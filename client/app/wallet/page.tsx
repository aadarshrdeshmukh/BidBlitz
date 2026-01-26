'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthUser, getAuthToken, updateAuthUser } from '@/lib/auth'
import { AnimatePresence, motion } from 'framer-motion'
import { Wallet, ArrowLeft, Plus, CreditCard, ShieldCheck, Zap } from 'lucide-react'
import { triggerHaptic } from '@/lib/haptics'

export default function WalletPage() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [topUpAmount, setTopUpAmount] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [message, setMessage] = useState({ type: '', text: '' })
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null)
    const [showPaymentModal, setShowPaymentModal] = useState(false)

    useEffect(() => {
        const authUser = getAuthUser()
        if (!authUser) {
            router.push('/login?redirectTo=/wallet')
        } else {
            setUser(authUser)
        }
    }, [router])

    const initiateTopUp = (amount: number) => {
        if (!amount || amount <= 0) return
        setSelectedAmount(amount)
        setShowPaymentModal(true)
        triggerHaptic('medium')
    }

    const handleConfirmPayment = async () => {
        if (!selectedAmount) return

        setIsLoading(true)
        setMessage({ type: '', text: '' })

        try {
            // Simulate a bank processing delay for premium feel
            await new Promise(resolve => setTimeout(resolve, 2000))

            const token = getAuthToken()
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/topup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount: selectedAmount })
            })

            const data = await response.json()
            if (data.success) {
                setMessage({ type: 'success', text: `Payment Successful! $${selectedAmount} added to your vault.` })
                triggerHaptic('success')

                const updatedUser = { ...user, balance: data.balance }
                updateAuthUser(updatedUser)
                setUser(updatedUser)
                setTopUpAmount('')
                setShowPaymentModal(false)
            } else {
                throw new Error(data.message)
            }
        } catch (error: any) {
            setMessage({ type: 'error', text: error.message || 'Payment Gateway Communication Error' })
            triggerHaptic('error')
        } finally {
            setIsLoading(false)
        }
    }

    if (!user) return null

    const presetAmounts = [100, 500, 1000, 5000]

    return (
        <div className="container" style={{ paddingTop: '8rem', maxWidth: '800px' }}>
            <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => router.back()}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'var(--text-muted)',
                    marginBottom: '2rem',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 600
                }}
            >
                <ArrowLeft size={16} />
                Back
            </motion.button>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
                {/* Current Balance Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card glass luxury-card"
                    style={{
                        padding: '3rem',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))',
                        border: '1px solid var(--border)',
                        position: 'relative',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        position: 'absolute',
                        top: '-50px',
                        right: '-50px',
                        width: '150px',
                        height: '150px',
                        background: 'var(--primary)',
                        filter: 'blur(100px)',
                        opacity: 0.1,
                        zIndex: 0
                    }} />

                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '20px',
                            background: 'rgba(59, 130, 246, 0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1.5rem',
                        }}>
                            <Wallet size={32} color="var(--primary)" />
                        </div>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                            Available Bidding Power
                        </span>
                        <h1 style={{ fontSize: '4rem', fontWeight: 900, marginTop: '0.5rem', color: 'white' }}>
                            ${user.balance.toLocaleString()}
                        </h1>
                    </div>
                </motion.div>

                {/* Top Up Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="card glass"
                    style={{ padding: '2.5rem' }}
                >
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <CreditCard color="var(--primary)" />
                        Add Funds
                    </h2>

                    {message.text && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={{
                                padding: '1rem',
                                borderRadius: '12px',
                                marginBottom: '1.5rem',
                                background: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: message.type === 'success' ? 'var(--success)' : 'var(--error)',
                                border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                                fontSize: '0.9rem',
                                textAlign: 'center'
                            }}
                        >
                            {message.text}
                        </motion.div>
                    )}

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        {presetAmounts.map((amount) => (
                            <motion.button
                                key={amount}
                                whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.08)' }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => initiateTopUp(amount)}
                                disabled={isLoading}
                                style={{
                                    padding: '1rem',
                                    borderRadius: '12px',
                                    border: '1px solid var(--border)',
                                    background: 'rgba(255,255,255,0.03)',
                                    color: 'white',
                                    fontWeight: 700,
                                    cursor: 'pointer',
                                    transition: '0.2s'
                                }}
                            >
                                +${amount}
                            </motion.button>
                        ))}
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                            <input
                                type="number"
                                placeholder="Custom amount..."
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '1rem 1rem 1rem 3rem',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    color: 'white',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                            />
                            <Plus size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => initiateTopUp(Number(topUpAmount))}
                            disabled={!topUpAmount}
                            className="primary-button"
                            style={{
                                padding: '1rem 2.5rem',
                                borderRadius: '12px',
                                background: 'white',
                                color: 'black',
                                border: 'none',
                                fontWeight: 800,
                                cursor: 'pointer',
                                opacity: !topUpAmount ? 0.5 : 1
                            }}
                        >
                            Proceed to Checkout
                        </motion.button>
                    </div>

                    <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <ShieldCheck size={18} color="var(--success)" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Secure Encryption</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'flex-end' }}>
                            <Zap size={18} color="var(--warning)" />
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Universal Gateway</span>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Simulated Payment Modal */}
            <AnimatePresence>
                {showPaymentModal && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 2000,
                        padding: '1.5rem'
                    }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isLoading && setShowPaymentModal(false)}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'rgba(0,0,0,0.9)',
                                backdropFilter: 'blur(20px)',
                            }}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            className="card glass"
                            style={{
                                width: '100%',
                                maxWidth: '450px',
                                position: 'relative',
                                zIndex: 1,
                                padding: '3rem',
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <div style={{
                                background: 'rgba(255,255,255,0.03)',
                                padding: '0.5rem 1rem',
                                borderRadius: '50px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '2rem',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}>
                                <ShieldCheck size={14} color="var(--success)" />
                                <span style={{ fontSize: '0.7rem', fontWeight: 800, letterSpacing: '0.1em', opacity: 0.8 }}>SECURE CHECKOUT</span>
                            </div>

                            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Verify Payment</h3>
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Confirm the transaction to secure your credits.</p>

                            <div className="card" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', marginBottom: '2.5rem' }}>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>Charge Amount</span>
                                <span style={{ fontSize: '2.5rem', fontWeight: 900 }}>${selectedAmount?.toLocaleString()}</span>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleConfirmPayment}
                                    disabled={isLoading}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        borderRadius: '12px',
                                        background: 'var(--primary)',
                                        color: 'black',
                                        border: 'none',
                                        fontWeight: 900,
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '12px'
                                    }}
                                >
                                    {isLoading ? (
                                        <>
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                                style={{ width: '18px', height: '18px', border: '2px solid rgba(0,0,0,0.1)', borderTop: '2px solid black', borderRadius: '50%' }}
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <ShieldCheck size={20} />
                                            Authorize Payment
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    disabled={isLoading}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--text-muted)',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        opacity: isLoading ? 0.3 : 1
                                    }}
                                >
                                    Cancel Transaction
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </div>
    )
}
