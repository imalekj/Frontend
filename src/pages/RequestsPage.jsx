import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { AppColors } from '../theme/AppColors';

export const RequestsPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const mainGreen = AppColors.primaryGreen || '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, token } = useAuth();
    const isLoggedIn = !!token;
        
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isProject, setIsProject] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('/login');
            return;
        }

        const fetchPostAndRequests = async () => {
            try {
                setLoading(true);

                const postRes = await apiFetch(`${baseUrl}api/Posts/GetProjectById?id=${id}`);
                if (postRes.ok) {
                    const postData = await postRes.json();
                    setIsProject(postData.isGraduationProject === true);
                }

                const response = await apiFetch(
                    `${baseUrl}api/PostRequests/GetAllRequestsByProjectID?ProjectID=${id}`,
                    {
                        method: 'GET',
                        headers: {
                            'accept': '*/*',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("فشل في جلب البيانات");
                }

                const data = await response.json();
                
                setRequests(
                    data.map(item => ({
                        userId: item.id, 
                        participationID: item.participationID, 
                        name: item.fullName,
                        avatar: item.imagePath ? `https://localhost:7011${item.imagePath}` : null,
                        major: item.major || "غير محدد",
                        skills: item.skills || [],
                        message: item.message || "لا يوجد رسالة توضيحية مرفقة",
                        registrationType: item.registrationType || 'individual',
                        teamName: item.teamName || '',
                        teamMembers: item.teamMembers || []
                    }))
                );

            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء جلب قائمة الطلبات'
                });
            } finally {
                setLoading(false);
            }
        };
            
        fetchPostAndRequests();
    }, [id, isLoggedIn, navigate, token, baseUrl]);

    const handleAction = async (request, action) => {
        const isAccept = action === 'accept';
        const displayTargetName = request.registrationType === 'team' ? `فريق (${request.teamName})` : request.name;

        const result = await Swal.fire({
            title: isAccept ? 'تأكيد القبول' : 'تأكيد الرفض',
            text: isAccept
                ? `هل أنت متأكد من قبول وانضمام ${displayTargetName}؟`
                : `هل تريد رفض طلب ${displayTargetName}؟`,
            icon: isAccept ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: isAccept ? mainGreen : '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: isAccept ? 'نعم، قبول' : 'نعم، رفض',
            cancelButtonText: 'إلغاء',
        });

        if (!result.isConfirmed) return;

        try {
            Swal.fire({
                title: 'جاري المعالجة...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            if (isAccept) {
                const subscribeRes = await apiFetch(
                    `${baseUrl}api/PostRequests/subscribeToProject?Projectid=${id}&userId=${request.userId}`,
                    {
                        method: 'POST',
                        headers: {
                            accept: '*/*',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!subscribeRes.ok) throw new Error('Subscribe failed');

                const statusRes = await apiFetch(
                    `${baseUrl}api/PostRequests/UpdateStatus`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            participationID: request.participationID,
                            status: 2
                        })
                    }
                );

                if (!statusRes.ok) throw new Error('Status update failed');

                setRequests(prev => prev.filter(req => req.participationID !== request.participationID));

                Swal.fire({
                    icon: 'success',
                    title: 'تم قبول الطلب بنجاح',
                    timer: 1500,
                    showConfirmButton: false,
                });

            } else {
                const statusRes = await apiFetch(
                    `${baseUrl}api/PostRequests/UpdateStatus`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({
                            participationID: request.participationID,
                            status: 1
                        })
                    }
                );

                if (!statusRes.ok) throw new Error();

                setRequests(prev => prev.filter(req => req.participationID !== request.participationID));

                Swal.fire({
                    icon: 'info',
                    title: 'تم رفض الطلب',
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'خطأ',
                text: 'حدث خطأ أثناء معالجة حالة الطلب الإلكتروني',
            });
        }
    };

    const getDefaultAvatar = (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

    if (!isLoggedIn) return null;

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 text-success fw-bold fs-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                جاري جلب وفهرسة طلبات الانضمام المعلقة...
            </div>
        );
    }
        
    return (
        <div className="container py-5 min-vh-100" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .request-card { border-radius: 22px; transition: all 0.3s ease; border: 1px solid #f1f5f9; }
                    .request-card:hover { transform: translateY(-5px); box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; }
                    .avatar-frame { width: 65px; height: 65px; border-radius: 18px; object-fit: cover; border: 2px solid #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }
                    .skill-tag { font-size: 0.75rem; padding: 5px 12px; border-radius: 10px; background: #f8fafc; color: ${mainGreen}; font-weight: 700; border: 1px solid #e2e8f0; }
                    .message-box { background: #f0fdf4; border-right: 4px solid ${mainGreen}; }
                    .empty-state { padding: 100px 0; background: white; border-radius: 30px; border: 2px dashed #e2e8f0; }
                    .swal2-container { font-family: 'Cairo', sans-serif !important; }
                    .team-badge { background-color: #f1f5f9; color: #334155; border-radius: 10px; padding: 6px 14px; font-size: 0.85rem; display: inline-flex; align-items: center; }
                    .member-chip { background: #ffffff; border: 1px solid #cbd5e1; color: #475569; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; margin-left: 4px; display: inline-block; }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4 animate__animated animate__fadeInDown">
                <div className="text-end">
                    <h2 className="fw-bold mb-2" style={{ color: mainGreen }}>
                        <i className="bi bi-person-lines-fill ms-2"></i>إدارة طلبات الانضمام
                    </h2>
                    <p className="text-muted small">
                        {isProject 
                            ? `مرحباً ${user?.fullName?.split(' ')[0]}، يمكنك مراجعة طلبات الطلاب الفردية الراغبين بالعمل في مشروع التخرج.` 
                            : `مرحباً ${user?.fullName?.split(' ')[0]}، تدار هنا طلبات التسجيل الفردية والجماعية الخاصة بالمسابقة.`
                        }
                    </p>
                </div>
                <button onClick={() => navigate(-1)} className="btn btn-white shadow-sm rounded-pill px-4 fw-bold border">
                    <i className="bi bi-arrow-right ms-2"></i> العودة للخلف
                </button>
            </div>

            <div className="row g-4">
                {requests.length > 0 ? (
                    requests.map((req, index) => (
                        <div className="col-12 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }} key={req.participationID} >
                            <div className="card request-card shadow-sm p-4 bg-white border-0">
                                <div className="row align-items-center">
                                    
                                    <div className="col-lg-4 d-flex align-items-start gap-3">
                                        <img 
                                            src={req.avatar || getDefaultAvatar(req.userId)} 
                                            className="avatar-frame shadow-sm mt-1" 
                                            alt={req.name}
                                        />
                                        <div className="text-end w-100">
                                            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
                                                <h6 className="fw-bold mb-0 text-dark">{req.name}</h6>
                                                {!isProject && req.registrationType === 'team' && (
                                                    <span className="badge bg-success bg-opacity-10 text-success fw-bold px-2 py-1 rounded-3 small">
                                                        <i className="bi bi-people-fill me-1"></i> طلب فريق
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <p className="text-muted mb-2 small fw-bold">
                                                <i className="bi bi-mortarboard me-1"></i> {req.major}
                                            </p>

                                            {!isProject && req.registrationType === 'team' && req.teamName && (
                                                <div className="team-badge fw-bold mb-2 w-100 d-block text-start">
                                                    <div className="mb-1 text-success"><i className="bi bi-tags-fill me-1"></i> اسم الفريق: {req.teamName}</div>
                                                    {req.teamMembers && req.teamMembers.length > 0 && (
                                                        <div className="mt-1">
                                                            {req.teamMembers.map((member, mIdx) => (
                                                                <span key={mIdx} className="member-chip shadow-sm">
                                                                    <i className="bi bi-person me-1"></i>{member}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="d-flex flex-wrap gap-1">
                                                {req.skills.map(skill => (
                                                    <span key={skill} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-5 my-3 my-lg-0">
                                        <div className="p-3 rounded-4 message-box small text-secondary h-100 d-flex align-items-center">
                                            <div>
                                                <i className="bi bi-chat-quote-fill ms-2 text-success opacity-50 fs-5 d-block mb-1"></i>
                                                <span className="text-dark fw-semibold">"{req.message}"</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-3">
                                        <div className="d-flex justify-content-lg-end gap-2 align-items-center">
                                            <button 
                                                onClick={() => handleAction(req, 'accept')}
                                                className="btn btn-success rounded-4 px-3 fw-bold flex-grow-1 shadow-sm border-0 py-2"
                                                style={{ background: mainGreen }}
                                            >
                                                <i className="bi bi-check-circle-fill me-1"></i> قبول وانضمام
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleAction(req, 'reject')}
                                                className="btn btn-outline-danger rounded-4 border-2 py-2"
                                                style={{ width: '48px' }}
                                                title="رفض الطلب"
                                            >
                                                <i className="bi bi-x-circle"></i>
                                            </button>

                                            <button 
                                                onClick={() => navigate(`/chat/${req.userId}`)}
                                                className="btn btn-light rounded-4 border text-primary py-2"
                                                style={{ width: '48px' }}
                                                title="بدء محادثة جانبية"
                                            >
                                                <i className="bi bi-chat-dots-fill"></i>
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12 animate__animated animate__zoomIn">
                        <div className="empty-state text-center shadow-sm">
                            <div className="mb-4">
                                <i className="bi bi-inbox-fill display-1 text-success opacity-25"></i>
                            </div>
                            <h4 className="fw-bold text-dark">صندوق الوارد فارغ</h4>
                            <p className="text-muted small">لا توجد طلبات انضمام جديدة معلقة بانتظار المراجعة حالياً.</p>
                            <button onClick={() => navigate('/')} className="btn btn-success rounded-pill px-5 mt-3" style={{ background: mainGreen }}>
                                العودة إلى القائمة الرئيسية
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};