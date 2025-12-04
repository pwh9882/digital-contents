import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Tooltip from '../components/common/Tooltip';
import { Link } from 'react-router-dom';
import {
    getSessions,
    getUserAggregate,
    estimateStorageUsage,
    downloadDataAsJson,
    migrateIfNeeded,
} from '../utils/storageManager';
import { METRIC_TOOLTIPS } from '../data/metricDescriptions';

const DashboardPage = () => {
    const [stats, setStats] = useState({
        totalSessions: 0,
        insightSessions: 0,
        therapySessions: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        // 확장 통계
        avgHesitation: 0,
        avgRhythm: 0,
        avgConsistency: 0,
        avgDwellTime: 0,
        avgFlightTime: 0,
        // UI 상태
        insightCompleted: false,
        profileName: 'Guest',
    });

    const [recentActivity, setRecentActivity] = useState([]);
    const [storageUsage, setStorageUsage] = useState(null);

    useEffect(() => {
        // 기존 데이터 마이그레이션 (최초 1회)
        migrateIfNeeded();

        // StorageManager에서 집계 데이터 로드
        const aggregate = getUserAggregate();
        const sessions = getSessions({ limit: 10 });
        const storage = estimateStorageUsage();

        // 기존 insightResults 체크 (하위 호환성)
        const insightResults = localStorage.getItem('insightResults');
        let insightDone = false;
        let profileName = 'Guest';

        if (insightResults) {
            try {
                const parsed = JSON.parse(insightResults);
                if (parsed.assignedProfile) {
                    insightDone = true;
                    // 프로필 이름 매핑
                    const profileNames = {
                        self_esteem: '자존감 향상형',
                        stress_management: '스트레스 관리형',
                        emotion_control: '감정 조절형',
                        motivation: '동기부여형',
                        demo: '체험 모드',
                    };
                    profileName = profileNames[parsed.assignedProfile] || 'Traveler';
                }
            } catch (e) {
                console.error(e);
            }
        }

        setStats({
            totalSessions: aggregate.totalSessions || 0,
            insightSessions: aggregate.insightSessions || 0,
            therapySessions: aggregate.therapySessions || 0,
            avgWpm: Math.round(aggregate.avgTypingSpeed || 0),
            avgAccuracy: Math.round(aggregate.avgAccuracy || 0),
            // 확장 통계
            avgHesitation: Math.round((aggregate.avgHesitationCount || 0) * 10) / 10,
            avgRhythm: Math.round(aggregate.avgRhythm || 0),
            avgConsistency: Math.round(aggregate.avgConsistency || 0),
            avgDwellTime: Math.round(aggregate.avgDwellTime || 0),
            avgFlightTime: Math.round(aggregate.avgFlightTime || 0),
            // UI 상태
            insightCompleted: insightDone,
            profileName,
        });

        // 최근 활동 생성
        const activity = sessions.map((s, i) => ({
            id: s.sessionId || i,
            type: s.mode === 'insight' ? 'Insight 선택' : 'Therapy 세션',
            date: s.completedAt ? new Date(s.completedAt).toLocaleDateString('ko-KR') : '방금 전',
            score: `${s.typingSpeed || s.wpm || 0} 타/분 / ${s.accuracy || 0}%`,
            status: (s.accuracy >= 90 && (s.typingSpeed || s.wpm) >= 100) ? 'Mastered' : 'Completed',
            // 확장 데이터 표시용
            analytics: s.analytics,
        }));

        setRecentActivity(activity);
        setStorageUsage(storage);
    }, []);

    const handleExportData = () => {
        downloadDataAsJson();
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-main mb-2">Dashboard</h1>
                    <p className="text-text-muted">타이핑 진행 상황과 분석 데이터를 확인하세요.</p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={handleExportData}>
                        데이터 내보내기
                    </Button>
                    <Link to="/therapy">
                        <Button variant="primary" size="sm">새 세션</Button>
                    </Link>
                </div>
            </div>

            {/* Stats Overview - 기본 통계 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Tooltip content={METRIC_TOOLTIPS.totalSessions} position="bottom">
                    <Card variant="elevated" className="p-6 text-center cursor-help">
                        <div className="text-3xl font-bold text-primary mb-1">{stats.totalSessions}</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider">전체 세션</div>
                    </Card>
                </Tooltip>
                <Tooltip content={METRIC_TOOLTIPS.avgWpm} position="bottom">
                    <Card variant="elevated" className="p-6 text-center cursor-help">
                        <div className="text-3xl font-bold text-secondary mb-1">{stats.avgWpm}</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider">평균 타/분</div>
                    </Card>
                </Tooltip>
                <Tooltip content={METRIC_TOOLTIPS.avgAccuracy} position="bottom">
                    <Card variant="elevated" className="p-6 text-center cursor-help">
                        <div className="text-3xl font-bold text-info mb-1">{stats.avgAccuracy}%</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider">평균 정확도</div>
                    </Card>
                </Tooltip>
                <Tooltip content={METRIC_TOOLTIPS.avgConsistency} position="bottom">
                    <Card variant="elevated" className="p-6 text-center cursor-help">
                        <div className="text-3xl font-bold text-purple-600 mb-1">{stats.avgConsistency}%</div>
                        <div className="text-xs text-text-muted uppercase tracking-wider">타이핑 일관성</div>
                    </Card>
                </Tooltip>
            </div>

            {/* 확장 통계 (Healthcare 데이터) */}
            {stats.totalSessions > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Tooltip content={METRIC_TOOLTIPS.avgHesitation} position="bottom">
                        <Card variant="flat" className="p-4 text-center bg-bg-highlight cursor-help">
                            <div className="text-2xl font-bold text-orange-600 mb-1">{stats.avgHesitation}</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">평균 망설임</div>
                        </Card>
                    </Tooltip>
                    <Tooltip content={METRIC_TOOLTIPS.rhythm} position="bottom">
                        <Card variant="flat" className="p-4 text-center bg-bg-highlight cursor-help">
                            <div className="text-2xl font-bold text-teal-600 mb-1">{stats.avgRhythm}ms</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">평균 리듬</div>
                        </Card>
                    </Tooltip>
                    <Tooltip content={METRIC_TOOLTIPS.avgDwellTime} position="bottom">
                        <Card variant="flat" className="p-4 text-center bg-bg-highlight cursor-help">
                            <div className="text-2xl font-bold text-indigo-600 mb-1">{stats.avgDwellTime}ms</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">키 누름 시간</div>
                        </Card>
                    </Tooltip>
                    <Tooltip content={METRIC_TOOLTIPS.avgFlightTime} position="bottom">
                        <Card variant="flat" className="p-4 text-center bg-bg-highlight cursor-help">
                            <div className="text-2xl font-bold text-pink-600 mb-1">{stats.avgFlightTime}ms</div>
                            <div className="text-xs text-text-muted uppercase tracking-wider">키 전환 시간</div>
                        </Card>
                    </Tooltip>
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Activity & Charts */}
                <div className="lg:col-span-2 space-y-8">
                    <Card title="최근 활동" className="min-h-[300px]">
                        {recentActivity.length > 0 ? (
                            <div className="space-y-4">
                                {recentActivity.map((item) => (
                                    <div key={item.id} className="flex items-center justify-between p-4 bg-bg-highlight rounded-xl border border-border-base hover:border-primary transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center text-primary">
                                                {item.type === 'Insight 선택' ? '💡' : '🌿'}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-text-main">{item.type}</h4>
                                                <p className="text-xs text-text-muted">{item.date}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${item.status === 'Mastered' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' : 'bg-bg-highlight text-text-muted'
                                                }`}>
                                                {item.status === 'Mastered' ? '마스터' : '완료'}
                                            </span>
                                            <p className="text-xs text-text-muted mt-1">{item.score}</p>
                                            {/* 확장 분석 데이터 */}
                                            {item.analytics && (
                                                <p className="text-xs text-info mt-1">
                                                    망설임 {item.analytics.hesitationCount || 0}회
                                                    {item.analytics.consistency ? ` · ${Math.round(item.analytics.consistency)}% 일관` : ''}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-48 text-text-muted">
                                <span className="text-4xl mb-2">📭</span>
                                <p>아직 활동 기록이 없습니다.</p>
                                <Link to="/therapy" className="mt-4">
                                    <Button variant="outline" size="sm">첫 세션 시작하기</Button>
                                </Link>
                            </div>
                        )}
                    </Card>

                    {/* 저장소 사용량 */}
                    {storageUsage && (
                        <Card title="데이터 저장 현황">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-text-muted">사용량</span>
                                    <span className="font-mono text-text-main">{storageUsage.usedKB} KB / 5 MB</span>
                                </div>
                                <div className="w-full bg-bg-highlight rounded-full h-2">
                                    <div
                                        className="bg-primary h-2 rounded-full transition-all"
                                        style={{ width: `${Math.min(storageUsage.percentUsed, 100)}%` }}
                                    />
                                </div>
                                <p className="text-xs text-text-muted">
                                    최근 50세션은 전체 데이터 보관, 이전 세션은 요약만 저장됩니다.
                                </p>
                            </div>
                        </Card>
                    )}
                </div>

                {/* Right Column: Profile & Goals */}
                <div className="lg:col-span-1 space-y-8">
                    <Card className="bg-gradient-to-br from-primary to-primary-700 text-white border-none">
                        <div className="text-center p-6">
                            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl mb-4 border-2 border-white/30">
                                👤
                            </div>
                            <h3 className="text-xl font-bold mb-1">{stats.profileName}</h3>
                            <p className="text-primary-100 text-sm mb-2">
                                {stats.insightSessions > 0 && `Insight ${stats.insightSessions}회`}
                                {stats.insightSessions > 0 && stats.therapySessions > 0 && ' · '}
                                {stats.therapySessions > 0 && `Therapy ${stats.therapySessions}회`}
                            </p>

                            {!stats.insightCompleted && (
                                <div className="bg-white/10 rounded-lg p-4 text-left mb-4">
                                    <p className="text-sm font-medium mb-2">Insight 모드 완료하기</p>
                                    <div className="w-full bg-black/20 rounded-full h-1.5">
                                        <div className="bg-white h-1.5 rounded-full w-1/4"></div>
                                    </div>
                                </div>
                            )}

                            <Link to="/insight">
                                <Button variant="ghost" className="w-full bg-bg-surface text-primary hover:bg-bg-highlight">
                                    {stats.insightCompleted ? 'Insight 다시 하기' : 'Insight 모드 시작'}
                                </Button>
                            </Link>
                        </div>
                    </Card>

                    <Card title="세션 요약">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-bg-highlight rounded-lg">
                                <span className="text-text-muted">Insight 세션</span>
                                <span className="font-bold text-primary">{stats.insightSessions}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-bg-highlight rounded-lg">
                                <span className="text-text-muted">Therapy 세션</span>
                                <span className="font-bold text-secondary">{stats.therapySessions}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-bg-highlight rounded-lg">
                                <span className="text-text-muted">평균 망설임</span>
                                <span className="font-bold text-orange-600">{stats.avgHesitation}회/세션</span>
                            </div>
                        </div>
                    </Card>

                    {/* 데이터 분석 안내 */}
                    <Card className="border-dashed border-2 border-border-base bg-transparent">
                        <div className="text-center p-4">
                            <div className="text-2xl mb-2">📊</div>
                            <h4 className="font-medium text-text-main mb-1">Healthcare 데이터</h4>
                            <p className="text-xs text-text-muted">
                                타이핑 패턴 데이터가 수집되고 있습니다.
                                망설임 패턴, 키 누름 시간 등을 분석하여
                                향후 연구에 활용됩니다.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
