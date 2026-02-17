import React, { useEffect, useRef, useState } from 'react';
import { MicButton } from './MicButton';
import { FeedbackView } from './FeedbackView';

export const InterviewUI = ({
    messages,
    isConnected,
    isListening,
    onStartListening,
    onStopListening,
    transcript,
    isSpeaking,
    feedback,
    interviewEnded
}) => {
    const chatEndRef = useRef(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, transcript]);

    return (
        <div className="flex flex-col h-screen bg-gray-50 text-gray-800 font-sans">
            {/* Header */}
            <header className="bg-white shadow-sm p-4 flex justify-between items-center z-10">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    AI Interviewer
                </h1>
                <div className="flex items-center gap-2">
                    <span className={`h-3 w-3 rounded-full ${interviewEnded ? 'bg-blue-500' : isConnected ? 'bg-green-500' : 'bg-red-500 animate-pulse'}`}></span>
                    <span className="text-sm font-medium text-gray-500">
                        {interviewEnded ? 'Interview Complete' : isConnected ? 'Online' : 'Reconnecting...'}
                    </span>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 overflow-y-auto p-4 space-y-4 max-w-3xl mx-auto w-full">
                {messages.length === 0 && (
                    <div className="text-center text-gray-400 mt-20">
                        <p>Waiting for interviewer to start...</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`group flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`
                            max-w-[85%] rounded-2xl px-5 py-3 shadow-sm
                            ${msg.role === 'user'
                                ? 'bg-blue-600 text-white rounded-br-none'
                                : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                            }
                        `}>
                            <p className="leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {/* Live Transcript Bubble (while speaking) */}
                {isListening && transcript && (
                    <div className="flex justify-end">
                        <div className="max-w-[85%] rounded-2xl rounded-br-none px-5 py-3 bg-blue-400/20 text-blue-900 animate-pulse">
                            <p className="italic">"{transcript}..."</p>
                        </div>
                    </div>
                )}

                <div ref={chatEndRef} />
            </main>

            {/* Controls Area */}
            <footer className="bg-white border-t border-gray-100 p-6">
                <div className="max-w-3xl mx-auto flex flex-col items-center gap-4">

                    {/* Status Text */}
                    <div className="h-6">
                        {isSpeaking && (
                            <div className="flex items-center gap-2 text-indigo-500 text-sm font-medium animate-pulse">
                                <span>Interviewer is speaking</span>
                                <span className="flex gap-1">
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-1 h-1 bg-indigo-500 rounded-full animate-bounce"></span>
                                </span>
                            </div>
                        )}
                        {isListening && !transcript && (
                            <span className="text-gray-400 text-sm">Listening for your answer...</span>
                        )}
                        {isListening && transcript && (
                            <span className="text-blue-500 text-sm font-medium">Processing speech...</span>
                        )}
                    </div>

                    {/* Mic Button */}
                    <div className="relative">
                        {/* Ripple Effect Ring */}
                        {isListening && (
                            <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-25 scale-150"></div>
                        )}
                        <MicButton
                            isListening={isListening}
                            onClick={isListening ? onStopListening : onStartListening}
                            disabled={!isConnected || isSpeaking || feedback}
                        />
                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        {isListening
                            ? "Tap to stop or wait for silence"
                            : "Tap microphone to answer"
                        }
                    </p>
                </div>
            </footer>

            {/* Feedback View Overlay */}
            {feedback && <FeedbackView feedback={feedback} />}
        </div>
    );
};
