import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import ProjectBoard from '../components/ProjectBoard.jsx';

function Dashboard() {
  const { token, logout } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (token) fetchProjects();
  }, [token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/projects', 
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([...projects, res.data]);
      setName('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="flex justify-between items-center mb-8 border-b border-slate-700 pb-4">
        <h1 className="text-3xl font-extrabold text-blue-400 tracking-wide">💼 Project Workspace</h1>
        <button onClick={logout} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition">Logout</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 p-6 rounded-lg h-fit border border-slate-700 shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-gray-200">New Project</h2>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <input type="text" placeholder="Project Name" className="w-full p-2.5 rounded bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-500" value={name} onChange={e => setName(e.target.value)} required />
            <textarea placeholder="Description..." className="w-full p-2.5 rounded bg-slate-900 border border-slate-600 text-white focus:outline-none focus:border-blue-500 h-24 resize-none" value={description} onChange={e => setDescription(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 p-2.5 rounded font-bold transition">＋ Create</button>
          </form>

          <h3 className="text-md font-bold mt-8 mb-3 text-gray-400 uppercase tracking-wider">Your Projects</h3>
          <div className="space-y-2">
            {projects.map(p => (
              <button key={p._id} onClick={() => setSelectedProject(p)} className={`w-full text-left p-3 rounded transition font-medium truncate block ${selectedProject?._id === p._id ? 'bg-blue-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-gray-200'}`}>
                📁 {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3">
          {selectedProject ? (
            <ProjectBoard project={selectedProject} token={token} />
          ) : (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/40 text-gray-400">
              <span className="text-5xl mb-4">👈</span>
              <p className="text-lg">Select a project from the left sidebar to open the Task Kanban Board.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;