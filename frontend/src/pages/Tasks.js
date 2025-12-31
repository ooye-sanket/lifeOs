import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { IoAddOutline, IoCheckmarkOutline, IoTrashOutline, IoCalendarOutline } from 'react-icons/io5';
import api from '../config/api';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: 'Personal',
  });

  useEffect(() => {
    loadTasks();
  }, [selectedDate]);

  const loadTasks = async () => {
    try {
      const dateStr = selectedDate.toISOString().split('T')[0];
      const response = await api.get(`/tasks?date=${dateStr}`);
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await api.post('/tasks', {
        ...newTask,
        date: selectedDate,
      });
      setNewTask({ title: '', description: '', priority: 'Medium', category: 'Personal' });
      setShowAddTask(false);
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/toggle`);
      loadTasks();
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const isToday = selectedDate.toDateString() === new Date().toDateString();
  const isTomorrow = selectedDate.toDateString() === new Date(Date.now() + 86400000).toDateString();

  return (
    <div className="page tasks-page">
      <div className="page-header">
        <h1 className="page-title">Tasks</h1>
        <p className="page-subtitle">
          {isToday ? 'Today' : isTomorrow ? 'Tomorrow' : selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', month: 'short', day: 'numeric' 
          })}
        </p>
      </div>

      {/* Date Selector */}
      <div className="date-selector">
        <button 
          className={`date-btn ${isToday ? 'active' : ''}`}
          onClick={() => setSelectedDate(new Date())}
        >
          Today
        </button>
        <button 
          className={`date-btn ${isTomorrow ? 'active' : ''}`}
          onClick={() => setSelectedDate(new Date(Date.now() + 86400000))}
        >
          Tomorrow
        </button>
        <button 
          className="date-btn calendar-btn"
          onClick={() => setShowCalendar(!showCalendar)}
        >
          <IoCalendarOutline />
          Someday
        </button>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="modal-overlay" onClick={() => setShowCalendar(false)}>
          <div className="modal-content calendar-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">Select Date</h3>
            <Calendar
              value={selectedDate}
              onChange={(date) => {
                setSelectedDate(date);
                setShowCalendar(false);
              }}
              minDate={new Date()}
            />
            <button className="btn btn-secondary" onClick={() => setShowCalendar(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="tasks-list">
        {tasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <h3 className="empty-state-title">No tasks yet</h3>
            <p className="empty-state-text">Add your first task to get started</p>
          </div>
        ) : (
          tasks.map(task => (
            <div key={task._id} className={`task-item ${task.completed ? 'completed' : ''}`}>
              <div className="task-checkbox-wrapper" onClick={() => toggleTask(task._id)}>
                <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && <IoCheckmarkOutline />}
                </div>
              </div>
              <div className="task-details">
                <div className="task-title">{task.title}</div>
                {task.description && <div className="task-description">{task.description}</div>}
                <div className="task-meta">
                  <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                  <span className="category-badge">{task.category}</span>
                </div>
              </div>
              <button className="task-delete" onClick={() => deleteTask(task._id)}>
                <IoTrashOutline />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Task Button */}
      {!showAddTask && (
        <button className="fab" onClick={() => setShowAddTask(true)}>
          <IoAddOutline />
        </button>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3 className="modal-title">New Task</h3>
            <form onSubmit={handleAddTask}>
              <div className="input-group">
                <input
                  type="text"
                  className="input"
                  placeholder="Task title"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  autoFocus
                />
              </div>
              <div className="input-group">
                <textarea
                  className="input"
                  placeholder="Description (optional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows="3"
                />
              </div>
              <div className="input-group">
                <label className="input-label">Priority</label>
                <select
                  className="input"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">Category</label>
                <select
                  className="input"
                  value={newTask.category}
                  onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                >
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Health">Health</option>
                  <option value="Finance">Finance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowAddTask(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;