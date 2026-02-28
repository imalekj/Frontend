import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import Swal from 'sweetalert2';

export const SetupProfile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [skillInput, setSkillInput] = useState("");
    
    const [formData, setFormData] = useState({
        role: "",
        major: "هندسة البرمجيات",
        github: "",
        bio: "",
        skills: [],
        avatarFile: null, 
        projects: [{ title: "", link: "" }]
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return toast.error("حجم الصورة كبير جداً (الأقصى 2MB)");
            }
            setImagePreview(URL.createObjectURL(file));
            setFormData(prev => ({ ...prev, avatarFile: file }));
            toast.success("تم اختيار الصورة بنجاح");
        }
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() !== "") {
            e.preventDefault();
            const newSkill = skillInput.trim();
            if (!formData.skills.includes(newSkill)) {
                setFormData(prev => ({
                    ...prev,
                    skills: [...prev.skills, newSkill]
                }));
                setSkillInput("");
            } else {
                toast.error("هذه المهارة مضافة بالفعل");
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skillToRemove)
        }));
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.projects];
        updatedProjects[index][field] = value;
        setFormData(prev => ({ ...prev, projects: updatedProjects }));
    };

    const addProjectField = () => {
        setFormData(prev => ({
            ...prev,
            projects: [...prev.projects, { title: "", link: "" }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const confirmResult = await Swal.fire({
            title: 'هل بياناتك جاهزة؟',
            text: "سيتم حفظ هذه المعلومات وعرضها في ملفك الشخصي.",
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: mainGreen,
            cancelButtonColor: '#6e7881',
            confirmButtonText: 'نعم، احفظ الملف',
            cancelButtonText: 'مراجعة ثانية',
            reverseButtons: true,
            customClass: { popup: 'rounded-5' }
        });

        if (!confirmResult.isConfirmed) return;

        setLoading(true);

        Swal.fire({
            title: 'جاري إنشاء ملفك الشخصي',
            html: 'يرجى الانتظار ثوانٍ معدودة...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            const dataToSend = new FormData();
            dataToSend.append('role', formData.role);
            dataToSend.append('major', formData.major);
            dataToSend.append('bio', formData.bio);
            dataToSend.append('skills', JSON.stringify(formData.skills));
            dataToSend.append('projects', JSON.stringify(formData.projects));
            
            if (formData.github.trim() !== "") {
                dataToSend.append('github', formData.github);
            }

            if (formData.avatarFile) {
                dataToSend.append('avatar', formData.avatarFile);
            }

        
            await new Promise(resolve => setTimeout(resolve, 1500));
            
        
            Swal.fire({
                title: 'مبارك!',
                text: 'تم إعداد ملفك الشخصي بنجاح، أنت الآن مستعد للمشاركة.',
                icon: 'success',
                confirmButtonColor: mainGreen,
                confirmButtonText: 'الذهاب للملف الشخصي',
                customClass: { popup: 'rounded-5' }
            }).then(() => {
                navigate('/profile');
            });

        } catch (error) {
            Swal.fire({
                title: 'خطأ!',
                text: 'حدثت مشكلة أثناء الحفظ، يرجى المحاولة لاحقاً.',
                icon: 'error',
                confirmButtonColor: '#d33'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <Toaster position="top-center" reverseOrder={false} />

            <style>
                {`
                    .setup-card { border-radius: 30px; border: none; background: white; overflow: hidden; }
                    .setup-header { background: ${mainGreen}; color: white; padding: 40px 20px; text-align: center; }
                    .form-label { font-weight: 700; color: ${mainGreen}; font-size: 0.85rem; margin-bottom: 8px; }
                    .input-custom { background: #f8f9fa; border: 2px solid #f1f1f1; border-radius: 15px; padding: 12px; transition: 0.3s; }
                    .input-custom:focus { border-color: ${mainGreen}; background: white; outline: none; box-shadow: none; }
                    .project-box { background: #fdfdfd; border: 1.5px dashed #ddd; border-radius: 20px; padding: 15px; margin-bottom: 15px; }
                    .cursor-pointer { cursor: pointer; }
                    .badge-skill { font-size: 0.8rem; padding: 8px 12px; }
                    .swal2-container { font-family: 'Cairo', sans-serif !important; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="setup-card shadow-lg animate__animated animate__fadeIn">
                        <div className="setup-header">
                            <h3 className="fw-900 mb-1">إعداد الملف الشخصي</h3>
                            <p className="mb-0 opacity-75 small">أكمل بياناتك لتظهر بشكل احترافي في المنصة</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-4 p-md-5 text-end">
                            
                        
                            <div className="text-center mb-5">
                                <div className="position-relative d-inline-block">
                                    <div className="rounded-circle border border-4 border-light shadow-sm overflow-hidden bg-white" style={{ width: '130px', height: '130px' }}>
                                        {imagePreview ? 
                                            <img src={imagePreview} className="w-100 h-100 object-fit-cover" alt="Profile" /> : 
                                            <div className="h-100 d-flex align-items-center justify-content-center bg-light text-muted">
                                                <i className="bi bi-person-bounding-box display-4"></i>
                                            </div>
                                        }
                                    </div>
                                    <label className="btn btn-success btn-sm position-absolute bottom-0 start-0 rounded-circle p-2 shadow-sm border-2 border-white cursor-pointer">
                                        <i className="bi bi-camera-fill"></i>
                                        <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                                    </label>
                                </div>
                                <h6 className="mt-3 fw-bold mb-0 text-dark">الصورة الشخصية</h6>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="form-label">المسمى التعريفي (مثل: مصمم واجهات)</label>
                                    <input name="role" type="text" className="form-control input-custom" 
                                        placeholder="ماذا تفعل؟"
                                        value={formData.role} onChange={handleInputChange} required />
                                </div>

                                <div className="col-md-6">
                                    <label className="form-label">التخصص الدراسي</label>
                                    <select name="major" className="form-select input-custom" 
                                        value={formData.major} onChange={handleInputChange}>
                                        <option value="هندسة البرمجيات">هندسة البرمجيات</option>
                                        <option value="علم الحاسوب">علم الحاسوب</option>
                                        <option value="نظم المعلومات">نظم المعلومات</option>
                                        <option value="الأمن السيبراني">الأمن السيبراني</option>
                                        <option value="الذكاء الاصطناعي">الذكاء الاصطناعي</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">رابط GitHub</label>
                                    <div className="input-group" dir="ltr">
                                        <span className="input-group-text bg-light border-0"><i className="bi bi-github"></i></span>
                                        <input name="github" type="url" className="form-control input-custom" 
                                            placeholder="https://github.com/username" 
                                            value={formData.github} onChange={handleInputChange} />
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="form-label">المهارات التقنية (اضغط Enter للإضافة)</label>
                                    <input type="text" className="form-control input-custom" 
                                        placeholder="JavaScript, React..." 
                                        value={skillInput} onChange={(e) => setSkillInput(e.target.value)} 
                                        onKeyDown={addSkill} />
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {formData.skills.map(s => (
                                            <span key={s} className="badge bg-success-subtle text-success border-0 badge-skill rounded-pill fw-bold">
                                                {s} <i className="bi bi-x-circle ms-2 cursor-pointer" onClick={() => removeSkill(s)}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12 text-end">
                                    <label className="form-label">النبذة التعريفية (Bio)</label>
                                    <textarea name="bio" className="form-control input-custom" rows="3" 
                                        placeholder="اكتب شيئاً بسيطاً عن شغفك التقني..." 
                                        value={formData.bio} onChange={handleInputChange} required></textarea>
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="form-label mb-0">المشاريع السابقة</label>
                                        <button type="button" className="btn btn-sm btn-outline-success rounded-pill px-3 fw-bold" onClick={addProjectField}>
                                            <i className="bi bi-plus-lg me-1"></i> إضافة مشروع
                                        </button>
                                    </div>
                                    {formData.projects.map((proj, index) => (
                                        <div key={index} className="project-box shadow-sm">
                                            <div className="row g-2">
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control form-control-sm border-0 bg-light" 
                                                        placeholder="اسم المشروع" value={proj.title}
                                                        onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                                                </div>
                                                <div className="col-md-6">
                                                    <input type="text" className="form-control form-control-sm border-0 bg-light" 
                                                        placeholder="رابط المشروع" value={proj.link}
                                                        onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={loading} 
                                className="btn btn-success w-100 py-3 mt-5 rounded-4 fw-bold shadow-sm" 
                                style={{ background: mainGreen }}
                            >
                                {loading ? "جاري المعالجة..." : "إكمال إعداد الملف الشخصي"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};