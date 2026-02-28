import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const MyTeams = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const defaultAvatar = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

    const [teams, setTeams] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setTimeout(() => {
                    const dbData = [
                        {
                            id: "T-701",
                            contestName: "هاكاثون جامعة الزيتونة للذكاء الاصطناعي",
                            projectName: "نظام تشخيص الأمراض",
                            role: "قائد الفريق",
                            membersCount: 4,
                            status: "active",
                            isSubmitted: true,
                            lastUpdate: "منذ يومين"
                        },
                        {
                            id: "T-805",
                            contestName: "مسابقة البرمجة العربية",
                            projectName: "إدارة الموارد المائية",
                            role: "مطور واجهات",
                            membersCount: 3,
                            status: "completed",
                            isSubmitted: true,
                            lastUpdate: "منذ شهر"
                        }
                    ];
                    setTeams(dbData);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                Swal.fire('خطأ', 'فشل في جلب بيانات الفرق', 'error');
                setLoading(false);
            }
        };

        fetchTeams();
    }, []);

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ maxWidth: '900px', fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .team-card {
                        border-radius: 20px;
                        border: 1px solid #f0f0f0;
                        transition: 0.3s;
                        background: white;
                        padding: 1.25rem !important;
                    }
                    .team-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 10px 25px rgba(0,0,0,0.05) !important;
                    }
                    .member-avatar {
                        width: 32px;
                        height: 32px;
                        border-radius: 50%;
                        border: 2px solid #fff;
                        margin-left: -10px; /* لعمل تأثير التداخل */
                        background: #eee;
                    }
                    .status-badge {
                        padding: 4px 10px;
                        border-radius: 8px;
                        font-size: 0.7rem;
                        font-weight: 700;
                    }
                    .btn-action-sm {
                        border-radius: 10px;
                        padding: 6px 15px;
                        font-weight: 700;
                        font-size: 0.8rem;
                    }
                `}
            </style>

            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold mb-1" style={{ color: mainGreen }}>فرق عملي</h4>
                    <p className="text-muted small mb-0">إدارة ومتابعة مشاريعك الجامعية</p>
                </div>
                <button className="btn btn-sm btn-outline-success rounded-pill px-3" onClick={() => window.location.reload()}>
                    <i className="bi bi-arrow-clockwise ms-1"></i> تحديث
                </button>
            </div>

            <div className="row g-3">
                {loading ? (
                    <div className="text-center py-5 w-100">
                        <div className="spinner-border text-success" role="status"></div>
                        <p className="mt-2 text-muted">جاري جلب الفرق ...</p>
                    </div>
                ) : teams.length > 0 ? (
                    teams.map((team) => (
                        <div className="col-md-6" key={team.id}>
                            <div className="card team-card shadow-sm h-100">
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <div className="p-2 rounded-3 bg-light text-success" style={{ fontSize: '1.2rem' }}>
                                            <i className="bi bi-code-square"></i>
                                        </div>
                                        <div>
                                            <h6 className="fw-bold mb-0 text-dark">{team.projectName}</h6>
                                            <small className="text-muted" style={{ fontSize: '0.65rem' }}>ID: {team.id}</small>
                                        </div>
                                    </div>
                                    <span className={`status-badge ${team.status === 'active' ? 'bg-success-subtle text-success' : 'bg-light text-secondary'}`}>
                                        {team.status === 'active' ? 'نشط' : 'مكتمل'}
                                    </span>
                                </div>

                                <div className="mb-3">
                                    <div className="small mb-2 text-secondary">
                                        <i className="bi bi-trophy-fill text-warning ms-1"></i> {team.contestName}
                                    </div>

                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="small">
                                            <span className="text-muted">دورك:</span> <b className="text-dark">{team.role}</b>
                                        </div>
                                        <div className="d-flex align-items-center">
                                            {[...Array(team.membersCount)].map((_, i) => (
                                                <img
                                                    key={i}
                                                    src={defaultAvatar}
                                                    alt="member"
                                                    className="member-avatar"
                                                    title="عضو الفريق"
                                                />
                                            ))}
                                            <span className="small text-muted me-2" style={{ fontSize: '0.7rem' }}>+{team.membersCount}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-2 border-top d-flex justify-content-between align-items-center">
                                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>{team.lastUpdate}</span>
                                    <div className="d-flex gap-2">
                                        <button
                                            onClick={() => navigate(`/team-details/${team.id}`)}
                                            className="btn btn-light btn-action-sm border shadow-sm"
                                        >
                                            <i className="bi bi-info-circle me-1"></i> التفاصيل
                                        </button>
                                        {team.isSubmitted && (
                                            <button
                                                onClick={() => navigate(`/evaluate/${team.id}`)}
                                                className="btn btn-warning btn-action-sm shadow-sm"
                                            >
                                                تقييم
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-5">
                        <h5 className="text-muted">لا توجد بيانات متاحة</h5>
                    </div>
                )}
            </div>
        </div>
    );
};