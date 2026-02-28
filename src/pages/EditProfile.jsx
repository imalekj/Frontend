import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export const EditProfile = () => {
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [imagePreview, setImagePreview] = useState("https://api.dicebear.com/7.x/avataaars/svg?seed=Felix");
    const [skillInput, setSkillInput] = useState("");
    const [skills, setSkills] = useState(["React.js", "UI/UX", "JavaScript"]);
    const [completeness, setCompleteness] = useState(0);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "مالك جابر",
        major: "هندسة البرمجيات",
        github: "malik-jaber",
        bio: "مطور واجهات أمامية شغوف ببناء تجارب مستخدم فريدة تخدم مجتمع جامعة الزيتونة الأردنية."
    });

    useEffect(() => {
        setIsAuthorized(true); 
    }, []);

    useEffect(() => {
        let count = 0;
        if (formData.name.trim().length > 3) count += 25;
        if (formData.bio.trim().length > 10) count += 25;
        if (skills.length >= 3) count += 25;
        if (formData.github.trim()) count += 25;
        setCompleteness(count);
    }, [formData, skills]);


    const swalStyled = Swal.mixin({
        customClass: {
            popup: 'rounded-4 shadow-lg',
            confirmButton: 'btn btn-success px-4 py-2 mx-2 fw-bold',
            cancelButton: 'btn btn-light px-4 py-2 mx-2 fw-bold border'
        },
        buttonsStyling: false,
        fontFamily: 'Cairo'
    });

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return swalStyled.fire({
                    icon: 'error',
                    title: 'حجم ملف كبير',
                    text: 'الأقصى المسموح به هو 2MB فقط',
                    confirmButtonText: 'حسناً'
                });
            }
            setImagePreview(URL.createObjectURL(file));
            
            Swal.fire({
                icon: 'success',
                title: 'تم تحديث الصورة',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
        }
    };

    const addSkill = (e) => {
        if (e.key === 'Enter' && skillInput.trim() !== "") {
            e.preventDefault();
            const newSkill = skillInput.trim();
            if (!skills.includes(newSkill)) {
                setSkills([...skills, newSkill]);
                setSkillInput("");
            } else {
                swalStyled.fire({
                    icon: 'warning',
                    text: 'هذه المهارة مضافة مسبقاً',
                    confirmButtonText: 'فهمت'
                });
            }
        }
    };

    const removeSkill = (skillToRemove) => {
        swalStyled.fire({
            title: 'هل أنت متأكد؟',
            text: `سيتم حذف مهارة "${skillToRemove}" من ملفك`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'نعم، احذفها',
            cancelButtonText: 'تراجع',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setSkills(skills.filter(s => s !== skillToRemove));
            }
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

    
        Swal.fire({
            title: 'جاري الحفظ',
            html: 'يرجى الانتظار لحظات...',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });
        
        try {
        
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            Swal.fire({
                icon: 'success',
                title: 'تم الحفظ!',
                text: 'تم تحديث ملفك الشخصي بنجاح',
                confirmButtonColor: mainGreen,
                confirmButtonText: 'رائع'
            }).then(() => {
                navigate('/profile');
            });
        } catch (err) {
            Swal.fire({
                icon: 'error',
                title: 'فشل الحفظ',
                text: 'حدث خطأ غير متوقع، حاول مرة أخرى'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthorized) return null;

    return (
        <div className="container py-5" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .swal2-popup { font-family: 'Cairo', sans-serif !important; }
                    .zuj-card { border-radius: 30px; border: 1px solid #f0f0f0; }
                    .form-control, .form-select {
                        border-radius: 12px;
                        padding: 12px 20px;
                        background-color: #f8f9fa;
                        border: 1px solid #eee;
                    }
                    .form-control:focus {
                        border-color: ${mainGreen};
                        box-shadow: 0 0 0 0.25rem rgba(26, 93, 68, 0.1);
                        background-color: #fff;
                    }
                    .skill-badge { animation: fadeIn 0.3s ease; }
                    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
                    
                    .camera-btn { width: 42px; height: 42px; border: 4px solid #fff !important; }
                    .progress-custom { height: 10px; border-radius: 10px; background: #e9ecef; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    <div className="card zuj-card shadow-lg border-0 p-4 p-md-5 bg-white text-end" dir="rtl">
                        
                        <div className="text-center mb-5">
                            <h4 className="fw-bold mb-2">تعديل الملف الشخصي</h4>
                            <div className="progress progress-custom mx-auto mt-3" style={{maxWidth: '250px'}}>
                                <div 
                                    className="progress-bar progress-bar-striped progress-bar-animated" 
                                    style={{width: `${completeness}%`, backgroundColor: mainGreen}}
                                ></div>
                            </div>
                            <small className="text-muted d-block mt-2">اكتمال الملف: {completeness}%</small>
                        </div>

                        <form onSubmit={handleSave}>
                            <div className="text-center mb-5">
                                <div className="position-relative d-inline-block">
                                    <img 
                                        src={imagePreview} 
                                        className="rounded-circle border shadow-sm" 
                                        width="130" height="130" alt="Avatar" 
                                    />
                                    <label htmlFor="file-upload" className="camera-btn btn btn-success position-absolute bottom-0 start-0 rounded-circle shadow p-0 d-flex align-items-center justify-content-center cursor-pointer">
                                        <i className="bi bi-camera-fill"></i>
                                    </label>
                                    <input id="file-upload" type="file" hidden onChange={handleImageChange} accept="image/*" />
                                </div>
                            </div>

                            <div className="row g-4">
                                <div className="col-md-6">
                                    <label className="small fw-bold mb-2">الاسم الكامل</label>
                                    <input type="text" className="form-control" value={formData.name} required onChange={(e) => setFormData({...formData, name: e.target.value})} />
                                </div>

                                <div className="col-md-6">
                                    <label className="small fw-bold mb-2">GitHub</label>
                                    <input type="text" className="form-control text-start" dir="ltr" value={formData.github} onChange={(e) => setFormData({...formData, github: e.target.value})} />
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2">التخصص</label>
                                    <select className="form-select" value={formData.major} onChange={(e) => setFormData({...formData, major: e.target.value})}>
                                        <option>هندسة البرمجيات</option>
                                        <option>علم الحاسوب</option>
                                        <option>الأمن السيبراني</option>
                                        <option>الذكاء الاصطناعي</option>
                                    </select>
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2">المهارات (Enter للإضافة)</label>
                                    <input type="text" className="form-control mb-3" placeholder="أضف مهارة..." value={skillInput} onChange={(e) => setSkillInput(e.target.value)} onKeyDown={addSkill} />
                                    <div className="d-flex flex-wrap gap-2">
                                        {skills.map((skill, index) => (
                                            <span key={index} className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 py-2 px-3 rounded-pill d-flex align-items-center gap-2">
                                                {skill}
                                                <i className="bi bi-x-circle-fill text-danger cursor-pointer" onClick={() => removeSkill(skill)}></i>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2">النبذة التعريفية</label>
                                    <textarea className="form-control" rows="4" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})}></textarea>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-5">
                                <button type="submit" disabled={loading} className="btn btn-success flex-grow-1 py-3 fw-bold rounded-4 shadow-sm border-0" style={{backgroundColor: mainGreen}}>
                                    حفظ التغييرات
                                </button>
                                <button type="button" className="btn btn-light px-4 py-3 fw-bold rounded-4 text-muted border" onClick={() => navigate('/profile')}>
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};