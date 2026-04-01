import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Profile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const isLoggedIn = true; 

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
        }
    }, [isLoggedIn, navigate]);

    // هذه البيانات الآن متوافقة تماماً مع بنية formData في SetupProfile
    const user = {
        fullName: "مالك جابر",
        userName: "malek_jaber",
        email: "202110456@std.zuj.edu.jo",
        role: "student", // أو 'supervisor'
        universityMajor: "هندسة البرمجيات",
        workField: "Full Stack Developer",
        githubUrl: "https://github.com/malek-jaber",
        avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
        skills: ["React.js", "Node.js", "Tailwind CSS", "MySQL", "JavaScript"],
        pastProjects: [
            { title: "نظام إدارة المكتبات", link: "https://github.com/..." },
            { title: "تطبيق التوصيل الجامعي", link: "https://github.com/..." }
        ],
        stats: { competitions: 12, points: 1250 }
    };

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
            if (result.isConfirmed) navigate('/login');
        });
    };

    if (!isLoggedIn) return null;

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
                        border: 6px solid rgba(255,255,255,0.2); background: white; object-fit: cover;
                    }
                    .role-badge {
                        background: ${user.role === 'student' ? '#ffc107' : '#0dcaf0'};
                        color: #000; padding: 4px 12px; border-radius: 8px;
                        font-size: 0.75rem; font-weight: 800; text-transform: uppercase;
                        margin-bottom: 10px; display: inline-block;
                    }
                    .stat-card { 
                        background: white; border: 1px solid #f0f0f0; 
                        border-radius: 20px; padding: 20px; transition: 0.3s;
                    }
                    .skill-badge { 
                        background: #f0f7f4; color: ${mainGreen}; padding: 8px 18px; 
                        border-radius: 12px; font-size: 0.8rem; font-weight: 700;
                    }
                    .project-link {
                        text-decoration: none; color: inherit;
                    }
                    .project-item { 
                        background: #f8fafc; border-radius: 20px; padding: 20px; transition: 0.3s; border: 1px solid transparent;
                    }
                    .project-item:hover { border-color: ${mainGreen}; background: white; transform: scale(1.02); }
                `}
            </style>

            <div className="profile-container">
                <div className="row g-4">
                    
                    {/* العمود الجانبي: المعلومات الأساسية */}
                    <div className="col-lg-4">
                        <div className="main-card shadow-sm text-center">
                            <div className="header-box shadow-sm">
                                <span className="role-badge">
                                    {user.role === 'student' ? 'حساب طالب' : 'حساب مشرف'}
                                </span>
                                <br/>
                                <img src={user.avatar} className="profile-img shadow mb-3" alt="User" />
                                <h4 className="fw-900 mb-1">{user.fullName}</h4>
                                <p className="small opacity-75 mb-3">@{user.userName}</p>
                                
                                <div className="d-grid gap-2 mt-4">
                                    <button className="btn btn-light rounded-pill py-2 fw-bold" onClick={() => navigate('/edit-profile')}>
                                        <i className="bi bi-pencil-square me-2"></i> تعديل البروفايل
                                    </button>
                                    <button className="btn btn-link text-white text-decoration-none small opacity-75" onClick={handleLogout}>
                                        تسجيل الخروج
                                    </button>
                                </div>
                            </div>

                            <div className="text-end mb-4">
                                <h6 className="fw-900 text-dark mb-2">مجال التخصص والعمل</h6>
                                <p className="text-secondary small mb-1"><i className="bi bi-briefcase me-2"></i> {user.workField}</p>
                                <p className="text-secondary small"><i className="bi bi-mortarboard me-2"></i> {user.universityMajor}</p>
                            </div>

                            <div className="text-end">
                                <h6 className="fw-900 text-dark mb-3">المهارات المضافة</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {user.skills.map(skill => (
                                        <span key={skill} className="skill-badge">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* العمود الرئيسي: الإحصائيات والمشاريع */}
                    <div className="col-lg-8">
                        
                        <div className="row g-3 mb-4 text-center">
                            <div className="col-md-6">
                                <div className="stat-card shadow-sm border-end border-4 border-success">
                                    <h3 className="fw-900 mb-0 text-success">{user.stats.points}</h3>
                                    <small className="text-muted fw-bold">نقاط التفاعل</small>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="stat-card shadow-sm border-end border-4 border-warning">
                                    <h3 className="fw-900 mb-0 text-warning">{user.pastProjects.length}</h3>
                                    <small className="text-muted fw-bold">مشاريع منجزة</small>
                                </div>
                            </div>
                        </div>

                        <div className="main-card shadow-sm mb-4">
                            <h5 className="fw-900 mb-4 border-bottom pb-3">المشاريع السابقة</h5>
                            <div className="row g-3">
                                {user.pastProjects.length > 0 ? (
                                    user.pastProjects.map((project, index) => (
                                        <div key={index} className="col-md-6">
                                            <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                                                <div className="project-item">
                                                    <h6 className="fw-900 mb-2">{project.title}</h6>
                                                    <p className="text-muted small mb-0">
                                                        <i className="bi bi-link-45deg me-1"></i> عرض المشروع على GitHub
                                                    </p>
                                                </div>
                                            </a>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted text-center py-3">لا توجد مشاريع مضافة حالياً</p>
                                )}
                            </div>
                        </div>

                        <div className="main-card shadow-sm">
                            <h5 className="fw-900 mb-4 text-dark border-bottom pb-3">بيانات التواصل والتوثيق</h5>
                            <div className="p-4 bg-light rounded-4">
                                <div className="row align-items-center">
                                    <div className="col-md-8">
                                        <h6 className="fw-900 mb-2">البريد الجامعي الموثق:</h6>
                                        <p className="text-success fw-bold mb-3 mb-md-0" style={{wordBreak: 'break-all'}}>{user.email}</p>
                                    </div>
                                    <div className="col-md-4 text-md-start">
                                        {user.githubUrl && (
                                            <a href={user.githubUrl} target="_blank" rel="noreferrer" className="btn btn-dark rounded-pill px-4 fw-bold">
                                                <i className="bi bi-github me-2"></i> GitHub Profile
                                            </a>
                                        )}
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