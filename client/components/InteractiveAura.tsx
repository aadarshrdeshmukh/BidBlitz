'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function InteractiveAura() {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)

    // Use springs for smooth following
    const springX = useSpring(mouseX, { stiffness: 50, damping: 20 })
    const springY = useSpring(mouseY, { stiffness: 50, damping: 20 })

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX)
            mouseY.set(e.clientY)
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [mouseX, mouseY])

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: springX,
                top: springY,
                width: '400px',
                height: '400px',
                background: 'rgba(255, 255, 255, 0.03)',
                filter: 'blur(100px)',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 0,
                transform: 'translate(-50%, -50%)',
            }}
        />
    )
}
