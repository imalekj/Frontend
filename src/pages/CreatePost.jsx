import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const CreatePost = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        category: 'مسابقة',
        participationType: 'فردي',
        maxMembers: 3,
        deadline: '', 
        prize: '', 
        location: 'أونلاين',
        content: '',
        skills: '',
    });

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
        } else {
            setIsAuthorized(true);
        }
    }, [navigate]);

    const categories = [
        { id: 'comp', label: 'مسابقة', icon: 'trophy' },
        { id: 'proj', label: 'مشروع', icon: 'mortarboard' },
        { id: 'hack', label: 'هاكاثون', icon: 'code-slash' }
    ];


    const handleSubmit = (e) => {
        e.preventDefault();
        
    
        Swal.fire({
            title: 'جاري النشر...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            timer: 1500
        }).then(() => {
            console.log("Post Data:", formData);
            
            Swal.fire({
                icon: 'success',
                title: 'تم النشر بنجاح!',
                text: 'سيكون منشورك مرئياً لمجتمع الزيتونة الآن.',
                confirmButtonColor: mainGreen,
                confirmButtonText: 'رائع',
                customClass: { popup: 'rounded-4' }
            }).then(() => {
                navigate('/competitions');
            });
        });
    };

    const handleCancel = () => {
        if (formData.title || formData.content) {
            Swal.fire({
                title: 'تجاهل المسودة؟',
                text: "لديك تغييرات غير محفوظة، هل أنت متأكد من الخروج؟",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: mainGreen,
                confirmButtonText: 'نعم، اخرج',
                cancelButtonText: 'إكمال الكتابة',
                reverseButtons: true,
                customClass: { popup: 'rounded-4' }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate(-1);
                }
            });
        } else {
            navigate(-1);
        }
    };

    if (!isAuthorized) return null;

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .mini-card { max-width: 580px; margin: 0 auto; border-radius: 25px; border: none; }
                    .header-mini { background: ${mainGreen}; color: white; padding: 15px; border-radius: 25px 25px 0 0; }
                    .category-btn { 
                        cursor: pointer; border: 1.5px solid #f0f0f0; border-radius: 12px; 
                        padding: 6px; transition: 0.2s; flex: 1; text-align: center; font-size: 0.75rem; background: white;
                    }
                    .category-btn.active { background: ${mainGreen}; color: white; border-color: ${mainGreen}; }
                    .form-label { font-size: 0.75rem; font-weight: 800; color: ${mainGreen}; margin-bottom: 4px; margin-top: 8px; }
                    .compact-input { 
                        background: #fdfdfd; border: 1.5px solid #eee; border-radius: 10px; 
                        padding: 8px 12px; font-size: 0.85rem; transition: 0.3s;
                    }
                    .compact-input:focus { border-color: ${mainGreen}; box-shadow: 0 0 0 3px rgba(26, 93, 68, 0.05); outline: none; }
                    .btn-publish { background: ${mainGreen}; color: white; border-radius: 10px; padding: 10px; font-weight: 700; border: none; width: 100%; transition: 0.3s; }
                    .btn-publish:hover { opacity: 0.9; transform: scale(1.02); }
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="card mini-card shadow-lg">
                <div className="header-mini text-center">
                    <h6 className="mb-0 fw-900 fs-5">إرسال منشور للمجتمع</h6>
                </div>

                <div className="card-body p-3 p-md-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">نوع المنشور</label>
                            <div className="d-flex gap-2">
                                {categories.map((cat) => (
                                    <div key={cat.id} 
                                        className={`category-btn ${formData.category === cat.label ? 'active' : ''}`}
                                        onClick={() => setFormData({...formData, category: cat.label})}>
                                        <i className={`bi bi-${cat.icon} d-block mb-1 fs-6`}></i>
                                        <span className="fw-bold">{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="row g-2">
                            <div className="col-12">
                                <label className="form-label">العنوان الرئيسي</label>
                                <input type="text" className="form-control compact-input" placeholder="مثلاً: مسابقة البرمجة السنوية" 
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({...formData, title: e.target.value})} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-danger">الموعد النهائي</label>
                                <input type="date" className="form-control compact-input" 
                                    required
                                    onChange={(e) => setFormData({...formData, deadline: e.target.value})} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">الجائزة / المحفز (إن وجد)</label>
                                <input type="text" className="form-control compact-input" placeholder="مكافأة، شهادة، مبلغ.."
                                    onChange={(e) => setFormData({...formData, prize: e.target.value})} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">طريقة المشاركة</label>
                                <select className="form-select compact-input" 
                                    onChange={(e) => setFormData({...formData, participationType: e.target.value})}>
                                    <option value="فردي">فردي فقط</option>
                                    <option value="فريق">فريق عمل</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">مكان المسابقة / العمل</label>
                                <select className="form-select compact-input" 
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}>
                                    <option value="أونلاين">أونلاين</option>
                                    <option value="داخل الحرم الجامعي">داخل الحرم الجامعي</option>
                                    <option value="مختبر الحاسوب">مختبر الحاسوب</option>
                                </select>
                            </div>

                            {formData.participationType === 'فريق' && (
                                <div className="col-12 animate__animated animate__fadeIn">
                                    <label className="form-label">الحد الأقصى لأعضاء الفريق</label>
                                    <input type="number" min="2" className="form-control compact-input" placeholder="عدد الأشخاص المسموح بهم"
                                        onChange={(e) => setFormData({...formData, maxMembers: e.target.value})} />
                                </div>
                            )}

                            <div className="col-12">
                                <label className="form-label">وصف الإعلان</label>
                                <textarea className="form-control compact-input" rows="2" placeholder="اكتب نبذة مختصرة..."
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({...formData, content: e.target.value})}></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label">الشروط والمهارات المطلوبة</label>
                                <textarea className="form-control compact-input border-success-subtle" rows="2" placeholder="مهارات محددة، معدل معين، إلخ..."
                                    onChange={(e) => setFormData({...formData, skills: e.target.value})}></textarea>
                            </div>
                        </div>

                        <div className="mt-4 d-grid gap-2 d-md-flex">
                            <button type="submit" className="btn-publish order-md-2 shadow-sm">
                                نشر الآن <i className="bi bi-rocket-takeoff ms-1"></i>
                            </button>
                            <button type="button" className="btn btn-light rounded-3 px-4 fw-bold border order-md-1" onClick={handleCancel}>
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};