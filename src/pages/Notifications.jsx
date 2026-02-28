import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const Notifications = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const [filter, setFilter] = useState('all');

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'request_accept',
            user: 'أحمد علي',
            content: 'وافق على طلب انضمامك لفريق هاكاثون الزيتونة!',
            time: 'منذ 5 دقائق',
            isRead: false,
            link: '/competition/101',
            category: 'teams'
        },
        {
            id: 2,
            type: 'new_request',
            user: 'سارة خالد',
            content: 'أرسلت طلباً للانضمام إلى مسابقتك (مشروع التخرج الذكي).',
            time: 'منذ ساعتين',
            isRead: false,
            link: '/manage-requests/202',
            category: 'teams'
        },
        {
            id: 3,
            type: 'system',
            user: 'بوابة المبدعين',
            content: 'أهلاً بك في منصة جامعة الزيتونة! ابدأ باستكشاف المسابقات المتاحة.',
            time: 'منذ يوم',
            isRead: true,
            link: '/competitions',
            category: 'system'
        }
    ]);

    const swalStyled = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success px-4 py-2 mx-2 fw-bold rounded-pill',
            cancelButton: 'btn btn-light px-4 py-2 mx-2 fw-bold rounded-pill border'
        },
        buttonsStyling: false,
        fontFamily: 'Cairo'
    });

    const filteredNotifs = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'teams') return n.category === 'teams';
        return true;
    });

    const markAsRead = (id) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    };

    const deleteNotif = (e, id) => {
        e.stopPropagation();
        
        swalStyled.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من استعادة هذا التنبيه بعد حذفه!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذفه',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#dc3545',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setNotifications(notifications.filter(n => n.id !== id));
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحذف',
                    timer: 1500,
                    showConfirmButton: false,
                    toast: true,
                    position: 'top-end'
                });
            }
        });
    };

    const markAllRead = () => {
        if (notifications.every(n => n.isRead)) {
            Swal.fire({
                text: 'جميع التنبيهات مقروءة بالفعل',
                icon: 'info',
                confirmButtonText: 'حسناً',
                confirmButtonColor: mainGreen
            });
            return;
        }

        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        
        Swal.fire({
            title: 'رائع!',
            text: 'تم تحديد جميع التنبيهات كمقروءة',
            icon: 'success',
            confirmButtonColor: mainGreen,
            timer: 2000
        });
    };

    return (
        <div className="container py-5 min-vh-100" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .notif-card { 
                        border-radius: 22px; 
                        transition: all 0.3s ease; 
                        border: 1px solid #f1f5f9;
                        cursor: pointer;
                        position: relative;
                        overflow: hidden;
                    }
                    .notif-card:hover { 
                        transform: translateX(-5px);
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important;
                    }
                    .unread { 
                        background-color: #f0fdf4 !important; 
                        border-right: 5px solid ${mainGreen} !important; 
                    }
                    .filter-btn {
                        border-radius: 12px;
                        padding: 8px 20px;
                        font-weight: 700;
                        font-size: 0.85rem;
                        transition: 0.3s;
                        border: 1px solid #eee;
                        background: white;
                        color: #64748b;
                    }
                    .filter-btn.active {
                        background: ${mainGreen};
                        color: white;
                        border-color: ${mainGreen};
                    }
                    .delete-btn {
                        opacity: 0;
                        transition: 0.2s;
                        width: 35px;
                        height: 35px;
                        border-radius: 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        background: #fee2e2;
                        color: #dc2626;
                        border: none;
                    }
                    .notif-card:hover .delete-btn { opacity: 1; }
                    .notif-icon-box {
                        width: 50px;
                        height: 50px;
                        border-radius: 15px;
                        background: white;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.04);
                    }
                    .swal2-popup { border-radius: 25px !important; font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-7">
                    
                    <div className="mb-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <div>
                                <h3 className="fw-900 mb-1" style={{ color: mainGreen }}>مركز التنبيهات</h3>
                                <p className="text-muted small">تابع آخر التحديثات والطلبات الخاصة بك</p>
                            </div>
                            <button onClick={markAllRead} className="btn btn-light btn-sm rounded-pill px-3 fw-bold border">
                                <i className="bi bi-check2-all ms-1"></i> قراءة الكل
                            </button>
                        </div>

                        <div className="d-flex gap-2 overflow-auto pb-2">
                            <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>الكل</button>
                            <button onClick={() => setFilter('unread')} className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}>غير مقروء</button>
                            <button onClick={() => setFilter('teams')} className={`filter-btn ${filter === 'teams' ? 'active' : ''}`}>الفرق</button>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {filteredNotifs.length > 0 ? (
                            filteredNotifs.map((n) => (
                                <div 
                                    key={n.id} 
                                    className={`card notif-card p-3 shadow-sm border-0 ${!n.isRead ? 'unread' : 'bg-white'}`}
                                    onClick={() => {
                                        markAsRead(n.id);
                                        navigate(n.link);
                                    }}
                                >
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="notif-icon-box">
                                            {n.type === 'request_accept' && <i className="bi bi-person-check-fill text-success fs-4"></i>}
                                            {n.type === 'new_request' && <i className="bi bi-people-fill text-primary fs-4"></i>}
                                            {n.type === 'system' && <i className="bi bi-megaphone-fill text-warning fs-4"></i>}
                                        </div>
                                        
                                        <div className="flex-grow-1 text-end">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <p className="mb-1 small fw-bold text-dark lh-base" style={{ maxWidth: '85%' }}>
                                                    <span style={{ color: mainGreen }}>{n.user}</span> {n.content}
                                                </p>
                                                <button onClick={(e) => deleteNotif(e, n.id)} className="delete-btn" title="حذف">
                                                    <i className="bi bi-trash"></i>
                                                </button>
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                    <i className="bi bi-clock-history ms-1"></i> {n.time}
                                                </small>
                                                {!n.isRead && <span className="badge bg-success rounded-pill" style={{ fontSize: '0.6rem' }}>جديد</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-5 bg-white rounded-5 shadow-sm border border-dashed">
                                <i className="bi bi-patch-check display-4 text-muted opacity-25"></i>
                                <h5 className="text-muted mt-3 fw-bold">أنت مطلع على كل شيء!</h5>
                                <p className="small text-secondary">لا توجد إشعارات تطابق الفلتر الحالي.</p>
                            </div>
                        )}
                    </div>

                </div>
            </div>
        </div>
    );
};