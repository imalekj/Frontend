import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext'; 

export const SetupProfile = () => {
    const navigate = useNavigate();
    const { login } = useAuth(); 
    const mainGreen = '#1a5d44'; 

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput] = useState("");
    const [verificationCode, setVerificationCode] = useState("");

    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        role: 'student',
        universityMajor: 'هندسة البرمجيات',
        workField: '', 
        githubUrl: '',
        skills: [],
        pastProjects: [], 
        profileImage: null
    });

    const validateEmail = (email) => {
        const cleanEmail = email.trim().toLowerCase();
        const domains = ["@std.zuj.edu.jo", "@zuj.edu.jo", "@std-zuj.edu.jo"];
        return domains.some(domain => cleanEmail.endsWith(domain));
    };

    const validatePassword = (pass) => {
        return {
            hasUpperCase: /[A-Z]/.test(pass),
            hasNumber: /[0-9]/.test(pass),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<> ]/.test(pass),
            isLongEnough: pass.length >= 8
        };
    };

    const passwordStatus = validatePassword(formData.password);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const finalValue = name === 'email' ? value.trim() : value;
        setFormData(prev => ({ ...prev, [name]: finalValue }));
    };

    const addProjectField = () => {
        setFormData(prev => ({
            ...prev,
            pastProjects: [...prev.pastProjects, { title: '', link: '' }]
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.pastProjects];
        updatedProjects[index][field] = value;
        setFormData(prev => ({ ...prev, pastProjects: updatedProjects }));
    };

    const removeProjectField = (index) => {
        const updatedProjects = formData.pastProjects.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, pastProjects: updatedProjects }));
    };

    const nextStep = () => {
        if (!formData.fullName || !formData.userName || !formData.password || !formData.email) {
            return toast.error("يرجى إكمال جميع الحقول المطلوبة");
        }
        if (!validateEmail(formData.email)) {
            return toast.error("يجب استخدام الإيميل الجامعي الرسمي (@zuj.edu.jo)");
        }
        if (!passwordStatus.hasUpperCase || !passwordStatus.hasNumber || !passwordStatus.hasSpecialChar || !passwordStatus.isLongEnough) {
            return toast.error("يرجى استيفاء جميع شروط كلمة المرور");
        }
        setStep(2);
    };

    const prevStep = () => setStep(step - 1);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) return toast.error("الصورة كبيرة جداً (الأقصى 2MB)");
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, profileImage: file }));
        }
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

    const removeSkill = (skill) => setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));

    const handleFinalStep = (e) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setStep(3);
            toast.success("تم إرسال كود التحقق إلى بريدك الجامعي");
        }, 1000);
    };

 const verifyAndSubmit = async (e) => {
    e.preventDefault();

    if (verificationCode.length < 4) {
        return toast.error("يرجى إدخال كود التحقق الصحيح");
    }

    setLoading(true);

    try {
        const formDataToSend = new FormData();

        formDataToSend.append("FullName", formData.fullName);
        formDataToSend.append("UserName", formData.userName);
        formDataToSend.append("Email", formData.email);
        formDataToSend.append("Password", formData.password);
       formDataToSend.append("Role", true);
        formDataToSend.append("UniversityMajor", formData.universityMajor);
        formDataToSend.append("WorkField", formData.workField);
        formDataToSend.append("GithubUrl", formData.githubUrl);

        // skills
        formData.skills.forEach((skill, index) => {
            formDataToSend.append(`Skills[${index}]`, skill);
        });

        // projects
        formData.pastProjects.forEach((proj, index) => {
            formDataToSend.append(`PastProjects[${index}].Title`, proj.title);
            formDataToSend.append(`PastProjects[${index}].Link`, proj.link);
        });

        // image
        if (formData.profileImage) {
            formDataToSend.append("ProfileImage", formData.profileImage);
        }

        const response = await fetch("https://localhost:7011/api/Login/Register", {
            method: "POST",
            body: formDataToSend
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "حدث خطأ أثناء التسجيل");
        }

        // 👇 حسب شكل الريسبونس من الباك
        const token = data.token;
        const userData = data.user;

        login(userData, token);

        Swal.fire({
            title: 'تم بنجاح',
            text: 'تم إنشاء الحساب بنجاح 🎉',
            icon: 'success',
            confirmButtonColor: mainGreen
        }).then(() => navigate('/profile'));

    } catch (error) {
        console.error(error);
        toast.error(error.message);
    } finally {
        setLoading(false);
    }
};
    return (
        <div className="container py-5" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Toaster position="top-center" />
            <style>
                {`
                    .setup-card { border-radius: 30px; border: none; background: white; overflow: hidden; }
                    .setup-header { background: ${mainGreen}; color: white; padding: 40px 20px; text-align: center; }
                    .form-label { font-weight: 700; color: ${mainGreen}; font-size: 0.85rem; margin-bottom: 8px; display: block; }
                    .input-custom { background: #f8f9fa; border: 2px solid #f1f1f1; border-radius: 15px; padding: 12px; transition: 0.3s; }
                    .input-custom:focus { border-color: ${mainGreen}; background: white; outline: none; box-shadow: none; }
                    .step-indicator { width: 45px; height: 45px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin: 0 auto 10px; border: 2px solid rgba(255,255,255,0.2); }
                    .active-step { background: white; color: ${mainGreen}; border-color: white; }
                    .inactive-step { background: rgba(255,255,255,0.1); color: white; }
                    .project-item { background: #fdfdfd; border: 1px dashed #ddd; border-radius: 15px; padding: 15px; margin-bottom: 10px; }
                    .pass-check-horizontal { font-size: 0.75rem; display: flex; align-items: center; gap: 4px; padding: 6px 12px; background: white; border-radius: 10px; border: 1px solid #eee; white-space: nowrap; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    <div className="setup-card shadow-lg">
                        <div className="setup-header">
                            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                                <div><div className={`step-indicator ${step === 1 ? 'active-step' : 'inactive-step'}`}>1</div><small className="fw-bold">البيانات</small></div>
                                <div style={{ height: '2px', width: '30px', background: 'rgba(255,255,255,0.2)', marginTop: '-20px' }}></div>
                                <div><div className={`step-indicator ${step === 2 ? 'active-step' : 'inactive-step'}`}>2</div><small className="fw-bold">الخبرات</small></div>
                                <div style={{ height: '2px', width: '30px', background: 'rgba(255,255,255,0.2)', marginTop: '-20px' }}></div>
                                <div><div className={`step-indicator ${step === 3 ? 'active-step' : 'inactive-step'}`}>3</div><small className="fw-bold">التأكيد</small></div>
                            </div>
                            <h3 className="fw-bold">إعداد الملف الشخصي</h3>
                        </div>

                        <div className="p-4 p-md-5">
                            {step === 1 && (
                                <div className="animate__animated animate__fadeInLeft text-end">
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            <div className="rounded-circle border border-4 border-light shadow-sm overflow-hidden bg-white" style={{ width: '120px', height: '120px' }}>
                                                {imagePreview ? <img src={imagePreview} className="w-100 h-100 object-fit-cover" /> : <i className="bi bi-person-fill text-light" style={{ fontSize: '4rem' }}></i>}
                                            </div>
                                            <label className="btn btn-success btn-sm position-absolute bottom-0 start-0 rounded-circle shadow p-2">
                                                <i className="bi bi-camera-fill"></i>
                                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>
                                    <div className="row g-3 mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label">الاسم الكامل</label>
                                            <input name="fullName" type="text" className="form-control input-custom" value={formData.fullName} onChange={handleInputChange} required />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">اسم المستخدم</label>
                                            <input name="userName" type="text" className="form-control input-custom" value={formData.userName} onChange={handleInputChange} required />
                                        </div>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">البريد الجامعي الرسمي</label>
                                        <input name="email" type="email" className="form-control input-custom text-start" value={formData.email} onChange={handleInputChange} required />
                                    </div>
                                    
                                    <div className="mb-4">
                                        <label className="form-label">كلمة المرور</label>
                                        <div className="position-relative mb-3">
                                            <input name="password" type={showPassword ? "text" : "password"} className="form-control input-custom" value={formData.password} onChange={handleInputChange} required />
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 start-0 translate-middle-y ms-3 cursor-pointer text-muted`} onClick={() => setShowPassword(!showPassword)}></i>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2 justify-content-center p-2 rounded-4 bg-light border">
                                            <div className="pass-check-horizontal">
                                                <i className={`bi ${passwordStatus.isLongEnough ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'}`}></i>
                                                <span>8 خانات</span>
                                            </div>
                                            <div className="pass-check-horizontal">
                                                <i className={`bi ${passwordStatus.hasUpperCase ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'}`}></i>
                                                <span>حرف كبير</span>
                                            </div>
                                            <div className="pass-check-horizontal">
                                                <i className={`bi ${passwordStatus.hasNumber ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'}`}></i>
                                                <span>رقم</span>
                                            </div>
                                            <div className="pass-check-horizontal">
                                                <i className={`bi ${passwordStatus.hasSpecialChar ? 'bi-check-circle-fill text-success' : 'bi-circle text-muted'}`}></i>
                                                <span>رمز خاص</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" onClick={nextStep} className="btn btn-success w-100 py-3 rounded-4 fw-bold shadow-sm mt-2" style={{ background: mainGreen }}>التالي</button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="animate__animated animate__fadeInRight text-end">
                                    <div className="row g-3 mb-4">
                                        <div className="col-md-6">
                                            <label className="form-label">التخصص الجامعي</label>
                                            <select name="universityMajor" className="form-select input-custom" value={formData.universityMajor} onChange={handleInputChange}>
                                                <option>هندسة البرمجيات</option>
                                                <option>علم الحاسوب</option>
                                                <option>الأمن السيبراني</option>
                                                <option>ذكاء اصطناعي</option>
                                                <option>نظم معلومات حاسوبية</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">مجال العمل (مثل: Web Developer)</label>
                                            <input name="workField" type="text" className="form-control input-custom" value={formData.workField} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label"><i className="bi bi-github me-1"></i> رابط GitHub (اختياري)</label>
                                        <div className="position-relative">
                                            <input name="githubUrl" type="url" className="form-control input-custom text-start ps-5" value={formData.githubUrl} onChange={handleInputChange} />
                                            <i className="bi bi-link-45deg position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{fontSize: '1.2rem'}}></i>
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label d-flex justify-content-between align-items-center">
                                            <span>المشاريع السابقة (اختياري)</span>
                                            <button type="button" onClick={addProjectField} className="btn btn-sm btn-outline-success rounded-pill px-3">+ إضافة مشروع</button>
                                        </label>
                                        {formData.pastProjects.map((project, index) => (
                                            <div key={index} className="project-item">
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span className="small text-muted">مشروع {index + 1}</span>
                                                    <i className="bi bi-trash text-danger cursor-pointer" onClick={() => removeProjectField(index)}></i>
                                                </div>
                                                <div className="row g-2">
                                                    <div className="col-md-5"><input type="text" className="form-control form-control-sm input-custom" value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} /></div>
                                                    <div className="col-md-7"><input type="url" className="form-control form-control-sm input-custom text-start" value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} /></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label">المهارات (Enter للإضافة)</label>
                                        <input type="text" className="form-control input-custom" value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {formData.skills.map(skill => (
                                                <span key={skill} className="badge bg-success-subtle text-success p-2 px-3 rounded-pill border border-success-subtle">
                                                    {skill} <i className="bi bi-x-circle ms-1 cursor-pointer" onClick={() => removeSkill(skill)}></i>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="d-flex gap-3">
                                        <button type="button" onClick={prevStep} className="btn btn-outline-secondary flex-grow-1 py-3 rounded-4">السابق</button>
                                        <button type="button" onClick={handleFinalStep} disabled={loading} className="btn btn-success flex-grow-1 py-3 rounded-4 fw-bold" style={{ background: mainGreen }}>التالي</button>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="animate__animated animate__fadeInUp text-center">
                                    <div className="mb-4">
                                        <div className="bg-success-subtle d-inline-block p-4 rounded-circle mb-3">
                                            <i className="bi bi-envelope-check text-success" style={{fontSize: '2.5rem'}}></i>
                                        </div>
                                        <h4 className="fw-bold">تأكيد البريد الإلكتروني</h4>
                                        <p className="text-muted">أدخل الكود المرسل إلى <br/> <strong>{formData.email}</strong></p>
                                    </div>

                                    <div className="mb-4">
                                        <input 
                                            type="text" 
                                            className="form-control input-custom text-center fw-bold fs-4" 
                                            placeholder="- - - -" 
                                            maxLength="6"
                                            value={verificationCode}
                                            onChange={(e) => setVerificationCode(e.target.value)}
                                        />
                                    </div>

                                    <div className="d-flex gap-3">
                                        <button type="button" onClick={prevStep} className="btn btn-outline-secondary flex-grow-1 py-3 rounded-4">السابق</button>
                                        <button type="button" onClick={verifyAndSubmit} disabled={loading} className="btn btn-success flex-grow-1 py-3 rounded-4 fw-bold" style={{ background: mainGreen }}>
                                            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'تأكيد وإنهاء'}
                                        </button>
                                    </div>
                                    <button type="button" className="btn btn-link text-success mt-3 text-decoration-none">إعادة إرسال الكود</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
