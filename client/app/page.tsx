'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Zap, Shield, Globe, Trophy, Activity, Sparkles, ChevronRight, CheckCircle2, Twitter, Github, Instagram } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import PremiumShowcase from '@/components/PremiumShowcase'

export default function LandingPage() {
    const [auctions, setAuctions] = useState<any[]>([])

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auctions?status=active`)
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setAuctions(data.auctions.slice(0, 3))
                }
            })
    }, [])

    return (
        <div className="grid-bg" style={{ minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                paddingTop: '8rem',
                paddingBottom: '4rem',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    filter: 'blur(120px)',
                    borderRadius: '50%',
                    zIndex: -1
                }} />

                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '6px 16px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '50px',
                            border: '1px solid var(--border)',
                            marginBottom: '2rem'
                        }}>
                            <Sparkles size={14} color="var(--warning)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Experience the new BidBlitz 2.0</span>
                        </div>

                        <h1 className="luxo-gradient-text" style={{ fontSize: 'clamp(3rem, 10vw, 6rem)', lineHeight: 0.9, marginBottom: '2rem' }}>
                            The future of <br /> elite bidding.
                        </h1>

                        <p style={{
                            maxWidth: '600px',
                            margin: '0 auto 3rem',
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            lineHeight: 1.6
                        }}>
                            Fast-paced real-time auctions for high-end collectibles. <br />
                            Protected by anti-snipe logic and military-grade security.
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            <Link href="/lobby">
                                <button className="glow-btn" style={{ fontSize: '1.1rem', padding: '1.25rem 2.5rem' }}>
                                    Start Bidding Now
                                    <ArrowRight size={20} />
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>

            <PremiumShowcase />

            {/* Featured Glimpse */}
            <section style={{ padding: '10rem 0', position: 'relative' }}>
                {/* Section Spotlight Glow */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80%',
                    height: '60%',
                    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                    zIndex: -1,
                    pointerEvents: 'none'
                }} />

                <div className="container">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        style={{ textAlign: 'center', marginBottom: '6rem' }}
                    >
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '10px',
                            marginBottom: '1.5rem',
                            padding: '8px 16px',
                            background: 'rgba(16, 185, 129, 0.05)',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                            borderRadius: '50px'
                        }}>
                            <div style={{
                                width: '8px',
                                height: '8px',
                                background: 'var(--success)',
                                borderRadius: '50%',
                                boxShadow: '0 0 10px var(--success)'
                            }} className="pulsate" />
                            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--success)', letterSpacing: '0.1em' }}>LIVE AUCTIONS</span>
                        </div>
                        <h2 className="luxo-gradient-text" style={{ fontSize: '4rem', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Live on the Floor</h2>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                            Join elite collectors in high-stakes bidding for world-class digital and physical assets.
                        </p>
                    </motion.div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))',
                        gap: '3rem'
                    }}>
                        {auctions.map((auction, idx) => (
                            <motion.div
                                key={auction._id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -15 }}
                                viewport={{ once: true }}
                                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <Link href={`/auction/${auction._id}`} style={{ textDecoration: 'none' }}>
                                    <div className="card glass luxury-card" style={{
                                        position: 'relative',
                                        overflow: 'hidden',
                                        padding: '1.5rem',
                                        transition: '0.4s ease',
                                        border: '1px solid rgba(255,255,255,0.05)'
                                    }}>
                                        {/* Image Container with Hover Effect */}
                                        <div style={{
                                            height: '280px',
                                            background: 'rgba(255,255,255,0.01)',
                                            borderRadius: '20px',
                                            marginBottom: '1.5rem',
                                            overflow: 'hidden',
                                            position: 'relative'
                                        }}>
                                            <motion.img
                                                src={auction.imageUrl}
                                                alt={auction.title}
                                                whileHover={{ scale: 1.1 }}
                                                transition={{ duration: 0.8, ease: "easeOut" }}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            {/* Category Overlay */}
                                            <div style={{
                                                position: 'absolute',
                                                top: '1rem',
                                                left: '1rem',
                                                background: 'rgba(0,0,0,0.6)',
                                                backdropFilter: 'blur(10px)',
                                                padding: '4px 12px',
                                                borderRadius: '50px',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                color: 'var(--primary)',
                                                border: '1px solid rgba(255,255,255,0.1)'
                                            }}>
                                                {auction.category || 'Premium'}
                                            </div>
                                        </div>

                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                            <h3 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'white' }}>{auction.title}</h3>
                                            <div style={{ textAlign: 'right' }}>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Bid</span>
                                                <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.5rem' }}>${auction.currentBid?.toLocaleString()}</span>
                                            </div>
                                        </div>

                                        <div style={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.02)',
                                            borderRadius: '16px',
                                            marginTop: '1.5rem'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <Activity size={16} color="var(--primary)" />
                                                <span>Active Auction</span>
                                            </div>
                                            <span style={{ color: 'white', fontWeight: 600, fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                Enter Room <ChevronRight size={16} />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Grid (Advanced Luxo Section) */}
            <section style={{ padding: '12rem 0', position: 'relative', overflow: 'hidden' }}>
                <div className="container">
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{
                                    width: 'fit-content',
                                    padding: '8px 16px',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    borderRadius: '50px',
                                    fontSize: '0.8rem',
                                    fontWeight: 700,
                                    color: 'var(--secondary)',
                                    letterSpacing: '0.1em'
                                }}>
                                    THE PLATFORM
                                </div>
                                <h2 style={{ fontSize: '3.5rem', lineHeight: 1.1 }}>Precision-engineered for the modern collector.</h2>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', lineHeight: 1.6 }}>
                                    BidBlitz combines military-grade security with real-time performance to deliver an auction experience without peer.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <FeatureCard
                                    icon={<Zap size={24} color="var(--warning)" />}
                                    title="Anti-Snipe"
                                    description="proprietary extension logic"
                                />
                                <FeatureCard
                                    icon={<Shield size={24} color="var(--success)" />}
                                    title="Escrow"
                                    description="Guaranteed safe payouts"
                                />
                                <FeatureCard
                                    icon={<Globe size={24} color="var(--secondary)" />}
                                    title="Latency"
                                    description="Sub-100ms global sync"
                                />
                                <FeatureCard
                                    icon={<Trophy size={24} color="var(--primary)" />}
                                    title="Elite Status"
                                    description="Exclusive private rooms"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section style={{ padding: '8rem 0' }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h2 style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '4rem' }}>Questions</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <FAQItem question="How does the anti-snipe feature work?" answer="If a bid is placed within the final 30 seconds of an auction, the timer automatically extends by 60 seconds to allow others to react." />
                        <FAQItem question="Are my payments secure?" answer="Yes, we use industry-standard encryption and an internal escrow system to ensure funds are only transferred upon successful auction completion." />
                        <FAQItem question="What happens if I win an auction?" answer="You will be notified instantly via gavel sound and confetti. The item will move to your 'Won' tab in the dashboard for checkout." />
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section style={{ padding: '10rem 0', textAlign: 'center' }}>
                <div className="container">
                    <div className="card glass" style={{ padding: '4rem', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))' }}>
                        <h2 style={{ fontSize: '3.5rem', marginBottom: '1.5rem' }}>Ready to join the blitz?</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '3rem', fontSize: '1.2rem' }}>Join 50,000+ collectors bidding on the world's most exclusive items.</p>
                        <Link href="/lobby">
                            <button className="glow-btn" style={{ margin: '0 auto', scale: 1.2 }}>
                                Get Started for Free
                                <ArrowRight size={20} />
                            </button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={{
                padding: '8rem 0 4rem',
                borderTop: '1px solid var(--border)',
                background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.01))'
            }}>
                <div className="container">
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr 1fr',
                        gap: '4rem',
                        marginBottom: '6rem'
                    }}>
                        {/* Brand Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <Link href="/" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.05em' }}>
                                BIDBLITZ
                            </Link>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: '280px' }}>
                                The world's most advanced real-time auction platform for high-end digital and physical collectibles.
                            </p>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <a href="#" className="glass" style={{ padding: '8px', borderRadius: '50%', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Twitter size={18} />
                                </a>
                                <a href="#" className="glass" style={{ padding: '8px', borderRadius: '50%', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Github size={18} />
                                </a>
                                <a href="#" className="glass" style={{ padding: '8px', borderRadius: '50%', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
                                    <Instagram size={18} />
                                </a>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <FooterColumn
                            title="Platform"
                            links={[
                                { label: 'Live Auctions', href: '/lobby' },
                                { label: 'Dashboard', href: '/dashboard' },
                                { label: 'How it Works', href: '#' },
                                { label: 'Verification', href: '#' }
                            ]}
                        />
                        <FooterColumn
                            title="Company"
                            links={[
                                { label: 'About Us', href: '#' },
                                { label: 'Elite Status', href: '#' },
                                { label: 'Success Stories', href: '#' },
                                { label: 'Contact', href: '#' }
                            ]}
                        />
                        <FooterColumn
                            title="Privacy"
                            links={[
                                { label: 'Terms of Service', href: '#' },
                                { label: 'Privacy Policy', href: '#' },
                                { label: 'Cookie Policy', href: '#' },
                                { label: 'Safety', href: '#' }
                            ]}
                        />
                    </div>

                    <div style={{
                        paddingTop: '2rem',
                        borderTop: '1px solid var(--border)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.9rem'
                    }}>
                        <span>© 2024 BidBlitz AI. All rights reserved.</span>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <span>v2.0.4 "Titan"</span>
                            <span>System Status: Online</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5, borderColor: 'rgba(255,255,255,0.2)' }}
            viewport={{ once: true }}
            className="card glass luxury-card"
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
                textAlign: 'left',
                padding: '1.5rem',
                borderRadius: '20px'
            }}
        >
            <div style={{
                padding: '10px',
                background: 'rgba(255,255,255,0.03)',
                width: 'fit-content',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.05)'
            }}>
                {icon}
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</p>
        </motion.div>
    )
}

function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false)
    return (
        <div
            className="card glass luxury-card"
            style={{
                cursor: 'pointer',
                padding: '1.5rem',
                borderRadius: '20px',
                border: '1px solid rgba(255,255,255,0.05)',
                transition: '0.3s ease'
            }}
            onClick={() => setIsOpen(!isOpen)}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>{question}</span>
                <div style={{
                    padding: '8px',
                    background: isOpen ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: '0.3s ease'
                }}>
                    <ChevronRight size={18} color={isOpen ? 'black' : 'white'} style={{ transform: isOpen ? 'rotate(90deg)' : 'none', transition: '0.3s' }} />
                </div>
            </div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        style={{ overflow: 'hidden' }}
                    >
                        <p style={{ marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem' }}>
                            {answer}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function FooterColumn({ title, links }: { title: string, links: { label: string, href: string }[] }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {links.map((link, idx) => (
                    <a
                        key={idx}
                        href={link.href}
                        style={{
                            color: 'var(--text-muted)',
                            fontSize: '0.95rem',
                            transition: '0.2s ease',
                            width: 'fit-content'
                        }}
                    >
                        {link.label}
                    </a>
                ))}
            </div>
        </div>
    )
}
