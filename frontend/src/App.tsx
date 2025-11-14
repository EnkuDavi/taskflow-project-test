import { useState, useEffect } from 'react'
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

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      
      if (data.success && data.data.token) {
        localStorage.setItem('token', data.data.token)
        setIsAuthenticated(true)
        setCurrentView('tasks')
      } else {
        console.error('Login failed:', data)
      }
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const handleRegister = async (fullName: string, email: string, password: string) => {
    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          name: fullName
        })
      })

      const data = await response.json()
      
      if (data.success) {
        setCurrentView('login')
      } else {
        console.error('Registration failed:', data)
      }
    } catch (error) {
      console.error('Registration error:', error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    setCurrentView('login')
  }

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setCurrentView('tasks')
    }
  }, [])

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

      <div className="kanban-board">
        <div className="kanban-column">
          <div className="column-header">
            <h3>Pending</h3>
            <span className="task-count">{tasks.filter(t => t.status === 'pending').length}</span>
          </div>
          <div className="column-content">
            {tasks.filter(task => task.status === 'pending').map(task => (
              <div key={task.id} className="kanban-card">
                <div className="card-content">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="card-actions">
                  <button onClick={() => toggleStatus(task.id)} className="complete-btn">
                    Complete
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === 'pending').length === 0 && (
              <div className="empty-column">No pending tasks</div>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <div className="column-header">
            <h3>Completed</h3>
            <span className="task-count">{tasks.filter(t => t.status === 'completed').length}</span>
          </div>
          <div className="column-content">
            {tasks.filter(task => task.status === 'completed').map(task => (
              <div key={task.id} className="kanban-card completed">
                <div className="card-content">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                </div>
                <div className="card-actions">
                  <button onClick={() => toggleStatus(task.id)} className="reopen-btn">
                    Reopen
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasks.filter(t => t.status === 'completed').length === 0 && (
              <div className="empty-column">No completed tasks</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
