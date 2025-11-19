import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalSessions: 0,
        totalTime: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        insightCompleted: false,
        profileName: 'Guest',
    });

    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        // Load data from localStorage
        const insightResults = localStorage.getItem('insightResults');
        const therapySessions = localStorage.getItem('therapySessions');

        let totalWpm = 0;
        let totalAcc = 0;
        let count = 0;
        let sessions = [];
        let profileName = 'Guest';
        let insightDone = false;

        if (insightResults) {
            try {
                const parsed = JSON.parse(insightResults);
                if (parsed.assignedProfile) {
                    insightDone = true;
                }
            } catch (e) {
                console.error(e);
            }
        }

        if (therapySessions) {
            try {
                const parsed = JSON.parse(therapySessions);
                if (parsed.sessions && Array.isArray(parsed.sessions)) {
                    sessions = parsed.sessions;
                    sessions.forEach(s => {
                        totalWpm += s.wpm || 0;
                        totalAcc += s.accuracy || 0;
                        count++;
                    });
                }
            } catch (e) {
                console.error(e);
            }
        }

        setStats({
            totalSessions: count,
            totalTime: count * 2, // Rough estimate: 2 mins per session
            avgWpm: count > 0 ? Math.round(totalWpm / count) : 0,
            avgAccuracy: count > 0 ? Math.round(totalAcc / count) : 0,
            insightCompleted: insightDone,
            profileName: 'Traveler', // Default name
        });

        // Mock recent activity if empty, or use real sessions
        const activity = sessions.slice(-5).reverse().map((s, i) => ({
            id: i,
            type: 'Therapy Session',
            date: s.completedAt ? new Date(s.completedAt).toLocaleDateString() : 'Just now',
            score: `${s.wpm} WPM / ${s.accuracy}%`,
            status: s.accuracy >= 90 ? 'Mastered' : 'Completed'
        }));

        setRecentActivity(activity);

    }, []);

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Dashboard</h1>
                    <p className="text-text-muted">Track your progress and mental wellness journey.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/therapy">
                        <Button variant="primary" size="sm">New Session</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card variant="elevated" className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary-main mb-1">{stats.totalSessions}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">Total Sessions</div>
                </Card>
                <Card variant="elevated" className="p-6 text-center">
                    <div className="text-3xl font-bold text-secondary-main mb-1">{stats.avgWpm}</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">Avg WPM</div>
                </Card>
                <Card variant="elevated" className="p-6 text-center">
                    <div className="text-3xl font-bold text-info mb-1">{stats.avgAccuracy}%</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">Avg Accuracy</div>
                </Card>
                <Card variant="elevated" className="p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">{stats.totalTime}m</div>
                    <div className="text-xs text-text-muted uppercase tracking-wider">Focus Time</div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Activity & Charts */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="Recent Activity" className="min-h-[300px]">
                        {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-bg-highlight rounded-xl border border-border-base hover:border-primary-200 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary-main">
                                                🌿
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-text-main">{item.type}</h4>
                                                <p className="text-xs text-text-muted">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${item.status === 'Mastered' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-bg-highlight text-text-muted'
                                                }`}>
                                                {item.status}
                                            </span>
                                            <p className="text-xs text-text-muted mt-1">{item.score}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-text-muted">
                                <span className="text-4xl mb-2">📭</span>
                                <p>No recent activity found.</p>
                                <Link to="/therapy" className="mt-4">
                                    <Button variant="outline" size="sm">Start your first session</Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>

                {/* Right Column: Profile & Goals */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="bg-gradient-to-br from-primary-main to-primary-700 text-white border-none">
                        <div className="text-center p-6">
                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl mb-4 border-2 border-white/30">
                                👤
                            </div>
                            <h3 className="text-xl font-bold mb-1">{stats.profileName}</h3>
                            <p className="text-primary-100 text-sm mb-6">Level 1 • Beginner</p>

                            {!stats.insightCompleted && (
                                <div className="bg-white/10 rounded-lg p-4 text-left mb-4">
                                    <p className="text-sm font-medium mb-2">Complete Insight Mode</p>
                                    <div className="w-full bg-black/20 rounded-full h-1.5">
                                        <div className="bg-white h-1.5 rounded-full w-1/4"></div>
                                    </div>
                                </div>
                            )}

                            <Link to="/insight">
                                <Button variant="ghost" className="w-full bg-white text-primary-main hover:bg-primary-light">
                                    {stats.insightCompleted ? 'Retake Insight Analysis' : 'Start Insight Mode'}
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card title="Weekly Goals">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-border-base flex items-center justify-center"></div>
                                <span className="text-sm text-text-muted">Complete 3 sessions</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-green-500 bg-green-500 flex items-center justify-center text-white text-xs">✓</div>
                                <span className="text-sm text-text-muted line-through">Achieve 95% accuracy</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-5 h-5 rounded-full border-2 border-border-base flex items-center justify-center"></div>
                                <span className="text-sm text-text-muted">Type for 15 minutes</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
