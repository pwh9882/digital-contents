import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Layout = ({ children }) => {
    const location = useLocation();

    // 사이드바 확장/축소 상태 (localStorage에서 복원)
    const [isExpanded, setIsExpanded] = useState(() => {
        const saved = localStorage.getItem('sidebarExpanded');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // 상태 변경 시 localStorage에 저장
    useEffect(() => {
        localStorage.setItem('sidebarExpanded', JSON.stringify(isExpanded));
    }, [isExpanded]);

    const toggleSidebar = () => setIsExpanded(!isExpanded);

    const navItems = [
        { path: '/', label: 'Hub', icon: '🏠' },
        { path: '/insight', label: 'Insight', icon: '🧠' },
        { path: '/therapy', label: 'Therapy', icon: '🌿' },
        { path: '/recap', label: 'Recap', icon: '✍️' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    return (
        <div className="min-h-screen app-surface text-text-main font-sans transition-colors duration-300">
            {/* Sidebar Navigation */}
            <aside className={`fixed top-0 left-0 h-full bg-bg-paper border-r border-border-base z-50 transition-all duration-300 hidden md:flex flex-col group/sidebar ${isExpanded ? 'w-64' : 'w-20'}`}>
                {/* 사이드바 경계 토글 버튼 (Notion 스타일) */}
                <button
                    onClick={toggleSidebar}
                    className="absolute -right-3 top-24 w-6 h-6 bg-bg-surface border border-border-base rounded-full shadow-md flex items-center justify-center text-text-muted hover:text-text-main hover:bg-bg-highlight hover:border-primary transition-all duration-200 opacity-0 group-hover/sidebar:opacity-100 hover:scale-110 z-10"
                    title={isExpanded ? '사이드바 축소' : '사이드바 확장'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`transition-transform duration-300 ${isExpanded ? '' : 'rotate-180'}`}
                    >
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>

                {/* Logo Area */}
                <div className={`h-20 flex items-center border-b border-border-base ${isExpanded ? 'px-4' : 'justify-center px-2'}`}>
                    <div className="flex items-center min-w-0">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary/30 flex-shrink-0">
                            T
                        </div>
                        {isExpanded && (
                            <span className="ml-3 font-display font-bold text-xl text-text-main truncate">
                                TheraType
                            </span>
                        )}
                    </div>
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
                                    flex items-center px-3 py-3 rounded-xl transition-all duration-200 group border
                                    ${isExpanded ? 'justify-start' : 'justify-center'}
                                    ${isActive
                                        ? 'bg-primary text-white shadow-md shadow-primary/20 border-primary'
                                        : 'bg-bg-surface text-text-muted border-transparent hover:bg-bg-highlight hover:text-text-main hover:border-border-base'
                                    }
                                `}
                            >
                                <span className="text-xl group-hover:scale-110 transition-transform duration-200">{item.icon}</span>
                                <span className={`font-medium transition-opacity duration-200 ${isActive ? 'font-bold' : ''} ${isExpanded ? 'ml-3 opacity-100' : 'opacity-0 w-0 overflow-hidden'}`}>
                                    {item.label}
                                </span>
                            </Link>
                        );
                    })}
                </nav>

                {/* User Profile & Theme Toggle */}
                <div className="p-4 border-t border-border-base space-y-4">
                    <div className={`flex ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                        <ThemeToggle
                            showLabel={true}
                            labelClassName={isExpanded ? '' : 'hidden'}
                            className={`rounded-xl flex items-center transition-colors bg-bg-surface border border-border-base hover:bg-bg-highlight hover:border-primary ${isExpanded ? 'w-full py-2 px-3 justify-start' : 'w-10 h-10 justify-center rounded-full'}`}
                        />
                    </div>

                    <div className={`flex items-center p-2 rounded-xl bg-bg-highlight border border-border-base ${isExpanded ? 'justify-start' : 'justify-center'}`}>
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                            G
                        </div>
                        <div className={`overflow-hidden transition-opacity duration-200 ${isExpanded ? 'ml-3 opacity-100' : 'opacity-0 w-0'}`}>
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
            <main className={`flex-1 min-h-screen transition-all duration-300 pt-16 md:pt-0 ${isExpanded ? 'md:ml-64' : 'md:ml-20'}`}>
                <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-10 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
