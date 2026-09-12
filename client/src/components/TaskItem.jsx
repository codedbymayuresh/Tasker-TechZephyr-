import React from 'react';

export default function TaskItem({ task, onComplete, onDelete }) {
  return (
    <li className={`task-card ${task.completed ? 'completed' : ''}`}>
      <div>
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          {task.category} · {task.difficulty}
        </div>
      </div>
      <div className="task-actions">
        {!task.completed && (
          <button
            className="btn-complete"
            onClick={() => onComplete(task._id)}
            aria-label={`Mark "${task.title}" as complete`}
          >
            Complete
          </button>
        )}
        <button
          className="btn-delete"
          onClick={() => onDelete(task._id)}
          aria-label={`Delete "${task.title}"`}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
