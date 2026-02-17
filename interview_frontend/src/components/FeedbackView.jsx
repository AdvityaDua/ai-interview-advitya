import React from 'react';

export const FeedbackView = ({ feedback }) => {
    if (!feedback) return null;

    const {
        summary,
        dimension_scores,
        verdict,
        improvement_plan
    } = feedback;

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-600 bg-green-100';
        if (score >= 5) return 'text-yellow-600 bg-yellow-100';
        return 'text-red-600 bg-red-100';
    };

    return (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in-up">

                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center z-10">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900">Interview Results</h2>
                        <p className="text-gray-500 text-sm">Review your performance analysis</p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition-colors"
                    >
                        Start New Interview
                    </button>
                </div>

                <div className="p-8 space-y-8">

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Overall Score */}
                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Overall Score</span>
                            <div className={`text-5xl font-extrabold mt-2 ${getScoreColor(summary?.overall_score || 0)} px-4 py-2 rounded-xl`}>
                                {summary?.overall_score || 0}<span className="text-2xl text-opacity-60">/10</span>
                            </div>
                        </div>

                        {/* Recommendation */}
                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                            <span className="text-gray-500 font-medium text-sm uppercase tracking-wider">Verdict</span>
                            <h3 className="text-2xl font-bold text-gray-800 mt-2">
                                {summary?.hire_recommendation || "N/A"}
                            </h3>
                            <span className="text-sm text-gray-500 mt-1 capitalize">
                                {summary?.seniority_assessment || "Unassessed"} Level
                            </span>
                        </div>

                        {/* Summary Text */}
                        <div className="bg-blue-50/50 rounded-2xl p-6 md:col-span-1 flex flex-col justify-center">
                            <span className="text-blue-900/60 font-medium text-sm uppercase tracking-wider mb-2">Executive Summary</span>
                            <p className="text-gray-700 text-sm leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                                {summary?.summary_text || "No summary available."}
                            </p>
                        </div>
                    </div>

                    {/* Dimension Scores */}
                    {dimension_scores && (
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Skill Dimensions</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
                                {Object.entries(dimension_scores).map(([key, score]) => (
                                    <div key={key} className="bg-white border boundary-gray-200 rounded-xl p-4">
                                        <div className="flex justify-between items-end mb-2">
                                            <span className="text-sm font-medium text-gray-600 capitalize">
                                                {key.replace('_', ' ')}
                                            </span>
                                            <span className="font-bold text-gray-900">{score}/10</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className={`h-2 rounded-full ${score >= 7 ? 'bg-green-500' : score >= 4 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                                style={{ width: `${score * 10}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Strengths */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-green-700 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Key Strengths
                            </h3>
                            <div className="bg-green-50 rounded-2xl p-6">
                                <ul className="space-y-3">
                                    {verdict?.strengths_to_highlight?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-gray-700">
                                            <span className="text-green-500 mt-1">●</span>
                                            <span>{item}</span>
                                        </li>
                                    )) || <li className="text-gray-500 italic">No specific strengths listed.</li>}
                                </ul>
                            </div>
                        </div>

                        {/* Improvements */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-bold text-red-600 flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                                Areas for Improvement
                            </h3>
                            <div className="bg-red-50 rounded-2xl p-6">
                                <ul className="space-y-3">
                                    {improvement_plan?.immediate_actions?.map((item, i) => (
                                        <li key={i} className="flex gap-3 text-gray-700">
                                            <span className="text-red-500 mt-1">●</span>
                                            <span>{item}</span>
                                        </li>
                                    )) || <li className="text-gray-500 italic">No specific action items.</li>}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Footer / Re-actions */}
                    {/* Could add detailed Question-by-Question breakdown here later */}
                </div>
            </div>
        </div>
    );
};
