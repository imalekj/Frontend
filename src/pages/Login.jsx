import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';

export const Login = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [credentials, setCredentials] = useState({ identifier: '', password: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);


    const swalStyled = Swal.mixin({
        customClass: {
            popup: 'rounded-5 shadow-lg',
            confirmButton: 'btn btn-success px-5 py-2 fw-bold'
        },
        buttonsStyling: false,
        fontFamily: 'Cairo'
    });

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleLogin = (e) => {
        e.preventDefault();
        
        
        if (credentials.identifier.length < 4) {
            swalStyled.fire({
                icon: 'warning',
                title: 'بيانات غير مكتملة',
                text: 'يرجى إدخال رقم جامعي أو بريد إلكتروني صحيح',
                confirmButtonText: 'حسناً',
                confirmButtonColor: mainGreen
            });
            return;
        }

        setIsLoading(true);

    
        setTimeout(() => {
            if (credentials.password === "123456") {
            
                Swal.fire({
                    title: 'أهلاً بك مجدداً!',
                    text: 'جاري تحويلك إلى منصة الزيتونة...',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false,
                    timerProgressBar: true,
                    didOpen: () => {
                        Swal.showLoading();
                    }
                }).then(() => {
                    setIsLoading(false);
                    navigate('/'); 
                });
            } else {
        
                swalStyled.fire({
                    icon: 'error',
                    title: 'خطأ في الدخول',
                    text: 'كلمة المرور التي أدخلتها غير صحيحة، يرجى المحاولة مرة أخرى',
                    confirmButtonText: 'إعادة المحاولة',
                });
                setIsLoading(false);
            }
        }, 1500);
    };

    return (
        <div className="container" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; }
                    .login-input:focus {
                        background-color: #fff !important;
                        border: 1px solid ${mainGreen} !important;
                        box-shadow: 0 0 10px rgba(26, 93, 68, 0.1) !important;
                    }
                    .zuj-card { transition: 0.4s; border: 1px solid #eee !important; }
                    .password-toggle {
                        position: absolute;
                        left: 15px;
                        top: 50%;
                        transform: translateY(-50%);
                        cursor: pointer;
                        color: #64748b;
                        z-index: 10;
                    }
                    .btn-login {
                        transition: 0.3s;
                        background-color: ${mainGreen};
                    }
                    .btn-login:hover {
                        filter: brightness(1.2);
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(26, 93, 68, 0.3);
                    }
                `}
            </style>

            <div className="row justify-content-center align-items-center" style={{ minHeight: '90vh' }}>
                <div className="col-md-6 col-lg-4">
                    <div className="card zuj-card shadow-lg border-0 p-4 p-md-5 text-center bg-white rounded-5">
                        
                        <div className="mb-4">
                            <img
                                src={zujLogo}
                                width="80"
                                alt="ZUJ Logo"
                                className="img-fluid"
                                style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
                            />
                        </div>

                        <h3 className="fw-900 mb-1" style={{ color: mainGreen }}>مرحباً بك مجدداً</h3>
                        <p className="text-muted small fw-bold mb-4">سجل دخولك للوصول إلى فرقك الدراسية</p>

                        <form onSubmit={handleLogin} className="text-end">
                            <div className="mb-3">
                                <label className="form-label small fw-bold text-secondary">الرقم الجامعي / البريد</label>
                                <div className="position-relative">
                                    <input
                                        type="text"
                                        name="identifier"
                                        className="form-control form-control-lg rounded-4 bg-light border-0 text-center shadow-none fs-6 login-input"
                                        placeholder="202XXXXXX"
                                        value={credentials.identifier}
                                        onChange={handleChange}
                                        required
                                    />
                                    <i className="bi bi-person position-absolute text-muted" style={{right: '15px', top: '15px'}}></i>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label small fw-bold text-secondary">كلمة المرور</label>
                                <div className="position-relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        className="form-control form-control-lg rounded-4 bg-light border-0 text-center shadow-none fs-6 login-input"
                                        placeholder="••••••••"
                                        value={credentials.password}
                                        onChange={handleChange}
                                        required
                                    />
                                    <span 
                                        className="password-toggle" 
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    </span>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="btn btn-login w-100 py-3 rounded-4 shadow-sm mb-3 fw-bold text-white border-0"
                            >
                                {isLoading ? (
                                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                ) : (
                                    "تسجيل الدخول"
                                )}
                            </button>
                        </form>

                        <div className="mt-2">
                            <div className="d-flex justify-content-between align-items-center small fw-bold">
                                <a href="#" className="text-muted text-decoration-none">نسيت كلمة المرور؟</a>
                                <Link to="/verify-email" className="text-success text-decoration-none">إنشاء حساب</Link>
                            </div>
                        </div>

                        <hr className="my-4 opacity-25" />
                        
                        <p className="small text-muted mb-0">
                            تواجه مشكلة؟ <a href="mailto:support@zuj.edu.jo" className="text-decoration-none" style={{ color: mainGreen }}>اتصل بالدعم الفني</a>
                        </p>
                    </div>
                    
                    <p className="text-center mt-4 text-muted small fw-bold">
                        &copy; 2026 جامعة الزيتونة الأردنية - جميع الحقوق محفوظة
                    </p>
                </div>
            </div>
        </div>
    );
};