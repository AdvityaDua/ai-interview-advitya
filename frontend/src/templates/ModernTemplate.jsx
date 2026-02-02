import React from 'react';

const ModernTemplate = ({ data, settings }) => {
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

    // Font map
    const fontMap = {
        'Inter': 'Inter, sans-serif',
        'Roboto': 'Roboto, sans-serif',
        'Serif': 'Georgia, serif'
    };

    // Scale map
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
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#333',
        lineHeight: '1.5',
        display: 'flex',
        flexDirection: 'row'
    };

    // Explicit colors for print safety
    const white = '#ffffff';
    const gray100 = '#f3f4f6';
    const gray800 = '#1f2937';
    const gray600 = '#4b5563';
    const gray200 = '#e5e7eb';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Left Sidebar (30%) */}
            <aside style={{ width: '32%', backgroundColor: gray800, color: white, padding: '2rem', minHeight: '297mm' }}>
                {/* Profile Pic Placeholder or Initials could go here */}

                {/* Contact */}
                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-4" style={{ color: white }}>{personal_info.name}</h1>
                    <div className="text-sm space-y-2 opacity-90">
                        {personal_info.email && <div className="break-words">{personal_info.email}</div>}
                        {personal_info.phone && <div>{personal_info.phone}</div>}
                        {personal_info.location && <div>{personal_info.location}</div>}
                        {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} className="block hover:underline truncate">{personal_info.linkedin}</a>}
                        {personal_info.github && <a href={`https://${personal_info.github}`} className="block hover:underline truncate">{personal_info.github}</a>}
                        {personal_info.website && <a href={`https://${personal_info.website}`} className="block hover:underline truncate">{personal_info.website}</a>}
                    </div>
                </div>

                {/* Skills */}
                {skills && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-3 uppercase tracking-wider border-b pb-1" style={{ borderColor: gray600 }}>Skills</h2>
                        <div className="space-y-4 text-sm">
                            <div>
                                <h3 className="font-semibold opacity-80 mb-1">Frontend</h3>
                                <p className="opacity-90">{skills.frontend.join(', ')}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold opacity-80 mb-1">Backend</h3>
                                <p className="opacity-90">{skills.backend.join(', ')}</p>
                            </div>
                            <div>
                                <h3 className="font-semibold opacity-80 mb-1">Tools</h3>
                                <p className="opacity-90">{skills.tools_cloud.join(', ')}</p>
                            </div>
                        </div>
                    </section>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-3 uppercase tracking-wider border-b pb-1" style={{ borderColor: gray600 }}>Education</h2>
                        <div className="space-y-4 text-sm">
                            {education.map((edu, index) => (
                                <div key={index}>
                                    <div className="font-bold">{edu.institution}</div>
                                    <div className="text-xs opacity-80">{edu.duration}</div>
                                    <div>{edu.degree}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                    <section className="mb-8">
                        <h2 className="text-lg font-bold mb-3 uppercase tracking-wider border-b pb-1" style={{ borderColor: gray600 }}>Languages</h2>
                        <ul className="text-sm space-y-1">
                            {languages.map((lang, index) => (
                                <li key={index} className="flex justify-between">
                                    <span>{lang.language}</span>
                                    <span className="opacity-75">{lang.proficiency}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </aside>

            {/* Right Content (70%) */}
            <main style={{ width: '68%', padding: '2rem' }}>
                {/* Summary */}
                {professional_summary && (
                    <section className="mb-6">
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide" style={{ color: 'var(--primary-color)' }}>Profile</h2>
                        <p className="text-sm text-justify leading-relaxed">{professional_summary}</p>
                    </section>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                    <section className="mb-6">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2"
                            style={{ color: 'var(--primary-color)', borderColor: gray200 }}>
                            Experience
                        </h2>
                        <div className="space-y-6">
                            {experience.map((job, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold" style={{ color: gray800 }}>{job.title}</h3>
                                        <span className="text-sm font-medium" style={{ color: gray600 }}>{job.duration}</span>
                                    </div>
                                    <div className="text-sm font-semibold mb-2" style={{ color: 'var(--secondary-color)' }}>
                                        {job.company} | {job.location}
                                    </div>
                                    <ul className="list-disc list-outside ml-4 text-sm space-y-1" style={{ color: '#374151' }}>
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
                    <section className="mb-6">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2"
                            style={{ color: 'var(--primary-color)', borderColor: gray200 }}>
                            Projects
                        </h2>
                        <div className="space-y-5">
                            {projects.map((proj, index) => (
                                <div key={index} className="break-inside-avoid">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-lg font-bold" style={{ color: gray800 }}>{proj.name}</h3>
                                        <div className="flex gap-2 text-xs">
                                            {proj.github && <a href={proj.github} className="hover:underline" style={{ color: 'var(--primary-color)' }}>Code</a>}
                                            {proj.demo && <a href={proj.demo} className="hover:underline" style={{ color: 'var(--primary-color)' }}>Live</a>}
                                        </div>
                                    </div>
                                    <p className="text-sm mb-1">{proj.description}</p>
                                    <p className="text-xs italic mb-2" style={{ color: gray600 }}>Stack: {proj.technologies.join(', ')}</p>
                                    <ul className="list-disc list-outside ml-4 text-xs space-y-1" style={{ color: '#374151' }}>
                                        {proj.highlights.map((highlight, i) => (
                                            <li key={i}>{highlight}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {/* Certifications or Achievements */}
                {(achievements || certifications) && (
                    <section className="mb-6">
                        <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-2"
                            style={{ color: 'var(--primary-color)', borderColor: gray200 }}>
                            Additional
                        </h2>
                        {achievements && (
                            <div className="mb-4">
                                <h3 className="font-bold text-sm mb-2">Achievements</h3>
                                <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                                    {achievements.map((ach, i) => <li key={i}>{ach}</li>)}
                                </ul>
                            </div>
                        )}
                        {certifications && (
                            <div>
                                <h3 className="font-bold text-sm mb-2">Certifications</h3>
                                <ul className="text-sm space-y-1">
                                    {certifications.map((cert, i) => (
                                        <li key={i}>{cert.name} - <span className="text-xs" style={{ color: '#6b7280' }}>{cert.issuer} ({cert.date})</span></li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </section>
                )}

            </main>
        </div>
    );
};

export default ModernTemplate;
