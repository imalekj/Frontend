import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext'; 

export const EditProfile = () => {
    const navigate = useNavigate();
    
    const { user, login } = useAuth(); 
    
    const mainGreen = '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(false);

    // 3. تهيئة البيانات بناءً على بيانات المستخدم المسجل حالياً
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        workField: user?.workField || "",
        githubUrl: user?.githubUrl || "",
        pastProjects: user?.pastProjects || [{ title: "", link: "" }]
    });
     



        const defaultImg =
        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";

        const [imagePreview, setImagePreview] = useState(defaultImg);
                        useEffect(() => {
  if (!user?.image) {
    setImagePreview(defaultImg);
    return;
  }

  if (
    user.image.startsWith("http") ||
    user.image.startsWith("blob")
  ) {
    setImagePreview(user.image);
  } else {
    setImagePreview(baseUrl + user.image);
  }
}, [user]);



    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                return Swal.fire({
                    icon: 'error',
                    title: 'حجم الملف كبير',
                    text: 'الحد الأقصى هو 2MB',
                    confirmButtonColor: mainGreen
                });
            }
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleProjectChange = (index, field, value) => {
        const updatedProjects = [...formData.pastProjects];
        updatedProjects[index][field] = value;
        setFormData({ ...formData, pastProjects: updatedProjects });
    };

    const addProjectField = () => {
        setFormData({
            ...formData,
            pastProjects: [...formData.pastProjects, { title: "", link: "" }]
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);

        Swal.fire({
            title: 'جاري الحفظ...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });
        
        try {
            // محاكاة لعملية الـ API
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 4. تحديث البيانات في الـ Context (هذا سيحدث الـ localStorage أيضاً)
            const updatedUser = {
                ...user,
                ...formData,
                image: imagePreview
            };
            login(updatedUser); 

            Swal.fire({
                icon: 'success',
                title: 'تم التحديث',
                text: 'تم حفظ التعديلات بنجاح في ملفك الشخصي',
                confirmButtonColor: mainGreen
            }).then(() => navigate('/profile'));
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'حدث خطأ ما' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-5 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .edit-card { border-radius: 25px; border: none; background: white; }
                    .form-control { border-radius: 12px; padding: 12px; background-color: #f8fafc; border: 1px solid #e2e8f0; }
                    .form-control:focus { border-color: ${mainGreen}; box-shadow: 0 0 0 0.2rem rgba(26, 93, 68, 0.1); }
                    .avatar-wrapper { width: 120px; height: 120px; margin: 0 auto; position: relative; }
                    .avatar-img { width: 100%; height: 100%; border-radius: 35px; object-fit: cover; border: 4px solid #fff; }
                    .upload-badge { 
                        position: absolute; bottom: -5px; left: -5px; 
                        background: ${mainGreen}; color: white; width: 35px; height: 35px; 
                        border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer;
                    }
                    .project-box { background: #f1f5f9; border-radius: 15px; padding: 15px; margin-bottom: 12px; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-7">
                    <div className="card edit-card shadow-lg p-4 p-md-5">
                        <h4 className="fw-bold mb-4 text-center">تعديل بيانات الحساب</h4>

                        <form onSubmit={handleSave}>
                            <div className="avatar-wrapper mb-5 shadow-sm">
         <img
  src={imagePreview}
  className="avatar-img shadow-sm"
  alt="Profile"
/>                           <label htmlFor="img-input" className="upload-badge shadow">
                                    <i className="bi bi-camera-fill"></i>
                                </label>
                                <input id="img-input" type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </div>

                            <div className="row g-4">
                                <div className="col-12">
                                    <label className="small fw-bold mb-2 text-secondary">الاسم الكامل</label>
                                    <input type="text" className="form-control fw-bold" value={formData.fullName} 
                                        onChange={(e) => setFormData({...formData, fullName: e.target.value})} required />
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2 text-secondary">مجال العمل / التخصص الدقيق</label>
                                    <input type="text" className="form-control" placeholder="مثلاً: Frontend Developer" 
                                        value={formData.workField} onChange={(e) => setFormData({...formData, workField: e.target.value})} />
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2 text-secondary">رابط ملف GitHub</label>
                                    <input type="url" className="form-control text-start" dir="ltr" 
                                        value={formData.githubUrl} onChange={(e) => setFormData({...formData, githubUrl: e.target.value})} />
                                </div>

                                <div className="col-12">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <label className="small fw-bold text-secondary">المشاريع البرمجية</label>
                                        <button type="button" className="btn btn-sm btn-outline-success px-3 rounded-pill fw-bold" onClick={addProjectField}>
                                            + إضافة مشروع
                                        </button>
                                    </div>
                                    {formData.pastProjects.map((project, index) => (
                                        <div key={index} className="project-box">
                                            <input type="text" className="form-control mb-2 bg-white" placeholder="اسم المشروع" 
                                                value={project.title} onChange={(e) => handleProjectChange(index, 'title', e.target.value)} />
                                            <input type="url" className="form-control bg-white text-start" dir="ltr" placeholder="رابط المشروع" 
                                                value={project.link} onChange={(e) => handleProjectChange(index, 'link', e.target.value)} />
                                        </div>
                                    ))}
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
