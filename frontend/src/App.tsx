import { useState } from 'react'
import './App.css'
import { Login } from './components/Login'
import { Register } from './components/Register'

interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'completed'
}

type AuthView = 'login' | 'register' | 'tasks'

function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleLogin = (email: string, password: string) => {
    console.log('Login:', { email, password })
    setIsAuthenticated(true)
    setCurrentView('tasks')
  }

  const handleRegister = (fullName: string, email: string, password: string) => {
    console.log('Register:', { fullName, email, password })
    setIsAuthenticated(true)
    setCurrentView('tasks')
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentView('login')
  }

  const addTask = () => {
    if (!title.trim()) return
    
    const newTask: Task = {
      id: Date.now(),
      title: title.trim(),
      description: description.trim() || undefined,
      status: 'pending'
    }
    
    setTasks([...tasks, newTask])
    setTitle('')
    setDescription('')
  }

  const toggleStatus = (id: number) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ))
  }

  const deleteTask = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  if (currentView === 'login') {
    return (
      <Login 
        onLogin={handleLogin}
        onSwitchToRegister={() => setCurrentView('register')}
      />
    )
  }

  if (currentView === 'register') {
    return (
      <Register 
        onRegister={handleRegister}
        onSwitchToLogin={() => setCurrentView('login')}
      />
    )
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Task Management</h1>
        <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
          Logout
        </button>
      </div>
      
      <div className="task-form">
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={addTask}>Add Task</button>
      </div>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className={`task-item ${task.status}`}>
            <div className="task-content">
              <h3>{task.title}</h3>
              {task.description && <p>{task.description}</p>}
              <span className="status">{task.status}</span>
            </div>
            <div className="task-actions">
              <button onClick={() => toggleStatus(task.id)}>
                {task.status === 'pending' ? 'Complete' : 'Reopen'}
              </button>
              <button onClick={() => deleteTask(task.id)} className="delete">
                Delete
              </button>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <p className="no-tasks">No tasks yet. Add one above!</p>
        )}
      </div>
    </div>
  )
}

export default App
