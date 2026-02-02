import React from 'react';

const ExecutiveTemplate = ({ data, settings }) => {
    const { resume_content } = data;
    if (!resume_content) return null;

    const {
        personal_info,
        professional_summary,
        skills,
        experience,
        projects,
        education,
        achievements,
        certifications,
        languages
    } = resume_content;

    const fontMap = {
        'Inter': 'Inter, sans-serif',
        'Roboto': 'Roboto, sans-serif',
        'Serif': 'Georgia, serif'
    };

    const scaleMap = {
        'Small': 0.8,
        'Medium': 1,
        'Large': 1.2
    };

    const containerStyle = {
        '--primary-color': settings.primaryColor || '#1e3a8a', // dark blue
        '--secondary-color': settings.secondaryColor || '#475569',
        '--font-family': fontMap[settings.fontFamily] || 'Georgia, serif',
        '--heading-scale': scaleMap[settings.headingSize] || 1,
        fontFamily: 'var(--font-family)',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '3rem',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#333',
        lineHeight: '1.6'
    };

    const gray50 = '#f9fafb';
    const gray200 = '#e5e7eb';
    const gray500 = '#6b7280';
    const gray700 = '#374151';
    const gray800 = '#1f2937';
    const gray900 = '#111827';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Header - Centered with lines */}
            <header className="text-center mb-8">
                <h1 className="text-4xl font-serif font-bold uppercase tracking-widest mb-3"
                    style={{ fontSize: `calc(2.5rem * var(--heading-scale))`, color: 'var(--primary-color)' }}>
                    {personal_info.name}
                </h1>
                <div className="flex justify-center flex-wrap gap-4 text-sm font-medium border-t border-b py-2 mb-4" style={{ borderColor: gray200, color: gray800 }}>
                    {personal_info.email && <span>{personal_info.email}</span>}
                    {personal_info.phone && <span>{personal_info.phone}</span>}
                    {personal_info.location && <span>{personal_info.location}</span>}
                    {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} className="hover:underline">LinkedIn</a>}
                </div>
            </header>

            {/* Summary - Strong emphasize */}
            {professional_summary && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-3 border-b-2 inline-block pb-1" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                        Executive Summary
                    </h2>
                    <p className="text-base text-justify leading-relaxed" style={{ color: gray700 }}>
                        {professional_summary}
                    </p>
                </section>
            )}

            {/* Experience - Detailed */}
            {experience && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-6 border-b-2 inline-block pb-1" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                        Professional Experience
                    </h2>
                    <div className="space-y-6">
                        {experience.map((job, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold" style={{ color: gray800 }}>{job.title}</h3>
                                    <span className="text-sm font-semibold" style={{ color: 'var(--secondary-color)' }}>{job.duration}</span>
                                </div>
                                <div className="text-base font-semibold italic mb-3" style={{ color: 'var(--primary-color)' }}>
                                    {job.company} — {job.location}
                                </div>
                                <ul className="list-disc list-outside ml-5 text-sm space-y-2" style={{ color: gray700 }}>
                                    {job.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Core Competencies (Skills) - Columns */}
            {skills && (
                <section className="mb-8 p-4 rounded" style={{ backgroundColor: gray50 }}>
                    <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b-2 inline-block pb-1" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                        Core Competencies
                    </h2>
                    <div className="grid grid-cols-3 gap-6 text-sm">
                        <div>
                            <h4 className="font-bold mb-2 border-b pb-1" style={{ color: gray900 }}>Technical Leadership</h4>
                            <ul className="list-none space-y-1" style={{ color: gray700 }}>
                                {skills.tools_cloud.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 border-b pb-1" style={{ color: gray900 }}>Frontend Development</h4>
                            <ul className="list-none space-y-1" style={{ color: gray700 }}>
                                {skills.frontend.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2 border-b pb-1" style={{ color: gray900 }}>Backend Architectures</h4>
                            <ul className="list-none space-y-1" style={{ color: gray700 }}>
                                {skills.backend.slice(0, 5).map((s, i) => <li key={i}>{s}</li>)}
                            </ul>
                        </div>
                    </div>
                </section>
            )}

            {/* Education & Certs */}
            <div className="flex justify-between gap-8 mt-4">
                {education && (
                    <div className="flex-1">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b-2 inline-block pb-1" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                            Education
                        </h2>
                        <div className="space-y-4">
                            {education.map((edu, i) => (
                                <div key={i}>
                                    <div className="font-bold" style={{ color: gray900 }}>{edu.institution}</div>
                                    <div style={{ color: gray700 }}>{edu.degree}</div>
                                    <div className="text-sm italic" style={{ color: gray500 }}>{edu.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                {certifications && (
                    <div className="flex-1">
                        <h2 className="text-sm font-bold uppercase tracking-wider mb-4 border-b-2 inline-block pb-1" style={{ color: 'var(--primary-color)', borderColor: 'var(--primary-color)' }}>
                            Certifications
                        </h2>
                        <ul className="list-none space-y-2 text-sm" style={{ color: gray700 }}>
                            {certifications.map((cert, i) => (
                                <li key={i} className="flex justify-between border-b border-dotted pb-1">
                                    <span>{cert.name}</span>
                                    <span className="italic" style={{ color: gray500 }}>{cert.issuer}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

        </div>
    );
};

export default ExecutiveTemplate;
