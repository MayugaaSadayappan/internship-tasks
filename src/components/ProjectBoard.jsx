import React, { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ProjectBoard({ project, token }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tasks/${project._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();

    socket.on('update_board', (data) => {
      if (data.projectId === project._id) {
        fetchTasks();
      }
    });

    return () => socket.off('update_board');
  }, [project._id]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks', 
        { project: project._id, title, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTitle('');
      setDescription('');
      fetchTasks();
      socket.emit('task_moved', { projectId: project._id });
    } catch (err) {
      console.error(err);
    }
  };

  const moveTask = async (taskId, currentStatus) => {
    let nextStatus = 'To-Do';
    if (currentStatus === 'To-Do') nextStatus = 'In Progress';
    if (currentStatus === 'In Progress') nextStatus = 'Done';
    if (currentStatus === 'Done') nextStatus = 'To-Do';

    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, 
        { status: nextStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
      socket.emit('task_moved', { projectId: project._id, taskId, nextStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const renderColumn = (status, bgColor, textBadge) => {
    const filteredTasks = tasks.filter(t => t.status === status);
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 min-h-[400px] shadow-md">
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-700">
          <h3 className="font-bold text-gray-200">{status}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${bgColor} ${textBadge}`}>
            {filteredTasks.length}
          </span>
        </div>

        <div className="space-y-3">
          {filteredTasks.map(t => (
            <div key={t._id} className="bg-slate-900 p-4 rounded border border-slate-700 hover:border-slate-500 shadow transition">
              <h4 className="font-semibold text-white mb-1">{t.title}</h4>
              <p className="text-sm text-gray-400 mb-3">{t.description || 'No description.'}</p>
              <button onClick={() => moveTask(t._id, t.status)} className="w-full text-xs bg-slate-700 hover:bg-blue-600 text-gray-200 hover:text-white py-1.5 px-2 rounded font-medium transition flex justify-center items-center gap-1">
                Move status ➔
              </button>
            </div>
          ))}
          {filteredTasks.length === 0 && (
            <p className="text-center text-sm text-gray-500 py-8">Empty Column</p>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-md">
        <h2 className="text-2xl font-bold text-white mb-1">📁 Project: {project.name}</h2>
        <p className="text-gray-400 text-sm mb-4">{project.description || 'No layout description.'}</p>

        <form onSubmit={handleAddTask} className="flex flex-col md:flex-row gap-3">
          <input type="text" placeholder="Task Title..." className="flex-1 p-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500" value={title} onChange={e => setTitle(e.target.value)} required />
          <input type="text" placeholder="Short description..." className="flex-1 p-2 bg-slate-900 border border-slate-600 rounded text-white text-sm focus:outline-none focus:border-blue-500" value={description} onChange={e => setDescription(e.target.value)} />
          <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded text-sm font-bold transition">＋ Add Task</button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {renderColumn('To-Do', 'bg-yellow-500/20', 'text-yellow-400')}
        {renderColumn('In Progress', 'bg-blue-500/20', 'text-blue-400')}
        {renderColumn('Done', 'bg-green-500/20', 'text-green-400')}
      </div>
    </div>
  );
}

export default ProjectBoard;