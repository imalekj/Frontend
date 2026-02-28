import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const TeamDetails = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    
    const teamData = {
        id: "T-908",
        name: "فريق تطوير منصة الخريجين",
        description: "مشروع يهدف لربط خريجي جامعة الزيتونة بسوق العمل وتوفير فرص تدريبية احترافية.",
        major: "هندسة البرمجيات",
        status: "قيد التطوير",
        createdAt: "12 فبراير 2026",
        githubUrl: "https://github.com/zuj/project",
        members: [
            { id: 101, name: "أحمد علي", role: "Team Leader", isOwner: true },
            { id: 102, name: "سارة خالد", role: "UI/UX Designer", isOwner: false },
            { id: 103, name: "خالد منصور", role: "Frontend Developer", isOwner: false },
            { id: 104, name: "ليلى حسن", role: "Backend Developer", isOwner: false },
        ]
    };

    const getDefaultAvatar = (seed) => `https://api.dicebear.com/7.x/identicon/svg?seed=${seed}`;

    const handleLeaveTeam = () => {
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
                `}
            </style>

            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card detail-card shadow-sm p-4 p-md-5 bg-white">
                        <div className="d-flex justify-content-between align-items-start mb-4">
                            <div>
                                <span className="status-badge mb-2 d-inline-block">{teamData.status}</span>
                                <h2 className="fw-900 mb-2">{teamData.name}</h2>
                                <p className="text-muted"><i className="bi bi-mortarboard me-1"></i> تخصص {teamData.major}</p>
                            </div>
                            <div className="text-start">
                                <span className="badge bg-light text-dark p-2 rounded-3">ID: {teamData.id}</span>
                            </div>
                        </div>

                        <h5 className="fw-bold mb-3">وصف المشروع</h5>
                        <p className="text-secondary leading-loose mb-5">{teamData.description}</p>

                        <h5 className="fw-bold mb-4">أعضاء الفريق ({teamData.members.length})</h5>
                        <div className="row g-3">
                            {teamData.members.map(member => (
                                <div key={member.id} className="col-md-6">
                                
                                    <div 
                                        className="member-item p-3 d-flex align-items-center gap-3"
                                        onClick={() => navigate(`/profile/${member.id}`)}
                                    >
                                        <img 
                                            src={getDefaultAvatar(member.id + member.name)} 
                                            style={{ width: '50px', height: '50px', borderRadius: '12px' }} 
                                            alt="avatar" 
                                        />
                                        <div>
                                            <h6 className="fw-bold mb-0">
                                                {member.name} 
                                                {member.isOwner && <span className="ms-2 badge bg-warning text-dark small" style={{fontSize: '0.6rem'}}>قائد</span>}
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
                    <div className="card detail-card shadow-sm p-4 bg-white mb-4">
                        <h5 className="fw-bold mb-4">روابط سريعة</h5>
                        <a href={teamData.githubUrl} target="_blank" rel="noreferrer" className="link-box mb-3 border">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-github fs-3 me-3"></i>
                                <div>
                                    <div className="fw-bold">مستودع الكود (GitHub)</div>
                                    <small className="text-muted">مشاهدة الكود المصدري</small>
                                </div>
                            </div>
                        </a>
                    </div>

                    <div className="card detail-card shadow-sm p-4 bg-white">
                        <h5 className="fw-bold mb-4">الإجراءات</h5>
                        <button 
                            className="btn w-100 py-3 mb-3 fw-bold shadow-sm"
                            style={{ background: mainGreen, color: 'white', borderRadius: '15px' }}
                            onClick={() => navigate(`/evaluate/${teamData.id}`)}
                        >
                            <i className="bi bi-star-fill me-2"></i> تقييم أعضاء الفريق
                        </button>
                        
                    
                        <button 
                            className="btn btn-outline-danger w-100 py-3 fw-bold" 
                            style={{ borderRadius: '15px' }}
                            onClick={handleLeaveTeam}
                        >
                            <i className="bi bi-box-arrow-right me-2"></i> مغادرة الفريق
                        </button>
                        
                        <hr className="my-4 opacity-25" />
                        <div className="text-center">
                            <small className="text-muted">تاريخ الإنشاء: {teamData.createdAt}</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};