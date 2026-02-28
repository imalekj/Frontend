import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Leaderboard = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('students');
    const mainGreen = '#1a5d44';
    const accentGold = '#FFD700';
    const accentBronze = '#CD7F32';

    const students = [
        { id: 101, name: "أحمد العتيبي", specialty: "هندسة برمجيات", points: 3200, rank: 1 },
        { id: 102, name: "سارة محمود", specialty: "أمن سيبراني", points: 2950, rank: 2 },
        { id: 103, name: "عمر خالد", specialty: "ذكاء اصطناعي", points: 2800, rank: 3 },
        { id: 104, name: "ليلى حسن", specialty: "علم بيانات", points: 2600, rank: 4 },
        { id: 105, name: "محمد علي", specialty: "نظم معلومات", points: 2400, rank: 5 },
    ];

    const teams = [
        { id: 1, name: "فريق المبدعين", category: "الذكاء الاصطناعي", score: 2850, rank: 1 },
        { id: 2, name: "رابطة المبرمجين", category: "الأمن السيبراني", score: 2600, rank: 2 },
        { id: 3, name: "رواد التقنية", category: "تطوير الويب", score: 2450, rank: 3 },
    ];

    const data = activeTab === 'students' ? students : teams;
    
    const topThree = [
        data.find(i => i.rank === 2),
        data.find(i => i.rank === 1),
        data.find(i => i.rank === 3)
    ].filter(Boolean);

    const others = data.filter(item => item.rank > 3);

    const handleNavigation = (id) => {
        if (activeTab === 'students') {
            navigate(`/profile/${id}`);
        } else {

            console.log("Team navigation not implemented yet");
        }
    };

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ maxWidth: '800px', fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .academic-card { border-radius: 20px; border: none; background: #fff; transition: 0.3s; }
                    .nav-pills-academic { background: #eee; padding: 4px; border-radius: 12px; display: inline-flex; }
                    .nav-pills-academic .btn { border-radius: 10px; font-weight: 600; transition: 0.3s; padding: 8px 25px; border: none; }
                    .nav-pills-academic .active { background: ${mainGreen}; color: white !important; box-shadow: 0 4px 10px rgba(26, 93, 68, 0.2); }
                    .podium-box { transition: transform 0.3s ease; padding: 20px 10px; border-radius: 20px; background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%); cursor: pointer; }
                    .podium-box:hover { transform: scale(1.05); }
                    .rank-1 { transform: translateY(-15px); border: 2px solid ${accentGold}22; box-shadow: 0 10px 25px rgba(255, 215, 0, 0.1); }
                    .name-link { color: #2c3e50; text-decoration: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
                    .name-link:hover { color: ${mainGreen}; }
                    .tab-content-animate { animation: slideUp 0.4s ease-out; }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    .points-badge { background: #e8f5e9; color: ${mainGreen}; padding: 4px 12px; border-radius: 8px; font-weight: 800; }
                `}
            </style>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-5 gap-3">
                <div>
                    <h3 className="fw-900 mb-1" style={{ color: mainGreen }}>لوحة الصدارة</h3>
                    <p className="text-muted small">نخبة المبدعين في جامعة الزيتونة الأردنية</p>
                </div>
                <div className="nav-pills-academic shadow-sm">
                    <button className={`btn ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}>
                        <i className="bi bi-person-fill me-1"></i> الطلاب
                    </button>
                    <button className={`btn ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>
                        <i className="bi bi-people-fill me-1"></i> الفرق
                    </button>
                </div>
            </div>

            <div className="row g-3 align-items-end mb-5 text-center tab-content-animate" key={activeTab}>
                {topThree.map((item) => (
                    <div key={item.id} className="col-4">
                        <div 
                            className={`podium-box shadow-sm ${item.rank === 1 ? 'rank-1' : ''}`}
                            onClick={() => handleNavigation(item.id)}
                        >
                            <div className="mb-2">
                                {item.rank === 1 && <i className="bi bi-trophy-fill fs-1 text-warning"></i>}
                                {item.rank === 2 && <i className="bi bi-award-fill fs-2 text-secondary"></i>}
                                {item.rank === 3 && <i className="bi bi-award-fill fs-3" style={{ color: accentBronze }}></i>}
                            </div>
                            <div className="name-link fs-6 mb-1">{item.name}</div>
                            <div className="text-muted extra-small mb-2" style={{ fontSize: '0.75rem' }}>
                                {activeTab === 'students' ? item.specialty : item.category}
                            </div>
                            <div className="points-badge small shadow-sm">
                                ⚡ {item.points || item.score}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="academic-card shadow-sm overflow-hidden tab-content-animate">
                <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-dark">بقية المتصدرين</span>
                    <i className="bi bi-filter-right text-muted"></i>
                </div>
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr className="small text-muted">
                                <th className="py-3 text-center">الترتيب</th>
                                <th className="py-3">الاسم</th>
                                <th className="py-3 text-center">النقاط</th>
                            </tr>
                        </thead>
                        <tbody>
                            {others.map((item) => (
                                <tr key={item.id}>
                                    <td className="py-3 text-center">
                                        <span className="badge rounded-pill bg-light text-dark border px-3">#{item.rank}</span>
                                    </td>
                                    <td className="py-3">
                                        <div className="name-link" onClick={() => handleNavigation(item.id)}>
                                            {item.name}
                                        </div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                            {activeTab === 'students' ? item.specialty : item.category}
                                        </div>
                                    </td>
                                    <td className="py-3 text-center">
                                        <span className="fw-bold text-success">
                                            {item.points || item.score}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};