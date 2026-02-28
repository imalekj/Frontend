import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

export const VerifyEmail = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const otpInputs = useRef([]);

    const registeredEmails = ["test@std-zuj.edu.jo", "student@std-zuj.edu.jo"];

    const handleEmailSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const lowerEmail = email.toLowerCase();


        if (!lowerEmail.endsWith('@std-zuj.edu.jo')) {
            setLoading(false);
            setError('يرجى استخدام بريد الطلبة المعتمد (@std-zuj.edu.jo)');
            toast.error('خطأ في النطاق الجامعي');
            return;
        }

    
        if (registeredEmails.includes(lowerEmail)) {
            setLoading(false);
            Swal.fire({
                title: 'هذا الحساب موجود بالفعل!',
                text: 'يبدو أنك سجلت مسبقاً بهذا البريد الإلكتروني. هل تريد الانتقال لصفحة تسجيل الدخول؟',
                icon: 'info',
                showCancelButton: true,
                confirmButtonColor: mainGreen,
                cancelButtonColor: '#6e7881',
                confirmButtonText: 'تسجيل الدخول',
                cancelButtonText: 'استخدام بريد آخر',
                reverseButtons: true,
                customClass: { popup: 'rounded-5' }
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/login');
                } else {
                    setEmail('');
                }
            });
            return;
        }

        setTimeout(() => {
            setStep(2);
            setLoading(false);
            toast.success('تم إرسال رمز التحقق إلى بريدك الجامعي', {
                style: { fontFamily: 'Cairo', direction: 'rtl' }
            });
        }, 1500);
    };

    const handleOtpChange = (e, index) => {
        const value = e.target.value;
        if (value && index < 5) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs.current[index - 1].focus();
        }
    };

    const handleVerifyOtp = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            
            Swal.fire({
                title: 'تم التحقق بنجاح! 🎉',
                text: 'أهلاً بك في منصة الطلبة، لنكمل الآن بناء ملفك الشخصي.',
                icon: 'success',
                confirmButtonColor: mainGreen,
                confirmButtonText: 'هيا بنا',
                customClass: { popup: 'rounded-5' }
            }).then(() => {
                navigate('/setup-profile');
            });

        }, 1500);
    };

    return (
        <div className="container py-5 mt-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Toaster position="top-center" reverseOrder={false} />

            <style>
                {`
                    .verify-card { max-width: 450px; margin: 0 auto; border-radius: 30px; border: none; }
                    .icon-box { 
                        width: 80px; height: 80px; background: #f0f7f4; color: ${mainGreen}; 
                        border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px;
                    }
                    .otp-input {
                        width: 45px; height: 55px; border-radius: 12px; border: 1.5px solid #eee;
                        text-align: center; font-size: 1.5rem; font-weight: bold; background: #fdfdfd; transition: 0.3s;
                    }
                    .otp-input:focus { border-color: ${mainGreen}; outline: none; box-shadow: 0 0 0 3px rgba(26, 93, 68, 0.1); }
                    .btn-zuj { background: ${mainGreen}; color: white; border-radius: 15px; padding: 14px; font-weight: 700; border: none; width: 100%; transition: 0.3s; }
                    .btn-zuj:hover { background: #144633; transform: translateY(-2px); }
                    .swal2-container { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="card verify-card shadow-lg p-4 p-md-5">
                {step === 1 ? (
                    <form onSubmit={handleEmailSubmit} className="animate__animated animate__fadeIn">
                        <div className="icon-box">
                            <i className="bi bi-shield-lock-fill fs-1"></i>
                        </div>
                        <h4 className="fw-900 text-center mb-2">تحقق الهوية</h4>
                        <p className="text-muted small text-center mb-4">أدخل بريدك الجامعي الرسمي للمتابعة</p>

                        <div className="mb-4">
                            <label className="form-label small fw-bold text-secondary">البريد الإلكتروني للطلبة</label>
                            <input
                                type="email"
                                className={`form-control form-control-lg rounded-4 border-0 bg-light py-3 fs-6 ${error ? 'is-invalid' : ''}`}
                                placeholder="yourid@std-zuj.edu.jo"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                                required
                                style={{ textAlign: 'left', direction: 'ltr' }}
                            />
                            {error && <div className="invalid-feedback fw-bold mt-2 small">{error}</div>}
                        </div>

                        <button type="submit" disabled={loading} className="btn-zuj shadow-sm">
                            {loading ? <span className="spinner-border spinner-border-sm"></span> : "إرسال رمز التأكيد"}
                        </button>
                    </form>
                ) : (
                    <div className="animate__animated animate__fadeIn">
                        <div className="icon-box">
                            <i className="bi bi-chat-left-dots-fill fs-1"></i>
                        </div>
                        <h4 className="fw-900 text-center mb-2">أدخل الرمز</h4>
                        <p className="text-muted small text-center mb-4">
                            تم إرسال الرمز إلى <br/>
                            <span className="text-dark fw-bold" dir="ltr">{email}</span>
                        </p>

                        <div className="d-flex justify-content-between mb-4" dir="ltr">
                            {[0, 1, 2, 3, 4, 5].map((i) => (
                                <input 
                                    key={i} 
                                    type="text" 
                                    maxLength="1" 
                                    className="otp-input"
                                    ref={el => otpInputs.current[i] = el}
                                    onChange={(e) => handleOtpChange(e, i)}
                                    onKeyDown={(e) => handleKeyDown(e, i)}
                                />
                            ))}
                        </div>

                        <button className="btn-zuj mb-3 shadow-sm" disabled={loading} onClick={handleVerifyOtp}>
                            {loading ? 'جاري التحقق...' : 'تأكيد الرمز'}
                        </button>

                        <div className="text-center">
                            <button className="btn btn-link text-muted small text-decoration-none fw-bold" onClick={() => setStep(1)}>
                                <i className="bi bi-arrow-right me-1"></i> تغيير البريد الإلكتروني
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};