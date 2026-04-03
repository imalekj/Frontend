import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 

export const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const mainGreen = '#1a5d44';

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    
    const isOwnProfile = currentUser?.id === parseInt(userId) || currentUser?.id === userId;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
    
                
                setTimeout(() => {
                    const mockData = {
                        id: userId,
                        name: isOwnProfile ? currentUser?.name : "أحمد علي",
                        role: isOwnProfile ? "طالب تقنية معلومات - الزيتونة" : "هندسة برمجيات - سنة ثالثة",
                        githubUrl: "https://github.com",
                        bio: "مطور واجهات طموح أهوى المشاركة في الهاكاثونات البرمجية. أؤمن بأن العمل الجماعي هو مفتاح الابتكار التقني.",
                        rating: 4.8,
                        stats: { competitions: 12, wins: 3, teams: 8 },
                        skills: ["React.js", "Node.js", "TypeScript", "UI/UX Design"],
                        previousWork: [
                            { id: 1, title: "تطبيق إدارة المهام", tech: "React & Firebase" },
                            { id: 2, title: "نظام التسجيل الجامعي", tech: "Node.js & MySQL" }
                        ],
                        activeCompetitions: [
                            { id: 101, title: "هاكاثون الزيتونة الوطني", role: "قائد الفريق", date: "تنتهي خلال 3 أيام" }
                        ]
                    };
                    setUser(mockData);
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error("Error fetching user:", error);
                setLoading(false);
            }
        };
        fetchUserData();
    }, [userId, currentUser, isOwnProfile]);

    if (loading) return (
        <div className="d-flex justify-content-center align-items-center min-vh-100">
            <div className="spinner-border text-success" role="status"></div>
        </div>
    );

    if (!user) return <div className="text-center py-5">المستخدم غير موجود</div>;

    return (
        <div className="container-fluid py-5 bg-light min-vh-100 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .profile-container { max-width: 1100px; margin: 0 auto; }
                    .main-card { border-radius: 20px; border: none; background: white; padding: 25px; overflow: hidden; }
                    .header-gradient { 
                        background: linear-gradient(135deg, ${mainGreen} 0%, #2d8a67 100%);
                        margin: -25px -25px 80px -25px;
                        height: 160px;
                        position: relative;
                    }
                    .avatar-wrapper {
                        position: absolute;
                        bottom: -60px;
                        right: 30px;
                    }
                    .profile-img { 
                        width: 130px; height: 130px; border-radius: 25px; 
                        border: 6px solid white; background: white;
                        object-fit: cover;
                    }
                    .info-section { margin-top: 10px; }
                    .rating-badge {
                        background: #fff9db; color: #f08c00;
                        padding: 6px 14px; border-radius: 10px;
                        font-size: 0.85rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;
                    }
                    .stat-box { 
                        background: #f8fafc; border: 1px solid #f1f5f9; 
                        border-radius: 18px; padding: 15px; transition: 0.3s;
                    }
                    .skill-tag { 
                        background: #f1f5f9; color: #475569; padding: 6px 14px; 
                        border-radius: 8px; font-size: 0.75rem; font-weight: 600;
                    }
                    .btn-github {
                        background: #24292e; color: white; border: none;
                        width: 40px; height: 40px; border-radius: 10px;
                        display: flex; align-items: center; justify-content: center;
                        transition: 0.3s; text-decoration: none;
                    }
                    .btn-github:hover { transform: translateY(-3px); color: white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                    .work-item {
                        border-right: 3px solid ${mainGreen};
                        background: #fdfdfd; padding: 12px 15px; border-radius: 8px;
                    }
                `}
            </style>

            <div className="profile-container">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="main-card shadow-sm mb-4">
                            <div className="header-gradient">
                                <div className="avatar-wrapper">
                                    <img 
                                        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
                                        className="profile-img shadow-sm" 
                                        alt="User" 
                                    />
                                </div>
                            </div>
                            
                            <div className="info-section">
                                <h4 className="fw-bold text-dark mb-1">
                                    {user.name} {isOwnProfile && <span className="badge bg-secondary-subtle text-secondary fs-6 ms-2">أنت</span>}
                                </h4>
                                <p className="text-muted small mb-3">{user.role}</p>
                                
                                <div className="rating-badge mb-4">
                                    <i className="bi bi-star-fill"></i> {user.rating} تقييم الزملاء
                                </div>

                                <div className="d-flex gap-2 mb-4">
                                    {/* إظهار زر تعديل للمالك، أو زر مراسلة للآخرين */}
                                    {isOwnProfile ? (
                                        <button 
                                            className="btn btn-outline-dark rounded-pill px-4 fw-bold flex-grow-1 shadow-sm"
                                            onClick={() => navigate('/settings')}
                                        >
                                            <i className="bi bi-pencil-square me-2"></i> تعديل الملف
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn text-white rounded-pill px-4 fw-bold flex-grow-1 shadow-sm"
                                            style={{ backgroundColor: mainGreen }}
                                            onClick={() => navigate(`/chat/${user.id}`)}
                                        >
                                            <i className="bi bi-chat-dots-fill me-2"></i> مراسلة
                                        </button>
                                    )}
                                    
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                                        <i className="bi bi-github fs-5"></i>
                                    </a>
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark small mb-2">نبذة تعريفية</h6>
                                    <p className="text-secondary small lh-base mb-0">{user.bio}</p>
                                </div>

                                <div>
                                    <h6 className="fw-bold text-dark small mb-2">المهارات</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {user.skills.map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="row g-3 mb-4 text-center">
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0" style={{ color: mainGreen }}>{user.stats.competitions}</h4>
                                    <small className="text-muted fw-600">مسابقة</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0 text-warning">{user.stats.wins}</h4>
                                    <small className="text-muted fw-600">إنجاز</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0 text-primary">{user.stats.teams}</h4>
                                    <small className="text-muted fw-600">فريق</small>
                                </div>
                            </div>
                        </div>

                        <div className="main-card shadow-sm mb-4">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-collection text-success"></i> المشاريع السابقة
                            </h6>
                            <div className="row g-3">
                                {user.previousWork.map(work => (
                                    <div key={work.id} className="col-md-6">
                                        <div className="work-item">
                                            <h6 className="fw-bold mb-1 small">{work.title}</h6>
                                            <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                <i className="bi bi-cpu me-1"></i> {work.tech}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="main-card shadow-sm">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-activity text-danger"></i> النشاط الحالي
                            </h6>
                            {user.activeCompetitions.map(comp => (
                                <div key={comp.id} className="p-3 d-flex justify-content-between align-items-center flex-wrap gap-3 border rounded-4 bg-light bg-opacity-50">
                                    <div>
                                        <h6 className="fw-bold mb-1 small">{comp.title}</h6>
                                        <div className="d-flex gap-3 small" style={{ fontSize: '0.75rem' }}>
                                            <span className="text-success fw-bold">{comp.role}</span>
                                            <span className="text-muted"><i className="bi bi-clock me-1"></i> {comp.date}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-sm btn-outline-dark rounded-pill px-3 fw-bold"
                                        onClick={() => navigate(`/competition/${comp.id}`)}
                                    >
                                        التفاصيل
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};