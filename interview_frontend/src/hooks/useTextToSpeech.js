import { useState, useRef, useEffect, useCallback } from 'react';

export const useTextToSpeech = () => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const utteranceQueueRef = useRef([]);
    const isProcessingRef = useRef(false);

    // Helper to process the queue
    const processQueue = useCallback(() => {
        if (isProcessingRef.current || utteranceQueueRef.current.length === 0) return;

        isProcessingRef.current = true;
        const text = utteranceQueueRef.current.shift();

        const utterance = new SpeechSynthesisUtterance(text);

        // Configurable voice/rate/pitch if needed
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(v => v.lang === 'en-US') || null; 

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => {
            isProcessingRef.current = false;
            if (utteranceQueueRef.current.length === 0) {
                setIsSpeaking(false);
            } else {
                processQueue(); // Process next chunk
            }
        };
        utterance.onerror = (e) => {
            console.error("TTS Error:", e);
            isProcessingRef.current = false;
            setIsSpeaking(false);
        }

        window.speechSynthesis.speak(utterance);
    }, []);

    const speak = useCallback((text) => {
        // If we receive a large block, queue it.
        // For streaming, we might receive small chunks. 
        // It's better to queue sentences or substantial phrases to avoid robotic chopping.
        // But for simplicity in this hook, we assume the caller passes bufferable chunks if possible, 
        // or we just queue what we get.

        // Optimized strategy: Cancel current speech if it's an interruption? 
        // Or just append? The prompt asked to "Stop previous speech when new chunk arrives" -- wait, 
        // "Stop previous speech when new chunk arrives" implies replacing OR strictly speaking user 
        // interrupts AI? "Handle interruptions" usually means User interrupts AI. 
        // AI streaming chunks should be appended.

        // User Requirement: "Stream response in real time, Speak while backend is still sending chunks"

        utteranceQueueRef.current.push(text);
        processQueue();
    }, [processQueue]);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        utteranceQueueRef.current = [];
        isProcessingRef.current = false;
        setIsSpeaking(false);
    }, []);

    return { isSpeaking, speak, cancel };
};
