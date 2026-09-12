import React, { useState } from 'react';

const CATEGORIES = ['fitness', 'coding', 'study', 'reading', 'mindfulness', 'social', 'chores', 'discipline', 'other'];
const DIFFICULTIES = ['easy', 'medium', 'hard'];

// Controlled form for creating a new task. Calls onCreate(taskData)
// and clears itself on success.
export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('other');
  const [difficulty, setDifficulty] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title cannot be empty');
      return;
    }
    setError('');
    setSubmitting(true);
    const success = await onCreate({ title, category, difficulty });
    setSubmitting(false);
    if (success) {
      setTitle('');
      setCategory('other');
      setDifficulty('medium');
    }
  };

  return (
    <form className="task-form" onSubmit={handleSubmit} aria-label="Add a new task">
      <label htmlFor="task-title" className="visually-hidden">Task title</label>
      <input
        id="task-title"
        type="text"
        placeholder="What do you need to do?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label htmlFor="task-category" className="visually-hidden">Category</label>
      <select id="task-category" value={category} onChange={(e) => setCategory(e.target.value)}>
        {CATEGORIES.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label htmlFor="task-difficulty" className="visually-hidden">Difficulty</label>
      <select id="task-difficulty" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
        {DIFFICULTIES.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <button type="submit" disabled={submitting}>
        {submitting ? 'Adding...' : 'Add Task'}
      </button>

      {error && <p className="error-message" role="alert">{error}</p>}
    </form>
  );
}
