import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; 
import { apiFetch } from '../api';
export const Profile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, isLoggedIn, logout } = useAuth();

    useEffect(() => {
    
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    const handleLogout = () => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "سيتم إنهاء جلستك الحالية وتضطر لتسجيل الدخول مرة أخرى.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: mainGreen,
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، سجل الخروج',
            cancelButtonText: 'إلغاء',
            reverseButtons: true,
            customClass: { popup: 'rounded-5' }
        }).then((result) => {
            if (result.isConfirmed) {
                logout(); // استدعاء دالة الخروج من السياق
                navigate('/login');
            }
        });
    };

    if (!isLoggedIn || !user) return null;

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
                    .avatar-wrapper { position: absolute; bottom: -60px; right: 30px; }
                    .profile-img { 
                        width: 130px; height: 130px; border-radius: 25px; 
                        border: 6px solid white; background: white;
                        object-fit: cover;
                    }
                    .info-section { margin-top: 10px; }
                    .role-badge {
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
                    .btn-github:hover { transform: translateY(-3px); color: white; }
                    .work-item {
                        border-right: 3px solid ${mainGreen};
                        background: #fdfdfd; padding: 12px 15px; border-radius: 8px;
                        text-decoration: none; display: block; transition: 0.2s;
                    }
                    .work-item:hover { background: #f0f7f4; }
                `}
            </style>

            <div className="profile-container">
                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="main-card mb-4">
                            <div className="header-gradient">
                                <div className="avatar-wrapper">
                                
                                    <img src={user.avatar || 'default-avatar.png'} className="profile-img shadow-sm" alt="User" />
                                </div>
                            </div>
                            
                            <div className="info-section">
                                <h4 className="fw-bold text-dark mb-1">{user.fullName}</h4>
                                <p className="text-muted small mb-3">@{user.userName}</p>
                                
                                <div className="role-badge mb-4">
                                    <i className="bi bi-person-badge-fill"></i> {user.role === 'student' ? 'حساب طالب' : 'حساب مشرف'}
                                </div>

                                <div className="d-flex gap-2 mb-4">
                                    <button 
                                        className="btn text-white rounded-pill px-4 fw-bold flex-grow-1 shadow-sm"
                                        style={{ backgroundColor: mainGreen }}
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i> تعديل البروفايل
                                    </button>
                                    
                                    <a href={user.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                                        <i className="bi bi-github fs-5"></i>
                                    </a>
                                </div>

                                <div className="mb-4 text-end">
                                    <h6 className="fw-bold text-dark small mb-2">مجال العمل والدراسة</h6>
                                    <p className="text-secondary small mb-1"><i className="bi bi-briefcase me-2"></i> {user.workField}</p>
                                    <p className="text-secondary small mb-0"><i className="bi bi-mortarboard me-2"></i> {user.universityMajor}</p>
                                </div>

                                <div className="text-end">
                                    <h6 className="fw-bold text-dark small mb-2">المهارات التقنية</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {user.skills?.map(skill => (
                                            <span key={skill} className="skill-tag">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <hr className="my-4 opacity-50" />
                                <button className="btn btn-sm btn-outline-danger w-100 rounded-pill fw-bold" onClick={handleLogout}>
                                    تسجيل الخروج
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="row g-3 mb-4 text-center">
                            <div className="col-6">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0" style={{ color: mainGreen }}>{user.stats?.points || 0}</h4>
                                    <small className="text-muted fw-600">نقاط التفاعل</small>
                                </div>
                            </div>
                            <div className="col-6">
                                <div className="stat-box">
                                    <h4 className="fw-bold mb-0 text-warning">{user.pastProjects?.length || 0}</h4>
                                    <small className="text-muted fw-600">مشاريع منجزة</small>
                                </div>
                            </div>
                        </div>

                        <div className="main-card mb-4">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-collection text-success"></i> المشاريع السابقة
                            </h6>
                            <div className="row g-3 text-end">
                                {user.pastProjects?.length > 0 ? (
                                    user.pastProjects.map((project, index) => (
                                        <div key={index} className="col-md-6">
                                            <a href={project.link} target="_blank" rel="noreferrer" className="work-item">
                                                <h6 className="fw-bold mb-1 small text-dark">{project.title}</h6>
                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    <i className="bi bi-link-45deg me-1"></i> عرض على GitHub
                                                </span>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small text-center py-3">لا توجد مشاريع مضافة</p>
                                )}
                            </div>
                        </div>

                        <div className="main-card shadow-sm">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                                <i className="bi bi-shield-check text-primary"></i> بيانات التوثيق
                            </h6>
                            <div className="p-4 bg-light bg-opacity-50 rounded-4 border">
                                <div className="row align-items-center">
                                    <div className="col-md-12 text-end">
                                        <h6 className="fw-bold mb-1 small text-muted">البريد الجامعي الموثق</h6>
                                        <p className="text-dark fw-bold mb-0" style={{ wordBreak: 'break-all' }}>{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
