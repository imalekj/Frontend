import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../api';
import { AppColors } from '../theme/AppColors'; 
import { toast } from 'react-hot-toast';
import Swal from 'sweetalert2'; // استيراد الـ SweetAlert

export const CompetitionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [user2, setUser2] = useState(null);
    const { user, token } = useAuth();
    const isLoggedIn = !!token;
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const userData = user; 

    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([
        { id: 1, name: "سارة محمود", text: "هل يمكن لطلاب السنة الأولى المشاركة؟", date: "منذ ساعة", avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" },
        { id: 2, name: "عمر خالد", text: "بالتوفيق للجميع، تحدي رائع!", date: "منذ 3 ساعات", avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" }
    ]);
    const [competition, setCompetition] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUserByProject = async (projectId) => {
        try {
            const response = await apiFetch(`${baseUrl}api/Posts/GetUserByProjectId?id=${projectId}`);
            return await response.json();
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await apiFetch(`${baseUrl}api/Posts/GetProjectById?id=${id}`);
                const data = await res.json();
                setCompetition(data);

                const userDataFetched = await getUserByProject(id);
                setUser2(userDataFetched);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    const handleAddComment = (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;
        
        const newComment = {
            id: Date.now(),
            name: userData?.name || "مستخدم جديد",
            text: commentText,
            date: "الآن",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData?.name || 'user'}`
        };
        
        setComments([newComment, ...comments]);
        setCommentText("");
    };

    const handleApply = () => {
        if (!competition?.projectID) return;
        if (isLoggedIn) {
            navigate(`/registration/${competition.projectID}`);
        } else {
            navigate('/login');
        }
    };

    const handleManageRequests = () => navigate(`/manage-requests/${competition.projectID}`);
    
    const handleEditPost = () => navigate(`/edit-post/${competition.projectID}`);

    // الدالة المحدثة باستخدام SweetAlert
 const handleDeletePost = () => {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "هل أنت متأكد من رغبتك في حذف هذا المنشور نهائياً؟ لا يمكن التراجع عن هذا الإجراء.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc3545',
        cancelButtonColor: '#6c757d',
        confirmButtonText: 'نعم، احذفه',
        cancelButtonText: 'إلغاء',
        reverseButtons: true
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await apiFetch(
                    `${baseUrl}api/PostRequests/DeleteProjectByID/${competition.projectID}`, // ✅ updated
                    {
                        method: 'DELETE',
                        headers: {
                            'Authorization': `Bearer ${token}` // ✅ add token
                        }
                    }
                );

                if (response.ok) {
                    toast.success("تم حذف المنشور بنجاح");
                    navigate('/');
                } else {
                    toast.error("فشل في حذف المنشور، يرجى المحاولة لاحقاً");
                }
            } catch (error) {
                console.error("Delete error:", error);
                toast.error("حدث خطأ في الاتصال أثناء محاولة الحذف");
            }
        }
    });
};

    const handlePublisherProfileClick = () => {
        if (user2?.id) {
            navigate(`/profile/${user2.id}`);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        return new Date(dateString).toLocaleDateString("ar-JO", {
            year: "numeric",
            month: "long",
            day: "numeric"
        });
    };

    const getDaysLeft = (endDate) => {
        const today = new Date();
        const end = new Date(endDate);
        const diffTime = end - today; 
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    if (loading || !competition) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 text-success fw-bold fs-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                جاري تحميل تفاصيل الإعلان...
            </div>
        );
    }

    const isProject = competition.isGraduationProject === true; 
    const isOwner = user2?.id === userData?.id;
    const skills = competition?.skills ? competition.skills.split(",").map(s => s.trim()) : [];
    const daysLeft = getDaysLeft(competition.endDate);

    return (
        <div className="container py-5 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', maxWidth: '1050px' }}>
            <style>
                {`
                    .comp-header-wrapper { position: relative; border-radius: 24px; overflow: hidden; margin-bottom: 35px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); }
                    .comp-header-img { width: 100%; height: 340px; object-fit: cover; }
                    .info-card { border: none; border-radius: 20px; padding: 24px; background: #fff; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04); border: 1px solid rgba(0,0,0,0.02); }
                    .publisher-mini { display: flex; align-items: center; gap: 14px; padding: 12px; border-radius: 14px; background: #fdfdfd; border: 1px solid #f5f5f5; cursor: pointer; transition: 0.2s ease; }
                    .publisher-mini:hover { background: #f7fbf9; border-color: ${AppColors.primaryGreen || '#1a5d44'}33; transform: translateY(-1px); }
                    .stat-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dashed #f0f0f0; }
                    .stat-row:last-child { border-bottom: none; }
                    .skill-badge { background: #e8f5e9; color: ${AppColors.primaryGreen || '#1a5d44'}; padding: 6px 14px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; border: 1px solid rgba(26, 93, 68, 0.05); transition: 0.2s; }
                    .skill-badge:hover { background: ${AppColors.primaryGreen || '#1a5d44'}; color: white; }
                    .btn-action { background: ${AppColors.primaryGreen || '#1a5d44'}; color: white; border: none; padding: 14px; border-radius: 12px; font-weight: 700; width: 100%; transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); box-shadow: 0 4px 12px rgba(26, 93, 68, 0.15); }
                    .btn-action:hover { opacity: 0.95; transform: translateY(-3px); box-shadow: 0 6px 20px rgba(26, 93, 68, 0.25); }
                    .comment-box { background: #fdfdfd; border-radius: 16px; padding: 18px; margin-bottom: 16px; border: 1px solid #f0f0f0; border-right: 4px solid ${AppColors.primaryGreen || '#1a5d44'}; transition: 0.2s; }
                    .comment-box:hover { box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                    .comment-input { background: #f8f9fa; border-radius: 12px; border: 1.5px solid ${AppColors.borderInput || '#e0e0e0'}; padding: 14px; font-size: 0.9rem; color: ${AppColors.textPrimary || '#2c3e50'}; transition: 0.3s; }
                    .comment-input:focus { border-color: ${AppColors.primaryGreen || '#1a5d44'}; box-shadow: 0 0 0 4px rgba(26, 93, 68, 0.08); outline: none; background: #fff; }
                    .section-title { font-weight: 800; color: #2c3e50; position: relative; padding-right: 12px; margin-bottom: 20px; }
                    .section-title::before { content: ''; position: absolute; right: 0; top: 15%; height: 70%; width: 4px; background: ${AppColors.primaryGreen || '#1a5d44'}; border-radius: 2px; }
                    .custom-badge { font-weight: 700; font-size: 0.85rem; padding: 8px 16px; border-radius: 10px; }
                `}
            </style>

            <div className="comp-header-wrapper">
                <img
                    src={competition.coverImage || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&q=80"}
                    className="comp-header-img"
                    alt="Cover"
                />
            </div>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="mb-4">
                        <span className={`badge custom-badge ${isProject ? 'bg-light text-primary border border-primary-subtle' : 'bg-light text-success border border-success-subtle'} mb-3`}>
                             <i className={`bi ${isProject ? 'bi-briefcase-fill' : 'bi-trophy-fill'} me-1`}></i> {isProject ? 'مشروع تخرج وعمل مشترك' : 'مسابقة علمية وبحثية'}
                        </span>
                        <h1 className="fw-900 mb-4" style={{ color: '#1a2332', fontSize: '2rem', letterSpacing: '-0.5px' }}>{competition.name}</h1>
                        
                        <div className="publisher-mini mb-4 shadow-sm-hover d-inline-flex" onClick={handlePublisherProfileClick}>
                            <img
                                src={user2?.imagePath ? `${baseUrl}${user2.imagePath}` : "https://api.dicebear.com/7.x/initials/svg?seed=Z"}
                                width="48"
                                height="48"
                                className="rounded-circle border-2 border-white shadow-sm"
                                alt="Publisher"
                            />
                            <div>
                                <div className="fw-bold text-dark small">{user2?.fullName || "عضو بهيئة التدريس / طالب"}</div>
                                <div className="text-muted extra-small" style={{fontSize: '0.72rem', direction: 'ltr'}}>@{user2?.userName || "username"}</div>
                            </div>
                        </div>
                    </div>

                    <h5 className="section-title fs-6">وصف وتفاصيل الإعلان</h5>
                    <p className="text-secondary small lh-lg mb-5 bg-white p-3 rounded-4 border border-light shadow-sm" style={{ textJustify: 'inter-word', whiteSpace: 'pre-line' }}>
                        {competition.descriptions}
                    </p>

                    <div className="row g-3 mb-5">
                        <div className="col-md-6">
                            <div className="p-3 bg-white rounded-4 border border-light shadow-sm h-100">
                                <h6 className="fw-bold mb-3 text-dark"><i className="bi bi-geo-alt text-success me-1"></i> الكلية المستهدفة أو مكان التجمع</h6>
                                <div className="small text-muted fw-bold bg-light p-2 rounded-3 text-center">
                                    {competition.projectLocation}
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="p-3 bg-white rounded-4 border border-light shadow-sm h-100">
                                <h6 className="fw-bold mb-3 text-dark"><i className="bi bi-patch-check text-primary me-1"></i> المتطلبات والمهارات المطلوبة</h6>
                                <div className="d-flex flex-wrap gap-2">
                                    {skills.length > 0 ? skills.map((skill, i) => (
                                        <span key={i} className="skill-badge">
                                            {skill}
                                        </span>
                                    )) : <span className="text-muted small italic">متاح لجميع التخصصات والشروط العامة</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <hr className="my-5 opacity-25" />

                    <div className="mt-4">
                        <h5 className="section-title fs-6">استفسارات وتواصل اجتماعي ({comments.length})</h5>
                        
                        {isLoggedIn ? (
                            <form onSubmit={handleAddComment} className="mb-4 bg-white p-3 rounded-4 shadow-sm border border-light">
                                <div className="mb-3">
                                    <textarea 
                                        className="form-control comment-input" 
                                        rows="3" 
                                        placeholder="هل لديك سؤال لصاحب المنشور؟ اطرح استفسارك هنا بكل وضوح..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="text-start">
                                    <button type="submit" className="btn btn-sm text-white px-4 fw-bold" style={{background: AppColors.primaryGreen || '#1a5d44', borderRadius: '10px', padding: '8px 20px'}}>
                                        إرسال الاستفسار <i className="bi bi-send-fill ms-1"></i>
                                    </button>
                                </div>
                            </form>
                        ) : (
                            <div className="alert alert-warning border-0 text-center small mb-4 py-3 rounded-4 shadow-sm">
                                <i className="bi bi-lock-fill me-1"></i> يرجى <span className="text-success fw-bold text-decoration-underline" style={{cursor:'pointer'}} onClick={()=>navigate('/login')}>تسجيل الدخول</span> لتتمكن من إضافة تعليق أو طرح استفسار.
                            </div>
                        )}

                        <div className="comments-list mt-3">
                            {comments.map(comment => (
                                <div key={comment.id} className="comment-box shadow-sm">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={comment.avatar} width="32" height="32" className="rounded-circle border" alt="avatar" />
                                            <span className="fw-bold text-dark small">{comment.name}</span>
                                        </div>
                                        <small className="text-muted" style={{fontSize: '0.7rem silent'}}><i className="bi bi-clock me-1"></i> {comment.date}</small>
                                    </div>
                                    <p className="mb-0 small text-secondary" style={{marginRight: '40px', lineHeight: '1.6'}}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="info-card shadow-lg sticky-top" style={{ top: '30px' }}>
                        <h6 className="fw-extrabold mb-4 border-bottom pb-2 text-dark fs-6">
                            <i className="bi bi-journal-text me-1 text-success"></i> بطاقة الانضمام والمواعيد
                        </h6>
                        <div className="stat-row">
                            <span className="text-muted small"><i className="bi bi-people-fill text-muted me-1"></i> {isProject ? 'الأعضاء المطلوبين' : 'المقاعد المتاحة'}</span>
                            <span className="badge bg-success-subtle text-success fw-bold p-2 px-3 rounded-pill" style={{fontSize:'0.85rem'}}>{competition.availableSeats} شواغر</span>
                        </div>
                        <div className="stat-row">
                            <span className="text-muted small"><i className="bi bi-calendar-event text-muted me-1"></i> الموعد النهائي</span>
                            <span className="fw-bold small text-dark">{formatDate(competition.endDate)}</span>
                        </div>
                        
                        {!isProject && (
                            <div className="stat-row">
                                <span className="text-muted small"><i className="bi bi-trophy text-muted me-1"></i> الحافز والجائزة</span>
                                <span className="badge bg-warning-subtle text-warning-emphasis fw-bold p-1 px-2 rounded small">🏆 حافز معنوي / مكافأة</span>
                            </div>
                        )}

                        <div className="mt-4 p-3 rounded-3" style={{ background: '#fafafa', border: '1px solid #f0f0f0' }}>
                            <div className="d-flex justify-content-between mb-1">
                                <span className="text-muted extra-small" style={{fontSize:'0.75rem'}}>حالة التقديم والموعد:</span>
                                <span className={`fw-bold extra-small ${daysLeft > 2 ? 'text-success' : 'text-danger'}`} style={{fontSize:'0.75rem'}}>
                                    {daysLeft > 0 ? `ينتهي خلال ${daysLeft} أيام` : 'انتهى موعد التقديم'}
                                </span>
                            </div>
                            <div className="progress" style={{ height: '6px' }}>
                                <div 
                                    className={`progress-bar ${daysLeft > 2 ? 'bg-success' : 'bg-danger'}`} 
                                    role="progressbar" 
                                    style={{ width: daysLeft > 7 ? '100%' : `${(daysLeft / 7) * 100}%` }}
                                ></div>
                            </div>
                        </div>

                        <div className="mt-4">
                            {isOwner ? (
                                <div className="d-flex flex-column gap-2">
                                    <button className="btn-action bg-warning text-dark border-0 w-100 fw-bold" onClick={handleManageRequests}>
                                        <i className="bi bi-sliders me-1"></i> إدارة الطلبات الواردة للمنشور
                                    </button>
                                    
                                    <div className="row g-2">
                                        <div className="col-6">
                                            <button className="btn btn-outline-primary w-100 fw-bold py-2 rounded-3 small" onClick={handleEditPost}>
                                                <i className="bi bi-pencil-square me-1"></i> تعديل
                                            </button>
                                        </div>
                                        <div className="col-6">
                                            <button className="btn btn-outline-danger w-100 fw-bold py-2 rounded-3 small" onClick={handleDeletePost}>
                                                <i className="bi bi-trash3-fill me-1"></i> حذف
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <button 
                                    className={`btn-action w-100 fw-bold ${!isLoggedIn ? 'bg-secondary' : ''}`} 
                                    onClick={handleApply}
                                    disabled={daysLeft === 0}
                                >
                                    {daysLeft === 0 ? (
                                        <span><i className="bi bi-dash-circle me-1"></i> التقديم مغلق حالياً</span>
                                    ) : isLoggedIn ? (
                                        <span>{isProject ? 'تقديم طلب انضمام لفريق المشروع' : 'تسجيل وتأكيد حضور المسابقة'} <i className="bi bi-arrow-left-short ms-1"></i></span>
                                    ) : (
                                        <span><i className="bi bi-box-arrow-in-right me-1"></i> سجل دخولك للتقديم فوراً</span>
                                    )}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
