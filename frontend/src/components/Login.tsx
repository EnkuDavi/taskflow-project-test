import { useState } from 'react'

interface LoginProps {
  onLogin: (email: string, password: string) => Promise<void>
  onSwitchToRegister: () => void
}

export const Login = ({ onLogin, onSwitchToRegister }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (email && password) {
      setLoading(true)
      try {
        await onLogin(email, password)
      } catch (err) {
        setError('Login failed. Please check your credentials.')
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <div className="error-message">{error}</div>}
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister}>
            Register
          </button>
        </p>
      </div>
    </div>
  )
}