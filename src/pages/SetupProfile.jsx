import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

export const SetupProfile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';


    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput] = useState("");

    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        email: '',
        password: '',
        phoneNumber: '',
        universityMajor: 'هندسة البرمجيات',
        workField: '',
        skills: [],
        githubUrl: '',
        pastProjects: [{ title: "", link: "" }],
        profileImage: null
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => {

        if (!formData.fullName || !formData.userName || !formData.password) {
            return toast.error("يرجى إكمال البيانات الأساسية أولاً");
        }
        setStep(2);
    };

    const prevStep = () => setStep(1);


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

    const handleProjectChange = (index, field, value) => {
        const updated = [...formData.pastProjects];
        updated[index][field] = value;
        setFormData(prev => ({ ...prev, pastProjects: updated }));
    };

    const addProjectField = () => setFormData(prev => ({ ...prev, pastProjects: [...prev.pastProjects, { title: "", link: "" }] }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            Swal.fire({
                title: 'تم بنجاح!',
                text: 'تم إنشاء ملفك الشخصي ',
                icon: 'success',
                confirmButtonColor: mainGreen
            }).then(() => navigate('/profile'));
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="container py-5" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Toaster position="top-center" />

            <style>
                {`
                    .setup-card { border-radius: 30px; border: none; background: white; overflow: hidden; min-height: 600px; }
                    .setup-header { background: ${mainGreen}; color: white; padding: 30px; text-align: center; }
                    .form-label { font-weight: 700; color: ${mainGreen}; font-size: 0.85rem; }
                    .input-custom { background: #f8f9fa; border: 2px solid #f1f1f1; border-radius: 15px; padding: 12px; transition: 0.3s; }
                    .input-custom:focus { border-color: ${mainGreen}; background: white; outline: none; box-shadow: none; }
                    .step-indicator { width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; margin: 0 auto 10px; }
                    .active-step { background: white; color: ${mainGreen}; }
                    .inactive-step { background: rgba(255,255,255,0.3); color: white; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="setup-card shadow-lg animate__animated animate__fadeIn">


                        <div className="setup-header">
                            <div className="d-flex justify-content-center gap-4 mb-3">
                                <div>
                                    <div className={`step-indicator ${step === 1 ? 'active-step' : 'inactive-step'}`}>1</div>
                                    <small>الأساسيات</small>
                                </div>
                                <div style={{ alignSelf: 'center', height: '2px', width: '50px', background: 'rgba(255,255,255,0.2)' }}></div>
                                <div>
                                    <div className={`step-indicator ${step === 2 ? 'active-step' : 'inactive-step'}`}>2</div>
                                    <small>الخبرات</small>
                                </div>
                            </div>
                            <h4 className="fw-900">{step === 1 ? "مرحباً بك! لنبدأ بالحساب" : "أخبرنا عن مهاراتك"}</h4>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 p-md-5">

                            {/* --- القسم الأول: بيانات الحساب --- */}
                            {step === 1 && (
                                <div className="animate__animated animate__fadeInLeft">
                                    <div className="text-center mb-4">
                                        <div className="position-relative d-inline-block">
                                            <div className="rounded-circle border border-4 border-light shadow-sm overflow-hidden bg-white" style={{ width: '110px', height: '110px' }}>
                                                {imagePreview ? <img src={imagePreview} className="w-100 h-100 object-fit-cover" alt="Avatar" /> : <i className="bi bi-person-circle display-1 text-light"></i>}
                                            </div>
                                            <label className="btn btn-success btn-sm position-absolute bottom-0 start-0 rounded-circle shadow">
                                                <i className="bi bi-camera"></i>
                                                <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-3 text-end">
                                        <label className="form-label">الاسم الكامل</label>
                                        <input name="fullName" type="text" className="form-control input-custom" value={formData.fullName} onChange={handleInputChange} required />
                                    </div>

                                    <div className="mb-3 text-end">
                                        <label className="form-label">اسم المستخدم (UserName)</label>
                                        <input name="userName" type="text" className="form-control input-custom" value={formData.userName} onChange={handleInputChange} required />
                                    </div>

                                    <div className="mb-4 text-end">
                                        <label className="form-label">كلمة المرور</label>
                                        <div className="position-relative">
                                            <input name="password" type={showPassword ? "text" : "password"} className="form-control input-custom" value={formData.password} onChange={handleInputChange} required />
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'} position-absolute top-50 start-0 translate-middle-y ms-3 cursor-pointer text-muted`} onClick={() => setShowPassword(!showPassword)}></i>
                                        </div>
                                    </div>

                                    <button type="button" onClick={nextStep} className="btn btn-success w-100 py-3 rounded-4 fw-bold shadow-sm" style={{ background: mainGreen }}>
                                        التالي <i className="bi bi-arrow-left ms-2"></i>
                                    </button>
                                </div>
                            )}

                        
                            {step === 2 && (
                                <div className="animate__animated animate__fadeInRight">
                                
                                    <div className="row g-3 mb-4 text-end">
                                        <div className="col-md-6">
                                            <label className="form-label">التخصص الجامعي</label>
                                            <select name="universityMajor" className="form-select input-custom" value={formData.universityMajor} onChange={handleInputChange}>
                                                <option>هندسة البرمجيات</option>
                                                <option>علم الحاسوب</option>
                                                <option>الأمن السيبراني</option>
                                                <option>الذكاء الاصطناعي</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label">مجال العمل / الشغف التقني</label>
                                            <input name="workField" type="text" className="form-control input-custom" placeholder="مثال: Full Stack Developer" value={formData.workField} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                    {/* المهارات */}
                                    <div className="mb-4 text-end">
                                        <label className="form-label">المهارات التقنية (Enter للإضافة)</label>
                                        <input type="text" className="form-control input-custom" placeholder="JavaScript, React, SQL..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                                        <div className="d-flex flex-wrap gap-2 mt-2">
                                            {formData.skills.map(s => (
                                                <span key={s} className="badge bg-success-subtle text-success p-2 rounded-pill fw-bold border-0 shadow-sm">
                                                    {s} <i className="bi bi-x-circle ms-1 cursor-pointer" onClick={() => removeSkill(s)}></i>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                
                                    <div className="mb-4 text-end">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <label className="form-label mb-0">المشاريع السابقة (إن وجدت)</label>
                                            <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" onClick={addProjectField}>
                                                <i className="bi bi-plus-lg me-1"></i> إضافة مشروع
                                            </button>
                                        </div>

                                        {formData.pastProjects.map((proj, index) => (
                                            <div key={index} className="p-3 mb-2 rounded-4 border bg-light animate__animated animate__fadeInUp shadow-sm position-relative">
                                                <div className="row g-2">
                                                    <div className="col-md-5">
                                                        <input type="text" className="form-control form-control-sm border-0 bg-white rounded-3"
                                                            placeholder="اسم المشروع" value={proj.title}
                                                            onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input type="text" className="form-control form-control-sm border-0 bg-white rounded-3 text-start"
                                                            dir="ltr" placeholder="Link (GitHub/Live)" value={proj.link}
                                                            onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                                                    </div>
                                                    <div className="col-md-1 d-flex align-items-center justify-content-center">
                                                        {formData.pastProjects.length > 1 && (
                                                            <i className="bi bi-trash text-danger cursor-pointer fs-5"
                                                                onClick={() => {
                                                                    const updated = formData.pastProjects.filter((_, i) => i !== index);
                                                                    setFormData(prev => ({ ...prev, pastProjects: updated }));
                                                                }}></i>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                
                                    <div className="mb-5 text-end">
                                        <label className="form-label">رابط الحساب الشخصي (GitHub Profile)</label>
                                        <div className="input-group" dir="ltr">
                                            <span className="input-group-text bg-white border-0 shadow-sm"><i className="bi bi-github"></i></span>
                                            <input name="githubUrl" type="url" className="form-control input-custom border-0 shadow-sm"
                                                placeholder="https://github.com/username" value={formData.githubUrl} onChange={handleInputChange} />
                                        </div>
                                    </div>

                                
                                    <div className="d-flex gap-3">
                                        <button type="button" onClick={prevStep} className="btn btn-light flex-grow-1 py-3 rounded-4 fw-bold text-muted border">
                                            <i className="bi bi-arrow-right me-2"></i> السابق
                                        </button>
                                        <button type="submit" disabled={loading} className="btn btn-success flex-grow-1 py-3 rounded-4 fw-bold shadow-sm" style={{ background: mainGreen }}>
                                            {loading ? (
                                                <span className="spinner-border spinner-border-sm me-2"></span>
                                            ) : (
                                                "إنهاء إعداد الملف الشخصي"
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};