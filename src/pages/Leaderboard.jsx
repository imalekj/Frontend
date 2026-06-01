import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AppColors } from '../theme/AppColors';
import axios from 'axios';

export const Leaderboard = () => {
    const navigate = useNavigate();
    const { user, token } = useAuth();

    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [activeTab, setActiveTab] = useState('competitions');
    const [selectedFaculty, setSelectedFaculty] = useState('الكل');

    const faculties = [
        'الكل',
        'العلوم وتكنولوجيا المعلومات',
        'الهندسة والتكنولوجيا',
        'الصيدلة',
        'التمريض',
        'الآداب',
        'الأعمال',
        'الحقوق',
        'العمارة والتصميم'
    ];

    useEffect(() => {
        const fetchLeaderboardData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get('/api/leaderboard', {
                    params: {
                        faculty: selectedFaculty,
                        sortBy: activeTab
                    },
                    headers: token ? { Authorization: `Bearer ${token}` } : {}
                });

                if (response.data) {
                    if (Array.isArray(response.data)) {
                        setStudents(response.data);
                    } else if (response.data.data && Array.isArray(response.data.data)) {
                        setStudents(response.data.data);
                    } else if (response.data.students && Array.isArray(response.data.students)) {
                        setStudents(response.data.students);
                    } else {
                        setStudents([]);
                    }
                } else {
                    setStudents([]);
                }

            } catch (err) {
                console.error("Error fetching leaderboard data:", err);
                setError("فشل في تحميل بيانات لوحة الصدارة. يرجى المحاولة لاحقاً.");
            } finally {
                setLoading(false);
            }
        };

        fetchLeaderboardData();
    }, [activeTab, selectedFaculty, token]);

    const studentsWithRank = Array.isArray(students)
        ? students.map((student, index) => ({
            ...student,
            rank: index + 1
        }))
        : [];

    const topThree = [
        studentsWithRank.find(i => i.rank === 2),
        studentsWithRank.find(i => i.rank === 1),
        studentsWithRank.find(i => i.rank === 3)
    ].filter(Boolean);

    const others = studentsWithRank.filter(item => item.rank > 3);

    const handleNavigation = (id) => {
        if (!token) {
            navigate('/login');
            return;
        }
        navigate(`/profile/${id}`);
    };

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ maxWidth: '800px', fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .academic-card { border-radius: 20px; border: none; background: #fff; transition: 0.3s; }
                    .nav-pills-academic { background: #eee; padding: 4px; border-radius: 12px; display: inline-flex; }
                    .nav-pills-academic .btn { border-radius: 10px; font-weight: 600; transition: 0.3s; padding: 8px 20px; border: none; font-size: 0.9rem; }
                    .nav-pills-academic .active { background: ${AppColors.primaryGreen || '#1a5d44'}; color: white !important; box-shadow: 0 4px 10px rgba(26, 93, 68, 0.2); }
                    .podium-box { transition: transform 0.3s ease; padding: 20px 10px; border-radius: 20px; background: linear-gradient(180deg, #ffffff 0%, #f9f9f9 100%); cursor: pointer; position: relative; min-height: 180px; display: flex; flex-direction: column; justify-content: space-between; align-items: center; }
                    .podium-box:hover { transform: scale(1.05); }
                    .rank-1 { transform: translateY(-15px); border: 2px solid ${AppColors.accentGold || '#FFD700'}22; box-shadow: 0 10px 25px rgba(255, 215, 0, 0.1); }
                    .name-link { color: #2c3e50; text-decoration: none; font-weight: 700; cursor: pointer; transition: 0.2s; }
                    .name-link:hover { color: ${AppColors.primaryGreen || '#1a5d44'}; }
                    .tab-content-animate { animation: slideUp 0.4s ease-out; }
                    @keyframes slideUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                    .count-badge { background: #e8f5e9; color: ${AppColors.primaryGreen || '#1a5d44'}; padding: 4px 12px; border-radius: 8px; font-weight: 800; display: inline-block; }
                    .is-me { background-color: #fff9c4 !important; border-right: 4px solid ${AppColors.accentGold || '#FFD700'}; }
                    .faculty-select { max-width: 250px; background-color: #f8f9fa; border: 1.5px solid ${AppColors.borderInput || '#eee'}; border-radius: 10px; padding: 8px 12px; font-size: 0.9rem; font-weight: 600; color: #495057; }
                    .faculty-select:focus { border-color: ${AppColors.primaryGreen || '#1a5d44'}; outline: none; box-shadow: 0 0 0 3px rgba(26, 93, 68, 0.1); }
                `}
            </style>

            <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                <div>
                    <h3 className="fw-900 mb-1" style={{ color: AppColors.primaryGreen || '#1a5d44' }}>لوحة الصدارة</h3>
                    <p className="text-muted small mb-0">نخبة الطلاب الأكثر تفاعلاً وإنجازاً في جامعة الزيتونة الأردنية</p>
                </div>
                <div className="nav-pills-academic shadow-sm">
                    <button className={`btn ${activeTab === 'competitions' ? 'active' : ''}`} onClick={() => setActiveTab('competitions')}>
                        <i className="bi bi-trophy-fill me-1"></i> الأكثر مشاركة بالمسابقات
                    </button>
                    <button className={`btn ${activeTab === 'projects' ? 'active' : ''}`} onClick={() => setActiveTab('projects')}>
                        <i className="bi bi-mortarboard-fill me-1"></i> الأكثر إنجازاً للمشاريع
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-start align-items-center mb-4 p-3 bg-white shadow-sm rounded-3">
                <label className="fw-bold me-2 mb-0 text-secondary small" style={{ marginLeft: '10px' }}>تصفية حسب الكلية:</label>
                <select
                    className="form-select faculty-select"
                    value={selectedFaculty}
                    onChange={(e) => setSelectedFaculty(e.target.value)}
                >
                    {faculties.map((fac, idx) => (
                        <option key={idx} value={fac}>{fac}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">جاري التحميل...</span>
                    </div>
                    <p className="text-muted mt-2 small">جاري جلب لوحة الصدارة الحية...</p>
                </div>
            ) : error ? (
                <div className="alert alert-danger text-center rounded-3 shadow-sm" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2"></i> {error}
                </div>
            ) : studentsWithRank.length > 0 ? (
                <>
                    <div className="row g-3 align-items-end mb-5 text-center tab-content-animate" key={`${activeTab}-${selectedFaculty}`}>
                        {topThree.map((item) => (
                            <div key={item.id} className="col-4">
                                <div
                                    className={`podium-box shadow-sm ${item.rank === 1 ? 'rank-1' : ''} ${user?.id === item.id ? 'border border-success' : ''}`}
                                    onClick={() => handleNavigation(item.id)}
                                >
                                    <div className="mb-2">
                                        {item.rank === 1 && <i className="bi bi-trophy-fill fs-1 text-warning"></i>}
                                        {item.rank === 2 && <i className="bi bi-award-fill fs-2 text-secondary"></i>}
                                        {item.rank === 3 && <i className="bi bi-award-fill fs-3" style={{ color: AppColors.accentBronze || '#CD7F32' }}></i>}
                                    </div>
                                    <div className="name-link fs-6 mb-1">
                                        {item.name} {user?.id === item.id && "(أنت)"}
                                    </div>
                                    <div className="text-muted extra-small mb-2" style={{ fontSize: '0.72rem' }}>
                                        {item.specialty} <br /> <span className="badge bg-light text-secondary mt-1 fw-normal">{item.faculty}</span>
                                    </div>
                                    <div className="count-badge small shadow-sm mt-auto">
                                        {activeTab === 'competitions'
                                            ? `🏆 ${item.competitionsCount || 0} مسابقات`
                                            : `📁 ${item.projectsCount || 0} مشاريع`
                                        }
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {others.length > 0 && (
                        <div className="academic-card shadow-sm overflow-hidden tab-content-animate">
                            <div className="p-3 bg-white border-bottom d-flex justify-content-between align-items-center">
                                <span className="fw-bold text-dark">بقية قائمة المتصدرين</span>
                                <i className="bi bi-filter-right text-muted"></i>
                            </div>
                            <div className="table-responsive">
                                <table className="table table-hover align-middle mb-0">
                                    <thead className="table-light">
                                        <tr className="small text-muted">
                                            <th className="py-3 text-center">الترتيب</th>
                                            <th className="py-3">الطالب</th>
                                            <th className="py-3 text-center">الإنجاز الحالي</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {others.map((item) => (
                                            <tr key={item.id} className={user?.id === item.id ? "is-me" : ""}>
                                                <td className="py-3 text-center">
                                                    <span className="badge rounded-pill bg-light text-dark border px-3">#{item.rank}</span>
                                                </td>
                                                <td className="py-3">
                                                    <div className="name-link" onClick={() => handleNavigation(item.id)}>
                                                        {item.name} {user?.id === item.id && " (أنت)"}
                                                    </div>
                                                    <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        {item.specialty} • <span className="text-secondary">{item.faculty}</span>
                                                    </div>
                                                </td>
                                                <td className="py-3 text-center">
                                                    <span className="fw-bold text-success">
                                                        {activeTab === 'competitions'
                                                            ? `${item.competitionsCount || 0} مسابقات`
                                                            : `${item.projectsCount || 0} مشاريع`
                                                        }
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-5 bg-white shadow-sm rounded-4 tab-content-animate">
                    <i className="bi bi-people text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="text-muted mt-3 fw-bold">لا يوجد بيانات مسجلة لهذه الكلية حالياً.</p>
                </div>
            )}
        </div>
    );
};