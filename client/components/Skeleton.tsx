import React from 'react'
import { motion } from 'framer-motion'

export const Skeleton = ({ className, style }: { className?: string, style?: React.CSSProperties }): React.JSX.Element => {
    return (
        <motion.div
            animate={{
                opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
            }}
            className={`skeleton ${className || ''}`}
            style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '8px',
                ...style
            }}
        />
    )
}

export const ProductCardSkeleton = (): React.JSX.Element => {
    return (
        <div className="card glass" style={{ height: '420px', display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
            <Skeleton style={{ height: '200px', width: '100%', borderRadius: '12px' }} />
            <Skeleton style={{ height: '24px', width: '70%' }} />
            <Skeleton style={{ height: '40px', width: '100%', marginTop: 'auto' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Skeleton style={{ height: '16px', width: '30%' }} />
                <Skeleton style={{ height: '16px', width: '40%' }} />
            </div>
        </div>
    )
}

export const StatCardSkeleton = (): React.JSX.Element => {
    return (
        <div className="card glass" style={{ padding: '1.5rem', flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Skeleton style={{ height: '48px', width: '48px', borderRadius: '12px' }} />
            <div style={{ flex: 1 }}>
                <Skeleton style={{ height: '12px', width: '40%', marginBottom: '8px' }} />
                <Skeleton style={{ height: '24px', width: '20%' }} />
            </div>
        </div>
    )
}
