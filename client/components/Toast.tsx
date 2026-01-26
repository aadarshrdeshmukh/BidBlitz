'use client'

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Bell, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
    id: string
    message: string
    type: ToastType
    duration?: number
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType, duration?: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const useToast = () => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider')
    }
    return context
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toasts, setToasts] = useState<Toast[]>([])

    const showToast = useCallback((message: string, type: ToastType = 'info', duration: number = 5000) => {
        const id = Math.random().toString(36).substr(2, 9)
        setToasts((prev) => [...prev, { id, message, type, duration }])

        setTimeout(() => {
            removeToast(id)
        }, duration)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
    }, [])

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                pointerEvents: 'none'
            }}>
                <AnimatePresence>
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            style={{ pointerEvents: 'auto' }}
                        >
                            <div className="card glass" style={{
                                padding: '1rem 1.25rem',
                                minWidth: '280px',
                                maxWidth: '400px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                border: `1px solid ${toast.type === 'success' ? 'rgba(34, 197, 94, 0.3)' :
                                        toast.type === 'error' ? 'rgba(239, 68, 68, 0.3)' :
                                            toast.type === 'warning' ? 'rgba(245, 158, 11, 0.3)' :
                                                'rgba(59, 130, 246, 0.3)'
                                    }`,
                                background: 'rgba(15, 15, 20, 0.9)',
                                backdropFilter: 'blur(16px)',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
                            }}>
                                <div style={{
                                    color:
                                        toast.type === 'success' ? 'var(--success)' :
                                            toast.type === 'error' ? 'var(--error)' :
                                                toast.type === 'warning' ? 'var(--warning)' :
                                                    'var(--secondary)'
                                }}>
                                    {toast.type === 'success' && <CheckCircle size={20} />}
                                    {toast.type === 'error' && <AlertCircle size={20} />}
                                    {toast.type === 'warning' && <Bell size={20} />}
                                    {toast.type === 'info' && <Info size={20} />}
                                </div>

                                <div style={{ flex: 1 }}>
                                    <p style={{ fontSize: '0.9rem', fontWeight: 500, color: 'white', lineHeight: 1.4 }}>
                                        {toast.message}
                                    </p>
                                </div>

                                <button
                                    onClick={() => removeToast(toast.id)}
                                    style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    )
}
