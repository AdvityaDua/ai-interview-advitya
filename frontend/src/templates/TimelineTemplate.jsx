import React from 'react';

const TimelineTemplate = ({ data, settings }) => {
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

    // Explicit colors for PDF safety
    const primary = settings.primaryColor || '#2563eb';
    const secondary = settings.secondaryColor || '#4b5563';
    const textMain = '#1f2937';
    const textMuted = '#6b7280';
    const borderLight = '#e5e7eb';
    const white = '#ffffff';

    const containerStyle = {
        fontFamily: fontMap[settings.fontFamily] || 'Inter, sans-serif',
        width: '210mm',
        minHeight: '297mm',
        margin: '0 auto',
        backgroundColor: 'white',
        color: textMain,
        lineHeight: '1.5'
    };

    return (
        <div id="resume-preview" className="resume-container shadow-lg" style={containerStyle}>
            {/* Header / Top Banner */}
            <div className="p-8 pb-0 flex flex-col items-center">
                <h1 className="text-4xl font-bold uppercase tracking-wider mb-2" style={{ color: primary }}>{personal_info.name}</h1>
                <div className="flex gap-4 text-sm font-medium mb-6" style={{ color: textMuted }}>
                    <span>{personal_info.email}</span>
                    <span>{personal_info.phone}</span>
                    <span>{personal_info.location}</span>
                </div>
                <div className="flex gap-4 text-xs font-mono mb-8" style={{ color: primary }}>
                    {personal_info.linkedin && <a href={`https://${personal_info.linkedin}`} style={{ color: 'inherit' }}>{personal_info.linkedin}</a>}
                    {personal_info.github && <a href={`https://${personal_info.github}`} style={{ color: 'inherit' }}>{personal_info.github}</a>}
                    {personal_info.website && <a href={`https://${personal_info.website}`} style={{ color: 'inherit' }}>{personal_info.website}</a>}
                </div>

                {/* Summary */}
                <div className="border-b-2 pb-6 max-w-2xl text-center mb-8" style={{ borderColor: borderLight }}>
                    <p className="text-base leading-relaxed italic">{professional_summary}</p>
                </div>
            </div>

            <div className="px-8 pb-8 grid grid-cols-12 gap-8">
                {/* Left Column (Timeline) - 8/12 */}
                <div className="col-span-8">
                    {/* Experience Timeline */}
                    <div className="mb-8">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: secondary }}>
                            <span style={{ fontSize: '1.5em', color: primary }}>•</span> Experience
                        </h2>

                        <div className="relative border-l-2 ml-3 py-2 space-y-8" style={{ borderColor: borderLight }}>
                            {experience && experience.map((job, index) => (
                                <div key={index} className="pl-8 relative break-inside-avoid">
                                    {/* Dot */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '-9px',
                                        top: '0',
                                        width: '16px',
                                        height: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: white,
                                        border: `4px solid ${primary}`
                                    }}></div>

                                    <div className="flex flex-col mb-2">
                                        <h3 className="text-lg font-bold" style={{ color: textMain }}>{job.title}</h3>
                                        <span className="text-sm font-semibold mb-1" style={{ color: primary }}>{job.company}</span>
                                        <span className="text-xs uppercase tracking-wide font-medium" style={{ color: textMuted }}>{job.duration}</span>
                                    </div>
                                    <ul className="list-disc list-outside ml-4 text-sm space-y-1" style={{ color: textMain }}>
                                        {job.description.map((desc, i) => <li key={i}>{desc}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Projects Timeline */}
                    <div className="mb-6">
                        <h2 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-2" style={{ color: secondary }}>
                            <span style={{ fontSize: '1.5em', color: primary }}>•</span> Projects
                        </h2>
                        <div className="relative border-l-2 ml-3 py-2 space-y-6" style={{ borderColor: borderLight }}>
                            {projects && projects.map((proj, index) => (
                                <div key={index} className="pl-8 relative break-inside-avoid">
                                    <div style={{
                                        position: 'absolute',
                                        left: '-6px',
                                        top: '6px',
                                        width: '10px',
                                        height: '10px',
                                        borderRadius: '50%',
                                        backgroundColor: borderLight,
                                    }}></div>
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="font-bold text-md" style={{ color: textMain }}>{proj.name}</h3>
                                        <span className="text-xs italic" style={{ color: textMuted }}>{proj.technologies.join(', ')}</span>
                                    </div>
                                    <p className="text-sm mb-1">{proj.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column (Skills & Ed) - 4/12 */}
                <div className="col-span-4 flex flex-col gap-8 pt-2">

                    {/* Skills */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ borderColor: primary, color: secondary }}>Skills</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xs font-bold uppercase mb-2" style={{ color: primary }}>Core</h3>
                                <div className="text-sm">{skills?.frontend.join(', ')}</div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase mb-2" style={{ color: primary }}>Backend</h3>
                                <div className="text-sm">{skills?.backend.join(', ')}</div>
                            </div>
                            <div>
                                <h3 className="text-xs font-bold uppercase mb-2" style={{ color: primary }}>Tools</h3>
                                <div className="text-sm">{skills?.tools_cloud.join(', ')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Education */}
                    <div>
                        <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ borderColor: primary, color: secondary }}>Education</h2>
                        <div className="space-y-4">
                            {education && education.map((edu, i) => (
                                <div key={i}>
                                    <div className="font-bold text-sm" style={{ color: textMain }}>{edu.institution}</div>
                                    <div className="text-xs">{edu.degree}</div>
                                    <div className="text-xs font-mono mt-1" style={{ color: textMuted }}>{edu.duration}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Certs */}
                    {certifications && (
                        <div>
                            <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b pb-2" style={{ borderColor: primary, color: secondary }}>Certifications</h2>
                            <ul className="text-xs space-y-2">
                                {certifications.map((c, i) => (
                                    <li key={i} className="flex flex-col">
                                        <span className="font-semibold">{c.name}</span>
                                        <span style={{ color: textMuted }}>{c.issuer}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TimelineTemplate;
