import React from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Dashboard = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44'; 


    const isLoggedIn = true; 

    const upcoming = [
        { 
            id: 1, 
            title: "المسابقة الوطنية للأمن السيبراني", 
            date: "10 يونيو 2024", 
            category: "تكنولوجيا المعلومات", 
            required: "فريق من 3-4 طلاب", 
            tags: ["Networking", "CyberSecurity"],
            organizer: "كلية تكنولوجيا المعلومات"
        },
        { 
            id: 2, 
            title: "منتدى الابتكار اللوجستي والأعمال", 
            date: "15 يونيو 2024", 
            category: "إدارة الأعمال", 
            required: "فريق من طالبين", 
            tags: ["Logistics", "Business"],
            organizer: "كلية الأعمال"
        },
        { 
            id: 3, 
            title: "هاكاثون البرمجيات الذكية", 
            date: "20 يونيو 2024", 
            category: "هندسة البرمجيات", 
            required: "فريق من 5 طلاب", 
            tags: ["AI", "Development"],
            organizer: "مركز الريادة"
        }
    ];

    const handleJoinClick = (id) => {
        if (!isLoggedIn) {
            Swal.fire({
                title: '<span style="font-family: Cairo">خطوة واحدة تفصلك!</span>',
                html: '<p style="font-family: Cairo">يجب تسجيل الدخول باستخدام بريدك الجامعي لتتمكن من الانضمام للفرق.</p>',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: mainGreen,
                cancelButtonColor: '#6e7881',
                confirmButtonText: 'تسجيل الدخول',
                cancelButtonText: 'تصفح كزائر',
                reverseButtons: true,
                customClass: { popup: 'rounded-4' }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                }
            });
        } else {
            navigate(`/competition-details/${id}`);
        }
    };

    return (
        <div className="dashboard-wrapper min-vh-100 text-end bg-white" dir="rtl">
            <style>
                {`
                    @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
                    
                    body { font-family: 'Cairo', sans-serif; color: #2c3e50; overflow-x: hidden; }
                    
                    .hero-section { 
                        background: linear-gradient(135deg, #ffffff 0%, #f1f5f3 100%); 
                        padding: 100px 0; 
                        position: relative;
                        overflow: hidden;
                        border-bottom: 1px solid #e9ecef; 
                    }

                    .bg-icon-person {
                        position: absolute;
                        left: 8%;
                        top: 50%;
                        transform: translateY(-50%);
                        font-size: 18rem;
                        color: ${mainGreen};
                        opacity: 0.12;
                        z-index: 1;
                    }

                    .bg-icon-trophy {
                        position: absolute;
                        left: 24%;
                        top: 30%;
                        font-size: 5rem;
                        color: ${mainGreen};
                        opacity: 0.2;
                        z-index: 1;
                        transform: rotate(15deg);
                    }

                    .hero-title { font-size: 2.8rem; font-weight: 900; color: #1a2a23; line-height: 1.2; position: relative; z-index: 2; }
                    .hero-title span { color: ${mainGreen}; }
                    .hero-subtitle { color: #5a6c64; font-size: 1.1rem; max-width: 600px; line-height: 1.7; position: relative; z-index: 2; }

                    .btn-prime { background-color: ${mainGreen}; color: white; border-radius: 10px; padding: 12px 32px; font-weight: 700; border: none; transition: 0.3s; cursor: pointer; }
                    .btn-prime:hover { background-color: #124130; transform: translateY(-2px); }
                    .btn-ghost { background: white; color: ${mainGreen}; border: 2px solid ${mainGreen}; border-radius: 10px; padding: 10px 32px; font-weight: 700; transition: 0.3s; cursor: pointer; text-decoration: none; display: inline-block; }
                    .btn-ghost:hover { background: ${mainGreen}; color: white; }

                    .comp-row { 
                        background: white; 
                        border: 1px solid #edf2f0; 
                        border-radius: 15px; 
                        transition: all 0.3s ease;
                        padding: 20px;
                        border-right: 6px solid transparent;
                    }
                    .comp-row:hover { border-right-color: ${mainGreen}; transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                    
                    .btn-publish {
                        background-color: ${mainGreen} !important;
                        color: white !important;
                        width: 50px;
                        height: 50px;
                        border-radius: 12px;
                        transition: 0.3s ease;
                        box-shadow: 0 4px 15px rgba(26,93,68,0.2) !important;
                    }
                    /* Swalt Styling */
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; border-radius: 20px !important; }
                `}
            </style>

            <div className="hero-section">
                <i className="bi bi-person-fill bg-icon-person"></i>
                <i className="bi bi-trophy-fill bg-icon-trophy"></i>

                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-8">
                            <h1 className="hero-title mb-4">
                                المنصة الرسمية <br />
                                <span>للفرق الطلابية بجامعة الزيتونة</span>
                            </h1>
                            <p className="hero-subtitle mb-5 fw-bold">
                                بيئة أكاديمية متكاملة تهدف إلى تمكين الطلاب من تكوين فرق تقنية وعلمية متجانسة للمشاركة في المسابقات المحلية والدولية.
                            </p>
                            
                            <div className="d-flex gap-3 justify-content-start">
                                {isLoggedIn ? (
                                    <button className="btn-prime shadow-sm" onClick={() => navigate('/competitions')}>
                                        ابدأ رحلتك الآن
                                    </button>
                                ) : (
                                    <>
                                        <button className="btn-prime shadow-sm" onClick={() => navigate('/login')}>
                                            تسجيل الدخول
                                        </button>
                                        <button className="btn-ghost" onClick={() => navigate('/verify-email')}>
                                            انضم إلينا الآن
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-5 mt-4">
                <h3 className="fw-bold mb-4" style={{borderRight: `4px solid ${mainGreen}`, paddingRight: '15px'}}>المسابقات المتاحة</h3>
                <div className="row g-4">
                    {upcoming.map(comp => (
                        <div key={comp.id} className="col-12">
                            <div className="comp-row d-md-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center gap-4">
                                    <div className="d-none d-md-block text-center border-start ps-4" style={{minWidth: '90px'}}>
                                        <h3 className="mb-0 fw-bold text-success">{comp.date.split(' ')[0]}</h3>
                                        <div className="text-muted small">{comp.date.split(' ')[1]}</div>
                                    </div>
                                    <div>
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <span className="badge bg-light text-success border">{comp.category}</span>
                                        </div>
                                        <h5 className="fw-bold mb-1">{comp.title}</h5>
                                        <div className="text-muted small fw-bold">
                                            <i className="bi bi-people-fill ms-1"></i> {comp.required}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 mt-md-0 d-flex gap-2">
                                    <button 
                                        className="btn btn-light btn-sm px-3 fw-bold border" 
                                        onClick={() => navigate(`/competition-details/${comp.id}`)}
                                    >
                                        التفاصيل
                                    </button>
                                    <button 
                                        className="btn-prime btn-sm px-3" 
                                        onClick={() => handleJoinClick(comp.id)}
                                    >
                                        انضمام للفريق
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isLoggedIn && (
                <button 
                    className="btn btn-publish shadow position-fixed bottom-0 start-0 m-4 d-flex align-items-center justify-content-center border-0"
                    title="إنشاء إعلان جديد"
                    onClick={() => navigate('/create-post')}
                >
                    <i className="bi bi-plus-lg fs-4"></i>
                </button>
            )}
        </div>
    );
};