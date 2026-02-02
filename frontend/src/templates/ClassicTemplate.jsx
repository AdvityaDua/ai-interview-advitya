import React from 'react';

const ClassicTemplate = ({ data, settings }) => {
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
        '--font-family': fontMap[settings.fontFamily] || 'Georgia, serif',
        '--heading-scale': scaleMap[settings.headingSize] || 1,
        fontFamily: 'var(--font-family)',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        padding: '2.5rem',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#000',
        lineHeight: '1.4'
    };

    const black = '#000000';
    const borderGray = '#e5e7eb';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Header */}
            <header className="border-b-4 mb-6 pb-4" style={{ borderColor: 'var(--primary-color)' }}>
                <h1 className="text-3xl font-bold uppercase tracking-wide mb-2"
                    style={{ fontSize: `calc(2.25rem * var(--heading-scale))`, color: 'var(--primary-color)' }}>
                    {personal_info.name}
                </h1>
                <div className="flex flex-wrap gap-x-4 text-sm font-medium" style={{ color: black }}>
                    {personal_info.email && <span>{personal_info.email}</span>}
                    {personal_info.phone && <span>| {personal_info.phone}</span>}
                    {personal_info.location && <span>| {personal_info.location}</span>}
                    {personal_info.linkedin && <span>| <a href={`https://${personal_info.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.linkedin}</a></span>}
                </div>
            </header>

            {/* Content Body */}
            <div>
                {/* Summary */}
                {professional_summary && (
                    <section className="mb-5">
                        <h2 className="text-lg font-bold uppercase border-b-2 mb-2"
                            style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                            Summary
                        </h2>
                        <p className="text-sm text-justify">{professional_summary}</p>
                    </section>
                )}

                {/* Skills */}
                {skills && (
                    <section className="mb-5">
                        <h2 className="text-lg font-bold uppercase border-b-2 mb-2"
                            style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                            Technical Skills
                        </h2>
                        <div className="text-sm">
                            <div className="mb-1"><span className="font-bold">Frontend:</span> {skills.frontend.join(', ')}</div>
                            <div className="mb-1"><span className="font-bold">Backend:</span> {skills.backend.join(', ')}</div>
                            <div><span className="font-bold">Tools & Cloud:</span> {skills.tools_cloud.join(', ')}</div>
                        </div>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-5">
                        <h2 className="text-lg font-bold uppercase border-b-2 mb-3"
                            style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                            Experience
                        </h2>
                        <div className="space-y-4">
                            {experience.map((job, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between font-bold text-sm mb-1">
                                        <span className="uppercase" style={{ color: black }}>{job.company}</span>
                                        <span>{job.duration}</span>
                                    </div>
                                    <div className="flex justify-between text-sm italic mb-1">
                                        <span>{job.title}</span>
                                        <span>{job.location}</span>
                                    </div>
                                    <ul className="list-square list-outside ml-4 text-sm space-y-1">
                                        {job.description.map((desc, i) => (
                                            <li key={i}>{desc}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                    <section className="mb-5">
                        <h2 className="text-lg font-bold uppercase border-b-2 mb-3"
                            style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                            Projects
                        </h2>
                        <div className="space-y-3">
                            {projects.map((proj, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between font-bold text-sm">
                                        <span>{proj.name}</span>
                                        <span className="font-normal italic text-xs">{proj.technologies.join(', ')}</span>
                                    </div>
                                    <p className="text-sm text-justify">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mb-5 break-inside-avoid">
                        <h2 className="text-lg font-bold uppercase border-b-2 mb-3"
                            style={{ borderColor: 'var(--secondary-color)', color: 'var(--secondary-color)' }}>
                            Education
                        </h2>
                        <div className="space-y-2">
                            {education.map((edu, index) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <div>
                                        <div className="font-bold">{edu.institution}</div>
                                        <div>{edu.degree}</div>
                                    </div>
                                    <div className="text-right">
                                        <div>{edu.duration}</div>
                                        {edu.gpa && <div>GPA: {edu.gpa}</div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications & Achievements */}
                <div className="grid grid-cols-2 gap-6">
                    {achievements && (
                        <section>
                            <h2 className="text-md font-bold uppercase border-b mb-2" style={{ color: 'var(--secondary-color)' }}>Achievements</h2>
                            <ul className="text-sm list-disc ml-4">
                                {achievements.slice(0, 3).map((ach, i) => <li key={i}>{ach}</li>)}
                            </ul>
                        </section>
                    )}
                    {languages && (
                        <section>
                            <h2 className="text-md font-bold uppercase border-b mb-2" style={{ color: 'var(--secondary-color)' }}>Languages</h2>
                            <ul className="text-sm list-disc ml-4">
                                {languages.map((lang, i) => <li key={i}>{lang.language} ({lang.proficiency})</li>)}
                            </ul>
                        </section>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ClassicTemplate;
