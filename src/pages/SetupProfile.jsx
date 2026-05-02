import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

const facultiesData = {
    "كلية تكنولوجيا المعلومات": ["هندسة البرمجيات", "علم الحاسوب", "الأمن السيبراني", "الذكاء الاصطناعي", "نظم المعلومات الحاسوبية"],
    "كلية الهندسة والتكنولوجيا": ["الهندسة المدنية", "الهندسة الميكانيكية", "الهندسة الكهربائية", "هندسة العمارة"],
    "كلية الصيدلة": ["الصيدلة"],
    "كلية التمريض": ["التمريض"],
    "كلية الأعمال": ["إدارة الأعمال", "المحاسبة", "العلوم المالية والمصرفية", "التسويق"],
    "كلية الحقوق": ["الحقوق"],
    "كلية الآداب": ["الغة العربية", "اللغة الإنجليزية", "الترجمة"],
    "كلية العلوم والآداب": ["الرياضيات", "الفيزياء"]
};

export const SetupProfile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44'; 

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput] = useState("");

    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        role: 'student',
        faculty: 'كلية تكنولوجيا المعلومات',
        universityMajor: 'هندسة البرمجيات',
        workField: '', 
        githubUrl: '',
        skills: [],
        profileImage: null,
        description: ''
    });

    const getSocialIcon = (url) => {
        if (!url) return "bi-link-45deg text-muted";
        const lowerUrl = url.toLowerCase();
        if (lowerUrl.includes("github.com")) return "bi-github text-dark";
        if (lowerUrl.includes("linkedin.com")) return "bi-linkedin text-primary";
        if (lowerUrl.includes("instagram.com")) return "bi-instagram text-danger";
        if (lowerUrl.includes("facebook.com")) return "bi-facebook text-primary";
        if (lowerUrl.includes("youtube.com") || lowerUrl.includes("youtu.be")) return "bi-youtube text-danger";
        return "bi-globe text-success";
    };

    const validatePassword = (pass) => ({
        "8 حروف على الأقل": pass.length >= 8,
        "حرف كبير (A-Z)": /[A-Z]/.test(pass),
        "رقم واحد (0-9)": /[0-9]/.test(pass),
        "رمز خاص (#@!)": /[!@#$%^&*]/.test(pass)
    });

    const passConditions = validatePassword(formData.password);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFacultyChange = (e) => {
        const selectedFaculty = e.target.value;
        setFormData(prev => ({ 
            ...prev, 
            faculty: selectedFaculty,
            universityMajor: facultiesData[selectedFaculty][0] 
        }));
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() !== "") {
            e.preventDefault();
            if (!formData.skills.includes(skillInput.trim())) {
                setFormData(prev => ({ ...prev, skills: [...prev.skills, skillInput.trim()] }));
                setSkillInput("");
            }
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, profileImage: file }));
        }
    };

    const nextStep = () => {
        if (step === 1) {
            const allValid = Object.values(passConditions).every(Boolean);
            if (!formData.fullName || !formData.email || !formData.password) return toast.error("يرجى إكمال البيانات الأساسية");
            if (!allValid) return toast.error("كلمة المرور لا تستوفي الشروط");
            setStep(2);
        }
    };

    // تم تعديل هذه الدالة لإزالة الـ API والاكتفاء بالتوجيه
    const verifyAndSubmit = (e) => {
        if (e) e.preventDefault();
        setLoading(true);

        // محاكاة وقت المعالجة (تأخير بسيط لشعور المستخدم بالواقعية)
        setTimeout(() => {
            setLoading(false);
            Swal.fire({
                title: 'تم بنجاح!',
                text: 'أهلاً بك في مجتمع الزيتونة، جاري نقلك لملفك الشخصي...',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
                willClose: () => {
                    navigate('/profile'); // التوجيه لصفحة الملف الشخصي
                }
            });
        }, 1000);
    };

    return (
        <div className="container py-5" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Toaster position="top-center" />
            <style>{`
                .setup-card { border: none; border-radius: 24px; overflow: hidden; background: #ffffff; }
                .input-custom { background: #fdfdfd; border: 1.5px solid #eee; border-radius: 12px; padding: 12px; transition: all 0.3s; }
                .input-custom:focus { border-color: ${mainGreen}; box-shadow: 0 0 10px rgba(26, 93, 68, 0.05); outline: none; }
                .step-dot { width: 10px; height: 10px; border-radius: 50%; background: #ddd; transition: 0.3s; }
                .step-dot.active { background: ${mainGreen}; transform: scale(1.3); }
                .condition-tag { font-size: 0.75rem; padding: 4px 10px; border-radius: 20px; transition: 0.3s; }
            `}</style>

            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-10">
                    <div className="setup-card shadow-lg">
                        {/* Header Section */}
                        <div className="text-center p-5 text-white" style={{ background: `linear-gradient(135deg, ${mainGreen}, #2a8d68)` }}>
                            <h2 className="fw-bold mb-2">إعداد الملف الشخصي</h2>
                            <p className="opacity-75 mb-4">خطوات بسيطة لتنضم لزملائك في جامعة الزيتونة</p>
                            <div className="d-flex justify-content-center gap-2">
                                {[1, 2, 3].map(i => <div key={i} className={`step-dot ${step === i ? 'active' : ''}`}></div>)}
                            </div>
                        </div>

                        <div className="card-body p-4 p-md-5">
                            {/* Step 1: Basic Info */}
                            {step === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block shadow-sm rounded-circle">
                                            <div className="rounded-circle border-4 border-white overflow-hidden bg-light" style={{ width: '110px', height: '110px' }}>
                                                {imagePreview ? <img src={imagePreview} className="w-100 h-100 object-fit-cover" alt="preview" /> : <i className="bi bi-person-circle text-muted" style={{fontSize: '3.5rem'}}></i>}
                                            </div>
                                            <label className="btn btn-success position-absolute bottom-0 start-0 rounded-circle shadow-sm p-1 px-2" style={{background: mainGreen}}>
                                                <i className="bi bi-pencil-square" style={{fontSize: '0.8rem'}}></i>
                                                <input type="file" hidden onChange={handleImageChange}/>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6"><label className="small fw-bold mb-1">الاسم الكامل</label><input name="fullName" placeholder="مثال: مالك جابر" className="form-control input-custom" onChange={handleInputChange} value={formData.fullName} /></div>
                                        <div className="col-md-6"><label className="small fw-bold mb-1">اسم المستخدم</label><input name="userName" placeholder="MJ_2026" className="form-control input-custom" onChange={handleInputChange} value={formData.userName} /></div>
                                        <div className="col-12"><label className="small fw-bold mb-1">البريد الجامعي</label><input name="email" placeholder="student@std.zuj.edu.jo" className="form-control input-custom text-start" onChange={handleInputChange} value={formData.email} /></div>
                                        
                                        <div className="col-12">
                                            <label className="small fw-bold mb-1">كلمة المرور</label>
                                            <input name="password" type="password" className="form-control input-custom mb-3" onChange={handleInputChange} value={formData.password} />
                                            <div className="d-flex flex-wrap gap-2 justify-content-center">
                                                {Object.entries(passConditions).map(([text, isValid]) => (
                                                    <span key={text} className={`condition-tag ${isValid ? 'bg-success text-white' : 'bg-light text-muted border'}`}>
                                                        <i className={`bi ${isValid ? 'bi-check2' : 'bi-dot'} me-1`}></i>{text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <button onClick={nextStep} className="btn btn-success w-100 mt-5 py-3 fw-bold rounded-3 shadow-sm" style={{background: mainGreen}}>الذهاب للخطوة التالية</button>
                                </div>
                            )}

                            {/* Step 2: Academic & Skills */}
                            {step === 2 && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="small fw-bold mb-1">الكلية</label>
                                            <select className="form-select input-custom" value={formData.faculty} onChange={handleFacultyChange}>
                                                {Object.keys(facultiesData).map(f => <option key={f} value={f}>{f}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="small fw-bold mb-1">التخصص</label>
                                            <select name="universityMajor" className="form-select input-custom" value={formData.universityMajor} onChange={handleInputChange}>
                                                {facultiesData[formData.faculty].map(m => <option key={m} value={m}>{m}</option>)}
                                            </select>
                                        </div>
                                        
                                        <div className="col-12">
                                            <label className="small fw-bold mb-1">الرابط التعريفي (Portfolio / Social)</label>
                                            <div className="position-relative">
                                                <input name="githubUrl" className="form-control input-custom text-start pe-5" placeholder="https://linkedin.com/in/malek" onChange={handleInputChange} value={formData.githubUrl} />
                                                <i className={`bi ${getSocialIcon(formData.githubUrl)} position-absolute top-50 end-0 translate-middle-y me-3`} style={{fontSize: '1.4rem', transition: '0.3s'}}></i>
                                            </div>
                                        </div>

                                        <div className="col-12">
                                            <label className="small fw-bold mb-1">المهارات (اكتب المهارة واضغط Enter)</label>
                                            <input className="form-control input-custom" placeholder="مثال: React, Graphic Design, PHP" value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} onKeyDown={addSkill} />
                                            <div className="d-flex flex-wrap gap-2 mt-2">
                                                {formData.skills.map(s => <span key={s} className="badge bg-light text-success border border-success-subtle p-2 px-3 rounded-pill">{s}</span>)}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3">
                                        <button onClick={()=>setStep(1)} className="btn btn-outline-secondary flex-grow-1 py-3 rounded-3">السابق</button>
                                        <button onClick={()=>setStep(3)} className="btn btn-success flex-grow-1 py-3 fw-bold rounded-3 shadow-sm" style={{background: mainGreen}}>تأكيد</button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Final Confirmation */}
                            {step === 3 && (
                                <div className="text-center animate__animated animate__zoomIn">
                                    <div className="py-4">
                                        <div className="mb-4">
                                            <i className="bi bi-rocket-takeoff text-success" style={{fontSize: '5rem'}}></i>
                                        </div>
                                        <h4 className="fw-bold">كل شيء جاهز يا {formData.fullName.split(' ')[0]}!</h4>
                                        <p className="text-muted px-4">بمجرد الضغط على الزر، سيتم إنشاء حسابك الرسمي وتتمكن من البحث عن شركاء لمشاريعك.</p>
                                    </div>
                                    <div className="d-flex gap-3 mt-4">
                                        <button onClick={()=>setStep(2)} className="btn btn-light flex-grow-1 py-3 border">مراجعة</button>
                                        <button onClick={verifyAndSubmit} className="btn btn-success flex-grow-1 py-3 fw-bold shadow" style={{background: mainGreen}} disabled={loading}>
                                            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : 'انطلاق الآن!'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <p className="text-center mt-4 text-muted small">جامعة الزيتونة الأردنية - مشروع التخرج 2026</p>
                </div>
            </div>
        </div>
    );
};