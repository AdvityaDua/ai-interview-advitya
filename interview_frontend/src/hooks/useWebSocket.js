import { useState, useEffect, useRef, useCallback } from 'react';

const WEBSOCKET_URL = "ws://localhost:8000/ws/stream";

export const useWebSocket = (clientId, initData) => {
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isStreamingResponse, setIsStreamingResponse] = useState(false);
    const [feedback, setFeedback] = useState(null);
    const [interviewEnded, setInterviewEnded] = useState(false);
    const feedbackRef = useRef(null);

    // Ref for isStreamingResponse to ensure event listener sees current state
    const isStreamingResponseRef = useRef(false);

    // Helper to update both state and ref
    const setStreamingInfo = (val) => {
        setIsStreamingResponse(val);
        isStreamingResponseRef.current = val;
    };

    // Keep initData in ref to access in connect callback without dependency loop issues
    const initDataRef = useRef(initData);
    useEffect(() => {
        initDataRef.current = initData;
    }, [initData]);

    const connect = useCallback(() => {
        // Only connect if we have init data
        if (!initDataRef.current) return;

        const ws = new WebSocket(`${WEBSOCKET_URL}/${clientId}`);

        ws.onopen = () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
            // Trigger Init with actual data
            ws.send(JSON.stringify({
                type: "init",
                resume_text: initDataRef.current.resumeText,
                jd_text: initDataRef.current.jdText
            }));
        };

        ws.onclose = () => {
            console.log('Disconnected from WebSocket');
            // Only show "disconnected" state if interview didn't end gracefully
            if (!feedbackRef.current) {
                setIsConnected(false);
            }
            setStreamingInfo(false);
        };

        ws.onerror = (error) => {
            console.error('WebSocket Error:', error);
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);

            if (data.type === 'stream_start') {
                setStreamingInfo(true);
            } else if (data.type === 'stream_end') {
                setStreamingInfo(false);
            } else if (data.type === 'text') {
                const isStreaming = isStreamingResponseRef.current;

                setMessages(prev => {
                    const lastMsg = prev[prev.length - 1];
                    // Access ref current value for logic
                    if (isStreaming) {
                        if (lastMsg && lastMsg.role === 'model') {
                            // Update last message content
                            const newContent = lastMsg.content + data.content;
                            return [...prev.slice(0, -1), { ...lastMsg, content: newContent }];
                        } else {
                            // Should theoretically not happen if stream_start comes first, but just in case
                            return [...prev, { role: 'model', content: data.content }];
                        }
                    } else {
                        // Not in stream mode, treat as new message
                        return [...prev, { role: 'model', content: data.content }];
                    }
                });
            } else if (data.type === 'info') {
                console.log("System Info:", data.content);
            } else if (data.type === 'end_interview') {
                console.log("Interview Ended", data.feedback);
                feedbackRef.current = data.feedback;
                setFeedback(data.feedback);
                setInterviewEnded(true);
            }
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [clientId]);

    const sendMessage = useCallback((text) => {
        if (socket && isConnected) {
            // Add user message to local state immediately for UI responsiveness
            setMessages(prev => [...prev, { role: 'user', content: text }]);

            socket.send(JSON.stringify({
                type: 'message',
                content: text
            }));
        }
    }, [socket, isConnected]);

    // Use explicit dependencies to trigger connection
    useEffect(() => {
        if (clientId && initData) {
            return connect();
        }
    }, [clientId, initData, connect]);

    return { isConnected, messages, sendMessage, isStreamingResponse, feedback, interviewEnded };
};
