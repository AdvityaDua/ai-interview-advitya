import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useWebSocket } from './hooks/useWebSocket';
import { useSpeechToText } from './hooks/useSpeechToText';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { InterviewUI } from './components/InterviewUI';
import { SetupForm } from './components/SetupForm';

// Generate a random client ID for this session
const CLIENT_ID = uuidv4();

function App() {
  const [setupData, setSetupData] = useState(null);

  // Only connect when setupData is available
  const { isConnected, messages, sendMessage, isStreamingResponse, feedback, interviewEnded } = useWebSocket(CLIENT_ID, setupData);

  // TTS Handler
  const { speak, cancel, isSpeaking } = useTextToSpeech();

  // Refs to track text processing for TTS
  const processedTextLengthRef = useRef(0);
  const lastModelMsgIdRef = useRef(null);
  const bufferRef = useRef("");

  useEffect(() => {
    const lastMsg = messages[messages.length - 1];

    // Only process if it's a model message
    if (!lastMsg || lastMsg.role !== 'model') return;

    // Reset processing if we detect a "new" model message
    const currentMsgIndex = messages.length - 1;

    if (lastModelMsgIdRef.current !== currentMsgIndex) {
      // New message bubble started
      processedTextLengthRef.current = 0;
      lastModelMsgIdRef.current = currentMsgIndex;
      bufferRef.current = "";
    }

    const fullText = lastMsg.content;
    // Get the new chunk
    const newText = fullText.slice(processedTextLengthRef.current);

    if (newText.length > 0) {
      processedTextLengthRef.current = fullText.length;
      handleTTSBuffer(newText);
    }
  }, [messages]);

  const handleTTSBuffer = (textChunk) => {
    bufferRef.current += textChunk;

    const lastPunctuationIndex = Math.max(
      bufferRef.current.lastIndexOf('.'),
      bufferRef.current.lastIndexOf('?'),
      bufferRef.current.lastIndexOf('!')
    );

    if (lastPunctuationIndex !== -1) {
      // Speak up to the punctuation
      const textToSpeak = bufferRef.current.substring(0, lastPunctuationIndex + 1);
      const remaining = bufferRef.current.substring(lastPunctuationIndex + 1);

      if (textToSpeak.trim()) {
        speak(textToSpeak);
      }
      bufferRef.current = remaining;
    }
  };

  // Flush buffer when streaming ends
  useEffect(() => {
    if (!isStreamingResponse && bufferRef.current.trim()) {
      speak(bufferRef.current);
      bufferRef.current = "";
    }
  }, [isStreamingResponse]);


  // STT Handler
  const handleFinalTranscript = (text) => {
    sendMessage(text);
    cancel();
    bufferRef.current = "";
  };

  const { isListening, transcript, startListening, stopListening } = useSpeechToText(handleFinalTranscript);

  // If setup data is not present, show the setup form
  if (!setupData) {
    return <SetupForm onStart={setSetupData} />;
  }

  return (
    <InterviewUI
      messages={messages}
      isConnected={isConnected}
      isListening={isListening}
      onStartListening={startListening}
      onStopListening={stopListening}
      transcript={transcript}
      isSpeaking={isSpeaking}
      feedback={feedback}
      interviewEnded={interviewEnded}
    />
  );
}

export default App;