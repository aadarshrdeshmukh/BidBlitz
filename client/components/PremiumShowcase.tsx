'use client'

import { motion } from 'framer-motion'
import React from 'react'

const SHOWCASE_IMAGES = [
    { src: 'https://framerusercontent.com/images/GP0wQFyoOZaJCdXZdIk1HWsKSE.png?width=815&height=815', top: 'calc(50% - 100px)', scale: 0.76, left: 100 },
    { src: 'https://framerusercontent.com/images/1Yst8MTi5i4Ex6l2tAgAJECGaCg.png?width=1024&height=1024', top: 'calc(50% + 50px)', scale: 1.46, left: 450 },
    { src: 'https://framerusercontent.com/images/8NjPyBNdNZQAyTSZkHGITjvM0bo.png?width=1024&height=1024', top: 'calc(50% - 140px)', scale: 1.13, left: 800 },
    { src: 'https://framerusercontent.com/images/RQeRYvZ0d2l91tSQOOx1JcsWuDI.png?width=815&height=815', top: 'calc(50% - 30px)', scale: 0.8, left: 1150 },
    { src: 'https://framerusercontent.com/images/uwLeztAEi5jYy6QdhSk6Klu4HQA.png?width=1024&height=1024', top: 'calc(50% + 150px)', scale: 1.6, left: 1500 },
    { src: 'https://framerusercontent.com/images/eTiE7vLpECPPpSq7KVYTPRIbxI.png?width=1024&height=1024', top: 'calc(50% - 30px)', scale: 1.33, left: 1850 },
    { src: 'https://framerusercontent.com/images/ppnaKDjtsQLri6sxPVgEUtUlZGk.png?width=1024&height=1024', top: 'calc(50% - 120px)', scale: 1.13, left: 2200 },
    { src: 'https://framerusercontent.com/images/eVAnLUMzaRaShT5KTqe04h9kz4g.png?width=1024&height=1024', top: 'calc(50% - 100px)', scale: 0.76, left: 2550 },
    { src: 'https://framerusercontent.com/images/MfqlxtZnKTfUgDLGJjudrUnTRlk.png?width=1024&height=1024', top: 'calc(50% + 50px)', scale: 1.46, left: 2900 },
]

export default function PremiumShowcase() {
    const totalWidth = 3200 // Approximate width of one set

    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '600px',
            overflow: 'hidden',
            background: 'transparent',
            marginTop: '-100px',
            marginBottom: '4rem',
            maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)'
        }}>
            <motion.div
                animate={{
                    x: [-totalWidth, 0],
                }}
                transition={{
                    duration: 40,
                    repeat: Infinity,
                    ease: 'linear',
                }}
                style={{
                    display: 'flex',
                    width: `${totalWidth * 2}px`,
                    height: '100%',
                    position: 'absolute',
                    left: 0,
                    top: 0
                }}
            >
                {/* Set 1 */}
                <div style={{ position: 'relative', width: `${totalWidth}px`, height: '100%' }}>
                    {SHOWCASE_IMAGES.map((img, i) => (
                        <ShowcaseItem key={`s1-${i}`} {...img} />
                    ))}
                </div>

                {/* Set 2 (Duplicated for infinite scroll) */}
                <div style={{ position: 'relative', width: `${totalWidth}px`, height: '100%' }}>
                    {SHOWCASE_IMAGES.map((img, i) => (
                        <ShowcaseItem key={`s2-${i}`} {...img} />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}

function ShowcaseItem({ src, top, scale, left }: { src: string; top: string; scale: number; left: number }) {
    return (
        <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            left: `${left}px`,
            top: top,
            transform: `translateY(-50%) scale(${scale})`,
            borderRadius: '24px',
            overflow: 'hidden',
            background: 'transparent',
            pointerEvents: 'none'
        }}>
            <img
                src={src}
                alt=""
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain',
                    display: 'block'
                }}
            />
        </div>
    )
}
