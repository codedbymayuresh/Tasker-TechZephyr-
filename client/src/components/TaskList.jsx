import React from 'react';
import TaskItem from './TaskItem';

export default function TaskList({ tasks, onComplete, onDelete }) {
  if (!tasks || tasks.length === 0) {
    return <p className="empty-state">No quests yet — add one above to get started.</p>;
  }

  return (
    <ul className="task-list" aria-label="Task list">
      {tasks.map((task) => (
        <TaskItem key={task._id} task={task} onComplete={onComplete} onDelete={onDelete} />
      ))}
    </ul>
  );
}
