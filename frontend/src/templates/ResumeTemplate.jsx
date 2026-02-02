import React from 'react';

const ResumeTemplate = ({ data, settings }) => {
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
        padding: '2rem',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#333',
        lineHeight: '1.5'
    };

    // Explicit colors for print safety (avoiding Tailwind oklch)
    const gray800 = '#1f2937';
    const gray600 = '#4b5563';
    const gray200 = '#e5e7eb';

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Header */}
            <header className="border-b-2 pb-6 mb-6" style={{ borderColor: 'var(--primary-color)' }}>
                <h1
                    className="text-4xl font-bold mb-2"
                    style={{
                        fontSize: `calc(2.25rem * var(--heading-scale))`,
                        color: 'var(--primary-color)'
                    }}
                >
                    {personal_info.name}
                </h1>
                <div
                    className="flex flex-wrap gap-x-4 gap-y-1 text-sm"
                    style={{ color: 'var(--secondary-color)' }}
                >
                    {personal_info.email && <span>{personal_info.email}</span>}
                    {personal_info.phone && <span>• {personal_info.phone}</span>}
                    {personal_info.location && <span>• {personal_info.location}</span>}
                    {personal_info.linkedin && <span>• <a href={`https://${personal_info.linkedin}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.linkedin}</a></span>}
                    {personal_info.github && <span>• <a href={`https://${personal_info.github}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.github}</a></span>}
                    {personal_info.website && <span>• <a href={`https://${personal_info.website}`} target="_blank" rel="noopener noreferrer" className="hover:underline">{personal_info.website}</a></span>}
                </div>
            </header>

            {/* Summary */}
            {professional_summary && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-2 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Professional Summary
                    </h2>
                    <p className="text-sm text-justify">{professional_summary}</p>
                </section>
            )}

            {/* Skills */}
            {skills && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Skills
                    </h2>
                    <div className="grid grid-cols-1 gap-2 text-sm">
                        {skills.frontend && (
                            <div className="flex">
                                <span className="font-bold w-32 shrink-0">Frontend:</span>
                                <span>{skills.frontend.join(', ')}</span>
                            </div>
                        )}
                        {skills.backend && (
                            <div className="flex">
                                <span className="font-bold w-32 shrink-0">Backend:</span>
                                <span>{skills.backend.join(', ')}</span>
                            </div>
                        )}
                        {skills.tools_cloud && (
                            <div className="flex">
                                <span className="font-bold w-32 shrink-0">Tools & Cloud:</span>
                                <span>{skills.tools_cloud.join(', ')}</span>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* Experience */}
            {experience && experience.length > 0 && (
                <section className="mb-6">
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Work Experience
                    </h2>
                    <div className="space-y-4">
                        {experience.map((job, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold"
                                        style={{
                                            fontSize: `calc(1.125rem * var(--heading-scale))`,
                                            color: gray800
                                        }}>
                                        {job.title}
                                    </h3>
                                    <span className="text-sm font-medium" style={{ color: gray600 }}>{job.duration}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2 text-sm" style={{ color: 'var(--secondary-color)' }}>
                                    <span className="font-semibold">{job.company}</span>
                                    <span>{job.location}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 text-sm space-y-1">
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
                    <h2 className="text-xl font-bold mb-4 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Projects
                    </h2>
                    <div className="space-y-4">
                        {projects.map((proj, index) => (
                            <div key={index} className="break-inside-avoid">
                                <div className="flex justify-between items-baseline mb-1">
                                    <h3 className="text-lg font-bold"
                                        style={{
                                            fontSize: `calc(1.125rem * var(--heading-scale))`,
                                            color: gray800
                                        }}>
                                        {proj.name}
                                    </h3>
                                    <div className="flex gap-2 text-xs">
                                        {proj.github && <a href={proj.github} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--primary-color)' }}>GitHub</a>}
                                        {proj.demo && <a href={proj.demo} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: 'var(--primary-color)' }}>Demo</a>}
                                    </div>
                                </div>
                                <p className="text-sm mb-2">{proj.description}</p>
                                <div className="mb-2">
                                    <span className="text-xs font-bold" style={{ color: gray600 }}>Tech Stack: </span>
                                    <span className="text-xs italic" style={{ color: '#6b7280' }}>{proj.technologies.join(', ')}</span>
                                </div>
                                <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                                    {proj.highlights.map((highlight, i) => (
                                        <li key={i}>{highlight}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Education */}
            {education && education.length > 0 && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Education
                    </h2>
                    <div className="space-y-3">
                        {education.map((edu, index) => (
                            <div key={index}>
                                <div className="flex justify-between font-bold text-sm">
                                    <span>{edu.institution}</span>
                                    <span>{edu.duration}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>{edu.degree} - {edu.field}</span>
                                    {edu.gpa && <span>GPA: {edu.gpa}</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* Achievements */}
            {achievements && achievements.length > 0 && (
                <section className="mb-6 break-inside-avoid">
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-wide border-b pb-1"
                        style={{
                            fontSize: `calc(1.25rem * var(--heading-scale))`,
                            color: 'var(--primary-color)',
                            borderColor: gray200
                        }}>
                        Key Achievements
                    </h2>
                    <ul className="list-disc list-outside ml-4 text-sm space-y-1">
                        {achievements.map((ach, index) => (
                            <li key={index}>{ach}</li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Certifications & Languages - Side by Side if space permits, or stacked */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
                {certifications && certifications.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide border-b pb-1"
                            style={{
                                fontSize: `calc(1.25rem * var(--heading-scale))`,
                                color: 'var(--primary-color)',
                                borderColor: gray200
                            }}>
                            Certifications
                        </h2>
                        <ul className="text-sm space-y-2">
                            {certifications.map((cert, index) => (
                                <li key={index} className="flex flex-col">
                                    <span className="font-bold">{cert.name}</span>
                                    <span className="text-xs" style={{ color: gray600 }}>{cert.issuer} | {cert.date}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}

                {languages && languages.length > 0 && (
                    <section>
                        <h2 className="text-xl font-bold mb-3 uppercase tracking-wide border-b pb-1"
                            style={{
                                fontSize: `calc(1.25rem * var(--heading-scale))`,
                                color: 'var(--primary-color)',
                                borderColor: gray200
                            }}>
                            Languages
                        </h2>
                        <ul className="text-sm space-y-1">
                            {languages.map((lang, index) => (
                                <li key={index}>
                                    <span className="font-bold">{lang.language}: </span>
                                    <span>{lang.proficiency}</span>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>

        </div>
    );
};

export default ResumeTemplate;
