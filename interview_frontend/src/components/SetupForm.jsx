import React, { useState } from 'react';

export const SetupForm = ({ onStart }) => {
    const [resumeText, setResumeText] = useState('');
    const [jdText, setJdText] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!resumeText.trim() || !jdText.trim()) {
            alert("Please provide both Resume and Job Description text.");
            return;
        }
        setLoading(true);
        // Simulate a brief processing delay or just start immediately
        onStart({ resumeText, jdText });
    };

    // Helper to read file as text
    const handleFileUpload = (e, setText) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type === "text/plain" || file.name.endsWith(".md") || file.name.endsWith(".txt")) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setText(event.target.result);
            };
            reader.readAsText(file);
        } else {
            alert("Only text files (.txt, .md) are supported for now. Please paste content for PDFs.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 font-sans">
            <div className="bg-white p-8 rounded-2xl shadow-xl max-w-2xl w-full space-y-8">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Interview Setup</h1>
                    <p className="text-gray-500 mt-2">Upload or paste your Resume and the Job Description to begin.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Job Description Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Job Description</label>
                        <div className="relative">
                            <textarea
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                                placeholder="Paste the Job Description here..."
                                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                            />
                            {/* File Upload Overlay or Button could go here, keeping it simple for now */}
                        </div>
                        <input
                            type="file"
                            accept=".txt,.md"
                            onChange={(e) => handleFileUpload(e, setJdText)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    {/* Resume Section */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Resume / CV</label>
                        <textarea
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            placeholder="Paste your Resume content here..."
                            className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all"
                        />
                        <input
                            type="file"
                            accept=".txt,.md"
                            onChange={(e) => handleFileUpload(e, setResumeText)}
                            className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-4 rounded-xl text-white font-semibold shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
              ${loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            }
            `}
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Initializing...</span>
                            </>
                        ) : (
                            "Start Interview"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
