'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'

interface EmptyStateProps {
    title?: string
    description?: string
    action?: React.ReactNode
}

export default function EmptyState({
    title = "No items found",
    description = "Try adjusting your search or filters to find what you're looking for.",
    action
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card glass"
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem',
                textAlign: 'center',
                gap: '1.5rem',
                minHeight: '300px'
            }}
        >
            <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid var(--border)'
            }}>
                <Search size={32} color="var(--text-muted)" opacity={0.5} />
            </div>
            <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', maxWidth: '400px', lineHeight: 1.6 }}>{description}</p>
            </div>
            {action && (
                <div style={{ marginTop: '1rem' }}>
                    {action}
                </div>
            )}
        </motion.div>
    )
}
