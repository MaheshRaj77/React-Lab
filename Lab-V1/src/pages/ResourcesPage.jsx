import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestSupabase from '../components/TestSupabase';
import Silk from '../blocks/Backgrounds/Silk/Silk';

const ResourcesPage = ({ 
  onHomeClick, 
  onLabsClick, 
  onResourcesClick, 
  onAboutClick, 
  onDashboardClick,
  onAdminLogin,
  onProfileClick,
  onLogoutClick,
  isLoggedIn = false,
  user = null
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [codeEditorContent, setCodeEditorContent] = useState(`// Welcome to the Code Editor!
// Write your code here and see it execute below

function greet(name) {
  return \`Hello, \${name}!\`;
}

console.log(greet("Developer"));
console.log("Start coding! 🚀");`);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [editorOutput, setEditorOutput] = useState('');

  const learningResources = [
    {
      category: 'frontend',
      title: 'React & Modern JavaScript',
      resources: [
        { name: 'React Official Docs', url: 'https://react.dev', description: 'Official React documentation with tutorials and API reference' },
        { name: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide', description: 'Comprehensive JavaScript language reference' },
        { name: 'React Router', url: 'https://reactrouter.com', description: 'Declarative routing for React applications' },
        { name: 'Redux Toolkit', url: 'https://redux-toolkit.js.org', description: 'The official, opinionated, batteries-included toolset for efficient Redux development' },
        { name: 'React Query', url: 'https://tanstack.com/query', description: 'Powerful data synchronization for React' }
      ]
    },
    {
      category: 'styling',
      title: 'CSS & Styling',
      resources: [
        { name: 'Tailwind CSS', url: 'https://tailwindcss.com', description: 'A utility-first CSS framework for rapid UI development' },
        { name: 'CSS-Tricks', url: 'https://css-tricks.com', description: 'Daily articles about CSS, HTML, JavaScript, and all things web design' },
        { name: 'Styled Components', url: 'https://styled-components.com', description: 'Visual primitives for the component age' },
        { name: 'Framer Motion', url: 'https://www.framer.com/motion', description: 'A production-ready motion library for React' },
        { name: 'CSS Grid Garden', url: 'https://cssgridgarden.com', description: 'A game for learning CSS Grid' }
      ]
    },
    {
      category: 'backend',
      title: 'Backend & APIs',
      resources: [
        { name: 'Node.js Docs', url: 'https://nodejs.org/en/docs', description: 'Official Node.js documentation and guides' },
        { name: 'Express.js', url: 'https://expressjs.com', description: 'Fast, unopinionated, minimalist web framework for Node.js' },
        { name: 'Supabase', url: 'https://supabase.com/docs', description: 'Open source Firebase alternative with real-time subscriptions' },
        { name: 'REST API Design', url: 'https://restfulapi.net', description: 'Best practices for REST API design' },
        { name: 'JWT.io', url: 'https://jwt.io', description: 'Learn about JSON Web Tokens' }
      ]
    },
    {
      category: 'tools',
      title: 'Development Tools',
      resources: [
        { name: 'VS Code', url: 'https://code.visualstudio.com', description: 'Free, open-source code editor with built-in support for JavaScript, TypeScript and Node.js' },
        { name: 'Git', url: 'https://git-scm.com/doc', description: 'Distributed version control system' },
        { name: 'Vite', url: 'https://vitejs.dev', description: 'Next generation frontend tooling - fast build tool' },
        { name: 'ESLint', url: 'https://eslint.org', description: 'Find and fix problems in your JavaScript code' },
        { name: 'Prettier', url: 'https://prettier.io', description: 'Opinionated code formatter' }
      ]
    },
    {
      category: 'community',
      title: 'Community & Learning',
      resources: [
        { name: 'Stack Overflow', url: 'https://stackoverflow.com', description: 'Question and answer site for professional and enthusiast programmers' },
        { name: 'GitHub', url: 'https://github.com', description: 'Development platform for version control and collaboration' },
        { name: 'Dev.to', url: 'https://dev.to', description: 'Where programmers share ideas and help each other grow' },
        { name: 'freeCodeCamp', url: 'https://www.freecodecamp.org', description: 'Learn to code for free with interactive coding challenges' },
        { name: 'MDN Web Docs', url: 'https://developer.mozilla.org', description: 'Resources for developers, by developers' }
      ]
    }
  ];

  const filteredResources = learningResources.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.resources.some(r => 
                           r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           r.description.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const runCode = () => {
    try {
      if (selectedLanguage === 'javascript') {
        // For JavaScript, we'll use eval in a controlled way
        let output = '';
        const originalConsoleLog = console.log;
        console.log = (...args) => {
          output += args.join(' ') + '\n';
        };
        
        // Create a new function to run the code safely
        const result = new Function(codeEditorContent)();
        if (result !== undefined) {
          output += 'Result: ' + result + '\n';
        }
        
        console.log = originalConsoleLog;
        setEditorOutput(output || 'Code executed successfully! ✅');
      } else {
        setEditorOutput(`Language "${selectedLanguage}" compilation not yet implemented.\nTry JavaScript for now! 🚀`);
      }
    } catch (error) {
      setEditorOutput(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative overflow-hidden">
      {/* Silk Background */}
      <div className="fixed inset-0 z-0 opacity-60">
        <Silk 
          speed={13.2} 
          scale={1} 
          color="#334155" 
          noiseIntensity={0} 
          rotation={0} 
        />
      </div>
      
      {/* Content Overlay */}
      <div className="relative z-10">
        <Navbar 
          onHomeClick={onHomeClick}
          onLabsClick={onLabsClick}
          onResourcesClick={onResourcesClick}
          onAboutClick={onAboutClick}
          onDashboardClick={onDashboardClick}
          onAdminLogin={onAdminLogin}
          onProfileClick={onProfileClick}
          onLogoutClick={onLogoutClick}
          isLoggedIn={isLoggedIn}
          user={user}
          theme="education"
        />
        
        <div className="pt-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-8 text-center font-heading">
              Learning Resources & Code Editor
            </h1>
          
          {/* Code Editor Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">💻 Interactive Code Editor</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400"
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="html">HTML/CSS</option>
                  </select>
                  <button
                    onClick={runCode}
                    className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors font-medium"
                  >
                    ▶️ Run Code
                  </button>
                </div>
                <textarea
                  value={codeEditorContent}
                  onChange={(e) => setCodeEditorContent(e.target.value)}
                  className="w-full h-64 bg-slate-900 border border-slate-600 rounded-lg p-4 text-green-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                  placeholder="Write your code here..."
                />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-4">Output:</h3>
                <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 h-64 overflow-auto">
                  <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">
                    {editorOutput || 'Click "Run Code" to see output here...'}
                  </pre>
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-slate-700 bg-opacity-60 rounded-lg">
              <h4 className="text-white font-semibold mb-2">💡 Tips:</h4>
              <ul className="text-slate-300 text-sm space-y-1">
                <li>• Use <code className="bg-slate-800 px-1 rounded">console.log()</code> to output values</li>
                <li>• JavaScript supports modern ES6+ features</li>
                <li>• Try writing functions, loops, and conditional statements</li>
                <li>• Other languages are coming soon with full compilation support!</li>
              </ul>
            </div>
          </div>
          
          {/* Search and Filter Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-6 shadow-2xl mb-8 border border-slate-600">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full md:w-auto">
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setSelectedCategory('frontend')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'frontend'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Frontend
                </button>
                <button
                  onClick={() => setSelectedCategory('styling')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'styling'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Styling
                </button>
                <button
                  onClick={() => setSelectedCategory('backend')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'backend'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Backend
                </button>
                <button
                  onClick={() => setSelectedCategory('tools')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === 'tools'
                      ? 'bg-primary-500 text-white'
                      : 'bg-slate-600 text-slate-300 hover:bg-slate-500'
                  }`}
                >
                  Tools
                </button>
              </div>
            </div>
          </div>
          
          {/* Database Connection Test */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-4 font-heading">Database Connection Test</h2>
            <TestSupabase />
          </div>
          
          {/* Experiments Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">Interactive Experiments</h2>
            <p className="text-white text-sm opacity-80 mb-6 font-sans">
              Explore hands-on web development experiments and demos:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <a href="/experiments/exp-1/index.html" target="_blank" rel="noopener noreferrer" className="backdrop-blur-lg bg-slate-700 bg-opacity-70 hover:bg-slate-600 p-4 rounded-xl transition-all border border-slate-600 hover:border-primary-400 hover:scale-105 duration-300">
                <h3 className="text-white font-semibold mb-2 font-heading">HTML Tag Explorer</h3>
                <p className="text-white text-sm opacity-70">Explore and preview common HTML tags</p>
              </a>
              <a href="/experiments/exp-2/index.html" target="_blank" rel="noopener noreferrer" className="backdrop-blur-lg bg-slate-700 bg-opacity-70 hover:bg-slate-600 p-4 rounded-xl transition-all border border-slate-600 hover:border-primary-400 hover:scale-105 duration-300">
                <h3 className="text-white font-semibold mb-2">Online Book Store</h3>
                <p className="text-white text-sm opacity-70">E-commerce demo with cart functionality</p>
              </a>
              <a href="/experiments/exp-5/index.html" target="_blank" rel="noopener noreferrer" className="backdrop-blur-lg bg-slate-700 bg-opacity-70 hover:bg-slate-600 p-4 rounded-xl transition-all border border-slate-600 hover:border-primary-400 hover:scale-105 duration-300">
                <h3 className="text-white font-semibold mb-2">XML/XSLT Book Collection</h3>
                <p className="text-white text-sm opacity-70">XML data transformation demo</p>
              </a>
            </div>
          </div>
          
          {/* Playground Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">🎮 Playground by Category</h2>
            <p className="text-white text-sm opacity-80 mb-6 font-sans">
              Explore interactive playgrounds organized by technology categories:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 p-4 rounded-xl border border-slate-600 hover:border-primary-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🌐</div>
                  <h3 className="text-white font-semibold font-heading group-hover:text-primary-300 transition-colors">HTML & CSS</h3>
                </div>
                <p className="text-white text-sm opacity-70 mb-3">Learn HTML tags and CSS styling</p>
                <a href="/experiments/exp-1/index.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm hover:scale-105 transform duration-200">
                  Try HTML Explorer →
                </a>
              </div>
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 p-4 rounded-xl border border-slate-600 hover:border-primary-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">⚡</div>
                  <h3 className="text-white font-semibold font-heading group-hover:text-primary-300 transition-colors">JavaScript</h3>
                </div>
                <p className="text-white text-sm opacity-70 mb-3">Interactive JavaScript demos and examples</p>
                <a href="/experiments/exp-2/index.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm hover:scale-105 transform duration-200">
                  Try Book Store Demo →
                </a>
              </div>
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 p-4 rounded-xl border border-slate-600 hover:border-primary-400/50 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">📄</div>
                  <h3 className="text-white font-semibold font-heading group-hover:text-primary-300 transition-colors">XML & XSLT</h3>
                </div>
                <p className="text-white text-sm opacity-70 mb-3">Data transformation and XML processing</p>
                <a href="/experiments/exp-5/index.html" target="_blank" rel="noopener noreferrer" className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-lg transition-colors text-sm hover:scale-105 transform duration-200">
                  Try XML Collection →
                </a>
              </div>
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-80 p-4 rounded-xl border border-slate-600 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">⚛️</div>
                  <h3 className="text-white font-semibold font-heading opacity-60">React Components</h3>
                </div>
                <p className="text-white text-sm opacity-50 mb-3">Build and test React components</p>
                <button
                  className="inline-block bg-slate-600 text-slate-400 px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                  disabled={true}
                >
                  Coming Soon
                </button>
              </div>
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-80 p-4 rounded-xl border border-slate-600 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🔗</div>
                  <h3 className="text-white font-semibold font-heading opacity-60">API Integration</h3>
                </div>
                <p className="text-white text-sm opacity-50 mb-3">Practice with REST APIs and data fetching</p>
                <button
                  className="inline-block bg-slate-600 text-slate-400 px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                  disabled={true}
                >
                  Coming Soon
                </button>
              </div>
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-80 p-4 rounded-xl border border-slate-600 group">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🗄️</div>
                  <h3 className="text-white font-semibold font-heading opacity-60">Database</h3>
                </div>
                <p className="text-white text-sm opacity-50 mb-3">SQL queries and database operations</p>
                <button
                  className="inline-block bg-slate-600 text-slate-400 px-4 py-2 rounded-lg text-sm cursor-not-allowed opacity-50"
                  disabled={true}
                >
                  Coming Soon
                </button>
              </div>
            </div>
          </div>
          
          {/* Enhanced Learning Resources Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">📚 Comprehensive Learning Resources</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredResources.map((category, index) => (
                <div key={index} className="backdrop-blur-lg bg-slate-700 bg-opacity-75 rounded-xl p-6 border border-slate-600">
                  <h3 className="text-lg font-semibold text-white mb-4 font-heading flex items-center gap-2">
                    {category.category === 'frontend' && '⚛️'}
                    {category.category === 'styling' && '🎨'}
                    {category.category === 'backend' && '🔧'}
                    {category.category === 'tools' && '🛠️'}
                    {category.category === 'community' && '👥'}
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.resources.map((resource, resourceIndex) => (
                      <li key={resourceIndex} className="group">
                        <a
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 rounded-lg bg-slate-600 bg-opacity-50 hover:bg-slate-500 transition-all duration-200 border border-slate-500 hover:border-primary-400"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="text-white font-medium group-hover:text-primary-300 transition-colors">
                                {resource.name}
                              </h4>
                              <p className="text-slate-300 text-sm mt-1 opacity-80 group-hover:opacity-100 transition-opacity">
                                {resource.description}
                              </p>
                            </div>
                            <div className="text-slate-400 group-hover:text-primary-400 transition-colors ml-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            {filteredResources.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No resources found</h3>
                <p className="text-slate-400">Try adjusting your search terms or category filter</p>
              </div>
            )}
          </div>
          
          {/* Quick Tips & Code Snippets Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">💡 Quick Tips & Code Snippets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 rounded-xl p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3 font-heading flex items-center gap-2">
                  ⚡ React Hooks
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 mb-3">
                  <pre className="text-green-400 text-sm overflow-x-auto">
{`const [count, setCount] = useState(0);

useEffect(() => {
  document.title = \`Count: \${count}\`;
}, [count]);`}
                  </pre>
                </div>
                <p className="text-slate-300 text-sm">Essential React hooks for state management and side effects</p>
              </div>
              
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 rounded-xl p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3 font-heading flex items-center gap-2">
                  🎨 Tailwind Utilities
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 mb-3">
                  <pre className="text-blue-400 text-sm overflow-x-auto">
{`<div className="flex items-center justify-between p-4 bg-gray-100 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <h3 className="text-lg font-semibold">Title</h3>
  <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Click</button>
</div>`}
                  </pre>
                </div>
                <p className="text-slate-300 text-sm">Responsive layout with hover effects and transitions</p>
              </div>
              
              <div className="backdrop-blur-lg bg-slate-700 bg-opacity-70 rounded-xl p-6 border border-slate-600">
                <h3 className="text-lg font-semibold text-white mb-3 font-heading flex items-center gap-2">
                  🔄 Async/Await
                </h3>
                <div className="bg-slate-900 rounded-lg p-4 mb-3">
                  <pre className="text-yellow-400 text-sm overflow-x-auto">
{`const fetchData = async () => {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
  }
};`}
                  </pre>
                </div>
                <p className="text-slate-300 text-sm">Modern async programming with error handling</p>
              </div>
            </div>
          </div>
          
          {/* Learning Progress Section */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">📊 Learning Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-4xl mb-2">🎯</div>
                <h3 className="text-lg font-semibold text-white mb-2">Experiments Completed</h3>
                <div className="text-3xl font-bold text-primary-400 mb-1">3</div>
                <p className="text-slate-400 text-sm">Out of 10 available</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                  <div className="bg-primary-500 h-2 rounded-full" style={{width: '30%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <h3 className="text-lg font-semibold text-white mb-2">Resources Explored</h3>
                <div className="text-3xl font-bold text-green-400 mb-1">12</div>
                <p className="text-slate-400 text-sm">Documentation pages visited</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                  <div className="bg-green-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-2">⏱️</div>
                <h3 className="text-lg font-semibold text-white mb-2">Time Spent Learning</h3>
                <div className="text-3xl font-bold text-blue-400 mb-1">2.5h</div>
                <p className="text-slate-400 text-sm">This week</p>
                <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                  <div className="bg-blue-500 h-2 rounded-full" style={{width: '75%'}}></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recently Accessed Resources */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl mb-8 border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">🕒 Recently Accessed</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-slate-700 bg-opacity-70 rounded-lg p-4 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">⚛️</span>
                  <div>
                    <h3 className="text-white font-semibold">React Hooks Guide</h3>
                    <p className="text-slate-400 text-sm">2 hours ago</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">Comprehensive guide to React hooks with examples</p>
              </div>
              <div className="bg-slate-700 bg-opacity-70 rounded-lg p-4 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🎨</span>
                  <div>
                    <h3 className="text-white font-semibold">Tailwind CSS Utilities</h3>
                    <p className="text-slate-400 text-sm">1 day ago</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">Complete reference for Tailwind utility classes</p>
              </div>
              <div className="bg-slate-700 bg-opacity-70 rounded-lg p-4 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-3">🔧</span>
                  <div>
                    <h3 className="text-white font-semibold">Vite Configuration</h3>
                    <p className="text-slate-400 text-sm">3 days ago</p>
                  </div>
                </div>
                <p className="text-slate-300 text-sm">Advanced Vite setup and optimization tips</p>
              </div>
            </div>
          </div>
          
          {/* Community & Support */}
          <div className="backdrop-blur-lg bg-slate-800 bg-opacity-85 rounded-2xl p-8 shadow-2xl border border-slate-600">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">🤝 Community & Support</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <a href="https://stackoverflow.com/questions/tagged/reactjs" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-700 bg-opacity-70 rounded-lg p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600 group">
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">💬</div>
                  <h3 className="text-white font-semibold mb-2">Stack Overflow</h3>
                  <p className="text-slate-300 text-sm">Get answers from the developer community</p>
                </div>
              </a>
              <a href="https://github.com/facebook/react" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-700 bg-opacity-70 rounded-lg p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600 group">
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🐙</div>
                  <h3 className="text-white font-semibold mb-2">GitHub</h3>
                  <p className="text-slate-300 text-sm">React repository and issue tracking</p>
                </div>
              </a>
              <a href="https://react.dev" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-700 bg-opacity-70 rounded-lg p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600 group">
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📚</div>
                  <h3 className="text-white font-semibold mb-2">React Docs</h3>
                  <p className="text-slate-300 text-sm">Official React documentation</p>
                </div>
              </a>
              <a href="https://discord.gg/reactiflux" target="_blank" rel="noopener noreferrer" 
                 className="bg-slate-700 bg-opacity-70 rounded-lg p-6 hover:bg-slate-600 transition-all duration-300 cursor-pointer border border-slate-600 group">
                <div className="text-center">
                  <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">🎮</div>
                  <h3 className="text-white font-semibold mb-2">Discord</h3>
                  <p className="text-slate-300 text-sm">Join the React community chat</p>
                </div>
              </a>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Footer Component */}
      <Footer
        onHomeClick={onHomeClick}
        onExploreClick={onLabsClick}
        onResourcesClick={onResourcesClick}
        onDashboardClick={onDashboardClick}
        onAdminLogin={onAdminLogin}
        isLoggedIn={isLoggedIn}
      />
    </div>
  );
};

export default ResourcesPage;