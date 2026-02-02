import React from 'react';

const MinimalistTemplate = ({ data, settings }) => {
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
        '--primary-color': settings.primaryColor || '#000000',
        '--secondary-color': settings.secondaryColor || '#555555',
        '--font-family': fontMap[settings.fontFamily] || 'Inter, sans-serif',
        '--heading-scale': scaleMap[settings.headingSize] || 1,
        fontFamily: 'var(--font-family)',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '3rem',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#1f2937',
        lineHeight: '1.6'
    };

    const gray500 = '#6b7280';
    const gray800 = '#1f2937';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Centered Header */}
            <header className="text-center mb-10">
                <h1 className="text-4xl font-light uppercase tracking-widest mb-3"
                    style={{ fontSize: `calc(2.5rem * var(--heading-scale))` }}>
                    {personal_info.name}
                </h1>
                <div className="flex justify-center flex-wrap gap-4 text-sm" style={{ color: gray500 }}>
                    {personal_info.email && <span>{personal_info.email}</span>}
                    {personal_info.phone && <span>{personal_info.phone}</span>}
                    {personal_info.location && <span>{personal_info.location}</span>}
                    {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.linkedin}</a>}
                    {personal_info.website && <a href={`https://${personal_info.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.website}</a>}
                </div>
            </header>

            {/* Summary */}
            <section className="mb-8 text-center px-10">
                <p className="text-base italic leading-relaxed" style={{ color: gray500 }}>
                    {professional_summary}
                </p>
            </section>

            {/* Experience */}
            {experience && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-6" style={{ color: 'var(--primary-color)' }}>Experience</h2>
                    <div className="space-y-8">
                        {experience.map((job, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-2">
                                    <h3 className="font-semibold text-lg" style={{ color: gray800 }}>{job.title}</h3>
                                    <span className="text-sm italic" style={{ color: gray500 }}>{job.duration}</span>
                                </div>
                                <div className="mb-2 text-sm uppercase tracking-wide" style={{ color: 'var(--secondary-color)' }}>
                                    {job.company}, {job.location}
                                </div>
                                <ul className="list-none space-y-2 text-sm">
                                    {job.description.map((desc, i) => (
                                        <li key={i} className="pl-4 border-l-2" style={{ borderColor: '#f3f4f6' }}>{desc}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Projects */}
            {projects && (
                <section className="mb-8">
                    <h2 className="text-sm font-bold uppercase tracking-widest text-center mb-6" style={{ color: 'var(--primary-color)' }}>Selected Projects</h2>
                    <div className="grid grid-cols-1 gap-6">
                        {projects.map((proj, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline">
                                    <h3 className="font-semibold" style={{ color: gray800 }}>{proj.name}</h3>
                                    <span className="text-xs italic" style={{ color: gray500 }}>{proj.technologies.join(', ')}</span>
                                </div>
                                <p className="text-sm mt-1 mb-2" style={{ color: gray500 }}>{proj.description}</p>
                                <ul className="list-disc list-inside text-xs" style={{ color: '#4b5563' }}>
                                    {proj.highlights.slice(0, 2).map((h, i) => <li key={i}>{h}</li>)}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Skills & Education Grid */}
            <div className="grid grid-cols-2 gap-10 mt-10 border-t pt-8" style={{ borderColor: '#f3f4f6' }}>
                {/* Skills */}
                <section>
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary-color)' }}>Expertise</h2>
                    <div className="text-sm space-y-3">
                        <div>
                            <span className="block font-semibold mb-1" style={{ color: gray800 }}>Frontend</span>
                            <span style={{ color: gray500 }}>{skills.frontend.join(', ')}</span>
                        </div>
                        <div>
                            <span className="block font-semibold mb-1" style={{ color: gray800 }}>Backend</span>
                            <span style={{ color: gray500 }}>{skills.backend.join(', ')}</span>
                        </div>
                    </div>
                </section>

                {/* Education */}
                <section className="text-right">
                    <h2 className="text-sm font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--primary-color)' }}>Education</h2>
                    <div className="space-y-3 text-sm">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="font-semibold" style={{ color: gray800 }}>{edu.institution}</div>
                                <div style={{ color: gray500 }}>{edu.degree}</div>
                                <div className="text-xs italic mt-1" style={{ color: gray500 }}>{edu.duration}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default MinimalistTemplate;
