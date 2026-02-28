import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2'; 
import toast from 'react-hot-toast';

export const RegistrationPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [isLoggedIn] = useState(true); 
    const [regType, setRegType] = useState('individual');
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        studentId: '',
        teamName: '',
    });

    useEffect(() => {
        if (!isLoggedIn) {
            toast.error('يجب تسجيل الدخول أولاً');
            navigate('/login', { state: { from: `/register/${id}` } });
        }
    }, [isLoggedIn, navigate, id]);

    const goToNextStep = () => {
        setStep(2);
        toast(`تم اختيار المشاركة الـ${regType === 'individual' ? 'فردية' : 'جماعية'}`, {
            icon: regType === 'individual' ? '👤' : '👥',
            style: { fontFamily: 'Cairo', borderRadius: '10px' }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
    
        const confirmResult = await Swal.fire({
            title: 'تأكيد البيانات',
            html: `أنت على وشك التسجيل كـ <b>${regType === 'individual' ? 'مشارك فردي' : `فريق باسم (${formData.teamName})`}</b>.<br>هل البيانات صحيحة؟`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، سجلني',
            cancelButtonText: 'تعديل',
            confirmButtonColor: mainGreen,
            cancelButtonColor: '#6e7881',
            customClass: { popup: 'rounded-5' }
        });

        if (!confirmResult.isConfirmed) return;

        
        setIsSubmitting(true);
        
        
        Swal.fire({
            title: 'جاري معالجة طلبك...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: { popup: 'rounded-5' }
        });

        
        setTimeout(() => {
            setIsSubmitting(false);
            
            
            Swal.fire({
                title: 'مبارك، تم قبول تسجيلك!',
                text: 'أنت الآن جزء من منافسة الهاكاثون. تفقد بريدك الجامعي لمتابعة الخطوات التالية.',
                icon: 'success',
                confirmButtonText: 'الذهاب لصفحة المسابقة',
                confirmButtonColor: mainGreen,
                allowOutsideClick: false,
                customClass: {
                    popup: 'rounded-5 shadow-lg border-bottom border-5 border-success',
                    title: 'fw-bold text-success',
                    confirmButton: 'px-5 py-2 rounded-pill'
                }
            }).then(() => {
                navigate(`/competition/${id}`);
            });
        }, 2000);
    };

    if (!isLoggedIn) return null;

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
                    .btn-main { background: ${mainGreen}; color: white; border-radius: 12px; padding: 14px; border: none; font-weight: bold; width: 100%; transition: 0.3s; }
                    .btn-main:hover { filter: brightness(1.1); transform: translateY(-2px); }
                    .swal2-html-container { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-6">
                
                    <div className="d-flex align-items-center mb-5 px-4 justify-content-center">
                        <div className="text-center">
                            <div className="step-indicator shadow-sm mb-2 mx-auto" style={{ backgroundColor: mainGreen, color: 'white' }}>
                                <i className="bi bi-check2"></i>
                            </div>
                            <span className="small fw-bold">النوع</span>
                        </div>
                        <div className="mx-3" style={{ height: '2px', width: '50px', background: step === 2 ? mainGreen : '#e2e8f0' }}></div>
                        <div className="text-center">
                            <div className="step-indicator shadow-sm mb-2 mx-auto" style={{ backgroundColor: step === 2 ? mainGreen : '#e2e8f0', color: step === 2 ? 'white' : '#64748b' }}>
                                {step === 2 ? <i className="bi bi-pencil-square"></i> : '2'}
                            </div>
                            <span className="small fw-bold">البيانات</span>
                        </div>
                    </div>

                    <div className="card reg-card shadow-lg border-0">
                        <div className="p-4 text-white text-center" style={{ backgroundColor: mainGreen }}>
                            <h5 className="fw-bold mb-1">تسجيل في الهاكاثون</h5>
                            <p className="small opacity-75 mb-0">خطوة واحدة تفصلك عن الإبداع</p>
                        </div>

                        <div className="card-body p-4 p-md-5 text-end">
                            {step === 1 ? (
                                <div className="animate__animated animate__fadeIn">
                                    <h6 className="fw-bold mb-4">اختر نوع المشاركة:</h6>
                                    <div className="row g-3">
                                        <div className="col-6" onClick={() => setRegType('individual')}>
                                            <div className={`p-4 type-card h-100 text-center ${regType === 'individual' ? 'active' : ''}`}>
                                                <i className={`bi bi-person-circle fs-1 ${regType === 'individual' ? 'text-success' : 'text-muted'}`}></i>
                                                <div className="fw-bold mt-2">فردي</div>
                                            </div>
                                        </div>
                                        <div className="col-6" onClick={() => setRegType('team')}>
                                            <div className={`p-4 type-card h-100 text-center ${regType === 'team' ? 'active' : ''}`}>
                                                <i className={`bi bi-people-fill fs-1 ${regType === 'team' ? 'text-success' : 'text-muted'}`}></i>
                                                <div className="fw-bold mt-2">فريق</div>
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={goToNextStep} className="btn-main mt-5">
                                        متابعة البيانات <i className="bi bi-arrow-left ms-2"></i>
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="animate__animated animate__fadeIn">
                                    <div className="mb-4">
                                        <label className="form-label small fw-bold">الرقم الجامعي</label>
                                        <input type="text" className="form-control custom-input text-end" placeholder="مثلاً: 202110255" required
                                            onChange={(e) => setFormData({...formData, studentId: e.target.value})} />
                                    </div>

                                    {regType === 'team' && (
                                        <div className="p-3 rounded-4 mb-4 bg-light border border-success border-opacity-25">
                                            <label className="form-label small fw-bold text-success">اسم الفريق</label>
                                            <input type="text" className="form-control custom-input mb-3 text-end" placeholder="ادخل اسم الفريق" required
                                                onChange={(e) => setFormData({...formData, teamName: e.target.value})} />
                                        </div>
                                    )}

                                    <div className="d-flex gap-2 mt-4">
                                        <button type="submit" disabled={isSubmitting} className="btn-main flex-grow-1">
                                            {isSubmitting ? 'جاري الإرسال...' : 'تأكيد التسجيل'}
                                        </button>
                                        <button type="button" onClick={() => setStep(1)} className="btn btn-light px-4 rounded-3 border fw-bold text-muted">
                                            رجوع
                                        </button>
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