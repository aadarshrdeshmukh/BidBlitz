'use client'

import React, { useEffect, useState } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 400 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            cursorX.set(e.clientX)
            cursorY.set(e.clientY)
        }

        const onMouseEnter = () => setIsVisible(true)
        const onMouseLeave = () => setIsVisible(false)

        window.addEventListener('mousemove', moveCursor)
        document.body.addEventListener('mouseenter', onMouseEnter)
        document.body.addEventListener('mouseleave', onMouseLeave)

        return () => {
            window.removeEventListener('mousemove', moveCursor)
            document.body.removeEventListener('mouseenter', onMouseEnter)
            document.body.removeEventListener('mouseleave', onMouseLeave)
        }
    }, [cursorX, cursorY])

    return (
        <motion.div
            style={{
                position: 'fixed',
                left: 0,
                top: 0,
                width: '12px',
                height: '12px',
                backgroundColor: 'white',
                borderRadius: '50%',
                pointerEvents: 'none',
                zIndex: 9999,
                mixBlendMode: 'difference',
                x: cursorXSpring,
                y: cursorYSpring,
                translateX: '-50%',
                translateY: '-50%',
                opacity: isVisible ? 1 : 0,
                display: 'block'
            }}
        >
            <motion.div
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                style={{
                    position: 'absolute',
                    top: '-10px',
                    left: '-10px',
                    right: '-10px',
                    bottom: '-10px',
                    border: '1px solid rgba(255,255,255,0.3)',
                    borderRadius: '50%'
                }}
            />
        </motion.div>
    )
}
