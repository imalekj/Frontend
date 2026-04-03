import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { useAuth } from '../context/AuthContext';

export const Notifications = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const mainGreen = '#1a5d44';
    
    const [filter, setFilter] = useState('all');
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. جلب التنبيهات من السيرفر عند تحميل الصفحة
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user?.identifier) return;
            try {
                // استبدل المسار بالـ API الحقيقي الخاص بك
                const response = await fetch(`https://localhost:7011/api/Notifications/GetUserNotifications/${user.identifier}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (error) {
                console.error("Error fetching notifications:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    const swalStyled = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success px-4 py-2 mx-2 fw-bold rounded-pill',
            cancelButton: 'btn btn-light px-4 py-2 mx-2 fw-bold rounded-pill border'
        },
        buttonsStyling: false,
        fontFamily: 'Cairo'
    });

    // 2. منطق الفلترة
    const filteredNotifs = notifications.filter(n => {
        if (filter === 'unread') return !n.isRead;
        if (filter === 'teams') return n.category === 'teams' || n.type.includes('request');
        return true;
    });

    // 3. تحديث حالة التنبيه كـ "مقروء" في السيرفر
    const markAsRead = async (id) => {
        try {
            await fetch(`https://localhost:7011/api/Notifications/MarkAsRead/${id}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error("Error marking as read:", error);
        }
    };

    const deleteNotif = (e, id) => {
        e.stopPropagation();
        swalStyled.fire({
            title: 'هل أنت متأكد؟',
            text: "سيتم إزالة هذا التنبيه نهائياً من مركزك الشخصي.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذفه',
            cancelButtonText: 'إلغاء',
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // طلب الحذف من السيرفر
                    await fetch(`https://localhost:7011/api/Notifications/Delete/${id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                    });
                    setNotifications(notifications.filter(n => n.id !== id));
                    
                    Swal.fire({
                        icon: 'success',
                        title: 'تم الحذف بنجاح',
                        timer: 1500,
                        showConfirmButton: false,
                        toast: true,
                        position: 'top-end'
                    });
                } catch (error) {
                    Swal.fire('خطأ', 'حدثت مشكلة أثناء الحذف', 'error');
                }
            }
        });
    };

    const markAllRead = async () => {
        if (notifications.every(n => n.isRead)) return;

        try {
            await fetch(`https://localhost:7011/api/Notifications/MarkAllRead/${user.identifier}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            Swal.fire({ title: 'تمت القراءة', text: 'تم تحديد جميع التنبيهات كمقروءة', icon: 'success', confirmButtonColor: mainGreen });
        } catch (error) {
            console.error("Error marking all read:", error);
        }
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
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="mb-5 text-center text-md-end">
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4 gap-3">
                            <div>
                                <h3 className="fw-bold mb-1" style={{ color: mainGreen }}>مركز التنبيهات</h3>
                                <p className="text-muted small mb-0">تنبيهات منصة مشاريع جامعة الزيتونة</p>
                            </div>
                            <button onClick={markAllRead} className="btn btn-light btn-sm rounded-pill px-4 fw-bold border shadow-sm">
                                <i className="bi bi-check2-all ms-2"></i> قراءة الكل
                            </button>
                        </div>

                        <div className="d-flex gap-2 overflow-auto pb-2">
                            <button onClick={() => setFilter('all')} className={`filter-btn ${filter === 'all' ? 'active' : ''}`}>الكل</button>
                            <button onClick={() => setFilter('unread')} className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}>غير مقروء</button>
                            <button onClick={() => setFilter('teams')} className={`filter-btn ${filter === 'teams' ? 'active' : ''}`}>الفرق</button>
                        </div>
                    </div>

                    <div className="d-flex flex-column gap-3">
                        {loading ? (
                            <div className="text-center py-5">
                                <div className="spinner-border text-success" role="status"></div>
                                <p className="mt-2 text-muted">جاري تحميل تنبيهاتك...</p>
                            </div>
                        ) : filteredNotifs.length > 0 ? (
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
                            <div className="text-center py-5 bg-light rounded-5 border border-dashed shadow-sm">
                                <i className="bi bi-bell-slash display-4 text-muted opacity-25"></i>
                                <h5 className="text-muted mt-3 fw-bold">لا توجد تنبيهات</h5>
                                <p className="small text-secondary px-3">بمجرد حدوث نشاط جديد على ملفك أو فريقك، سيظهر هنا.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};