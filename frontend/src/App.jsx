import React, { useState } from 'react';
import ResumeTemplate from './templates/ResumeTemplate';
import ModernTemplate from './templates/ModernTemplate';
import MinimalistTemplate from './templates/MinimalistTemplate';
import ClassicTemplate from './templates/ClassicTemplate';
import CreativeTemplate from './templates/CreativeTemplate';
import CompactTemplate from './templates/CompactTemplate';
import ExecutiveTemplate from './templates/ExecutiveTemplate';
import CustomizationPanel from './panels/CustomizationPanel';
import ContentPanel from './panels/ContentPanel';
import { generatePDF } from './utils/pdfGenerator';
import './index.css'; // Ensure tailwind is imported

const App = () => {
  const initialData = {
    "status": "success",
    "resume_content": {
      "personal_info": {
        "name": "Akash Kumar",
        "email": "akashkum71@gmail.com",
        "phone": "+91 7617644460",
        "location": "India",
        "linkedin": "linkedin.com/in/akash-bargoti",
        "github": "github.com/AkashKumar2000",
        "website": "portfolio.akashkumar.dev"
      },
      "professional_summary": "Full-Stack Software Developer specializing in JavaScript/TypeScript, React, and Node.js with proven experience in building scalable web applications, interactive dashboards, and backend APIs. Passionate about creating innovative digital solutions and 3D interactive experiences for modern web applications.",
      "skills": {
        "frontend": [
          "JavaScript",
          "TypeScript",
          "React",
          "HTML5",
          "CSS3",
          "WebGL",
          "Three.js"
        ],
        "backend": [
          "Node.js",
          "Express.js",
          "REST APIs",
          "FastAPI",
          "MongoDB",
          "Socket.IO"
        ],
        "tools_cloud": [
          "Git",
          "Docker",
          "AWS",
          "VPS Deployment",
          "CI/CD",
          "Webpack"
        ]
      },
      "experience": [
        {
          "title": "Software Engineering Intern",
          "company": "EPAM Systems",
          "location": "Remote, India",
          "duration": "Jun 2023 - Dec 2023",
          "description": [
            "Developed and maintained web applications and dashboards using React and Node.js, focusing on scalable architecture and performance optimization",
            "Built robust backend APIs and services using Node.js and REST APIs with emphasis on security, data integrity, and real-time functionality",
            "Collaborated with cross-functional teams to deliver interactive digital solutions and modern web applications",
            "Implemented responsive UI components and optimized user experience across multiple devices and platforms"
          ],
          "technologies": [
            "React",
            "Node.js",
            "JavaScript",
            "TypeScript",
            "REST APIs",
            "MongoDB"
          ]
        },
        {
          "title": "Full-Stack Developer",
          "company": "Freelance Projects",
          "location": "Remote",
          "duration": "Jan 2023 - May 2023",
          "description": [
            "Designed and developed interactive web applications with focus on user experience and modern UI/UX principles",
            "Created scalable backend services and APIs to support real-time data processing and communication features",
            "Implemented responsive designs and cross-browser compatibility for optimal user engagement"
          ],
          "technologies": [
            "JavaScript",
            "React",
            "Node.js",
            "MongoDB",
            "Socket.IO"
          ]
        }
      ],
      "projects": [
        {
          "name": "AI Document Summarizer Platform",
          "description": "Built an AI-powered document summarization platform supporting PDF, DOCX, and TXT files with modern web interface and real-time processing capabilities",
          "technologies": [
            "FastAPI",
            "React",
            "NLP",
            "Transformers",
            "JavaScript",
            "REST APIs"
          ],
          "github": "https://github.com/AkashKumar2000/ai-document-summarizer",
          "demo": "https://ai-summarizer-demo.com",
          "highlights": [
            "Implemented responsive React frontend with modern UI components",
            "Developed scalable FastAPI backend with real-time document processing",
            "Integrated advanced NLP models for accurate text summarization",
            "Achieved 95% accuracy in document content extraction and summarization"
          ]
        },
        {
          "name": "Real-Time MERN Chat Application",
          "description": "Developed a real-time chat application using Socket.IO for live communication with modern web technologies and interactive user interface",
          "technologies": [
            "MongoDB",
            "Express.js",
            "React",
            "Node.js",
            "Socket.IO",
            "JavaScript"
          ],
          "github": "https://github.com/AkashKumar2000/mern-chat-app",
          "demo": "https://mern-chat-demo.com",
          "highlights": [
            "Built responsive React frontend with real-time messaging interface",
            "Implemented Node.js backend with Socket.IO for instant communication",
            "Designed scalable MongoDB database architecture for user and message management",
            "Deployed application with focus on performance and user experience"
          ]
        },
        {
          "name": "Interactive 3D Portfolio Website",
          "description": "Created an interactive 3D portfolio website showcasing modern web development skills with WebGL and Three.js integration",
          "technologies": [
            "Three.js",
            "WebGL",
            "JavaScript",
            "React",
            "CSS3",
            "Interactive UI"
          ],
          "github": "https://github.com/AkashKumar2000/3d-portfolio",
          "demo": "https://portfolio.akashkumar.dev",
          "highlights": [
            "Implemented 3D graphics and animations using Three.js and WebGL",
            "Created interactive UI elements with smooth user experience",
            "Optimized performance for cross-device compatibility",
            "Showcased modern web development and 3D visualization skills"
          ]
        }
      ],
      "education": [
        {
          "degree": "M.E. in Artificial Intelligence",
          "field": "Artificial Intelligence & Machine Learning",
          "institution": "University Name",
          "duration": "Aug 2025 – Present",
          "gpa": "Current"
        },
        {
          "degree": "B.Tech in Computer Science & Engineering",
          "field": "Computer Science & Engineering",
          "institution": "University Name",
          "duration": "Aug 2019 – May 2023",
          "gpa": "7.25"
        }
      ],
      "achievements": [
        "Achieved an 18% improvement in Sharpe Ratio over traditional MPT models using LSTM-based portfolio optimization",
        "Successfully delivered 5+ full-stack web applications with 99% uptime and optimal performance",
        "Improved application load time by 40% through code optimization and efficient API design",
        "Led development of real-time features serving 1000+ concurrent users with Socket.IO integration"
      ],
      "certifications": [
        {
          "name": "React Developer Professional",
          "issuer": "Meta",
          "date": "2023"
        },
        {
          "name": "Node.js Application Development",
          "issuer": "IBM",
          "date": "2023"
        },
        {
          "name": "JavaScript Algorithms and Data Structures",
          "issuer": "freeCodeCamp",
          "date": "2023"
        },
        {
          "name": "AWS Cloud Practitioner",
          "issuer": "Amazon Web Services",
          "date": "2024"
        }
      ],
      "languages": [
        {
          "language": "English",
          "proficiency": "Professional"
        },
        {
          "language": "Hindi",
          "proficiency": "Native"
        }
      ]
    },
    "formatting_tips": [
      "Emphasize JavaScript/TypeScript and React experience prominently",
      "Highlight Node.js backend development and API creation skills",
      "Include any 3D, WebGL, or interactive UI projects (even learning projects)",
      "Mention cloud platforms and deployment experience",
      "Use action verbs: 'Built', 'Developed', 'Implemented', 'Optimized'",
      "Quantify achievements with specific numbers and percentages",
      "Tailor keywords to match: scalable, interactive, modern, responsive",
      "Show progression from learning to implementing complex features"
    ],
    "message": "JD-matched resume content generated successfully with gap analysis integration"
  };

  const [resumeData, setResumeData] = useState(initialData);
  const [activePanel, setActivePanel] = useState('customize'); // 'customize' or 'content'

  const [settings, setSettings] = useState({
    selectedTemplate: 'Standard',
    primaryColor: '#2563eb', // blue-600
    secondaryColor: '#4b5563', // gray-600
    fontFamily: 'Inter',
    headingSize: 'Medium'
  });

  const handleDownload = () => {
    generatePDF('resume-preview');
  };

  const renderTemplate = () => {
    const props = { data: resumeData, settings };
    switch (settings.selectedTemplate) {
      case 'Modern': return <ModernTemplate {...props} />;
      case 'Minimalist': return <MinimalistTemplate {...props} />;
      case 'Classic': return <ClassicTemplate {...props} />;
      case 'Creative': return <CreativeTemplate {...props} />;
      case 'Compact': return <CompactTemplate {...props} />;
      case 'Executive': return <ExecutiveTemplate {...props} />;
      default: return <ResumeTemplate {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-3xl font-bold text-gray-900">Resume Builder</h1>
            <div className="bg-white rounded-lg shadow p-1 flex">
              <button
                onClick={() => setActivePanel('customize')}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activePanel === 'customize' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Customize
              </button>
              <button
                onClick={() => setActivePanel('content')}
                className={`px-4 py-1.5 text-sm font-medium rounded transition-colors ${activePanel === 'content' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                Edit Content
              </button>
            </div>
          </div>

          <button
            onClick={handleDownload}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded shadow transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Download PDF
          </button>
        </header>

        <div className="flex flex-col md:flex-row gap-8 items-start">
          <aside className="w-full md:w-auto shrink-0 z-10 sticky top-8">
            {activePanel === 'customize' ? (
              <CustomizationPanel settings={settings} setSettings={setSettings} />
            ) : (
              <ContentPanel data={resumeData} setData={setResumeData} />
            )}
          </aside>

          <main className="flex-grow overflow-auto flex justify-center pb-20">
            {renderTemplate()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;