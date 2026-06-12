import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; 
import { AppColors } from '../theme/AppColors';

export const Profile = () => {
    const navigate = useNavigate();
    const mainGreen = AppColors.primaryGreen || '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, isLoggedIn, logout } = useAuth();
    console.log("البيانات القادمة من الـ AuthContext:", user);

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
                logout(); 
                navigate('/login');
            }
        });
    };

    // دالة لتحديد أيقونة ونوع الرابط المضاف ديناميكياً
    const getLinkDetails = (url) => {
        if (!url) return null;
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("github.com")) return { icon: "bi-github", text: "GitHub" };
        if (lowerUrl.includes("linkedin.com")) return { icon: "bi-linkedin", text: "LinkedIn" };
        if (lowerUrl.includes("instagram.com")) return { icon: "bi-instagram", text: "Instagram" };
        if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return { icon: "bi-youtube", text: "YouTube" };
        return { icon: "bi-link-45deg", text: "الرابط الشخصي" };
    };

    if (!isLoggedIn || !user) return null;

    // استخراج الرابط المضاف سواء كان مخزناً في url أو githubUrl
    const userTargetLink = user.url || user.githubUrl;
    const linkDetails = getLinkDetails(userTargetLink);

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
                    .user-added-link {
                        display: inline-flex;
                        align-items: center;
                        gap: 6px;
                        text-decoration: none;
                        font-size: 0.85rem;
                        font-weight: 600;
                        color: ${mainGreen};
                        background: #f0f7f4;
                        padding: 6px 14px;
                        border-radius: 8px;
                        transition: 0.2s;
                    }
                    .user-added-link:hover {
                        background: ${mainGreen};
                        color: white !important;
                    }
                    .stat-box { 
                        background: #f8fafc; border: 1px solid #f1f5f9; 
                        border-radius: 18px; padding: 15px; transition: 0.3s;
                    }
                    .skill-tag { 
                        background: #f1f5f9; color: #475569; padding: 6px 14px; 
                        border-radius: 8px; font-size: 0.75rem; font-weight: 600;
                    }
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
                                <p className="text-muted small mb-2">@{user.userName}</p>
                                
                                {/* إظهار الرابط المضاف من قبل المستخدم مباشرة أسفل الاسم */}
                                {linkDetails && (
                                    <div className="mb-3">
                                        <a href={userTargetLink} target="_blank" rel="noopener noreferrer" className="user-added-link">
                                            <i className={`bi ${linkDetails.icon}`}></i>
                                            {linkDetails.text}
                                        </a>
                                    </div>
                                )}
                                
                                <div className="role-badge mb-4">
                                    <i className="bi bi-person-badge-fill"></i> {user.role === 'student' ? 'حساب طالب' : 'حساب مشرف'}
                                </div>

                                <div className="d-flex mb-4">
                                    <button 
                                        className="btn text-white rounded-pill px-4 fw-bold flex-grow-1 shadow-sm ms-2"
                                        style={{ backgroundColor: mainGreen }}
                                        onClick={() => navigate('/edit-profile')}
                                    >
                                        <i className="bi bi-pencil-square me-2"></i> تعديل البروفايل
                                    </button>
                                </div>

                                <div className="mb-4 text-end">
                                    <h6 className="fw-bold text-dark small mb-2">البيانات الأكاديمية والمهنية</h6>
                                    {user.faculty && (
                                        <p className="text-secondary small mb-1">
                                            <i className="bi bi-building me-2"></i> {user.faculty}
                                        </p>
                                    )}
                                    <p className="text-secondary small mb-1">
                                        <i className="bi bi-mortarboard me-2"></i> {user.universityMajor || "غير محدد"}
                                    </p>
                                    <p className="text-secondary small mb-0">
                                        <i className="bi bi-briefcase me-2"></i> {user.workField || "لم يتم تحديد مجال التركيز"}
                                    </p>
                                </div>

                                <div className="text-end">
                                    <h6 className="fw-bold text-dark small mb-2">المهارات والاهتمامات التقنية</h6>
                                    <div className="d-flex flex-wrap gap-2">
                                        {user.skills && user.skills.length > 0 ? (
                                            user.skills.map(skill => (
                                                <span key={skill} className="skill-tag">{skill}</span>
                                            ))
                                        ) : (
                                            <span className="text-muted small">لم يتم إضافة مهارات بعد</span>
                                        )}
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
                                    <small className="text-muted fw-600">أعمال ومشاريع منجزة</small>
                                </div>
                            </div>
                        </div>

                        <div className="main-card mb-4">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2">
                                <i className="bi bi-collection text-success"></i> المعرض والأعمال السابقة
                            </h6>
                            <div className="row g-3 text-end">
                                {user.pastProjects && user.pastProjects.length > 0 ? (
                                    user.pastProjects.map((project, index) => (
                                        <div key={index} className="col-md-6">
                                            <a href={project.link} target="_blank" rel="noreferrer" className="work-item">
                                                <h6 className="fw-bold mb-1 small text-dark">{project.title}</h6>
                                                <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                                                    <i className="bi bi-box-arrow-up-right me-1"></i> عرض تفاصيل العمل
                                                </span>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small text-center py-3">لا توجد أعمال مضافة حالياً</p>
                                )}
                            </div>
                        </div>

                        <div className="main-card shadow-sm">
                            <h6 className="fw-bold mb-4 d-flex align-items-center gap-2 text-dark">
                                <i className="bi bi-shield-check text-primary"></i> بيانات الحساب والتوثيق
                            </h6>
                            <div className="p-4 bg-light bg-opacity-50 rounded-4 border">
                                <div className="row align-items-center">
                                    <div className="col-md-12 text-end">
                                        <h6 className="fw-bold mb-1 small text-muted">البريد الإلكتروني المعتمد</h6>
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