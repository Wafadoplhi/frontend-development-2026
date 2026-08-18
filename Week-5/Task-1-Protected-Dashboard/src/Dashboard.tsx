import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

function Dashboard() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser()

      if (error || !data.user) {
        navigate('/', { replace: true })
        return
      }

      setEmail(data.user.email || '')
      setChecking(false)
    }

    checkUser()
  }, [navigate])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/', { replace: true })
  }

  if (checking) {
    return <p>Checking authentication...</p>
  }

  return (
    <div className="dashboard">
      <header>
        <h1>Protected Dashboard</h1>
        <button onClick={handleLogout}>Logout</button>
      </header>

      <main>
        <h2>Welcome! 👋</h2>
        <p>You are successfully logged in.</p>
        <p>Email: {email}</p>
      </main>
    </div>
  )
}

export default Dashboard