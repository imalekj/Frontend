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
    const user = {
        name: "مالك جابر",
        id: "202110456",
        role: "سنة ثالثة - Full Stack Developer",
        major: "علم حاسوب",
        bio: "مطور واجهات أمامية شغوف ببناء تجارب مستخدم فريدة تخدم مجتمع جامعة الزيتونة الأردنية، أطمح للفوز بالمسابقات البرمجية العالمية.",
        rating: 4.9,
        points: 1250,
        rank: 12,
        github: "https://github.com/ahmed-momani",
        avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg", 
        skills: ["React.js", "UI/UX", "JavaScript", "Node.js", "Tailwind CSS"],
        stats: { competitions: 12, wins: 3, teams: 8 },
        projects: [
            { id: 1, title: "نظام إدارة المكتبات", tech: "React & Firebase" },
            { id: 2, title: "تطبيق التوصيل الجامعي", tech: "Node.js & MySQL" }
        ]
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
                    .project-item { 
                        background: #f8fafc; border-radius: 20px; padding: 20px; transition: 0.3s; border: 1px solid transparent;
                    }
                    .project-item:hover { border-color: ${mainGreen}; background: white; }
                `}
            </style>

            <div className="profile-container">
                <div className="row g-4">
                    
                    <div className="col-lg-4">
                        <div className="main-card shadow-sm text-center">
                            <div className="header-box shadow-sm">
                                <img src={user.avatar} className="profile-img shadow mb-3" alt="User" />
                                <h4 className="fw-900 mb-1">{user.name}</h4>
                                <p className="small opacity-75 mb-3">{user.role}</p>
                                
                                <div className="rating-badge mb-4">
                                    <i className="bi bi-star-fill text-warning me-1"></i> {user.rating} تقييم الأداء
                                </div>

                                <div className="d-grid gap-2">
                                    <button className="btn btn-light rounded-pill py-2 fw-bold" onClick={() => navigate('/edit-profile')}>
                                        <i className="bi bi-pencil-square me-2"></i> تعديل بياناتي
                                    </button>
                                    <button className="btn btn-link text-white text-decoration-none small opacity-75" onClick={handleLogout}>
                                        تسجيل الخروج
                                    </button>
                                </div>
                            </div>

                            <div className="text-end mb-4">
                                <h6 className="fw-900 text-dark mb-3">النبذة التعريفية</h6>
                                <p className="text-secondary small lh-lg mb-0">{user.bio}</p>
                            </div>

                            <div className="text-end">
                                <h6 className="fw-900 text-dark mb-3">المهارات والقدرات</h6>
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
                                    <small className="text-muted fw-bold">مسابقة شاركت بها</small>
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="stat-card shadow-sm">
                                    <h3 className="fw-900 mb-0 text-warning">{user.stats.wins}</h3>
                                    <small className="text-muted fw-bold">إنجاز وفوز</small>
                                </div>
                            </div>
                            <div className="col-md-4 col-12">
                                <div className="stat-card shadow-sm">
                                    <h3 className="fw-900 mb-0 text-primary">{user.points}</h3>
                                    <small className="text-muted fw-bold">نقطة في رصيدك</small>
                                </div>
                            </div>
                        </div>

                
                        <div className="main-card shadow-sm mb-4">
                            <h5 className="fw-900 mb-4 border-bottom pb-3">مشاريعك البرمجية</h5>
                            <div className="row g-3">
                                {user.projects.map(work => (
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
                            <h5 className="fw-900 mb-4 text-dark border-bottom pb-3">بيانات التوثيق الجامعي</h5>
                            <div className="p-4 d-flex justify-content-between align-items-center flex-wrap gap-3 border-end border-success border-4 bg-light rounded-4">
                                <div>
                                    <h6 className="fw-900 mb-1 fs-5">الرقم الجامعي: {user.id}</h6>
                                    <div className="d-flex gap-3 mt-1 small fw-bold text-muted">
                                        <span><i className="bi bi-mortarboard me-1"></i> {user.major}</span>
                                        <span><i className="bi bi-patch-check-fill text-success me-1"></i> حساب موثق</span>
                                    </div>
                                </div>
                                <a href={user.github} target="_blank" rel="noreferrer" className="btn btn-dark rounded-pill px-4 fw-bold">
                                    <i className="bi bi-github me-2"></i> ملف GitHub
                                </a>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};