import { useState } from 'react'

interface LoginProps {
  onLogin: (email: string, password: string) => void
  onSwitchToRegister: () => void
}

export const Login = ({ onLogin, onSwitchToRegister }: LoginProps) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && password) {
      onLogin(email, password)
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
          <button type="submit">Login</button>
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