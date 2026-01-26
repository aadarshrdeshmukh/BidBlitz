import { Howl } from 'howler';
import { useCallback } from 'react';

const sounds = {
    bid: 'https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3', // Subtle click
    outbid: 'https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3', // Alert
    success: 'https://assets.mixkit.co/active_storage/sfx/1435/1435-preview.mp3', // Success/Confetti
    gavel: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3', // Auction end
    error: 'https://assets.mixkit.co/active_storage/sfx/2573/2573-preview.mp3' // Error
};

export const useSounds = () => {
    const playSound = useCallback((type: keyof typeof sounds) => {
        const sound = new Howl({
            src: [sounds[type]],
            html5: true,
            volume: 0.5
        });
        sound.play();
    }, []);

    return { playSound };
};
