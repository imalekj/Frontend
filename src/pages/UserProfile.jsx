import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                setTimeout(() => {
                    const mockData = {
                        id: userId,
                        name: "أحمد علي",
                        role: "هندسة برمجيات - سنة ثالثة",
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
    }, [userId]);

    const getAvatar = (seed) => `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`;

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
                    .main-card { border-radius: 25px; border: none; background: white; padding: 30px; }
                    .header-box { 
                        background: linear-gradient(135deg, ${mainGreen} 0%, #2d8a67 100%);
                        border-radius: 25px; padding: 40px 20px; margin-bottom: 30px; color: white;
                    }
                    .profile-img { 
                        width: 130px; height: 130px; border-radius: 40px; 
                        border: 6px solid rgba(255,255,255,0.2); background: white;
                        object-fit: cover;
                    }
                    .rating-badge {
                        background: rgba(255, 255, 255, 0.2);
                        padding: 6px 16px; border-radius: 12px;
                        font-size: 0.9rem; font-weight: 700; display: inline-block;
                    }
                    .stat-card { 
                        background: white; border: 1px solid #f0f0f0; 
                        border-radius: 20px; padding: 20px; transition: 0.3s;
                    }
                    .stat-card:hover { transform: translateY(-5px); border-color: ${mainGreen}; }
                    .skill-badge { 
                        background: #f0f7f4; color: ${mainGreen}; padding: 8px 18px; 
                        border-radius: 12px; font-size: 0.8rem; font-weight: 700;
                    }
                    .btn-github {
                        background: #24292e; color: white; border: none;
                        width: 45px; height: 45px; border-radius: 12px;
                        display: flex; align-items: center; justify-content: center;
                        transition: 0.3s;
                    }
                    .btn-github:hover { background: #000; color: white; transform: scale(1.05); }
                `}
            </style>

            <div className="profile-container">
                <div className="row g-4">
                    
                
                    <div className="col-lg-4">
                        <div className="main-card shadow-sm text-center">
                            <div className="header-box shadow-sm">
                                <img src={getAvatar(user.name)} className="profile-img shadow mb-3" alt="User" />
                                <h4 className="fw-900 mb-1">{user.name}</h4>
                                <p className="small opacity-75 mb-3">{user.role}</p>
                                
                                <div className="rating-badge mb-4">
                                    <i className="bi bi-star-fill text-warning me-1"></i> {user.rating} تقييم الزملاء
                                </div>

                                <div className="d-flex gap-2 justify-content-center">
                                    {/* زر المراسلة */}
                                    <button 
                                        className="btn btn-light rounded-pill px-4 fw-bold flex-grow-1"
                                        onClick={() => navigate(`/chat/${user.id}`)}
                                    >
                                        <i className="bi bi-chat-dots-fill me-2"></i> مراسلة
                                    </button>
                                    
                                
                                    <a 
                                        href={user.githubUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="btn-github"
                                        title="GitHub Profile"
                                    >
                                        <i className="bi bi-github fs-5"></i>
                                    </a>
                                </div>
                            </div>

                            <div className="text-end mb-4">
                                <h6 className="fw-900 text-dark mb-3">نبذة تعريفية</h6>
                                <p className="text-secondary small lh-lg mb-0">{user.bio}</p>
                            </div>

                            <div className="text-end">
                                <h6 className="fw-900 text-dark mb-3">المهارات التقنية</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {user.skills.map(skill => (
                                        <span key={skill} className="skill-badge">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                
                    <div className="col-lg-8">
                    
                        <div className="row g-3 mb-4 text-center">
                            <div className="col-md-4 col-12">
                                <div className="stat-card shadow-sm">
                                    <h3 className="fw-900 mb-0 text-success">{user.stats.competitions}</h3>
                                    <small className="text-muted fw-bold">مسابقات شارك بها</small>
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="stat-card shadow-sm">
                                    <h3 className="fw-900 mb-0 text-warning">{user.stats.wins}</h3>
                                    <small className="text-muted fw-bold">إنجازات وفوز</small>
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="stat-card shadow-sm">
                                    <h3 className="fw-900 mb-0 text-primary">{user.stats.teams}</h3>
                                    <small className="text-muted fw-bold">فرق انضم إليها</small>
                                </div>
                            </div>
                        </div>

                    
                        <div className="main-card shadow-sm mb-4">
                            <h5 className="fw-900 mb-4 border-bottom pb-3">المشاريع السابقة</h5>
                            <div className="row g-3">
                                {user.previousWork.map(work => (
                                    <div key={work.id} className="col-md-6">
                                        <div className="project-item">
                                            <h6 className="fw-900 mb-1">{work.title}</h6>
                                            <p className="text-muted small mb-0"><i className="bi bi-code-slash me-1"></i> {work.tech}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    
                        <div className="main-card shadow-sm">
                            <h5 className="fw-900 mb-4 text-dark border-bottom pb-3">النشاط البرمجي الحالي</h5>
                            {user.activeCompetitions.map(comp => (
                                <div key={comp.id} className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3 border-end border-success border-4 bg-light rounded-4">
                                    <div>
                                        <h6 className="fw-900 mb-1 fs-5">{comp.title}</h6>
                                        <div className="d-flex gap-3 mt-1 small fw-bold">
                                            <span className="text-success"><i className="bi bi-person-badge me-1"></i> {comp.role}</span>
                                            <span className="text-danger"><i className="bi bi-clock me-1"></i> {comp.date}</span>
                                        </div>
                                    </div>
                                    <button 
                                        className="btn btn-dark rounded-pill px-4 fw-bold"
                                        onClick={() => navigate(`/competition/${comp.id}`)}
                                    >
                                        عرض المسابقة
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