import React from 'react';

const CompactTemplate = ({ data, settings }) => {
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
        'Serif': 'Times New Roman, serif'
    };

    const scaleMap = {
        'Small': 0.8,
        'Medium': 1,
        'Large': 1.2
    };

    const containerStyle = {
        '--primary-color': settings.primaryColor || '#111827', // dark gray default
        '--secondary-color': settings.secondaryColor || '#374151',
        '--font-family': fontMap[settings.fontFamily] || 'Inter, sans-serif',
        '--heading-scale': scaleMap[settings.headingSize] || 1,
        fontFamily: 'var(--font-family)',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '1.5rem', // Reduced padding
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#111',
        lineHeight: '1.3', // Tighter line height
        fontSize: '10pt' // Base font size smaller
    };

    const borderBottom = '1px solid #e5e7eb';
    const gray100 = '#f3f4f6';
    const gray500 = '#6b7280';
    const gray600 = '#4b5563';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Header */}
            <header className="mb-4 pb-2" style={{ borderBottom }}>
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="font-bold uppercase tracking-tight"
                            style={{ fontSize: `calc(2rem * var(--heading-scale))`, color: 'var(--primary-color)' }}>
                            {personal_info.name}
                        </h1>
                        <p className="text-sm font-medium" style={{ color: 'var(--secondary-color)' }}>Full Stack Developer</p>
                    </div>
                    <div className="text-right text-xs">
                        <div>{personal_info.email} | {personal_info.phone}</div>
                        <div>{personal_info.location}</div>
                        <div className="flex gap-2 justify-end">
                            {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} className="hover:underline" style={{ color: 'inherit' }}>LinkedIn</a>}
                            {personal_info.github && <a href={`https://${personal_info.github}`} className="hover:underline" style={{ color: 'inherit' }}>GitHub</a>}
                            {personal_info.website && <a href={`https://${personal_info.website}`} className="hover:underline" style={{ color: 'inherit' }}>Portfolio</a>}
                        </div>
                    </div>
                </div>
            </header>

            {/* 3 Column Skills/Ed/Summary Top Section */}
            <div className="flex gap-4 mb-4 pb-4" style={{ borderBottom }}>
                <div className="w-1/2 pr-2 border-r" style={{ borderColor: '#e5e7eb' }}>
                    <h2 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--primary-color)' }}>Summary</h2>
                    <p className="text-xs text-justify">{professional_summary}</p>
                </div>
                <div className="w-1/4 px-2 border-r" style={{ borderColor: '#e5e7eb' }}>
                    <h2 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--primary-color)' }}>Skills</h2>
                    <div className="text-xs space-y-1">
                        <div><span className="font-semibold">Core:</span> {skills.frontend.slice(0, 4).join(', ')}</div>
                        <div><span className="font-semibold">Back:</span> {skills.backend.slice(0, 4).join(', ')}</div>
                        <div><span className="font-semibold">Tools:</span> {skills.tools_cloud.slice(0, 4).join(', ')}</div>
                    </div>
                </div>
                <div className="w-1/4 pl-2">
                    <h2 className="text-xs font-bold uppercase mb-1" style={{ color: 'var(--primary-color)' }}>Education</h2>
                    {education && education.map((edu, i) => (
                        <div key={i} className="mb-1">
                            <div className="font-bold text-xs">{edu.institution}</div>
                            <div className="text-[10px]">{edu.degree}</div>
                            <div className="text-[10px]" style={{ color: gray500 }}>{edu.duration}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Experience - Very Compact */}
            {experience && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase mb-2 p-1" style={{ color: 'var(--primary-color)', backgroundColor: gray100 }}>Experience</h2>
                    <div className="space-y-3">
                        {experience.map((job, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="font-bold text-sm" style={{ color: '#000' }}>{job.title}</span>
                                        <span className="text-xs mx-1">at</span>
                                        <span className="font-semibold text-xs" style={{ color: 'var(--secondary-color)' }}>{job.company}</span>
                                    </div>
                                    <span className="text-xs font-mono">{job.duration}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 mt-1 space-y-0.5 text-xs">
                                    {job.description.map((desc, i) => (
                                        <li key={i}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects - Grid Layout */}
            {projects && (
                <section className="mb-4">
                    <h2 className="text-sm font-bold uppercase mb-2 p-1" style={{ color: 'var(--primary-color)', backgroundColor: gray100 }}>Key Projects</h2>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {projects.map((proj, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline border-b border-dotted pb-0.5 mb-1">
                                    <h3 className="font-bold text-xs">{proj.name}</h3>
                                    <span className="text-[10px] italic">{proj.technologies.slice(0, 3).join(', ')}</span>
                                </div>
                                <p className="text-xs mb-1 leading-tight">{proj.description}</p>
                                <ul className="list-none text-[10px] pl-0" style={{ color: gray600 }}>
                                    {proj.highlights.slice(0, 2).map((h, i) => <li key={i}>• {h}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            <div className="flex gap-4">
                {/* Achievements */}
                {achievements && (
                    <div className="flex-1">
                        <h2 className="text-xs font-bold uppercase mb-1 border-b" style={{ color: 'var(--primary-color)' }}>Achievements</h2>
                        <ul className="text-xs list-disc ml-4 space-y-0.5">
                            {achievements.slice(0, 3).map((ach, i) => <li key={i}>{ach}</li>)}
                        </ul>
                    </div>
                )}
                {/* Languages/Certs */}
                <div className="flex-1">
                    <h2 className="text-xs font-bold uppercase mb-1 border-b" style={{ color: 'var(--primary-color)' }}>Certifications</h2>
                    <div className="text-xs space-y-0.5">
                        {certifications && certifications.map((cert, i) => (
                            <div key={i}>{cert.name} <span style={{ color: gray500 }}>({cert.issuer})</span></div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default CompactTemplate;
