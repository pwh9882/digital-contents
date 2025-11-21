import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Hub', icon: '🏠' },
        { path: '/insight', label: 'Insight', icon: '🧠' },
        { path: '/therapy', label: 'Therapy', icon: '🌿' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    return (
        <div className="min-h-screen app-surface text-text-main font-sans transition-colors duration-300">
            {/* Sidebar Navigation */}
            <aside className="fixed top-0 left-0 h-full w-20 lg:w-64 bg-bg-paper border-r border-border-base z-50 transition-all duration-300 hidden md:flex flex-col">
                {/* Logo Area */}
                <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-border-base">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30">
                        T
                    </div>
                    <span className="ml-3 font-display font-bold text-xl hidden lg:block text-text-main">
                        TheraType
                    </span>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 py-8 flex flex-col gap-2 px-3">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`
                  flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all duration-200 group border
                  ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 border-primary'
                                        : 'bg-bg-surface text-text-muted border-transparent hover:bg-bg-highlight hover:text-text-main hover:border-border-base'
                                    }
                `}
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                <span className={`ml-3 font-medium hidden lg:block ${isActive ? 'font-bold' : ''}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Theme Toggle */}
                <div className="p-4 border-t border-border-base space-y-4">
                    <div className="flex justify-center lg:justify-start">
                        <ThemeToggle
                            showLabel={true}
                            labelClassName="hidden lg:block"
                            className="w-10 h-10 lg:w-full lg:h-auto lg:py-2 lg:px-3 rounded-full lg:rounded-xl flex items-center justify-center lg:justify-start transition-colors bg-bg-surface border border-border-base hover:bg-bg-highlight hover:border-primary"
                        />
                    </div>

                    <div className="flex items-center justify-center lg:justify-start p-2 rounded-xl bg-bg-highlight border border-border-base">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold">
                            G
                        </div>
                        <div className="ml-3 hidden lg:block overflow-hidden">
                            <p className="text-sm font-bold text-text-main truncate">Guest User</p>
                            <p className="text-xs text-text-muted truncate">Free Plan</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden h-16 bg-bg-surface border-b border-border-base flex items-center justify-between px-4 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold shadow-md">
                        T
                    </div>
                    <span className="font-display font-bold text-lg text-text-main">TheraType</span>
                </div>
                <ThemeToggle />
            </header>

            {/* Mobile Bottom Navigation */}
            <nav className="md:hidden fixed bottom-0 left-0 w-full bg-bg-surface border-t border-border-base z-50 flex justify-around p-2 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-colors
                ${isActive ? 'text-primary bg-primary-50 dark:bg-primary-900/20' : 'text-text-muted'}
              `}
                        >
                            <span className={`text-xl ${isActive ? 'scale-110' : ''} transition-transform`}>{item.icon}</span>
                            <span className="text-[10px] font-medium mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Main Content Area */}
            <main className="flex-1 md:ml-20 lg:ml-64 min-h-screen transition-all duration-300 pt-16 md:pt-0">
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
