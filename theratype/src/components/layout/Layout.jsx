import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Home', icon: '🏠' },
        { path: '/insight', label: 'Insight', icon: '🧠' },
        { path: '/therapy', label: 'Therapy', icon: '🌿' },
        { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    ];

    return (
        <div className="flex min-h-screen bg-neutral-50">
            {/* Sidebar Navigation */}
            <aside className="w-20 lg:w-64 bg-white border-r border-neutral-200 flex-shrink-0 fixed h-full z-20 transition-all duration-300">
                <div className="h-full flex flex-col">
                    {/* Logo Area */}
                    <div className="h-20 flex items-center justify-center lg:justify-start lg:px-8 border-b border-neutral-100">
                        <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                            T
                        </div>
                        <span className="hidden lg:block ml-3 font-display font-bold text-xl text-neutral-800 tracking-tight">
                            TheraType
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 py-8 px-4 space-y-2">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group ${isActive
                                            ? 'bg-primary-50 text-primary-600 shadow-sm'
                                            : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                                        }`}
                                >
                                    <span className={`text-xl ${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-200`}>
                                        {item.icon}
                                    </span>
                                    <span className={`hidden lg:block ml-3 font-medium ${isActive ? 'font-semibold' : ''}`}>
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="hidden lg:block ml-auto w-1.5 h-1.5 rounded-full bg-primary-500" />
                                    )}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Profile / Footer */}
                    <div className="p-4 border-t border-neutral-100">
                        <div className="flex items-center justify-center lg:justify-start p-2 rounded-xl hover:bg-neutral-50 cursor-pointer transition-colors">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-secondary-400 to-primary-500 border-2 border-white shadow-sm" />
                            <div className="hidden lg:block ml-3">
                                <p className="text-sm font-medium text-neutral-700">Guest User</p>
                                <p className="text-xs text-neutral-400">Free Plan</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 ml-20 lg:ml-64 min-h-screen transition-all duration-300">
                <div className="max-w-7xl mx-auto p-6 lg:p-10 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
