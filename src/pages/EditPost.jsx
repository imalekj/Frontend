import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { AppColors } from '../theme/AppColors';

export const EditPost = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { postId } = useParams();
    const [formData, setFormData] = useState({
        title: '',
        category: 'مسابقة',
        faculty: 'العلوم وتكنولوجيا المعلومات',
        participationType: 'فريق',
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
            return;
        }
        setIsAuthorized(true);

        const fetchPostData = async () => {
            try {
                const response = await apiFetch(`${baseUrl}api/Posts/GetProjectById?id=${postId}`);
                if (!response.ok) throw new Error("فشل في جلب بيانات المنشور");
                
                const data = await response.json();
                const formattedDate = data.endDate ? data.endDate.split('T')[0] : '';

                setFormData({
                    title: data.name || '',
                    category: data.isGraduationProject ? 'مشروع' : 'مسابقة',
                    faculty: data.projectLocation || 'العلوم وتكنولوجيا المعلومات',
                    participationType: data.teamType || 'فريق',
                    maxMembers: data.numberOfAvailableSeats || 3,
                    deadline: formattedDate,
                    prize: data.prize || '',
                    location: data.location || 'أونلاين',
                    content: data.descriptions || '',
                    skills: data.skills || '',
                });
                setIsLoading(false);
            } catch (error) {
                console.error(error);
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'حدث خطأ أثناء تحميل بيانات المنشور الأصلية.',
                    confirmButtonColor: AppColors.primaryGreen,
                }).then(() => navigate(-1));
            }
        };

        fetchPostData();
    }, [navigate, postId, baseUrl]);

    const categories = [
        { id: 'comp', label: 'مسابقة', icon: 'trophy' },
        { id: 'proj', label: 'مشروع', icon: 'mortarboard' }
    ];

    const faculties = [
        'العلوم وتكنولوجيا المعلومات',
        'الهندسة والتكنولوجيا',
        'الصيدلة',
        'التمريض',
        'الآداب',
        'الأعمال',
        'الحقوق',
        'العمارة والتصميم'
    ];

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
                confirmButtonColor: AppColors.primaryGreen,
            });
        }

        try {
            Swal.fire({
                title: 'جاري حفظ التعديلات...',
                allowOutsideClick: false,
                didOpen: () => Swal.showLoading(),
            });

            const isProject = formData.category === "مشروع";

          

            const token = localStorage.getItem("token");

            const user = JSON.parse(localStorage.getItem("user"));

const dataToSend = {
    projectID: Number(postId),
    name: formData.title,
    descriptions: formData.content,
    rating: "0",
    isGraduationProject: isProject,
    endDate: new Date(formData.deadline).toISOString(),
    skills: formData.skills,
    availableSeats: isProject
        ? formData.maxMembers
        : (formData.participationType === "فريق"
            ? formData.maxMembers
            : 1),
    projectLocation: formData.faculty,
    teamType: isProject ? "فريق" : formData.participationType,
    numberOfAvailableSeats: Number(formData.maxMembers),
    userId: user?.id
};

const response = await apiFetch(
    `${baseUrl}api/Posts/UpdatePost`,
    {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
    }
);
            if (!response.ok) throw new Error("Update request failed");

            Swal.fire({
                icon: 'success',
                title: 'تم تعديل المنشور بنجاح!',
                confirmButtonColor: AppColors.primaryGreen,
            }).then(() => {
                navigate('/competitions');
            });

        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: 'error',
                title: 'فشل التعديل',
                text: 'حدث خطأ أثناء حفظ البيانات المعدلة',
                confirmButtonColor: AppColors.primaryGreen,
            });
        }
    };

    const handleCancel = () => {
        Swal.fire({
            title: 'إلغاء التعديل؟',
            text: "لن يتم حفظ أي تغييرات قمت بإجرائها.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: AppColors.colorRed,
            cancelButtonColor: AppColors.primaryGreen,
            confirmButtonText: 'نعم، ألغِ التعديل',
            cancelButtonText: 'إكمال التعديل',
            reverseButtons: true,
            customClass: { popup: 'rounded-4' }
        }).then((result) => {
            if (result.isConfirmed) {
                navigate(-1);
            }
        });
    };

    if (!isAuthorized || isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh', color: AppColors.primaryGreen }}>
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">جاري التحميل...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .mini-card { max-width: 580px; margin: 0 auto; border-radius: 25px; border: none; background: ${AppColors.backgroundCard}; }
                    .header-mini { background: ${AppColors.primaryGreen}; color: white; padding: 15px; border-radius: 25px 25px 0 0; }
                    .category-btn { 
                        cursor: pointer; border: 1.5px solid ${AppColors.borderInput}; border-radius: 12px; 
                        padding: 12px; transition: 0.2s; flex: 1; text-align: center; font-size: 0.85rem; background: ${AppColors.backgroundCard};
                        color: ${AppColors.textSecondary};
                    }
                    .category-btn.active { background: ${AppColors.primaryGreen}; color: white; border-color: ${AppColors.primaryGreen}; }
                    .form-label { font-size: 0.75rem; font-weight: 800; color: ${AppColors.primaryGreen}; margin-bottom: 4px; margin-top: 8px; }
                    .compact-input { 
                        background: ${AppColors.backgroundScreenLight}; border: 1.5px solid ${AppColors.borderInput}; border-radius: 10px; 
                        padding: 8px 12px; font-size: 0.85rem; transition: 0.3s; color: ${AppColors.textPrimary};
                    }
                    .compact-input:focus { border-color: ${AppColors.primaryGreen}; box-shadow: 0 0 0 3px rgba(27, 94, 56, 0.05); outline: none; background: ${AppColors.backgroundCard}; }
                    .btn-publish { background: ${AppColors.primaryGreen}; color: white; border-radius: 10px; padding: 10px; font-weight: 700; border: none; width: 100%; transition: 0.3s; }
                    .btn-publish:hover { background: ${AppColors.primaryDark}; transform: scale(1.02); }
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="card mini-card shadow-lg">
                <div className="header-mini text-center">
                    <h6 className="mb-0 fw-900 fs-5">تعديل بيانات المنشور</h6>
                </div>

                <div className="card-body p-3 p-md-4">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-2">
                            <label className="form-label">نوع المنشور (التصنيف)</label>
                            <div className="d-flex gap-3">
                                {categories.map((cat) => (
                                    <div key={cat.id}
                                        className={`category-btn ${formData.category === cat.label ? 'active' : ''}`}
                                        onClick={() => setFormData({ ...formData, category: cat.label })}>
                                        <i className={`bi bi-${cat.icon} d-block mb-1 fs-5`}></i>
                                        <span className="fw-bold">{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="row g-2">
                            <div className="col-12">
                                <label className="form-label">الكلية المستهدفة</label>
                                <select name="faculty" className="form-select compact-input"
                                    value={formData.faculty} onChange={handleChange}>
                                    {faculties.map((fac, idx) => (
                                        <option key={idx} value={fac}>{fac}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-12">
                                <label className="form-label">العنوان الرئيسي</label>
                                <input name="title" type="text" className="form-control compact-input" placeholder={formData.category === 'مشروع' ? "مثلاً: مشروع تخرج نظام ذكي" : "مثلاً: مسابقة البرمجة السنوية"}
                                    required value={formData.title} onChange={handleChange} />
                            </div>

                            <div className="col-12">
                                <label className="form-label" style={{ color: AppColors.colorRed }}>الموعد النهائي للنشر / التسجيل</label>
                                <input name="deadline" type="date" className="form-control compact-input"
                                    required value={formData.deadline} onChange={handleChange} />
                            </div>

                            {formData.category !== 'مشروع' && (
                                <>
                                    <div className="col-12">
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
                                </>
                            )}

                            {(formData.category === 'مشروع' || formData.participationType === 'فريق') && (
                                <div className="col-12">
                                    <label className="form-label">الحد الأقصى لأعضاء الفريق (عدد الأعضاء)</label>
                                    <input name="maxMembers" type="number" min="2" className="form-control compact-input"
                                        value={formData.maxMembers} onChange={handleChange} />
                                </div>
                            )}

                            <div className="col-12">
                                <label className="form-label">نبذة عن الإعلان (الوصف)</label>
                                <textarea name="content" className="form-control compact-input" rows="3" placeholder="اكتب نبذة مختصرة عن المشروع أو المسابقة..."
                                    required value={formData.content} onChange={handleChange}></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label">الشروط والمهارات المطلوبة</label>
                                <textarea name="skills" className="form-control compact-input" rows="3" placeholder="مهارات محددة، لغات برمجة، شروط معينة إلخ..."
                                    style={{ borderColor: AppColors.borderInput }}
                                    value={formData.skills} onChange={handleChange}></textarea>
                            </div>
                        </div>

                        <div className="mt-4 d-grid gap-2 d-md-flex">
                            <button type="submit" className="btn-publish order-md-2 shadow-sm">
                                حفظ التعديلات <i className="bi bi-check-circle ms-1"></i>
                            </button>
                            <button type="button" className="btn btn-light rounded-3 px-4 fw-bold border order-md-1" 
                                style={{ backgroundColor: AppColors.backgroundScreenLight, color: AppColors.textSecondary, borderColor: AppColors.borderInput }} 
                                onClick={handleCancel}>
                                إلغاء
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPost;
