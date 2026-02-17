import { useState, useEffect, useRef, useCallback } from 'react';
import { createSilenceTimer } from '../utils/silenceDetection';

export const useSpeechToText = (onFinalTranscript) => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const recognitionRef = useRef(null);
    const silenceTimerRef = useRef(null);

    // Accumulator for finalized text across multiple speech segments
    const accumulatedFinalRef = useRef('');

    // Silence threshold in ms
    const SILENCE_THRESHOLD = 2000;

    const startListening = useCallback(() => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Web Speech API not supported in this browser. Please use Chrome.");
            return;
        }

        const SpeechRecognition = window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            accumulatedFinalRef.current = ''; // Reset on new listen session
        };

        recognition.onresult = (event) => {
            let interimTranscript = '';

            // Walk ALL results from the beginning to build the full picture.
            // The Web Speech API keeps all results in event.results,
            // and marks earlier segments as isFinal once confirmed.
            let allFinal = '';
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    allFinal += event.results[i][0].transcript;
                } else {
                    interimTranscript += event.results[i][0].transcript;
                }
            }

            // Update accumulated final text
            accumulatedFinalRef.current = allFinal;

            // Display: accumulated final + current interim
            const displayText = (allFinal + interimTranscript).trim();
            setTranscript(displayText);

            // Reset silence timer on every result
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);

            if (displayText.length > 0) {
                silenceTimerRef.current = createSilenceTimer(() => {
                    // Use the full accumulated text as the final transcript
                    const finalText = (accumulatedFinalRef.current + interimTranscript).trim();
                    stopListening();
                    if (finalText) {
                        onFinalTranscript(finalText);
                    }
                }, SILENCE_THRESHOLD);
            }
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error', event.error);
            // Don't stop on 'no-speech' errors, just log them
            if (event.error !== 'no-speech') {
                setIsListening(false);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
        };

        recognitionRef.current = recognition;
        recognition.start();
    }, [onFinalTranscript]);

    const stopListening = useCallback(() => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
        if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    }, []);

    return { isListening, transcript, startListening, stopListening };
};
