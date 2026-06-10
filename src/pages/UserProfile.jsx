import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; 
import { apiFetch } from '../api';
import { AppColors } from '../theme/AppColors';

export const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useAuth();
    const mainGreen = AppColors.primaryGreen || '#1a5d44';

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [projectsCount, setProjectsCount] = useState(0);
    const [finishedCount, setFinishedCount] = useState(0);
    const [currentProjects, setCurrentProjects] = useState([]);
    const [prevProjects, setPrevProjects] = useState([]);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const isOwnProfile = currentUser?.id === parseInt(userId) || currentUser?.id === userId;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);

                const [userRes, countRes, finishedRes, currentRes, prevRes] = await Promise.all([
                    apiFetch(`${baseUrl}api/Login/GetUserInfo/${userId}`),
                    apiFetch(`${baseUrl}api/Profile/GetCountOfAllProjects/${userId}`),
                    apiFetch(`${baseUrl}api/Profile/GetCountOfFinshedProjects/${userId}`),
                    apiFetch(`${baseUrl}api/Profile/GetCurrentProjects/${userId}`),
                    apiFetch(`${baseUrl}api/Profile/GetprevProjcts/${userId}`),
                    apiFetch(`${baseUrl}api/Profile/GetSpecialistNameByUserId/${userId}`)
                ]);

                if (!userRes.ok) throw new Error("فشل في جلب البيانات");

                const userData = await userRes.json();
                const countData = countRes.ok ? await countRes.json() : 0;
                const finishedData = finishedRes.ok ? await finishedRes.json() : 0;
                const currentData = currentRes.ok ? await currentRes.json() : [];
                const prevData = prevRes.ok ? await prevRes.json() : [];
                

                setTimeout(() => {
                    setUser({
                        id: userData.id,
                        name: userData.fullName || userData.name,
                        role: userData.role || "غير محدد",
                        githubUrl: userData.githubUrl || "",
                        bio: userData.bio || "",
                        skills: userData.skills || [],
                        imagePath: userData.imagePath
                    });
                    
                    setProjectsCount(countData?.count ?? countData ?? 0);
                    setFinishedCount(finishedData?.count ?? finishedData ?? 0);
                    setCurrentProjects(Array.isArray(currentData) ? currentData : []);
                    setPrevProjects(Array.isArray(prevData) ? prevData : []);

                    setLoading(false);
                }, 800);

            } catch (error) {
                console.error("Error fetching user data:", error);
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, baseUrl]);
    console.log(user);
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
                    .main-card { border-radius: 20px; border: none; background: white; padding: 25px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
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

                    {/* Left Column */}
                    <div className="col-lg-4">
                        <div className="main-card mb-4">
                            <div className="header-gradient">
                                <div className="avatar-wrapper">
                                    <img 
                                        src={user.imagePath ? `${baseUrl}${user.imagePath}` : 'default-avatar.png'} 
                                        className="profile-img shadow-sm" 
                                        alt="User" 
                                    />
                                </div>
                            </div>
                            
                            <div className="info-section">
                                <h4 className="fw-bold text-dark mb-1">
                                    {user.name} {isOwnProfile && (
                                        <span className="badge bg-secondary-subtle text-secondary fs-6 ms-2">أنت</span>
                                    )}
                                </h4>
                                <p className="text-muted small mb-4">{user.role}</p>

                                <div className="d-flex gap-2 mb-4">
                                    {isOwnProfile ? (
                                        <button 
                                            className="btn btn-outline-dark rounded-pill px-4 fw-bold flex-grow-1 shadow-sm"
                                            onClick={() => navigate('/edit-profile')}
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
                                    
                                    {user.githubUrl && (
                                        <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                                            <i className="bi bi-github fs-5"></i>
                                        </a>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <h6 className="fw-bold text-dark small mb-2">نبذة تعريفية</h6>
                                    <p className="text-secondary small lh-base mb-0">
                                        {user.bio || "لا توجد نبذة تعريفية مضافة."}
                                    </p>
                                </div>

                                <div>
                                    <h6 className="fw-bold text-dark small mb-2">المهارات</h6>
                                <div className="d-flex flex-wrap gap-2">
                                        {user.skills ? (
                                            <span>{user.skills}</span>
                                        ) : (
                                            <span className="text-muted small">لم يتم إضافة مهارات</span>
                                        )}
                                    </div>
                                                                    </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="col-lg-8">

                        {/* Stats */}
                        <div className="row g-3 mb-4 text-center">
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0" style={{ color: mainGreen }}>{projectsCount}</h4>
                                    <small className="text-muted">مسابقة</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0 text-warning">{finishedCount}</h4>
                                    <small className="text-muted">إنجاز</small>
                                </div>
                            </div>
                            <div className="col-4">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0 text-primary">{currentProjects.length}</h4>
                                    <small className="text-muted">فريق</small>
                                </div>
                            </div>
                        </div>

                        {/* Previous Projects */}
                        <div className="main-card mb-4">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-collection text-success"></i> المشاريع السابقة
                            </h6>
                            <div className="row g-3">
                                {prevProjects.length > 0 ? (
                                   prevProjects.map((title, index) => (
                            <div key={index} className="col-md-6">
                                <div className="work-item">
                                <h6 className="fw-bold mb-1 small text-dark">{title}</h6>
                                </div>
                            </div>
                            ))
                                                            ) : (
                                    <p className="text-muted small text-center py-3 mb-0">لا توجد مشاريع مضافة حالياً</p>
                                )}
                            </div>
                        </div>

                        {/* Current / Active Projects */}
                        <div className="main-card">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-activity text-danger"></i> النشاط الحالي
                            </h6>
                              <div className="row g-3">
                                {currentProjects.length > 0 ? (
                                   currentProjects.map((title, index) => (
                            <div key={index} className="col-md-6">
                                <div className="work-item">
                                <h6 className="fw-bold mb-1 small text-dark">{title}</h6>
                                </div>
                            </div>
                            ))
                                      
                                    
                                ) : (
                                    <p className="text-muted small text-center py-2 mb-0">لا توجد أنشطة أو مسابقات جارية حالياً</p>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};
