import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { supabase } from './lib/supabase'
import type { User } from '@supabase/supabase-js'
import './App.css'

const authSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

type AuthFormData = z.infer<typeof authSchema>

function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [user, setUser] = useState<User | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(authSchema),
  })

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const onSubmit = async (data: AuthFormData) => {
    setLoading(true)
    setMessage('')
    setError('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else {
        setMessage('Login successful! Welcome back.')
        reset()
      }
    } else {
      const { data: signupData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (error) {
        setError(error.message)
      } else if (signupData.session) {
        setMessage('Registration successful! You are now logged in.')
        reset()
      } else {
        setMessage(
          'Registration successful! Please check your email to confirm your account.'
        )
        reset()
      }
    }

    setLoading(false)
  }

  const handleLogout = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signOut()

    if (error) {
      setError(error.message)
    } else {
      setMessage('You have been logged out successfully.')
    }

    setLoading(false)
  }

  if (user) {
    return (
      <div className="app">
        <div className="dashboard-card">
          <div className="success-icon">✓</div>

          <h1>Welcome!</h1>

          <p className="welcome-text">
            You are successfully logged in.
          </p>

          <div className="user-box">
            <span>Logged in as</span>
            <strong>{user.email}</strong>
          </div>

          {message && <div className="message success">{message}</div>}

          {error && <div className="message error">{error}</div>}

          <button
            className="logout-button"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="auth-card">
        <div className="logo">
          <span>🔐</span>
        </div>

        <h1>{isLogin ? 'Welcome Back' : 'Create Account'}</h1>

        <p className="subtitle">
          {isLogin
            ? 'Login to continue to your account'
            : 'Register to create your account'}
        </p>

        <div className="tabs">
          <button
            className={isLogin ? 'tab active' : 'tab'}
            onClick={() => {
              setIsLogin(true)
              setMessage('')
              setError('')
              reset()
            }}
          >
            Login
          </button>

          <button
            className={!isLogin ? 'tab active' : 'tab'}
            onClick={() => {
              setIsLogin(false)
              setMessage('')
              setError('')
              reset()
            }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email')}
            />

            {errors.email && (
              <p className="field-error">{errors.email.message}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password')}
            />

            {errors.password && (
              <p className="field-error">{errors.password.message}</p>
            )}
          </div>

          {message && <div className="message success">{message}</div>}

          {error && <div className="message error">{error}</div>}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : isLogin
                ? 'Login'
                : 'Create Account'}
          </button>
        </form>

        <p className="switch-text">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            className="switch-button"
            onClick={() => {
              setIsLogin(!isLogin)
              setMessage('')
              setError('')
              reset()
            }}
          >
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default App