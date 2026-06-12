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
    const [regType, setRegType] = useState('individual');
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [maxSeats, setMaxSeats] = useState(1); 
    const [loadingDetails, setLoadingDetails] = useState(true);

    const [formData, setFormData] = useState({
        studentId: user?.studentId || '', 
        teamName: '',
        teamMembers: [] 
    });


    useEffect(() => {
        if (user?.studentId) {
            setFormData(prev => ({
                ...prev,
                studentId: user.studentId
            }));
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
                const data = await res.json();
                
                const checkIsProject = data.isGraduationProject === true;
                setIsProject(checkIsProject);

                const seats = data.availableSeats ? Number(data.availableSeats) : 1;
                setMaxSeats(seats);

                if (checkIsProject) {
                    setRegType('individual');
                    setStep(2); 
                } else {
                    if (seats <= 1) {
                        setRegType('individual');
                        setStep(2);
                    } else {
                        const extraMembersCount = seats - 1 > 0 ? seats - 1 : 0;
                        setFormData(prev => ({
                            ...prev,
                            teamMembers: Array(extraMembersCount).fill('')
                        }));
                    }
                }
            } catch (err) {
                console.error("Error fetching post details:", err);
                toast.error("حدث خطأ أثناء جلب تفاصيل الشواغر والمقاعد");
            } finally {
                LoadingDetails(false);
            }
        };

        if (id) fetchPostDetails();
    }, [id, isLoggedIn, navigate, baseUrl]);

    const handleMemberNameChange = (index, value) => {
        const updatedMembers = [...formData.teamMembers];
        updatedMembers[index] = value;
        setFormData({ ...formData, teamMembers: updatedMembers });
    };

    const goToNextStep = () => {
        setStep(2);
        toast(`تم اختيار الانضمام الـ${regType === 'individual' ? 'فردي' : 'جماعي كفريق'}`, {
            icon: regType === 'individual' ? '👤' : '👥',
            style: { fontFamily: 'Cairo', borderRadius: '10px' }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!id) {
            Swal.fire("خطأ", "رقم الإعلان غير موجود", "error");
            return;
        }

        const activeMembers = formData.teamMembers.filter(name => name.trim() !== "");

        let confirmationHtml = '';
        if (isProject) {
            confirmationHtml = `أنت على وشك إرسال طلب انضمام <b>فردي</b> برقمك الجامعي الموثق لفريق عمل هذا المشروع.`;
        } else {
            confirmationHtml = `أنت على وشك التسجيل في المسابقة كـ <b>${regType === 'individual' ? 'مشارك فردي' : `فريق باسم (${formData.teamName}) ويضم ${activeMembers.length + 1} أعضاء`}</b>`;
        }

        const confirmResult = await Swal.fire({
            title: 'تأكيد إرسال الطلب',
            html: confirmationHtml,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، أرسل الطلب',
            cancelButtonText: 'تعديل البيانات',
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
                navigate(`/competition/${id}`);
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
                جاري فحص وتحديد نوع الإعلان والمقاعد المتاحة...
            </div>
        );
    }

    return (
        <div className="container py-5 min-vh-100" dir="rtl" style={{fontFamily: 'Cairo, sans-serif'}}>
            <style>
                {`
                    .reg-card { border-radius: 25px; border: none; overflow: hidden; background: white; }
                    .step-indicator { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.9rem; transition: 0.4s; }
                    .type-card { cursor: pointer; transition: 0.3s; border: 2px solid #f1f5f9; border-radius: 20px; }
                    .type-card.active { border-color: ${mainGreen}; background-color: #f0f7f4; transform: translateY(-5px); }
                    .custom-input { background: #f8fafc; border: 1px solid #edf2f7; border-radius: 12px; padding: 12px; }
                    .custom-input:focus { border-color: ${mainGreen}; box-shadow: 0 0 0 3px rgba(26, 93, 68, 0.1); outline: none; }
                    .custom-input:disabled { background-color: #f1f5f9; color: #64748b; cursor: not-allowed; border-color: #e2e8f0; }
                    .btn-main { background: ${mainGreen}; color: white; border-radius: 12px; padding: 14px; border: none; font-weight: bold; width: 100%; transition: 0.3s; }
                    .btn-main:hover { filter: brightness(1.1); transform: translateY(-2px); }
                    .swal2-html-container { font-family: 'Cairo', sans-serif !important; }
                    .member-node { border-right: 3px solid ${mainGreen}; padding-right: 15px; margin-bottom: 15px; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-6">
                
                    {!isProject && maxSeats > 1 && (
                        <div className="d-flex align-items-center mb-5 px-4 justify-content-center">
                            <div className="text-center">
                                <div className="step-indicator shadow-sm mb-2 mx-auto" style={{ backgroundColor: mainGreen, color: 'white' }}>
                                    <i className="bi bi-check2"></i>
                                </div>
                                <span className="small fw-bold">نوع المشاركة</span>
                            </div>
                            <div className="mx-3" style={{ height: '2px', width: '50px', background: step === 2 ? mainGreen : '#e2e8f0' }}></div>
                            <div className="text-center">
                                <div className="step-indicator shadow-sm mb-2 mx-auto" style={{ backgroundColor: step === 2 ? mainGreen : '#e2e8f0', color: step === 2 ? 'white' : '#64748b' }}>
                                    {step === 2 ? <i className="bi bi-pencil-square"></i> : '2'}
                                </div>
                                <span className="small fw-bold">البيانات</span>
                            </div>
                        </div>
                    )}

                    <div className="card reg-card shadow-lg border-0">
                        <div className="p-4 text-white text-center" style={{ backgroundColor: mainGreen }}>
                            <h5 className="fw-bold mb-1">
                                {isProject ? 'طلب انضمام لمشروع تخرج' : 'تسجيل في المسابقة العلمية'}
                            </h5>
                            <p className="small opacity-75 mb-0">مرحباً بك، {user?.fullName?.split(' ')[0]}</p>
                        </div>

                        <div className="card-body p-4 p-md-5 text-end">
                            {step === 1 && !isProject && maxSeats > 1 ? (
                                <div className="animate__animated animate__fadeIn">
                                    <h6 className="fw-bold mb-4">اختر طبيعة التسجيل في المسابقة:</h6>
                                    <div className="row g-3">
                                        <div className="col-6" onClick={() => setRegType('individual')}>
                                            <div className={`p-4 type-card h-100 text-center ${regType === 'individual' ? 'active' : ''}`}>
                                                <i className={`bi bi-person-circle fs-1 ${regType === 'individual' ? 'text-success' : 'text-muted'}`}></i>
                                                <div className="fw-bold mt-2">تسجيل فردي</div>
                                                <small className="text-muted d-block mt-1">مقعد واحد مستقل</small>
                                            </div>
                                        </div>
                                        
                                        <div className="col-6" onClick={() => setRegType('team')}>
                                            <div className={`p-4 type-card h-100 text-center ${regType === 'team' ? 'active' : ''}`}>
                                                <i className={`bi bi-people-fill fs-1 ${regType === 'team' ? 'text-success' : 'text-muted'}`}></i>
                                                <div className="fw-bold mt-2">تشكيل فريق</div>
                                                <small className="text-muted d-block mt-1">حتى {maxSeats} أعضاء</small>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={goToNextStep} className="btn-main mt-5">
                                        الانتقال لتعبئة البيانات <i className="bi bi-arrow-left ms-2"></i>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
                                    
                                    {/* حقل الرقم الجامعي المطور (يتحول للقراءة فقط في حال كان مشروع تخرج) */}
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">الرقم الجامعي للمتقدم</label>
                                        <input 
                                            type="text" 
                                            className="form-control custom-input text-end" 
                                            value={formData.studentId}
                                            placeholder={isProject ? "جاري سحب الرقم الجامعي..." : "مثلاً: 202110455"} 
                                            required
                                            disabled={isProject}
                                            onChange={(e) => setFormData({...formData, studentId: e.target.value})} 
                                        />
                                        <div className="form-text x-small text-muted">
                                            {isProject ? "🔒 تم قفل وتأكيد الحقل بناءً على الحساب الأكاديمي النشط حالياً." : `سيتم ربط الطلب بملفك الأكاديمي الحالي: ${user?.email}`}
                                        </div>
                                    </div>

                                    {!isProject && regType === 'team' && (
                                        <div className="p-3 rounded-4 mb-4 bg-light border border-success border-opacity-25">
                                            <div className="mb-4">
                                                <label className="form-label small fw-bold text-success">اسم الفريق</label>
                                                <input 
                                                    type="text" 
                                                    className="form-control custom-input text-end mb-2" 
                                                    placeholder="اكتب اسم فريقك المبتكر" 
                                                    required={regType === 'team'}
                                                    value={formData.teamName}
                                                    onChange={(e) => setFormData({...formData, teamName: e.target.value})} 
                                                />
                                            </div>

                                            {formData.teamMembers.length > 0 && (
                                                <div className="mt-3">
                                                    <label className="form-label small fw-bold text-secondary mb-3">
                                                        <i className="bi bi-person-plus-fill me-1"></i> أسماء زملائك في الفريق ({formData.teamMembers.length} مقاعد متاحة)
                                                    </label>
                                                    
                                                    {formData.teamMembers.map((member, index) => (
                                                        <div key={index} className="member-node">
                                                            <label className="form-label extra-small text-muted">اسم العضو رقم {index + 2}</label>
                                                            <input 
                                                                type="text" 
                                                                className="form-control custom-input text-end" 
                                                                placeholder={`اسم زميلك الشريك`}
                                                                value={member}
                                                                required
                                                                onChange={(e) => handleMemberNameChange(index, e.target.value)} 
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div className="d-flex gap-2 mt-4">
                                        <button type="submit" disabled={isSubmitting} className="btn-main flex-grow-1">
                                            {isSubmitting ? 'جاري إرسال الطلب...' : isProject ? 'إرسال طلب الانضمام للمشروع' : 'تأكيد التسجيل بالمسابقة'}
                                        </button>
                                        
                                        {!isProject && maxSeats > 1 && (
                                            <button type="button" onClick={() => setStep(1)} className="btn btn-light px-4 rounded-3 border fw-bold text-muted">
                                                رجوع
                                            </button>
                                        )}
                                    </div>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};