import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import XPBar from '../components/XPBar';
import StreakDisplay from '../components/StreakDisplay';

export default function Dashboard() {
  const { user, updateUser } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [levelUpMessage, setLevelUpMessage] = useState('');
  
  // Modal state & form inputs
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [difficulty, setDifficulty] = useState('medium');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/tasks');
      setTasks(res.data.tasks);
    } catch (err) {
      setError('Could not load tasks. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/tasks', { 
        title, 
        description, 
        dueDate, 
        priority, 
        difficulty 
      });
      setTasks((prev) => [res.data.task, ...prev]);
      setTitle('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setDifficulty('medium');
      setIsModalOpen(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Could not create task');
    }
  };

  const handleCompleteTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, completed: true } : t))
    );

    try {
      const res = await api.patch(`/tasks/${taskId}/complete`);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      updateUser(res.data.user);

      if (res.data.rewards.leveledUp) {
        setLevelUpMessage(`Level Up! You reached level ${res.data.rewards.newLevel}!`);
        setTimeout(() => setLevelUpMessage(''), 4000);
      }
    } catch (err) {
      setTasks(previousTasks);
      setError(err.response?.data?.message || 'Could not complete task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    const previousTasks = tasks;
    setTasks((prev) => prev.filter((t) => t._id !== taskId));

    try {
      await api.delete(`/tasks/${taskId}`);
    } catch (err) {
      setTasks(previousTasks);
      setError(err.response?.data?.message || 'Could not delete task');
    }
  };

  if (!user) return null;

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <main style={{ padding: '2rem', fontFamily: "'Share Tech Mono', monospace", color: '#fff', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ color: '#00f0ff', margin: 0, textShadow: '0 0 10px rgba(0,240,255,0.3)', fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}>
            WELCOME BACK, {user.username.toUpperCase()}
          </h1>
          <p style={{ color: '#888', margin: '0.3rem 0 0 0', fontSize: '0.85rem' }}>SYSTEM STATUS: ONLINE</p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          style={{
            background: 'rgba(0, 240, 255, 0.1)',
            border: '1px solid #00f0ff',
            color: '#00f0ff',
            padding: '0.75rem 1.5rem',
            fontFamily: 'inherit',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 0 10px rgba(0,240,255,0.2)',
            letterSpacing: '1px'
          }}>
          + NEW QUEST
        </button>
      </div>

      {levelUpMessage && (
        <div style={{ background: 'rgba(0,240,255,0.1)', border: '1px solid #00f0ff', padding: '1rem', marginBottom: '1.5rem', color: '#00f0ff', textAlign: 'center', fontWeight: 'bold' }}>
          {levelUpMessage}
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: '#111', border: '1px solid #333', padding: '1.2rem' }}>
          <XPBar level={user.level} currentLevelXp={user.currentLevelXp} xpForNextLevel={user.xpForNextLevel} />
        </div>
        <div style={{ background: '#111', border: '1px solid #333', padding: '1.2rem' }}>
          <StreakDisplay streak={user.streak} />
        </div>
      </section>

      <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '2rem' }}>
        
        {/* Left Column: Active Quests */}
        <section style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
          <h2 style={{ color: '#00f0ff', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginTop: 0 }}>
            ACTIVE QUESTS ({activeTasks.length})
          </h2>

          {error && <p style={{ color: '#ff003c', fontSize: '0.9rem' }}>{error}</p>}

          {loading ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>Decrypting task data...</div>
          ) : activeTasks.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>No active quests. Queue is clear.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {activeTasks.map((task) => (
                <div key={task._id} className="task-item" style={{ background: '#16161a', border: '1px solid #333', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
                  <div style={{ flex: 1, minWidth: '180px' }}>
                    <h4 style={{ margin: '0 0 0.3rem 0', color: '#fff' }}>{task.title}</h4>
                    <p style={{ margin: '0 0 0.5rem 0', color: '#888', fontSize: '0.8rem' }}>{task.description || 'No subtext provided.'}</p>
                    <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.7rem', flexWrap: 'wrap' }}>
                      {task.dueDate && <span style={{ color: '#fce205' }}>DATE: {task.dueDate.split('T')[0]}</span>}
                      <span style={{ color: '#00f0ff' }}>PRIORITY: {task.priority?.toUpperCase()}</span>
                      <span style={{ color: '#a855f7' }}>DIFF: {task.difficulty?.toUpperCase()}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      onClick={() => handleCompleteTask(task._id)}
                      style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid #22c55e', color: '#22c55e', padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontWeight: 'bold', fontSize: '0.75rem' }}>
                      [COMPLETE]
                    </button>
                    <button 
                      onClick={() => handleDeleteTask(task._id)}
                      style={{ background: 'rgba(255,0,60,0.1)', border: '1px solid #ff003c', color: '#ff003c', padding: '0.4rem 0.8rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem' }}>
                      X
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Right Column: Completed Archive */}
        <section style={{ background: '#111', border: '1px solid #222', padding: '1.5rem' }}>
          <h2 style={{ color: '#22c55e', fontSize: '1.2rem', borderBottom: '1px solid #222', paddingBottom: '0.5rem', marginTop: 0 }}>
            COMPLETED ARCHIVE ({completedTasks.length})
          </h2>

          {completedTasks.length === 0 ? (
            <div style={{ color: '#666', textAlign: 'center', padding: '3rem' }}>No completed quests archived yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {completedTasks.map((task) => (
                <div key={task._id} style={{ background: '#131316', border: '1px solid #1e293b', padding: '1rem', opacity: 0.75 }}>
                  <h4 style={{ margin: '0 0 0.3rem 0', color: '#94a3b8', textDecoration: 'line-through' }}>{task.title}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#22c55e', background: 'rgba(34,197,94,0.1)', padding: '0.2rem 0.4rem' }}>
                    STATUS: EXECUTED
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>

      {/* Cyberpunk Modal Popup */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.85)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 2000,
          padding: '1rem'
        }}>
          <div className="modal-container" style={{
            background: '#121215',
            border: '2px solid #00f0ff',
            width: '500px',
            maxWidth: '100%',
            padding: '2rem',
            boxShadow: '0 0 25px rgba(0,240,255,0.3)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ color: '#00f0ff', marginTop: 0, borderBottom: '1px solid #333', paddingBottom: '0.5rem', letterSpacing: '1px', fontSize: '1.2rem' }}>
              INITIALIZE NEW QUEST
            </h2>

            <form onSubmit={handleCreateTask}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>QUEST TITLE</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                  placeholder="e.g., Deploy Neural Network"
                  style={{ width: '100%', padding: '0.7rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }} 
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>DUE DATE</label>
                <input 
                  type="date" 
                  value={dueDate} 
                  onChange={(e) => setDueDate(e.target.value)} 
                  style={{ width: '100%', padding: '0.7rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }} 
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>PRIORITY</label>
                  <select 
                    value={priority} 
                    onChange={(e) => setPriority(e.target.value)} 
                    style={{ width: '100%', padding: '0.7rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>DIFFICULTY</label>
                  <select 
                    value={difficulty} 
                    onChange={(e) => setDifficulty(e.target.value)} 
                    style={{ width: '100%', padding: '0.7rem', background: '#000', border: '1px solid #333', color: '#fff', fontFamily: 'inherit' }}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#888', marginBottom: '0.4rem' }}>QUEST DESCRIPTION</label>
                <textarea 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Enter specifications..."
                  rows="3"
                  style={{ width: '100%', padding: '0.7rem', background: '#000', border: '1px solid #333', color: '#fff', resize: 'none', fontFamily: 'inherit' }} 
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button 
                  type="submit" 
                  style={{ flex: 1, padding: '0.75rem', background: '#00f0ff', color: '#000', fontWeight: 'bold', border: 'none', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'inherit' }}>
                  DEPLOY
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  style={{ flex: 1, padding: '0.75rem', background: 'transparent', border: '1px solid #ff003c', color: '#ff003c', fontWeight: 'bold', cursor: 'pointer', letterSpacing: '1px', fontFamily: 'inherit' }}>
                  ABORT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}