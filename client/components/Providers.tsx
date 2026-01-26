'use client'

import React from 'react'
import { ToastProvider } from './Toast'
import { SocketNotifications } from './SocketNotifications'

export const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ToastProvider>
            <SocketNotifications />
            {children}
        </ToastProvider>
    )
}
