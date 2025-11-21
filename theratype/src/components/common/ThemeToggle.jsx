import React, { useEffect, useState } from 'react';
import Button from './Button';

const ThemeToggle = ({ className, showLabel = false, labelClassName = '' }) => {
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        // Check system preference or local storage
        if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDark(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDark(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    const toggleTheme = () => {
        if (isDark) {
            document.documentElement.classList.remove('dark');
            localStorage.theme = 'light';
            setIsDark(false);
        } else {
            document.documentElement.classList.add('dark');
            localStorage.theme = 'dark';
            setIsDark(true);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            className={className || "rounded-full w-10 h-10 p-0 flex items-center justify-center transition-colors bg-bg-surface border-border-base hover:bg-bg-highlight hover:border-primary"}
            aria-label="Toggle Dark Mode"
        >
            {isDark ? (
                <div className="flex items-center gap-3">
                    <span className="text-xl text-yellow-400 drop-shadow-glow animate-fade-in">☀️</span>
                    {showLabel && <span className={`text-sm font-medium text-text-main ${labelClassName}`}>Light Mode</span>}
                </div>
            ) : (
                <div className="flex items-center gap-3">
                    <span className="text-xl text-blue-600 drop-shadow-sm animate-fade-in">🌙</span>
                    {showLabel && <span className={`text-sm font-medium text-text-main ${labelClassName}`}>Dark Mode</span>}
                </div>
            )}
        </Button>
    );
};

export default ThemeToggle;
