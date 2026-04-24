
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
export const TeamDetails = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const mainGreen = '#1a5d44';
    const [members, setMembers] = useState([]);

    const { state } = useLocation();
    const { teamId } = useParams();
    const [team, setTeam] = useState(state || null);
    const [count, setCount] = useState(0);

useEffect(() => {
    const fetchMembers = async () => {
        try {
          const res = await fetch(
    `https://localhost:7011/api/Teams/GetAllTeamMembersByProjectId?ProjectId=${teamId}`,
    {
        method: "POST"
    }
);
                    if (!res.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await res.json();
            setMembers(data);
           setCount(data.length);
        } catch (error) {
            console.error(error);
            Swal.fire('خطأ', 'فشل تحميل أعضاء الفريق', 'error');
        }
    };

    fetchMembers();
}, []);


    // التحقق مما إذا كان المستخدم الحالي هو قائد الفريق
   const isCurrentUserOwner = members.find(m => m.id === user?.id)?.role === "Manger";

    const getDefaultAvatar = (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

    const handleLeaveTeam = () => {
        if (isCurrentUserOwner) {
            return Swal.fire('تنبيه', 'لا يمكن لقائد الفريق المغادرة قبل تعيين قائد جديد أو حذف الفريق.', 'info');
        }

        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "لن تتمكن من الوصول إلى ملفات الفريق بعد المغادرة!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: mainGreen,
            confirmButtonText: 'نعم، غادر الفريق',
            cancelButtonText: ' إلغاء',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    'تمت المغادرة!',
                    'لقد خرجت من الفريق بنجاح.',
                    'success'
                );
                navigate('/my-teams');
            }
        });
    };

    return (
        <div className="container py-5 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>

            <style>
                {`
                    .detail-card { border-radius: 25px; border: none; overflow: hidden; }
                    .status-badge { background: #e8f5e9; color: ${mainGreen}; padding: 5px 15px; border-radius: 10px; font-size: 0.8rem; font-weight: bold; }
                    .member-item { transition: 0.3s; border-radius: 15px; border: 1px solid #f0f0f0; cursor: pointer; }
                    .member-item:hover { background: #f8f9fa; transform: translateY(-3px); border-color: ${mainGreen}; }
                    .link-box { background: #f8f9fa; border-radius: 15px; padding: 15px; transition: 0.3s; text-decoration: none; color: inherit; display: block; }
                    .link-box:hover { background: #eef2f0; border-color: ${mainGreen}; }
                    .btn-action { border-radius: 15px; transition: 0.3s; }
                    .btn-action:hover { opacity: 0.9; transform: scale(1.02); }
                `}
            </style>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card detail-card shadow-sm p-4 p-md-5 bg-white">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <span className="status-badge mb-2 d-inline-block">{state?.status}</span>
                                <h2 className="fw-900 mb-2">{state?.name}</h2>
                                <p className="text-muted"><i className="bi bi-mortarboard me-1"></i> تخصص {state?.projectType}</p>
                            </div>
                            <div className="text-start">
                                <span className="badge bg-light text-dark p-2 rounded-3">ID: {state?.projectId}</span>
                            </div>
                        </div>

                        <h5 className="fw-bold mb-3">وصف المشروع</h5>
                        <p className="text-secondary leading-loose mb-5">{state?.description}</p>

                        <h5 className="fw-bold mb-4">أعضاء الفريق ({count })</h5>
                        <div className="row g-3">
                            {members.map(member =>(
                                <div key={member.fullName} className="col-md-6">
                                    <div
                                        className="member-item p-3 d-flex align-items-center gap-3"
                                        onClick={() => navigate(`/profile/${member.id}`)}
                                    >
                                        <img
                                              src={member.imagePath 
                                                        ? `https://localhost:7011${member.imagePath}` 
                                                        : getDefaultAvatar(member.id)
                                                    }
                                            style={{ width: '50px', height: '50px', borderRadius: '12px' }}
                                            alt="avatar"
                                        />
                                        <div>
                                           <h6 className="fw-bold mb-0">
                                                    {member.fullName}

                                                    {member.id === user?.id && (
                                                        <span className="ms-2 badge bg-info text-white small">
                                                            أنت
                                                        </span>
                                                    )}

                                                    {member.role === "Manger" && (
                                                        <span className="ms-2 badge bg-warning text-dark small">
                                                            قائد
                                                        </span>
                                                    )}
                                            </h6>
                                            <small className="text-muted">{member.role}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card detail-card shadow-sm p-4 bg-white mb-4 border-0">
                        <h5 className="fw-bold mb-4">روابط سريعة</h5>
                        <a href={""} target="_blank" rel="noreferrer" className="link-box mb-3 border">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-github fs-3 me-3"></i>
                                <div>
                                    <div className="fw-bold">مستودع الكود (GitHub)</div>
                                    <small className="text-muted">مشاهدة الكود المصدري</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="card detail-card shadow-sm p-4 bg-white border-0">
                        <h5 className="fw-bold mb-4">إدارة الفريق</h5>

                        <button
                            className="btn w-100 py-3 mb-3 fw-bold shadow-sm btn-action text-white"
                            style={{ background: '#2c3e50' }}
                            onClick={() => navigate(`/todo-list/${state?.id}`)}
                        >
                            <i className="bi bi-check2-square me-2"></i> قائمة مهام الفريق
                        </button>

                        <button
                            className="btn w-100 py-3 mb-3 fw-bold shadow-sm btn-action"
                            style={{ background: mainGreen, color: 'white' }}
                            onClick={() => navigate(`/evaluate/${state?.id}`)}
                        >
                            <i className="bi bi-star-fill me-2"></i> تقييم أعضاء الفريق
                        </button>

                        {/* زر المغادرة يظهر للجميع ولكن بآلية تحقق مختلفة للقائد */}
                        <button
                            className="btn btn-outline-danger w-100 py-3 fw-bold btn-action"
                            onClick={handleLeaveTeam}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> مغادرة الفريق
                        </button>

                        <hr className="my-4 opacity-25" />
                        <div className="text-center">
                            <small className="text-muted small">تاريخ الإنشاء: {state?.createdAt}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
