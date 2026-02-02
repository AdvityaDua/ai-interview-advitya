import React from 'react';

const CreativeTemplate = ({ data, settings }) => {
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
        '--primary-color': settings.primaryColor || '#ec4899', // pink-500 default for creative
        '--secondary-color': settings.secondaryColor || '#831843',
        '--font-family': fontMap[settings.fontFamily] || 'Roboto, sans-serif',
        '--heading-scale': scaleMap[settings.headingSize] || 1,
        fontFamily: 'var(--font-family)',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        backgroundColor: 'white',
        boxSizing: 'border-box',
        color: '#333',
        lineHeight: '1.5'
    };

    const gray50 = '#f9fafb';
    const gray100 = '#f3f4f6';
    const gray200 = '#e5e7eb';
    const gray800 = '#1f2937';

    return (
        <div id="resume-preview" className="resume-container shadow-lg relative overflow-hidden" style={containerStyle}>
            {/* Decorative Background Shape */}
            <div
                style={{
                    position: 'absolute',
                    top: '-150px',
                    left: '-100px',
                    width: '600px',
                    height: '400px',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%',
                    transform: 'rotate(-15deg)',
                    zIndex: 0,
                    opacity: 0.1
                }}
            />

            {/* Header */}
            <header className="relative z-10 px-10 pt-10 pb-6 mb-6 flex justify-between items-end border-b-2" style={{ borderColor: 'var(--primary-color)' }}>
                <div>
                    <h1 className="text-4xl font-extrabold mb-1 tracking-tight"
                        style={{ fontSize: `calc(3rem * var(--heading-scale))`, color: 'var(--secondary-color)' }}>
                        {personal_info.name}
                    </h1>
                    <div className="text-sm font-medium opacity-80" style={{ color: gray800 }}>
                        {personal_info.location} | {personal_info.email} | {personal_info.phone}
                    </div>
                </div>
                <div className="text-right text-xs font-mono space-y-1">
                    {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} className="block hover:underline" style={{ color: 'inherit' }}>{personal_info.linkedin}</a>}
                    {personal_info.github && <a href={`https://${personal_info.github}`} className="block hover:underline" style={{ color: 'inherit' }}>{personal_info.github}</a>}
                    {personal_info.website && <a href={`https://${personal_info.website}`} className="block hover:underline" style={{ color: 'inherit' }}>{personal_info.website}</a>}
                </div>
            </header>

            <div className="relative z-10 px-10 flex gap-8">
                {/* Left Column (Main) */}
                <main className="flex-1">
                    {/* Summary */}
                    {professional_summary && (
                        <section className="mb-8">
                            <p className="text-lg italic font-light leading-relaxed border-l-4 pl-4" style={{ borderColor: 'var(--primary-color)' }}>
                                {professional_summary}
                            </p>
                        </section>
                    )}

                    {/* Experience */}
                    {experience && (
                        <section className="mb-8">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--secondary-color)' }}>
                                <span style={{ backgroundColor: 'var(--primary-color)', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
                                EXPERIENCE
                            </h2>
                            <div className="space-y-8 relative border-l-2 ml-1 pl-6" style={{ borderColor: gray100 }}>
                                {experience.map((job, index) => (
                                    <div key={index} className="break-inside-avoid relative">
                                        {/* Timeline dot */}
                                        <div style={{
                                            position: 'absolute',
                                            left: '-31px',
                                            top: '6px',
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: 'white',
                                            border: '2px solid var(--primary-color)'
                                        }}></div>

                                        <div className="flex justify-between items-baseline mb-1">
                                            <h3 className="text-lg font-bold" style={{ color: gray800 }}>{job.title}</h3>
                                            <span className="text-xs font-bold px-2 py-1 rounded" style={{ backgroundColor: gray100 }}>{job.duration}</span>
                                        </div>
                                        <div className="text-sm font-semibold mb-2" style={{ color: 'var(--primary-color)' }}>
                                            @{job.company}
                                        </div>
                                        <p className="text-sm mb-2 text-justify">{job.description[0]}</p>
                                        <ul className="list-none text-sm space-y-1 pl-0">
                                            {job.description.slice(1).map((desc, i) => (
                                                <li key={i} className="flex gap-2">
                                                    <span style={{ color: 'var(--primary-color)' }}>›</span>
                                                    <span>{desc}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Projects */}
                    {projects && (
                        <section className="mb-6">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--secondary-color)' }}>
                                <span style={{ backgroundColor: 'var(--primary-color)', width: '8px', height: '8px', borderRadius: '50%', display: 'inline-block' }}></span>
                                PROJECTS
                            </h2>
                            <div className="grid grid-cols-1 gap-4">
                                {projects.map((proj, index) => (
                                    <div key={index} className="p-4 rounded-lg break-inside-avoid shadow-sm hover:shadow-md transition-shadow" style={{ backgroundColor: gray50 }}>
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="font-bold" style={{ color: gray800 }}>{proj.name}</h3>
                                            <div className="flex gap-2 text-xs opacity-70">
                                                {proj.github && <a href={proj.github} className="hover:text-blue-600" style={{ color: 'inherit' }}>Repo</a>}
                                                {proj.demo && <a href={proj.demo} className="hover:text-blue-600" style={{ color: 'inherit' }}>Demo</a>}
                                            </div>
                                        </div>
                                        <p className="text-sm mb-2">{proj.description}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {proj.technologies.slice(0, 4).map((tech, i) => (
                                                <span key={i} className="text-xs px-2 py-0.5 rounded-full border" style={{ borderColor: 'var(--primary-color)', color: 'var(--secondary-color)' }}>
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </main>

                {/* Right Column (Sidebar) */}
                <aside className="w-1/3 pt-2">
                    {/* Skills */}
                    {skills && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ color: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}>
                                SKILLSET
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-xs font-bold uppercase mb-2" style={{ color: gray800 }}>Frontend</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.frontend.map((skill, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: gray100, color: '#4b5563' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase mb-2" style={{ color: gray800 }}>Backend</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.backend.map((skill, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: gray100, color: '#4b5563' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold uppercase mb-2" style={{ color: gray800 }}>Tools</h3>
                                    <div className="flex flex-wrap gap-1">
                                        {skills.tools_cloud.map((skill, i) => (
                                            <span key={i} className="text-xs px-2 py-1 rounded" style={{ backgroundColor: gray100, color: '#4b5563' }}>{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Education */}
                    {education && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ color: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}>
                                EDUCATION
                            </h2>
                            <div className="space-y-4">
                                {education.map((edu, index) => (
                                    <div key={index}>
                                        <div className="font-bold text-sm">{edu.institution}</div>
                                        <div className="text-xs italic mb-1">{edu.degree}</div>
                                        <div className="text-xs" style={{ color: '#6b7280' }}>{edu.duration}</div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Languages */}
                    {languages && (
                        <section className="mb-8">
                            <h2 className="text-sm font-bold tracking-widest mb-4 border-b-2 pb-1 inline-block" style={{ color: 'var(--secondary-color)', borderColor: 'var(--primary-color)' }}>
                                LANGUAGES
                            </h2>
                            <div className="space-y-2">
                                {languages.map((lang, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{lang.language}</span>
                                        <span className="font-bold" style={{ color: 'var(--primary-color)' }}>{lang.proficiency}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </aside>
            </div>
        </div>
    );
};

export default CreativeTemplate;
