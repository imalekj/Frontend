import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

export const TeamEvaluation = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [members, setMembers] = useState([
        { id: 1, name: "خالد منصور", role: "Frontend Developer", rating: 0, feedback: "" },
        { id: 2, name: "سارة خالد", role: "UI/UX Designer", rating: 0, feedback: "" }
    ]);

    const getDefaultAvatar = (seed) => `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`;

    const handleRating = (memberId, stars) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, rating: stars } : m));
    };

    const completedCount = members.filter(m => m.rating > 0).length;

    const handleSubmit = async () => {
        if (completedCount < members.length) {
            toast.error('يرجى إكمال تقييم جميع الأعضاء أولاً', {
                style: {
                    borderRadius: '15px',
                    fontFamily: 'Cairo',
                },
            });
            return;
        }

        const result = await Swal.fire({
            title: 'إرسال التقييمات؟',
            text: "لن تتمكن من تعديل التقييم بعد الإرسال.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: mainGreen,
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، أرسل الآن',
            cancelButtonText: 'مراجعة',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-5',
                title: 'fw-bold'
            }
        });

        if (result.isConfirmed) {
            Swal.fire({
                title: 'جاري الحفظ...',
                didOpen: () => { Swal.showLoading(); }
            });

            setTimeout(() => {
                Swal.fire({
                    title: 'تم الإرسال بنجاح! 🚀',
                    text: 'شكراً لك! تقييمك يساعد في بناء مجتمع تقني أفضل.',
                    icon: 'success',
                    confirmButtonColor: mainGreen,
                    customClass: { popup: 'rounded-5' }
                }).then(() => {
                    navigate('/profile');
                });
            }, 1500);
        }
    };

    return (
        <div className="container py-5 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', maxWidth: '850px' }}>
            <Toaster position="top-center" />
            
            <style>
                {`
                    .member-card { 
                        border-radius: 25px; 
                        transition: all 0.3s ease; 
                    }
                    .member-card:hover { 
                        transform: translateY(-5px); 
                        box-shadow: 0 10px 20px rgba(0,0,0,0.05) !important; 
                    }
                    .star-icon { cursor: pointer; transition: 0.2s; }
                    .star-icon:hover { transform: scale(1.2); }
                    .swal2-container { font-family: 'Cairo', sans-serif !important; }
                    .avatar-frame {
                        width: 60px; 
                        height: 60px;
                        border-radius: 15px; 
                        background: #f8f9fa;
                        object-fit: cover;
                        border: 2px solid #eee;
                    }
                `}
            </style>

            <div className="text-center mb-5 animate__animated animate__fadeInDown">
                <h2 className="fw-bold mb-2">تقييم <span style={{color: mainGreen}}>أداء الفريق</span></h2>
                <p className="text-muted small">رأيك الصادق يساهم في تحسين جودة مجتمعنا التقني</p>
            </div>

            {members.map((member, index) => (
                <div key={member.id} className="card border-0 shadow-sm p-4 mb-4 member-card animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                        <img 
                            src={getDefaultAvatar(member.id + member.name)} 
                            className="avatar-frame"
                            alt="avatar" 
                        />
                        <div>
                            <h6 className="fw-bold mb-0">{member.name}</h6>
                            <small className="text-success fw-bold">{member.role}</small>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-2 py-3 bg-light rounded-4 mb-3">
                        {[1, 2, 3, 4, 5].map(star => (
                            <i 
                                key={star} 
                                className={`bi fs-2 star-icon ${star <= member.rating ? 'bi-star-fill text-warning' : 'bi-star text-secondary opacity-25'}`}
                                onClick={() => handleRating(member.id, star)}
                            ></i>
                        ))}
                    </div>

                    <textarea 
                        className="form-control border-0 bg-light p-3" 
                        style={{ borderRadius: '15px', fontSize: '0.9rem' }}
                        rows="2" 
                        placeholder="أضف ملاحظة حول أدائه (اختياري)..."
                        value={member.feedback}
                        onChange={(e) => setMembers(members.map(m => m.id === member.id ? { ...m, feedback: e.target.value } : m))}
                    ></textarea>
                </div>
            ))}

            <button 
                className="btn w-100 py-3 mt-4 shadow-sm border-0" 
                style={{ 
                    background: mainGreen, 
                    color: 'white', 
                    borderRadius: '20px', 
                    fontWeight: 'bold',
                    transition: '0.3s'
                }}
                onClick={handleSubmit}
            >
                إرسال كافة التقييمات ({completedCount}/{members.length})
            </button>
        </div>
    );
};