import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const CompetitionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const user = localStorage.getItem('user');
    const isLoggedIn = !!user; 
    const userData = user ? JSON.parse(user) : null;

    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState([
        { id: 1, name: "سارة محمود", text: "هل يمكن لطلاب السنة الأولى المشاركة؟", date: "منذ ساعة", avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" },
        { id: 2, name: "عمر خالد", text: "بالتوفيق للجميع، تحدي رائع!", date: "منذ 3 ساعات", avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" }
    ]);

    const competition = {
        title: "هاكاثون الزيتونة الوطني للبرمجيات 2026",
        coverImage: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
        description: "تحدي برمجي مكثف لمدة 3 أيام يهدف لتطوير حلول تقنية ذكية لتعزيز الاستدامة في الحرم الجامعي. المسابقة مفتوحة لجميع التخصصات التقنية في جامعة الزيتونة.",
        publisher: {
            id: "user_789",
            name: "أحمد علي",
            specialization: "هندسة برمجيات - سنة ثالثة",
            avatar: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
            datePublished: "منذ يومين",
            requests: 12,
            remainingDays: 4
        },
        stats: {
            availableSeats: "3 من 5 طلاب",
            deadline: "15 مايو 2026",
            reward: "تدريب + جائزة مالية"
        },
        requirements: ["طالب مقيد في الجامعة", "إجادة أساسيات البرمجة", "الالتزام بالحضور الشخصي", "العمل ضمن فريق"],
        skills: ["React.js", "Tailwind CSS", "TypeScript", "Node.js"]
    };

    const isOwner = isLoggedIn && competition.publisher.id === userData?.id;

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

    const handleApply = () => isLoggedIn ? navigate(`/registration/${id}`) : navigate('/login');
    const handleManageRequests = () => navigate(`/requests/${id}`);
    const handleProfileClick = () => navigate(`/profile/${competition.publisher.id}`);

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', maxWidth: '1000px' }}>
            <style>
                {`
                    .comp-header-img { width: 100%; height: 300px; object-fit: cover; border-radius: 20px; margin-bottom: 25px; }
                    .info-card { border: 1px solid #edf2f0; border-radius: 15px; padding: 20px; background: #fff; }
                    .publisher-mini { display: flex; align-items: center; gap: 12px; padding-bottom: 15px; border-bottom: 1px solid #f1f3f5; cursor: pointer; }
                    .stat-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px dashed #e9ecef; }
                    .skill-badge { background: #f1f7f5; color: ${mainGreen}; padding: 5px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; }
                    .btn-action { background: ${mainGreen}; color: white; border: none; padding: 14px; border-radius: 10px; font-weight: 700; width: 100%; transition: 0.3s; }
                    .btn-action:hover { opacity: 0.9; transform: translateY(-2px); }
                    
                    /* تنسيق التعليقات */
                    .comment-box { background: #f8faf9; border-radius: 12px; padding: 15px; margin-bottom: 15px; border-right: 4px solid ${mainGreen}; }
                    .comment-input { border-radius: 10px; border: 1px solid #e0e0e0; padding: 12px; font-size: 0.9rem; }
                    .comment-input:focus { border-color: ${mainGreen}; box-shadow: 0 0 0 0.2rem rgba(26, 93, 68, 0.1); }
                `}
            </style>

            <img src={competition.coverImage} className="comp-header-img shadow-sm" alt="Cover" />

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="mb-4">
                        <span className="badge bg-light text-success border mb-2 px-3 py-2">مسابقة برمجية</span>
                        <h2 className="fw-900 mb-3" style={{ color: '#1a2a23' }}>{competition.title}</h2>
                        
                        <div className="publisher-mini mb-4" onClick={handleProfileClick}>
                            <img src={competition.publisher.avatar} width="45" height="45" className="rounded-circle border" alt="Publisher" />
                            <div>
                                <div className="fw-bold small">{competition.publisher.name}</div>
                                <div className="text-muted" style={{fontSize: '0.75rem'}}>{competition.publisher.specialization} • {competition.publisher.datePublished}</div>
                            </div>
                        </div>
                    </div>

                    <h6 className="fw-bold mb-3"><i className="bi bi-info-circle me-1"></i> وصف المسابقة</h6>
                    <p className="text-muted small lh-lg mb-5">{competition.description}</p>

                
                    <div className="row mb-5">
                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">المتطلبات الأساسية</h6>
                            {competition.requirements.map((req, i) => (
                                <div key={i} className="small text-muted mb-2">
                                    <i className="bi bi-check2-circle text-success ms-2"></i> {req}
                                </div>
                            ))}
                        </div>
                        <div className="col-md-6">
                            <h6 className="fw-bold mb-3">المهارات المطلوبة</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {competition.skills.map(skill => (
                                    <span key={skill} className="skill-badge">{skill}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <hr />

                    <div className="mt-5">
                        <h5 className="fw-bold mb-4"><i className="bi bi-chat-left-text ms-2"></i>التعليقات ({comments.length})</h5>
                        
                        {isLoggedIn ? (
                            <form onSubmit={handleAddComment} className="mb-5">
                                <div className="d-flex gap-3">
                                    <textarea 
                                        className="form-control comment-input" 
                                        rows="2" 
                                        placeholder="لديك استفسار؟ اكتبه هنا..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                    ></textarea>
                                </div>
                                <div className="text-start mt-2">
                                    <button type="submit" className="btn btn-sm text-white px-4" style={{background: mainGreen, borderRadius: '8px'}}>نشر التعليق</button>
                                </div>
                            </form>
                        ) : (
                            <div className="alert alert-light border text-center small mb-5">
                                يرجى <span className="text-success fw-bold" style={{cursor:'pointer'}} onClick={()=>navigate('/login')}>تسجيل الدخول</span> لتتمكن من إضافة تعليق.
                            </div>
                        )}

                        <div className="comments-list">
                            {comments.map(comment => (
                                <div key={comment.id} className="comment-box shadow-sm">
                                    <div className="d-flex justify-content-between mb-2">
                                        <div className="d-flex align-items-center gap-2">
                                            <img src={comment.avatar} width="30" height="30" className="rounded-circle" alt="avatar" />
                                            <span className="fw-bold small">{comment.name}</span>
                                        </div>
                                        <small className="text-muted" style={{fontSize: '0.7rem'}}>{comment.date}</small>
                                    </div>
                                    <p className="mb-0 small text-dark" style={{marginRight: '38px'}}>{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>


                <div className="col-lg-4">
                    <div className="info-card shadow-sm sticky-top" style={{ top: '20px' }}>
                        <h6 className="fw-bold mb-3 border-bottom pb-2">تفاصيل التسجيل</h6>
                        <div className="stat-row">
                            <span className="text-muted small">المقاعد المتاحة</span>
                            <span className="fw-bold small text-success">{competition.stats.availableSeats}</span>
                        </div>
                        <div className="stat-row">
                            <span className="text-muted small">آخر موعد</span>
                            <span className="fw-bold small">{competition.stats.deadline}</span>
                        </div>
                        <div className="stat-row">
                            <span className="text-muted small">الجائزة</span>
                            <span className="fw-bold small">{competition.stats.reward}</span>
                        </div>

                        <div className="mt-4">
                            {isOwner ? (
                                <button className="btn-action bg-warning text-dark border-0" onClick={handleManageRequests}>
                                    إدارة الطلبات ({competition.publisher.requests})
                                </button>
                            ) : (
                                <button 
                                    className={`btn-action ${!isLoggedIn ? 'bg-danger' : ''}`} 
                                    onClick={handleApply}
                                >
                                    {isLoggedIn ? 'سجل الآن في المسابقة' : 'سجل الدخول للتقديم'}
                                </button>
                            )}
                            <div className="text-center mt-3">
                                <small className="text-danger fw-bold" style={{fontSize: '0.75rem'}}>
                                    <i className="bi bi-alarm ms-1"></i>
                                    ينتهي التسجيل خلال {competition.publisher.remainingDays} أيام
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};