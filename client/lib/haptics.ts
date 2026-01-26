/**
 * Simple utility for haptic feedback
 * Works on supported mobile devices
 */
export const triggerHaptic = (type: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error') => {
    if (typeof window === 'undefined' || !navigator.vibrate) return;

    switch (type) {
        case 'light':
            navigator.vibrate(10);
            break;
        case 'medium':
            navigator.vibrate(20);
            break;
        case 'heavy':
            navigator.vibrate(50);
            break;
        case 'success':
            navigator.vibrate([20, 30, 20]);
            break;
        case 'warning':
            navigator.vibrate([50, 50, 50]);
            break;
        case 'error':
            navigator.vibrate([10, 30, 10, 30, 10]);
            break;
        default:
            navigator.vibrate(20);
    }
};
