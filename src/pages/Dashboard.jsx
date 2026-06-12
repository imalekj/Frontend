import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';
import { AppColors } from '../theme/AppColors';

export const Dashboard = () => {
    const navigate = useNavigate();
    const [competitions, setCompetitions] = useState([]);
    const [myTeams, setMyTeams] = useState([]);
    const [loading, setLoading] = useState(false);
    const [teamsLoading, setTeamsLoading] = useState(false);
    const { user, token } = useAuth();
    const isLoggedIn = !!token;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchCompetitions = async () => {
            setLoading(true);
            try {
                const res = await apiFetch(`${baseUrl}api/Posts/GetAllProject`, {
                    method: "GET",
                    headers: { "Accept": "*/*" }
                });
                const data = await res.json();
                
                const dataArray = Array.isArray(data) ? data : [];
                
                // الوقت الحالي للمقارنة والتحقق من التواريخ المنتهية
                const now = new Date();

                const formatted = dataArray
                    .map(comp => ({
                        id: comp.projectID,
                        title: comp.name,
                        description: comp.descriptions,
                        rating: comp.rating,
                        isGraduation: comp.isGraduationProject,
                        endDate: comp.endDate,
                        skills: comp.skills,
                        availableSeats: comp.numberOfAvailableSeats,
                        location: comp.projectLocation,
                        teamType: comp.teamType,
                        // نستخدم تاريخ الإنشاء أو تاريخ الانتهاء للترتيب إذا لم يتوفر الموعد الأصلي
                        creationDate: comp.creationDate || comp.id 
                    }))
                    // 1. تصفية المسابقات: إظهار الفعالة فقط (التي تاريخ انتهائها مستقبلي أو غير محدد "مفتوح")
                    .filter(comp => {
                        if (!comp.endDate) return true; // إذا لم يوجد تاريخ انتهاء تعتبر فعالة دائماً
                        return new Date(comp.endDate) >= now;
                    })
                    // 2. الترتيب وفق الأحدث: ترتيب تنازلي (من الأحدث للأقدم)
                    // ملاحظة: إذا كان الـ API يوفر حقل مثل creationDate يفضل استخدامه، هنا رتبنا بحسب تاريخ الانتهاء أو المعرّف كبديل.
                    .sort((a, b) => {
                        const dateA = a.endDate ? new Date(a.endDate) : 0;
                        const dateB = b.endDate ? new Date(b.endDate) : 0;
                        return dateB - dateA; // الأحدث ينتهي أولاً أو المضاف حديثاً
                    });

                setCompetitions(formatted);
            } catch (err) {
                console.error("Error fetching competitions:", err);
                setCompetitions([]);
            } finally {
                setLoading(false);
            }
        };
        fetchCompetitions();
    }, [baseUrl]);

    useEffect(() => {
        const fetchMyTeams = async () => {
            if (!isLoggedIn) return;
            setTeamsLoading(true);
            try {
                const res = await apiFetch(`${baseUrl}api/Teams/GetMyTeams`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Accept": "*/*"
                    }
                });
                
                if (res.ok) {
                    const data = await res.json();
                    const teamsArray = Array.isArray(data) ? data : [];
                    
                    const formattedTeams = teamsArray.map(team => ({
                        id: team.teamID || team.id,
                        name: team.teamName || team.name,
                        projectName: team.projectName || "قيد المراجعة"
                    }));
                    
                    setMyTeams(formattedTeams);
                } else {
                    setMyTeams([]);
                }
            } catch (err) {
                console.error("Error fetching my teams:", err);
                setMyTeams([]);
            } finally {
                setTeamsLoading(false);
            }
        };
        fetchMyTeams();
    }, [isLoggedIn, token, baseUrl]);

    const handleJoinClick = (id) => {
        if (!isLoggedIn) {
            Swal.fire({
                title: '<span style="font-family: Cairo">خطوة واحدة تفصلك!</span>',
                html: '<p style="font-family: Cairo">يجب تسجيل الدخول باستخدام بريدك الجامعي لتتمكن من الانضمام للفرق.</p>',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: AppColors.primaryGreen,
                cancelButtonColor: '#6e7881',
                confirmButtonText: 'تسجيل الدخول',
                cancelButtonText: 'تصفح كزائر',
                reverseButtons: true,
                customClass: { popup: 'rounded-4' }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
        } else {
            navigate(`/competition/${id}`);
        }
    };

    return (
        <div className="dashboard-wrapper min-vh-100 text-end bg-light" dir="rtl">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                    body { font-family: 'Cairo', sans-serif; color: #2c3e50; }
                    
                    .hero-section { 
                        background: linear-gradient(135deg, #ffffff 0%, #f4f8f6 100%); 
                        padding: 120px 0 90px 0; 
                        position: relative;
                        overflow: hidden;
                        border-bottom: 1px solid #eef2f0; 
                    }
                    .bg-icon-person {
                        position: absolute; left: 6%; top: 50%; transform: translateY(-50%);
                        font-size: 20rem; color: ${AppColors.primaryGreen}; opacity: 0.08; z-index: 1;
                    }
                    .bg-icon-trophy {
                        position: absolute; left: 22%; top: 25%;
                        font-size: 6rem; color: ${AppColors.primaryGreen}; opacity: 0.12; z-index: 1;
                        transform: rotate(15deg);
                    }
                    .hero-title { font-size: 3rem; font-weight: 900; color: #1a2a23; line-height: 1.2; z-index: 2; position: relative; }
                    .hero-title span { color: ${AppColors.primaryGreen}; }
                    .hero-subtitle { color: #5a6c64; font-size: 1.15rem; max-width: 650px; line-height: 1.8; z-index: 2; position: relative; }

                    .btn-prime { background-color: ${AppColors.primaryGreen}; color: white; border-radius: 12px; padding: 12px 35px; font-weight: 700; border: none; transition: 0.3s ease; cursor: pointer; }
                    .btn-prime:hover { background-color: #124130; transform: translateY(-2px); box-shadow: 0 5px 15px rgba(26,93,68,0.15); }
                    .btn-ghost { background: white; color: ${AppColors.primaryGreen}; border: 2px solid ${AppColors.primaryGreen}; border-radius: 12px; padding: 10px 35px; font-weight: 700; transition: 0.3s ease; cursor: pointer; text-decoration: none; display: inline-block; }
                    .btn-ghost:hover { background: ${AppColors.primaryGreen}; color: white; transform: translateY(-2px); }

                    .btn-see-more {
                        background-color: white;
                        color: ${AppColors.primaryGreen};
                        border: 1px solid #e2e8f0;
                        font-weight: 700;
                        font-size: 0.85rem;
                        padding: 6px 18px;
                        border-radius: 50px;
                        transition: all 0.2s ease;
                        cursor: pointer;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.02);
                    }
                    .btn-see-more:hover {
                        background-color: ${AppColors.primaryGreen};
                        color: white;
                        border-color: ${AppColors.primaryGreen};
                        transform: translateX(-3px);
                        box-shadow: 0 4px 12px rgba(26, 93, 68, 0.15);
                    }

                    .comp-card {
                        background: white;
                        border: 1px solid #e2e8f0;
                        border-radius: 16px;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        display: flex;
                        flex-direction: column;
                        height: 100%;
                    }
                    .comp-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 30px rgba(0,0,0,0.06);
                        border-color: ${AppColors.primaryGreen};
                    }
                    .card-badge {
                        background: rgba(26, 93, 68, 0.06);
                        color: ${AppColors.primaryGreen};
                        font-weight: 700;
                        font-size: 0.8rem;
                        padding: 5px 12px;
                        border-radius: 8px;
                    }
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; border-radius: 20px !important; }
                `}
            </style>

            <div className="hero-section bg-white">
                <i className="bi bi-person-fill bg-icon-person"></i>
                <i className="bi bi-trophy-fill bg-icon-trophy"></i>
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-9">
                            <h1 className="hero-title mb-3">
                                منصة <span>فـريـقـي</span> <br />
                                <span className="fs-2 text-dark fw-bold">بوابتك الذكية لتشكيل وإدارة الفرق الطلابية</span>
                            </h1>
                            <p className="hero-subtitle mb-4 text-muted">
                                المظلة الأكاديمية الشاملة لطلبة جامعة الزيتونة الأردنية بكافة كلياتها وتخصصاتها، والمصممة لمساعدتك في بناء فرق متكاملة لمشاريع التخرج والمسابقات المتنوعة.
                            </p>
                            <div className="d-flex gap-3 justify-content-start">
                                {isLoggedIn ? (
                                    <button className="btn-prime shadow-sm" onClick={() => navigate('/competitions')}>
                                        استكشف الفرص المتاحة
                                    </button>
                                ) : (
                                    <>
                                        <button className="btn-prime shadow-sm" onClick={() => navigate('/login')}>
                                            ابدأ رحلتك الآن
                                        </button>
                                        <button className="btn-ghost" onClick={() => navigate('/setup-profile')}>
                                            إنشاء حساب جديد
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="fw-bold mb-0" style={{ borderRight: `4px solid ${AppColors.primaryGreen}`, paddingRight: '12px' }}>
                        المسابقات والمشاريع النشطة
                    </h4>
                    <button className="btn-see-more shadow-sm d-flex align-items-center gap-1" onClick={() => navigate('/competitions')}>
                        عرض المزيد <i className="bi bi-arrow-left small"></i>
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-5">
                        <div className="spinner-border text-success" role="status"></div>
                        <p className="text-muted mt-2 small">جاري تحميل المنشورات المتاحة...</p>
                    </div>
                ) : competitions.length === 0 ? (
                    <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                        <i className="bi bi-folder-x text-muted display-4 d-block mb-3"></i>
                        <h6 className="fw-bold text-secondary">لا توجد مسابقات نشطة حالياً</h6>
                        <p className="text-muted small mb-0">جميع المسابقات السابقة انتهت صلاحيتها وجاري التحضير لمسابقات جديدة.</p>
                    </div>
                ) : (
                    <div className="row g-4">
                        {competitions.slice(0, 6).map(comp => (
                            <div key={comp.id} className="col-md-6 col-lg-4">
                                <div className="comp-card p-4 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-start mb-3">
                                            <span className="card-badge">
                                                {comp.isGraduation ? "مشروع تخرج" : "مسابقة"}
                                            </span>
                                            <small className="text-muted fw-bold">
                                                <i className="bi bi-calendar2-event ms-1"></i>
                                                {comp.endDate ? new Date(comp.endDate).toLocaleDateString() : "مفتوح"}
                                            </small>
                                        </div>
                                        <h5 className="fw-bold text-dark mb-2 lh-base">{comp.title}</h5>
                                        <p className="text-muted small mb-3" style={{ height: '42px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                                            {comp.description || "لا يوجد تفاصيل إضافية حول هذا الإعلان."}
                                        </p>
                                    </div>

                                    <div className="border-top pt-3 mt-2">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <span className="small text-secondary fw-bold">
                                                <i className="bi bi-person-plus ms-1 text-success"></i> 
                                                المقاعد المتاحة: {comp.availableSeats || 0}
                                            </span>
                                            {comp.teamType && (
                                                <span className="badge bg-light text-muted border small">{comp.teamType}</span>
                                            )}
                                        </div>
                                        <div className="row g-2">
                                            <div className="col-4">
                                                <button className="btn btn-light btn-sm w-100 py-2 fw-bold border rounded-3" onClick={() => navigate(`/competition/${comp.id}`)}>
                                                    التفاصيل
                                                </button>
                                            </div>
                                            <div className="col-8">
                                                <button className="btn-prime btn-sm w-100 py-2 rounded-3 text-center fs-7" onClick={() => handleJoinClick(comp.id)}>
                                                    طلب انضمام
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {isLoggedIn && (
                    <div className="mt-5 pt-4">
                        <h4 className="fw-bold mb-4" style={{ borderRight: `4px solid ${AppColors.primaryGreen}`, paddingRight: '12px' }}>
                            الفرق التي تنتمي إليها
                        </h4>
                        {teamsLoading ? (
                            <div className="text-center py-4 bg-white rounded-4 border">
                                <div className="spinner-border spinner-border-sm text-success"></div>
                            </div>
                        ) : myTeams.length === 0 ? (
                            <div className="text-center py-5 bg-white rounded-4 border shadow-sm">
                                <i className="bi bi-people text-light display-4 d-block mb-3"></i>
                                <h6 className="fw-bold text-secondary">لم تنضم إلى أي فريق حتى الآن</h6>
                                <p className="text-muted small mb-0">ابدأ بتقديم طلبات انضمام للمشاريع المتاحة في الأعلى.</p>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {myTeams.map(team => (
                                    <div key={team.id} className="col-md-6 col-lg-4">
                                        <div className="p-3 bg-white border rounded-4 d-flex align-items-center justify-content-between shadow-sm">
                                            <div className="d-flex align-items-center gap-3">
                                                <div className="bg-success bg-opacity-10 rounded-3 p-2.5 text-success">
                                                    <i className="bi bi-shield-check fs-4"></i>
                                                </div>
                                                <div>
                                                    <h6 className="fw-bold mb-1 text-dark">{team.name}</h6>
                                                    <small className="text-muted d-block">مشروع: {team.projectName}</small>
                                                </div>
                                            </div>
                                            <button className="btn btn-sm btn-light border rounded-3 fw-bold px-3" onClick={() => navigate('/my-teams')}>
                                                إدارة
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;