import { useState } from 'react'
import './App.css'

interface Task {
  id: number
  title: string
  description?: string
  status: 'pending' | 'completed'
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

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

  return (
    <div className="app">
      <h1>Task Management</h1>
      
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
