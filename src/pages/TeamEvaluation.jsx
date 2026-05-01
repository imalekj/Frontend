import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import { useLocation, useParams } from "react-router-dom";

import { apiFetch } from '../api';
export const TeamEvaluation = () => {

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [members, setMembers] = useState([]);
    const navigate = useNavigate();
    const { user, token } = useAuth();
          const isLoggedIn = !!token;
    const mainGreen = '#1a5d44';
    const { state } = useLocation();
   const { teamId } = useParams();
        useEffect(() => {
            if (state && Array.isArray(state)) {
                const initialized = state.map(m => ({
                    ...m,
                    rating: 0,
                    feedback: ""
                }));

                setMembers(initialized);
            } else {
                console.log("No state passed");
                // ممكن تعمل fetch من API هون إذا بدك
            }
        }, [state]);

    const evaluationList = members.filter(m => m.id !== user?.id);

    const getDefaultAvatar = (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

    const handleRating = (memberId, stars) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, rating: stars } : m));
    };

    const handleFeedbackChange = (memberId, text) => {
        setMembers(members.map(m => m.id === memberId ? { ...m, feedback: text } : m));
    };

    const completedCount = evaluationList.filter(m => m.rating > 0).length;

const sendRating = async (userId, projectID, rating) => {
    const res = await apiFetch(
        `${baseUrl}api/Teams/updateTeamMemberRate?userId=${userId}&projectID=${projectID}&Rating=${rating}`,
        {
            method: "POST"
        }
    );

    if (!res.ok) {
        throw new Error("Request failed");
    }

    return await res.json();
};

const handleSubmit = async () => {
    if (completedCount < evaluationList.length) {
        toast.error('يرجى إكمال تقييم جميع الأعضاء أولاً');
        return;
    }

    const result = await Swal.fire({
        title: 'إرسال التقييمات؟',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'نعم'
    });

    if (!result.isConfirmed) return;

    try {
        Swal.fire({ title: 'جاري الحفظ...', didOpen: () => Swal.showLoading() });

        await Promise.all(
            evaluationList.map(member =>
                sendRating(member.id, teamId, member.rating)
            )
        );

        Swal.fire('تم!', 'تم حفظ التقييمات', 'success');
        navigate('/profile');

    } catch (err) {
        Swal.fire('خطأ', 'فشل حفظ التقييم', 'error');
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
                <p className="text-muted small">مرحباً {user?.name}، رأيك الصادق يساهم في تحسين جودة مجتمعنا التقني</p>
            </div>

            {evaluationList.map((member, index) => (
                <div key={member.id} className="card border-0 shadow-sm p-4 mb-4 member-card animate__animated animate__fadeInUp" style={{ animationDelay: `${index * 0.1}s` }}>
                    <div className="d-flex align-items-center gap-3 mb-3">
                    <img 
                                src={member.imagePath 
                                    ? `https://localhost:7011${member.imagePath}` 
                                    : getDefaultAvatar(`${member.id}-${member.fullName || ''}`)
                                }
                                className="avatar-frame"
                                alt="avatar" 
                            />
                        <div>
                            <h6 className="fw-bold mb-0">{member.fullName }</h6>
                            <small className="text-success fw-bold">{member?.role}</small>
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
                        placeholder={`ما هو رأيك في مساهمة ${member.fullName.split(' ')[0]}؟ (اختياري)...`}
                        value={member.feedback}
                        onChange={(e) => handleFeedbackChange(member.id, e.target.value)}
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
                إرسال كافة التقييمات ({completedCount}/{evaluationList.length})
            </button>
        </div>
    );
};
