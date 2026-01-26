'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { setAuthUser } from '@/lib/auth'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User as UserIcon, ArrowRight, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [isRegister, setIsRegister] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const endpoint = isRegister ? '/api/users/register' : '/api/users/login'
      const body = isRegister
        ? { email, password, username }
        : { email, password }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      setAuthUser({
        id: data.user.id,
        email: data.user.email,
        username: data.user.username,
        balance: data.user.balance,
        token: data.token
      })

      const redirectTo = searchParams.get('redirectTo') || searchParams.get('callbackUrl') || '/lobby'
      router.push(redirectTo)
      router.refresh()
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid-bg" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        background: 'rgba(255, 255, 255, 0.03)',
        filter: 'blur(120px)',
        borderRadius: '50%',
        zIndex: 0
      }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card glass"
        style={{
          width: '100%',
          maxWidth: '450px',
          padding: '3rem',
          position: 'relative',
          zIndex: 1,
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            style={{
              width: '60px',
              height: '60px',
              background: 'var(--primary)',
              borderRadius: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              boxShadow: '0 0 30px rgba(255,255,255,0.2)'
            }}
          >
            <Sparkles size={30} color="black" />
          </motion.div>
          <h1 className="luxo-gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {isRegister ? 'Join the world\'s most elite auctions.' : 'Log in to continue your bidding journey.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.2)',
                borderRadius: '12px',
                padding: '1rem',
                color: 'var(--error)',
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '1.5rem'
              }}
            >
              <AlertCircle size={18} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <AnimatePresence>
            {isRegister && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                style={{ position: 'relative' }}
              >
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="glass"
                  style={{
                    width: '100%',
                    padding: '1rem 1rem 1rem 3rem',
                    borderRadius: '12px',
                    color: 'white',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                />
                <UserIcon size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              </motion.div>
            )}
          </AnimatePresence>

          <div style={{ position: 'relative' }}>
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="glass"
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <div style={{ position: 'relative' }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="glass"
              style={{
                width: '100%',
                padding: '1rem 1rem 1rem 3rem',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontSize: '1rem'
              }}
            />
            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </div>

          <motion.button
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="glow-btn"
            style={{
              width: '100%',
              padding: '1rem',
              marginTop: '1rem',
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}
          >
            {isLoading ? (
              <Loader2 className="pulsate" size={20} />
            ) : (
              <>
                {isRegister ? 'Create Account' : 'Sign In'}
                <ArrowRight size={20} />
              </>
            )}
          </motion.button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setError('')
            }}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: '0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'white'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            {isRegister ? (
              <span>Already have an account? <strong style={{ color: 'var(--primary)' }}>Sign In</strong></span>
            ) : (
              <span>New to BidBlitz? <strong style={{ color: 'var(--primary)' }}>Register</strong></span>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--background)' }}><Loader2 className="pulsate" size={40} color="var(--primary)" /></div>}>
      <LoginForm />
    </Suspense>
  )
}

