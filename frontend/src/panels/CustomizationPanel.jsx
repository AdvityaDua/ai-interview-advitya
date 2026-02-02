import React from 'react';

const CustomizationPanel = ({ settings, setSettings }) => {
    const handleChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md w-full md:w-80 h-fit sticky top-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Customize</h2>

            {/* Template Selection */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Template</h3>
                <select
                    value={settings.selectedTemplate || 'Standard'}
                    onChange={(e) => handleChange('selectedTemplate', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="Standard">Standard</option>
                    <option value="Modern">Modern (Sidebar)</option>
                    <option value="Minimalist">Minimalist</option>
                    <option value="Classic">Classic</option>
                    <option value="Creative">Creative</option>
                    <option value="Compact">Compact</option>
                    <option value="Executive">Executive</option>
                </select>
            </div>

            {/* Colors */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Colors</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label htmlFor="primaryColor" className="text-gray-700 font-medium">Primary Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                id="primaryColor"
                                value={settings.primaryColor}
                                onChange={(e) => handleChange('primaryColor', e.target.value)}
                                className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-300"
                            />
                            <span className="text-xs text-gray-500 font-mono w-16">{settings.primaryColor}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <label htmlFor="secondaryColor" className="text-gray-700 font-medium">Secondary Color</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="color"
                                id="secondaryColor"
                                value={settings.secondaryColor}
                                onChange={(e) => handleChange('secondaryColor', e.target.value)}
                                className="w-10 h-10 p-1 rounded cursor-pointer border border-gray-300"
                            />
                            <span className="text-xs text-gray-500 font-mono w-16">{settings.secondaryColor}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wider">Typography</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Font Family</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Inter', 'Roboto', 'Serif'].map(font => (
                                <button
                                    key={font}
                                    onClick={() => handleChange('fontFamily', font)}
                                    className={`px-3 py-2 text-sm border rounded transition-colors ${settings.fontFamily === font
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {font}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-gray-700 font-medium mb-1">Heading Size</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Small', 'Medium', 'Large'].map(size => (
                                <button
                                    key={size}
                                    onClick={() => handleChange('headingSize', size)}
                                    className={`px-3 py-2 text-sm border rounded transition-colors ${settings.headingSize === size
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded text-sm text-blue-800">
                <p>💡 Tip: Browser print settings can affect the output. Ensure "Background graphics" is enabled in the print dialog.</p>
            </div>

        </div>
    );
};

export default CustomizationPanel;
