import React, { useState } from 'react';

const SectionHeader = ({ title, isOpen, toggle }) => (
    <button
        onClick={toggle}
        className="w-full flex justify-between items-center p-3 bg-gray-100 hover:bg-gray-200 rounded mb-2 transition-colors"
    >
        <span className="font-bold text-gray-700">{title}</span>
        <span>{isOpen ? '▼' : '▶'}</span>
    </button>
);

const InputGroup = ({ label, value, onChange, type = "text", multilines = false }) => (
    <div className="mb-3">
        <label className="block text-xs font-bold text-gray-600 mb-1 uppercase tracking-wide">{label}</label>
        {multilines ? (
            <textarea
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                rows={4}
            />
        ) : (
            <input
                type={type}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
            />
        )}
    </div>
);

const ContentPanel = ({ data, setData }) => {
    // We assume data structure matches the resume_content
    const content = data.resume_content || {};

    // Helper to update root level fields (not used much since everything is nested)
    // Helper to update specific nested sections
    const updateSection = (section, updates) => {
        setData(prev => ({
            ...prev,
            resume_content: {
                ...prev.resume_content,
                [section]: { ...prev.resume_content[section], ...updates }
            }
        }));
    };

    // Helper to update array items
    const updateArrayItem = (section, index, updates) => {
        const newArray = [...(content[section] || [])];
        newArray[index] = { ...newArray[index], ...updates };
        setData(prev => ({
            ...prev,
            resume_content: { ...prev.resume_content, [section]: newArray }
        }));
    };

    const addArrayItem = (section, template) => {
        const newArray = [...(content[section] || []), template];
        setData(prev => ({
            ...prev,
            resume_content: { ...prev.resume_content, [section]: newArray }
        }));
    };

    const removeArrayItem = (section, index) => {
        const newArray = (content[section] || []).filter((_, i) => i !== index);
        setData(prev => ({
            ...prev,
            resume_content: { ...prev.resume_content, [section]: newArray }
        }));
    };

    // Helper for simple fields like Professional Summary
    const updateField = (field, value) => {
        setData(prev => ({
            ...prev,
            resume_content: { ...prev.resume_content, [field]: value }
        }));
    };

    // Local state for accordion
    const [openSections, setOpenSections] = useState({
        personal: true,
        summary: false,
        experience: false,
        education: false,
        skills: false,
        projects: false,
        achievements: false,
        certifications: false,
        languages: false
    });

    const toggleSection = (sec) => setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));

    return (
        <div className="h-full flex flex-col bg-white">
            <div className="p-4 bg-gray-50 border-b">
                <h2 className="text-lg font-bold text-gray-800">Edit Content</h2>
                <p className="text-xs text-gray-500">Changes reflect immediately</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">

                {/* Personal Info */}
                <div>
                    <SectionHeader title="Personal Information" isOpen={openSections.personal} toggle={() => toggleSection('personal')} />
                    {openSections.personal && (
                        <div className="pl-2 border-l-2 border-gray-200">
                            <InputGroup label="Full Name" value={content.personal_info?.name} onChange={(v) => updateSection('personal_info', { name: v })} />
                            <InputGroup label="Email" value={content.personal_info?.email} onChange={(v) => updateSection('personal_info', { email: v })} />
                            <InputGroup label="Phone" value={content.personal_info?.phone} onChange={(v) => updateSection('personal_info', { phone: v })} />
                            <InputGroup label="Location" value={content.personal_info?.location} onChange={(v) => updateSection('personal_info', { location: v })} />
                            <InputGroup label="LinkedIn" value={content.personal_info?.linkedin} onChange={(v) => updateSection('personal_info', { linkedin: v })} />
                            <InputGroup label="GitHub" value={content.personal_info?.github} onChange={(v) => updateSection('personal_info', { github: v })} />
                            <InputGroup label="Website" value={content.personal_info?.website} onChange={(v) => updateSection('personal_info', { website: v })} />
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div>
                    <SectionHeader title="Professional Summary" isOpen={openSections.summary} toggle={() => toggleSection('summary')} />
                    {openSections.summary && (
                        <div className="pl-2 border-l-2 border-gray-200">
                            <InputGroup multilines label="Summary" value={content.professional_summary} onChange={(v) => updateField('professional_summary', v)} />
                        </div>
                    )}
                </div>

                {/* Experience */}
                <div>
                    <SectionHeader title="Experience" isOpen={openSections.experience} toggle={() => toggleSection('experience')} />
                    {openSections.experience && (
                        <div className="space-y-6 pl-2 border-l-2 border-gray-200">
                            {(content.experience || []).map((job, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded border relative">
                                    <button onClick={() => removeArrayItem('experience', index)} className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700">Remove</button>
                                    <h4 className="font-bold text-sm mb-2 text-gray-700">Job #{index + 1}</h4>
                                    <InputGroup label="Company" value={job.company} onChange={(v) => updateArrayItem('experience', index, { company: v })} />
                                    <InputGroup label="Title" value={job.title} onChange={(v) => updateArrayItem('experience', index, { title: v })} />
                                    <InputGroup label="Location" value={job.location} onChange={(v) => updateArrayItem('experience', index, { location: v })} />
                                    <InputGroup label="Duration" value={job.duration} onChange={(v) => updateArrayItem('experience', index, { duration: v })} />

                                    <div className="mb-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">DESCRIPTION (One bullet per line)</label>
                                        <textarea
                                            className="w-full p-2 border rounded text-sm"
                                            rows={4}
                                            value={(job.description || []).join('\n')}
                                            onChange={(e) => updateArrayItem('experience', index, { description: e.target.value.split('\n') })}
                                        />
                                    </div>
                                    <InputGroup label="Technologies (comma separated)" value={(job.technologies || []).join(', ')} onChange={(v) => updateArrayItem('experience', index, { technologies: v.split(',').map(s => s.trim()) })} />
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('experience', { company: 'New Company', title: 'Job Title', duration: 'Date - Date', description: ['Did something cool'], technologies: [] })} className="w-full py-2 bg-blue-50 text-blue-600 rounded dashed border border-blue-200 hover:bg-blue-100">+ Add Experience</button>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div>
                    <SectionHeader title="Skills" isOpen={openSections.skills} toggle={() => toggleSection('skills')} />
                    {openSections.skills && (
                        <div className="pl-2 border-l-2 border-gray-200">
                            <InputGroup
                                label="Frontend (comma separated)"
                                value={(content.skills?.frontend || []).join(', ')}
                                onChange={(v) => updateSection('skills', { frontend: v.split(',').map(s => s.trim()) })}
                            />
                            <InputGroup
                                label="Backend (comma separated)"
                                value={(content.skills?.backend || []).join(', ')}
                                onChange={(v) => updateSection('skills', { backend: v.split(',').map(s => s.trim()) })}
                            />
                            <InputGroup
                                label="Tools & Cloud (comma separated)"
                                value={(content.skills?.tools_cloud || []).join(', ')}
                                onChange={(v) => updateSection('skills', { tools_cloud: v.split(',').map(s => s.trim()) })}
                            />
                        </div>
                    )}
                </div>

                {/* Education */}
                <div>
                    <SectionHeader title="Education" isOpen={openSections.education} toggle={() => toggleSection('education')} />
                    {openSections.education && (
                        <div className="space-y-4 pl-2 border-l-2 border-gray-200">
                            {(content.education || []).map((edu, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded border relative">
                                    <button onClick={() => removeArrayItem('education', index)} className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700">Remove</button>
                                    <InputGroup label="Institution" value={edu.institution} onChange={(v) => updateArrayItem('education', index, { institution: v })} />
                                    <InputGroup label="Degree" value={edu.degree} onChange={(v) => updateArrayItem('education', index, { degree: v })} />
                                    <InputGroup label="Duration" value={edu.duration} onChange={(v) => updateArrayItem('education', index, { duration: v })} />
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('education', { institution: 'University', degree: 'Degree', duration: 'Year' })} className="w-full py-2 bg-blue-50 text-blue-600 rounded dashed border border-blue-200 hover:bg-blue-100">+ Add Education</button>
                        </div>
                    )}
                </div>

                {/* Projects */}
                <div>
                    <SectionHeader title="Projects" isOpen={openSections.projects} toggle={() => toggleSection('projects')} />
                    {openSections.projects && (
                        <div className="space-y-6 pl-2 border-l-2 border-gray-200">
                            {(content.projects || []).map((proj, index) => (
                                <div key={index} className="bg-gray-50 p-3 rounded border relative">
                                    <button onClick={() => removeArrayItem('projects', index)} className="absolute top-2 right-2 text-red-500 text-xs hover:text-red-700">Remove</button>
                                    <InputGroup label="Project Name" value={proj.name} onChange={(v) => updateArrayItem('projects', index, { name: v })} />
                                    <InputGroup label="Description" value={proj.description} onChange={(v) => updateArrayItem('projects', index, { description: v })} style={{ minHeight: '60px' }} multilines />

                                    <div className="mb-2">
                                        <label className="block text-xs font-bold text-gray-600 mb-1">HIGHLIGHTS (One bullet per line)</label>
                                        <textarea
                                            className="w-full p-2 border rounded text-sm"
                                            rows={3}
                                            value={(proj.highlights || []).join('\n')}
                                            onChange={(e) => updateArrayItem('projects', index, { highlights: e.target.value.split('\n') })}
                                        />
                                    </div>
                                    <InputGroup label="Tech (comma separated)" value={(proj.technologies || []).join(', ')} onChange={(v) => updateArrayItem('projects', index, { technologies: v.split(',').map(s => s.trim()) })} />
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <InputGroup label="GitHub URL" value={proj.github} onChange={(v) => updateArrayItem('projects', index, { github: v })} />
                                        </div>
                                        <div className="flex-1">
                                            <InputGroup label="Demo URL" value={proj.demo} onChange={(v) => updateArrayItem('projects', index, { demo: v })} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button onClick={() => addArrayItem('projects', { name: 'New Project', description: 'Desc', highlights: [], technologies: [] })} className="w-full py-2 bg-blue-50 text-blue-600 rounded dashed border border-blue-200 hover:bg-blue-100">+ Add Project</button>
                        </div>
                    )}
                </div>

                {/* Certifications, Achievements, Languages - Simplified */}
                <div>
                    <SectionHeader title="Other" isOpen={openSections.achievements} toggle={() => toggleSection('achievements')} />
                    {openSections.achievements && (
                        <div className="pl-2 border-l-2 border-gray-200 space-y-4">
                            <div className="mb-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1">ACHIEVEMENTS (One per line)</label>
                                <textarea
                                    className="w-full p-2 border rounded text-sm"
                                    rows={4}
                                    value={(content.achievements || []).join('\n')}
                                    onChange={(e) => updateField('achievements', e.target.value.split('\n'))}
                                />
                            </div>
                            <div className="mb-2">
                                <label className="block text-xs font-bold text-gray-600 mb-1">LANGUAGES (One per line, e.g. "English (Native)")</label>
                                <textarea
                                    className="w-full p-2 border rounded text-sm"
                                    rows={3}
                                    // Complex mapping due to object structure of languages
                                    value={(content.languages || []).map(l => `${l.language} (${l.proficiency})`).join('\n')}
                                    onChange={(e) => {
                                        const lines = e.target.value.split('\n');
                                        const newLangs = lines.map(line => {
                                            const match = line.match(/(.*)\s\((.*)\)/);
                                            if (match) return { language: match[1].trim(), proficiency: match[2].trim() };
                                            return { language: line, proficiency: 'Proficient' };
                                        });
                                        updateField('languages', newLangs);
                                    }}
                                />
                                <p className="text-[10px] text-gray-400">Format: Language (Proficiency)</p>
                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default ContentPanel;
