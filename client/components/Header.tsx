'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getAuthUser, clearAuthUser, AuthUser } from '@/lib/auth'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Power, User as UserIcon, LogIn, Wallet } from 'lucide-react'

export default function Header() {
    const [user, setUser] = useState<AuthUser | null>(null)
    const [hasMounted, setHasMounted] = useState(false)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        setHasMounted(true)
        setUser(getAuthUser())
    }, [pathname]) // Refresh on navigation

    const handleLogout = () => {
        clearAuthUser()
        setUser(null)
        router.push('/')
        router.refresh()
    }

    if (!hasMounted) return null

    return (
        <header style={{
            position: 'fixed',
            top: '1.5rem',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            width: 'max-content',
            maxWidth: 'calc(100vw - 2rem)',
            transition: '0.3s ease'
        }}>
            <nav className="glass" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.6rem 2rem',
                borderRadius: '50px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                gap: '2.5rem'
            }}>
                <Link href="/" style={{
                    fontSize: '1.25rem',
                    fontWeight: 900,
                    color: 'white',
                    letterSpacing: '-0.05em'
                }}>
                    BITBLITZ
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link href="/lobby" style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: pathname === '/lobby' ? 'var(--primary)' : 'var(--text-muted)',
                        transition: '0.2s'
                    }}>Lobby</Link>
                    <Link href="/dashboard" style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: pathname === '/dashboard' ? 'var(--primary)' : 'var(--text-muted)',
                        transition: '0.2s'
                    }}>Dashboard</Link>

                    <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />

                    <AnimatePresence mode="wait">
                        {user ? (
                            <motion.div
                                key="user"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}
                            >
                                {/* Wallet Balance */}
                                <Link href="/wallet">
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        background: 'rgba(255,255,255,0.05)',
                                        padding: '4px 12px',
                                        borderRadius: '50px',
                                        border: '1px solid var(--border)',
                                        cursor: 'pointer',
                                        transition: '0.2s'
                                    }}
                                        className="glass-hover"
                                    >
                                        <Wallet size={14} color="var(--primary)" />
                                        <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>${user.balance}</span>
                                    </div>
                                </Link>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserIcon size={14} color="black" />
                                    </div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>{user.username}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="glass-hover"
                                    style={{
                                        padding: '8px',
                                        borderRadius: '12px',
                                        background: 'rgba(239, 68, 68, 0.1)',
                                        border: '1px solid rgba(239, 68, 68, 0.2)',
                                        color: 'var(--error)',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        transition: '0.2s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                >
                                    <Power size={14} strokeWidth={3} />
                                </button>
                            </motion.div>
                        ) : (
                            <Link
                                key="login"
                                href="/login"
                                style={{
                                    fontSize: '0.85rem',
                                    fontWeight: 700,
                                    background: 'white',
                                    color: 'black',
                                    padding: '0.5rem 1.25rem',
                                    borderRadius: '50px'
                                }}
                            >
                                Sign In
                            </Link>
                        )}
                    </AnimatePresence>
                </div>
            </nav>
        </header>
    )
}
