import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const RequestsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const isLoggedIn = true;

    const [requests, setRequests] = useState([
        { 
            id: 101, 
            name: "سارة محمود", 
            major: "هندسة البرمجيات", 
            year: "سنة رابعة",
            avatar: "", 
            skills: ["React", "UI/UX", "Figma"],
            message: "أريد الانضمام كـ Frontend Developer، لدي خبرة في مشاريع سابقة.",
            status: "pending"
        },
        { 
            id: 102, 
            name: "محمد عبدالله", 
            major: "علم الحاسوب", 
            year: "سنة ثالثة",
            avatar: "", 
            skills: ["Node.js", "Python", "SQL"],
            message: "مهتم بالعمل على الـ Backend وتصميم قواعد البيانات.",
            status: "pending"
        }
    ]);

    const handleAction = async (request, action) => {
        const isAccept = action === 'accept';
        
        
        const result = await Swal.fire({
            title: isAccept ? 'تأكيد القبول' : 'تأكيد الرفض',
            text: isAccept 
                ? `هل أنت متأكد من إضافة ${request.name} لفريقك؟` 
                : `سيتم حذف طلب ${request.name} ولن يتمكن من الانضمام حالياً.`,
            icon: isAccept ? 'question' : 'warning',
            showCancelButton: true,
            confirmButtonColor: isAccept ? mainGreen : '#d33',
            cancelButtonColor: '#64748b',
            confirmButtonText: isAccept ? 'نعم، أضفه للفريق' : 'نعم، رفض الطلب',
            cancelButtonText: 'إلغاء',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-5',
                title: 'fw-bold',
            }
        });

        if (result.isConfirmed) {
            
            Swal.fire({
                title: isAccept ? 'جاري القبول...' : 'جاري المعالجة...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            
            setTimeout(() => {
                setRequests(prev => prev.filter(req => req.id !== request.id));
                
                
                Swal.fire({
                    title: isAccept ? 'تمت الإضافة!' : 'تم الرفض',
                    text: isAccept 
                        ? `أصبح ${request.name} الآن عضواً في فريقك.` 
                        : 'تم استبعاد الطلب من القائمة بنجاح.',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    customClass: {
                        popup: 'rounded-4 border-bottom border-5 ' + (isAccept ? 'border-success' : 'border-danger')
                    }
                });
            }, 1000);
        }
    };

    const getDefaultAvatar = (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

    if (!isLoggedIn) return null;

    return (
        <div className="container py-5 min-vh-100" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .request-card { 
                        border-radius: 22px; 
                        transition: all 0.3s ease; 
                        border: 1px solid #f1f5f9;
                    }
                    .request-card:hover { 
                        transform: translateY(-5px); 
                        box-shadow: 0 15px 30px rgba(0,0,0,0.08) !important; 
                    }
                    .avatar-frame { 
                        width: 65px; height: 65px; 
                        border-radius: 18px; 
                        object-fit: cover; 
                        border: 2px solid #fff;
                        box-shadow: 0 5px 15px rgba(0,0,0,0.05);
                    }
                    .skill-tag { 
                        font-size: 0.75rem; 
                        padding: 5px 12px; 
                        border-radius: 10px; 
                        background: #f8fafc; 
                        color: ${mainGreen};
                        font-weight: 700;
                        border: 1px solid #e2e8f0;
                    }
                    .message-box {
                        background: #f0fdf4;
                        border-right: 4px solid ${mainGreen};
                        font-style: italic;
                    }
                    .empty-state {
                        padding: 100px 0;
                        background: white;
                        border-radius: 30px;
                        border: 2px dashed #e2e8f0;
                    }
                    /* تعديل خط SweetAlert */
                    .swal2-container {
                        font-family: 'Cairo', sans-serif !important;
                    }
                `}
            </style>

        
            <div className="d-flex justify-content-between align-items-center mb-5 flex-wrap gap-4 animate__animated animate__fadeInDown">
                <div className="text-end">
                    <h2 className="fw-bold mb-2" style={{ color: mainGreen }}>
                        <i className="bi bi-people-fill ms-2"></i>طلبات الانضمام
                    </h2>
                    <nav aria-label="breadcrumb">
                        <ol className="breadcrumb mb-0">
                            <li className="breadcrumb-item small"><a href="/" className="text-decoration-none text-muted">الرئيسية</a></li>
                            <li className="breadcrumb-item small active" aria-current="page">إدارة الطلبات</li>
                        </ol>
                    </nav>
                </div>
                <button onClick={() => navigate(-1)} className="btn btn-white shadow-sm rounded-pill px-4 fw-bold border">
                    <i className="bi bi-arrow-right ms-2"></i> العودة
                </button>
            </div>

        
            <div className="row g-4">
                {requests.length > 0 ? (
                    requests.map((req, index) => (
                        <div className="col-12 animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }} key={req.id}>
                            <div className="card request-card shadow-sm p-4 bg-white border-0">
                                <div className="row align-items-center">
                                
                                    <div className="col-lg-4 d-flex align-items-center gap-3">
                                        <img 
                                            src={req.avatar || getDefaultAvatar(req.id)} 
                                            className="avatar-frame shadow-sm" 
                                            alt={req.name}
                                        />
                                        <div className="text-end">
                                            <h6 className="fw-bold mb-1 text-dark">{req.name}</h6>
                                            <p className="text-muted mb-2 small fw-bold">
                                                <i className="bi bi-mortarboard me-1"></i> {req.major}
                                            </p>
                                            <div className="d-flex flex-wrap gap-1">
                                                {req.skills.map(skill => (
                                                    <span key={skill} className="skill-tag">{skill}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                
                                    <div className="col-lg-5 my-3 my-lg-0">
                                        <div className="p-3 rounded-4 message-box small text-secondary">
                                            <i className="bi bi-chat-quote-fill ms-2 text-success opacity-50 fs-5"></i>
                                            "{req.message}"
                                        </div>
                                    </div>

                                
                                    <div className="col-lg-3">
                                        <div className="d-flex justify-content-lg-end gap-2">
                                            <button 
                                                onClick={() => handleAction(req, 'accept')}
                                                className="btn btn-success rounded-4 px-3 fw-bold flex-grow-1 shadow-sm border-0"
                                                style={{ background: mainGreen }}
                                            >
                                                <i className="bi bi-person-plus-fill me-1"></i> قبول
                                            </button>
                                            
                                            <button 
                                                onClick={() => handleAction(req, 'reject')}
                                                className="btn btn-outline-danger rounded-4 border-2"
                                                style={{ width: '48px' }}
                                                title="رفض"
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>

                                            <button 
                                                onClick={() => navigate(`/chat/${req.id}`)}
                                                className="btn btn-light rounded-4 border text-primary"
                                                style={{ width: '48px' }}
                                                title="محادثة"
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
                                <i className="bi bi-clipboard-check display-1 text-success opacity-25"></i>
                            </div>
                            <h4 className="fw-bold text-dark">كل شيء جاهز!</h4>
                            <p className="text-muted">لا توجد طلبات معلقة حالياً. فريقك مكتمل أو بانتظار مبدعين جدد.</p>
                            <button onClick={() => navigate('/')} className="btn btn-success rounded-pill px-5 mt-3" style={{ background: mainGreen }}>
                                تصفح المسابقات الأخرى
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};