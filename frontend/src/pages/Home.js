import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoCheckboxOutline, IoWalletOutline, IoDocumentTextOutline, IoTrendingUpOutline } from 'react-icons/io5';
import api from '../config/api';
import './Home.css';

const Home = () => {
  const [todayTasks, setTodayTasks] = useState([]);
  const [todayExpenses, setTodayExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadDashboard();
    setGreetingMessage();
  }, []);

  const setGreetingMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const loadDashboard = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get today's tasks
      const tasksRes = await api.get(`/tasks?date=${today}`);
      setTodayTasks(tasksRes.data);

      // Get today's expenses
      const expensesRes = await api.get(`/expenses?startDate=${today}&endDate=${today}`);
      const total = expensesRes.data.reduce((sum, exp) => sum + exp.amount, 0);
      setTodayExpenses(total);

      setLoading(false);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setLoading(false);
    }
  };

  const completedTasks = todayTasks.filter(t => t.completed).length;
  const completionRate = todayTasks.length > 0 
    ? Math.round((completedTasks / todayTasks.length) * 100) 
    : 0;

  if (loading) {
    return (
      <div className="page">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="page home-page">
      <div className="home-header">
        <div>
          <h1 className="home-greeting">{greeting}</h1>
          <p className="home-date">{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="stats-grid">
        <Link to="/tasks" className="stat-card">
          <IoCheckboxOutline className="stat-icon" style={{ color: 'var(--primary-1)' }} />
          <div className="stat-content">
            <div className="stat-value">{completedTasks}/{todayTasks.length}</div>
            <div className="stat-label">Tasks Done</div>
          </div>
        </Link>

        <Link to="/expenses" className="stat-card">
          <IoWalletOutline className="stat-icon" style={{ color: 'var(--primary-3)' }} />
          <div className="stat-content">
            <div className="stat-value">₹{todayExpenses.toLocaleString()}</div>
            <div className="stat-label">Spent Today</div>
          </div>
        </Link>
      </div>

      {/* Today's Tasks Preview */}
      <div className="section">
        <div className="section-header">
          <h2 className="section-title">Today's Tasks</h2>
          <Link to="/tasks" className="section-link">View All</Link>
        </div>

        {todayTasks.length === 0 ? (
          <div className="card empty-card">
            <p>No tasks for today. Tap to add one.</p>
          </div>
        ) : (
          <div className="tasks-preview">
            {todayTasks.slice(0, 3).map(task => (
              <div key={task._id} className={`task-preview-item ${task.completed ? 'completed' : ''}`}>
                <div className={`task-checkbox ${task.completed ? 'checked' : ''}`}>
                  {task.completed && '✓'}
                </div>
                <div className="task-preview-content">
                  <div className="task-preview-title">{task.title}</div>
                  <div className="task-preview-meta">
                    <span className={`priority-badge priority-${task.priority.toLowerCase()}`}>
                      {task.priority}
                    </span>
                    <span className="category-badge">{task.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions">
          <Link to="/tasks" className="quick-action-btn">
            <IoCheckboxOutline />
            <span>Add Task</span>
          </Link>
          <Link to="/expenses" className="quick-action-btn">
            <IoWalletOutline />
            <span>Log Expense</span>
          </Link>
          <Link to="/checkin" className="quick-action-btn">
            <IoTrendingUpOutline />
            <span>Daily Check-in</span>
          </Link>
          <Link to="/documents" className="quick-action-btn">
            <IoDocumentTextOutline />
            <span>Add Document</span>
          </Link>
        </div>
      </div>

      {/* Progress Ring */}
      {todayTasks.length > 0 && (
        <div className="section">
          <div className="progress-card">
            <div className="progress-ring">
              <svg width="120" height="120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="var(--gray-800)"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${completionRate * 3.39} 339`}
                  transform="rotate(-90 60 60)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="var(--primary-1)" />
                    <stop offset="100%" stopColor="var(--primary-2)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="progress-text">
                <div className="progress-percentage">{completionRate}%</div>
                <div className="progress-label">Complete</div>
              </div>
            </div>
            <div className="progress-details">
              <p className="progress-title">Today's Progress</p>
              <p className="progress-subtitle">
                You've completed {completedTasks} out of {todayTasks.length} tasks
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;