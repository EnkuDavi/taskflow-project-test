import { useState, useEffect } from 'react'
import './App.css'
import { Login } from './components/Login'
import { Register } from './components/Register'
import { apiRequest, setUnauthorizedCallback } from './utils/auth'
import { API_BASE_URL } from './config/api'

interface Task {
  id: string
  title: string
  description?: string | null
  status: 'pending' | 'in_progress' | 'completed'
  userId: string
  createdAt: string
  updatedAt: string
}

type AuthView = 'login' | 'register' | 'tasks'

function App() {
  const [currentView, setCurrentView] = useState<AuthView>('login')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [inProgressTasks, setInProgressTasks] = useState<Task[]>([])
  const [completedTasks, setCompletedTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingPage, setPendingPage] = useState(1)
  const [inProgressPage, setInProgressPage] = useState(1)
  const [completedPage, setCompletedPage] = useState(1)
  const [pendingHasMore, setPendingHasMore] = useState(true)
  const [inProgressHasMore, setInProgressHasMore] = useState(true)
  const [completedHasMore, setCompletedHasMore] = useState(true)
  const [pendingTotal, setPendingTotal] = useState(0)
  const [inProgressTotal, setInProgressTotal] = useState(0)
  const [completedTotal, setCompletedTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleLogin = async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
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
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
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
    setPendingTasks([])
    setInProgressTasks([])
    setCompletedTasks([])
    setPendingTotal(0)
    setInProgressTotal(0)
    setCompletedTotal(0)
    setIsAuthenticated(false)
    setCurrentView('login')
  }

  const fetchTasksByStatus = async (status: 'pending' | 'in_progress' | 'completed', search = '', page = 1, append = false) => {
    if (!isAuthenticated || loading) return
    
    setLoading(true)
    try {
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : ''
      const response = await apiRequest(`${API_BASE_URL}/tasks?status=${status}&limit=10&page=${page}${searchParam}`)
      const data = await response.json()
      
      if (data.success) {
        const updateTasks = (prev: Task[]) => {
          if (append) {
            const existingIds = new Set(prev.map(task => task.id))
            const newTasks = data.data.filter((task: Task) => !existingIds.has(task.id))
            return [...prev, ...newTasks]
          }
          return data.data
        }
        
        if (status === 'pending') {
          setPendingTasks(updateTasks)
          setPendingPage(data.meta.currentPage)
          setPendingHasMore(data.meta.currentPage < data.meta.lastPage)
          setPendingTotal(data.meta.total)
        } else if (status === 'in_progress') {
          setInProgressTasks(updateTasks)
          setInProgressPage(data.meta.currentPage)
          setInProgressHasMore(data.meta.currentPage < data.meta.lastPage)
          setInProgressTotal(data.meta.total)
        } else {
          setCompletedTasks(updateTasks)
          setCompletedPage(data.meta.currentPage)
          setCompletedHasMore(data.meta.currentPage < data.meta.lastPage)
          setCompletedTotal(data.meta.total)
        }
      }
    } catch (error) {
      console.error(`Error fetching ${status} tasks:`, error)
    } finally {
      setLoading(false)
    }
  }

  const fetchAllTasks = async (search = '') => {
    await Promise.all([
      fetchTasksByStatus('pending', search, 1, false),
      fetchTasksByStatus('in_progress', search, 1, false),
      fetchTasksByStatus('completed', search, 1, false)
    ])
  }

  useEffect(() => {
    setUnauthorizedCallback(() => {
      setIsAuthenticated(false)
      setCurrentView('login')
      setPendingTasks([])
      setInProgressTasks([])
      setCompletedTasks([])
      setPendingTotal(0)
      setInProgressTotal(0)
      setCompletedTotal(0)
    })
    
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
      setCurrentView('tasks')
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated && currentView === 'tasks') {
      fetchAllTasks()
    }
  }, [isAuthenticated, currentView])

  useEffect(() => {
    if (!isAuthenticated) return
    
    const debounceTimer = setTimeout(() => {
      setPendingPage(1)
      setInProgressPage(1)
      setCompletedPage(1)
      setPendingHasMore(true)
      setInProgressHasMore(true)
      setCompletedHasMore(true)
      fetchAllTasks(searchQuery)
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, isAuthenticated])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  const loadMoreForStatus = (status: 'pending' | 'in_progress' | 'completed') => {
    if (loading) return
    
    if (status === 'pending' && pendingHasMore) {
      fetchTasksByStatus('pending', searchQuery, pendingPage + 1, true)
    } else if (status === 'in_progress' && inProgressHasMore) {
      fetchTasksByStatus('in_progress', searchQuery, inProgressPage + 1, true)
    } else if (status === 'completed' && completedHasMore) {
      fetchTasksByStatus('completed', searchQuery, completedPage + 1, true)
    }
  }

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('column-content')) {
        const { scrollTop, scrollHeight, clientHeight } = target
        if (scrollTop + clientHeight >= scrollHeight - 100) {
          const columnType = target.closest('.kanban-column')?.querySelector('h3')?.textContent?.toLowerCase()
          if (columnType === 'pending') {
            loadMoreForStatus('pending')
          } else if (columnType === 'in progress') {
            loadMoreForStatus('in_progress')
          } else if (columnType === 'completed') {
            loadMoreForStatus('completed')
          }
        }
      }
    }

    const columns = document.querySelectorAll('.column-content')
    columns.forEach(column => {
      column.addEventListener('scroll', handleScroll)
    })

    return () => {
      columns.forEach(column => {
        column.removeEventListener('scroll', handleScroll)
      })
    }
  }, [loading, pendingHasMore, inProgressHasMore, completedHasMore, pendingPage, inProgressPage, completedPage, searchQuery])



  const addTask = async () => {
    if (!title.trim()) return
    
    try {
      const response = await apiRequest(`${API_BASE_URL}/tasks`, {
        method: 'POST',
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || undefined
        })
      })
      
      const data = await response.json()
      if (data.success) {
        setTitle('')
        setDescription('')
        fetchAllTasks(searchQuery)
      }
    } catch (error) {
      console.error('Error creating task:', error)
    }
  }

  const updateTaskStatus = async (id: string, newStatus: 'pending' | 'in_progress' | 'completed') => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus })
      })
      
      const data = await response.json()
      if (data.success) {
        fetchAllTasks(searchQuery)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
  }

  const deleteTask = async (id: string) => {
    try {
      const response = await apiRequest(`${API_BASE_URL}/tasks/${id}`, {
        method: 'DELETE'
      })
      
      const data = await response.json()
      if (data.success) {
        fetchAllTasks(searchQuery)
      }
    } catch (error) {
      console.error('Error deleting task:', error)
    }
  }

  const openEditModal = (task: Task) => {
    setEditingTask(task)
    setEditTitle(task.title)
    setEditDescription(task.description || '')
  }

  const closeEditModal = () => {
    setEditingTask(null)
    setEditTitle('')
    setEditDescription('')
  }

  const updateTask = async () => {
    if (!editingTask || !editTitle.trim()) return
    
    try {
      const response = await apiRequest(`${API_BASE_URL}/tasks/${editingTask.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: editTitle.trim(),
          description: editDescription.trim() || undefined
        })
      })
      
      const data = await response.json()
      if (data.success) {
        closeEditModal()
        fetchAllTasks(searchQuery)
      }
    } catch (error) {
      console.error('Error updating task:', error)
    }
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

      <div className="search-form">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="kanban-board">
        <div className="kanban-column">
          <div className="column-header">
            <h3>Pending</h3>
            <span className="task-count">{pendingTasks.length} / {pendingTotal}</span>
          </div>
          <div className="column-content">
            {pendingTasks.map(task => (
              <div key={task.id} className="kanban-card">
                <div className="card-content">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <small className="task-date">{new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(task)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => updateTaskStatus(task.id, 'in_progress')} className="progress-btn">
                    Start
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <div className="empty-column">No pending tasks</div>
            )}
            {loading && pendingHasMore && (
              <div className="column-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <div className="column-header">
            <h3>In Progress</h3>
            <span className="task-count">{inProgressTasks.length} / {inProgressTotal}</span>
          </div>
          <div className="column-content">
            {inProgressTasks.map(task => (
              <div key={task.id} className="kanban-card in-progress">
                <div className="card-content">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <small className="task-date">{new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(task)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => updateTaskStatus(task.id, 'completed')} className="complete-btn">
                    Complete
                  </button>
                  <button onClick={() => updateTaskStatus(task.id, 'pending')} className="back-btn">
                    Back
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {inProgressTasks.length === 0 && (
              <div className="empty-column">No tasks in progress</div>
            )}
            {loading && inProgressHasMore && (
              <div className="column-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>

        <div className="kanban-column">
          <div className="column-header">
            <h3>Completed</h3>
            <span className="task-count">{completedTasks.length} / {completedTotal}</span>
          </div>
          <div className="column-content">
            {completedTasks.map(task => (
              <div key={task.id} className="kanban-card completed">
                <div className="card-content">
                  <h4>{task.title}</h4>
                  {task.description && <p>{task.description}</p>}
                  <small className="task-date">{new Date(task.createdAt).toLocaleDateString()}</small>
                </div>
                <div className="card-actions">
                  <button onClick={() => openEditModal(task)} className="edit-btn">
                    Edit
                  </button>
                  <button onClick={() => updateTaskStatus(task.id, 'in_progress')} className="reopen-btn">
                    Reopen
                  </button>
                  <button onClick={() => deleteTask(task.id)} className="delete-btn">
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <div className="empty-column">No completed tasks</div>
            )}
            {loading && completedHasMore && (
              <div className="column-loading">
                <div className="loading-spinner"></div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <span>Loading more tasks...</span>
        </div>
      )}

      {editingTask && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Edit Task</h3>
            <input
              type="text"
              placeholder="Task title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />
            <textarea
              placeholder="Description (optional)"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
            <div className="modal-actions">
              <button onClick={updateTask} className="save-btn">Save</button>
              <button onClick={closeEditModal} className="cancel-btn">Cancel</button>
            </div>
          </div>
        </div>
      )}
      

    </div>
  )
}

export default App
