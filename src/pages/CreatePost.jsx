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
            navigate('/login');
        } else {
            // تصحيح: يجب أن تكون true ليتم عرض المحتوى
            setIsAuthorized(true);
        }
    }, [navigate]);

    const categories = [
        { id: 'comp', label: 'مسابقة', icon: 'trophy' },
        { id: 'proj', label: 'مشروع', icon: 'mortarboard' },
        { id: 'hack', label: 'هاكاثون', icon: 'code-slash' }
    ];

    // دالة موحدة لتحديث الحالة (توفيراً للكود)
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedDate = new Date(formData.deadline);
    const today = new Date();
    if (selectedDate < today) {
        return Swal.fire({
            icon: 'error',
            title: 'التاريخ غير منطقي',
            text: 'يرجى اختيار تاريخ موعد نهائي في المستقبل.',
            confirmButtonColor: mainGreen,
        });
    }

    try {
        Swal.fire({
            title: 'جاري النشر...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });

        // 🔥 تحويل البيانات للشكل المطلوب للـ C#
        const dataToSend = {
            name: formData.title,
            descriptions: formData.content,
            rating: "0",
            isGraduationProject: formData.category === "مشروع",
            endDate: new Date(formData.deadline).toISOString(),
            skills: formData.skills,
            availableSeats: formData.participationType === "فريق" ? formData.maxMembers : 1,
            projectLocation: formData.location,
            teamType: formData.participationType,
            numberOfAvailableSeats: formData.maxMembers
        };

        const response = await fetch("https://localhost:7011/api/Posts/Create", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(dataToSend)
        });

        if (!response.ok) throw new Error("Request failed");

        Swal.fire({
            icon: 'success',
            title: 'تم النشر بنجاح!',
            confirmButtonColor: mainGreen,
        }).then(() => {
            navigate('/competitions');
        });

    } catch (error) {
        console.error(error);

        Swal.fire({
            icon: 'error',
            title: 'فشل النشر',
            text: 'حدث خطأ أثناء إرسال البيانات',
            confirmButtonColor: mainGreen,
        });
    }
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
                                <input name="title" type="text" className="form-control compact-input" placeholder="مثلاً: مسابقة البرمجة السنوية" 
                                    required value={formData.title} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label text-danger">الموعد النهائي</label>
                                <input name="deadline" type="date" className="form-control compact-input" 
                                    required value={formData.deadline} onChange={handleChange} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">الجائزة / المحفز (إن وجد)</label>
                                <input name="prize" type="text" className="form-control compact-input" placeholder="مكافأة، شهادة، مبلغ.."
                                    value={formData.prize} onChange={handleChange} />
                            </div>

                            <div className="col-md-6">
                                <label className="form-label">طريقة المشاركة</label>
                                <select name="participationType" className="form-select compact-input" 
                                    value={formData.participationType} onChange={handleChange}>
                                    <option value="فردي">فردي فقط</option>
                                    <option value="فريق">فريق عمل</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">مكان المسابقة / العمل</label>
                                <select name="location" className="form-select compact-input" 
                                    value={formData.location} onChange={handleChange}>
                                    <option value="أونلاين">أونلاين</option>
                                    <option value="داخل الحرم الجامعي">داخل الحرم الجامعي</option>
                                    <option value="مختبر الحاسوب">مختبر الحاسوب</option>
                                </select>
                            </div>

                            {formData.participationType === 'فريق' && (
                                <div className="col-12 animate__animated animate__fadeIn">
                                    <label className="form-label">الحد الأقصى لأعضاء الفريق</label>
                                    <input name="maxMembers" type="number" min="2" className="form-control compact-input" 
                                        value={formData.maxMembers} onChange={handleChange} />
                                </div>
                            )}

                            <div className="col-12">
                                <label className="form-label">وصف الإعلان</label>
                                <textarea name="content" className="form-control compact-input" rows="2" placeholder="اكتب نبذة مختصرة..."
                                    required value={formData.content} onChange={handleChange}></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label">الشروط والمهارات المطلوبة</label>
                                <textarea name="skills" className="form-control compact-input border-success-subtle" rows="2" placeholder="مهارات محددة، معدل معين، إلخ..."
                                    value={formData.skills} onChange={handleChange}></textarea>
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
