import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import toast from 'react-hot-toast';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { AppColors } from '../theme/AppColors';

export const RegistrationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const mainGreen = AppColors.primaryGreen || '#1a5d44';
    
    const { user, token } = useAuth();
    const isLoggedIn = !!token;
    
    const [isProject, setIsProject] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingDetails, setLoadingDetails] = useState(true);

    // جعل الـ State قابلة للتحديث عند كتابة الطالب لرقمه
    const [formData, setFormData] = useState({
        studentId: user?.studentId || ''
    });

    // سحب الرقم الجامعي كقيمة أولية فقط إذا توفرت لتسهيل الإدخال
    useEffect(() => {
        if (user?.studentId) {
            setFormData({ studentId: user.studentId });
        }
    }, [user]);

    useEffect(() => {
        if (!isLoggedIn) {
            toast.error('يجب تسجيل الدخول أولاً');
            navigate('/login', { state: { from: `/registration/${id}` } });
            return;
        }

        const fetchPostDetails = async () => {
            try {
                const res = await apiFetch(`${baseUrl}api/Posts/GetProjectById?id=${id}`);
                if (!res.ok) throw new Error("Failed to fetch details");
                const data = await res.json();
                
                const checkIsProject = data.isGraduationProject === true;
                setIsProject(checkIsProject);
            } catch (err) {
                console.error("Error fetching post details:", err);
                toast.error("حدث خطأ أثناء جلب تفاصيل الإعلان");
            } finally {
                setLoadingDetails(false);
            }
        };

        if (id) fetchPostDetails();
    }, [id, isLoggedIn, navigate, baseUrl]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id) {
            Swal.fire("خطأ", "رقم الإعلان غير موجود", "error");
            return;
        }

        // التحقق من أن الطالب أدخل رقماً جامعياً ولم يترك الحقل فارغاً
        if (!formData.studentId.trim()) {
            Swal.fire("تنبيه", "يرجى إدخال رقمك الجامعي بشكل صحيح", "warning");
            return;
        }

        const confirmationHtml = isProject 
            ? `أنت على وشك إرسال طلب انضمام لعمل هذا المشروع بالرقم الجامعي: <b>${formData.studentId}</b>`
            : `أنت على وشك التسجيل في هذه المسابقة العلمية بالرقم الجامعي: <b>${formData.studentId}</b>`;

        const confirmResult = await Swal.fire({
            title: 'تأكيد إرسال الطلب',
            html: confirmationHtml,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، أرسل الطلب',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: mainGreen,
        });

        if (!confirmResult.isConfirmed) return;

        setIsSubmitting(true);

        Swal.fire({
            title: 'جاري معالجة طلبك حالياً...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading()
        });

        try {
            // ملاحظة: الـ API الحالي يستقبل الـ projectId فقط، 
            // إذا كان الـ API بحاجة لاستقبال الـ studentId المدخل يدوياً، قم بإضافته داخل الـ body هنا.
            const response = await apiFetch(
                `${baseUrl}api/PostRequests/SendPostRequestToManager`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        projectId: Number(id)
                        // studentId: formData.studentId // أزل التعليق عن هذا السطر إذا كان الـ API يدعمه
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "فشلت عملية إرسال الطلب");
            }

            Swal.fire({
                title: 'تم إرسال طلبك بنجاح 🎉',
                text: isProject ? 'تم إرسال طلب الانضمام للمشروع بنجاح، بانتظار موافقة صاحب المشروع.' : 'تم تسجيلك في المسابقة وبانتظار موافقة الإدارة.',
                icon: 'success',
                confirmButtonColor: mainGreen
            }).then(() => {
                navigate(isProject ? `/profile/${user?.id}` : `/competitions`);
            });

        } catch (error) {
            console.error(error);
            Swal.fire({
                title: 'خطأ أثناء الإرسال ❌',
                text: error.message || 'حدث خطأ غير متوقع، يرجى المحاولة مرة أخرى',
                icon: 'error'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isLoggedIn) return null;

    if (loadingDetails) {
        return (
            <div className="d-flex justify-content-center align-items-center vh-100 text-success fw-bold fs-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                جاري فحص وتحديد نوع الإعلان...
            </div>
        );
    }

    return (
        <div className="container py-5 min-vh-100" dir="rtl" style={{fontFamily: 'Cairo, sans-serif'}}>
            <style>
                {`
                    .reg-card { border-radius: 25px; border: none; overflow: hidden; background: white; }
                    .custom-input { background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 12px; }
                    .custom-input:focus { border-color: ${mainGreen}; box-shadow: 0 0 0 3px rgba(26, 93, 68, 0.1); outline: none; }
                    .btn-main { background: ${mainGreen}; color: white; border-radius: 12px; padding: 14px; border: none; font-weight: bold; width: 100%; transition: 0.3s; }
                    .btn-main:hover { filter: brightness(1.1); transform: translateY(-2px); }
                    .swal2-html-container { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <div className="card reg-card shadow-lg border-0">
                        <div className="p-4 text-white text-center" style={{ backgroundColor: mainGreen }}>
                            <h5 className="fw-bold mb-1">
                                {isProject ? 'طلب انضمام لمشروع تخرج' : 'تسجيل في المسابقة العلمية'}
                            </h5>
                            <p className="small opacity-75 mb-0">مرحباً بك، {user?.fullName?.split(' ')[0]}</p>
                        </div>

                        <div className="card-body p-4 p-md-5 text-end">
                            <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
                                
                                <div className="mb-4">
                                    <label className="form-label small fw-bold">الرقم الجامعي للمتقدم</label>
                                    <input 
                                        type="text" 
                                        className="form-control custom-input text-end" 
                                        value={formData.studentId}
                                        onChange={(e) => setFormData({ studentId: e.target.value })}
                                        placeholder="أدخل رقمك الجامعي هنا (مثال: 202210123)" 
                                        required
                                    />
                                    <div className="form-text x-small text-muted">
                                        يرجى التأكد من كتابة الرقم الجامعي بشكل صحيح لربطه بملفك الأكاديمي.
                                    </div>
                                </div>

                                <div className="d-flex gap-2 mt-4">
                                    <button type="submit" disabled={isSubmitting} className="btn-main flex-grow-1">
                                        {isSubmitting ? 'جاري إرسال الطلب...' : isProject ? 'إرسال طلب الانضمام للمشروع' : 'تأكيد التسجيل بالمسابقة'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationPage;