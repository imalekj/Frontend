import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { AppColors } from '../theme/AppColors';

export const EditProfile = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const userId = user?.id;
    const [selectedFile, setSelectedFile] = useState(null);
    const mainGreen = AppColors.primaryGreen || '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
        skills: "",
        bio: "",
    });

    // حالات إدارة المشاريع السابقة محلياً
    const [newProjectTitle, setNewProjectTitle] = useState("");
    const [newProjectLink, setNewProjectLink] = useState("");
    const [existingProjects, setExistingProjects] = useState([]);
    const [loadingProjects, setLoadingProjects] = useState(false);
    
    const defaultImg = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const [imagePreview, setImagePreview] = useState(defaultImg);

    // 1. جلب البيانات الأساسية والمشاريع المضافة مسبقاً عند تحميل الصفحة
    useEffect(() => {
        if (!user) return;

        setFormData({
            fullName: user.fullName || user.name || "",
            role: user.role || "",
            skills: user.skills || "",
            bio: user.bio || "",
        });

        if (user.imagePath) {
            setImagePreview(
                user.imagePath.startsWith("http")
                    ? user.imagePath
                    : `${baseUrl}${user.imagePath}`
            );
        }

        const fetchCurrentPastProjects = async () => {
            if (!user.id) return;
            setLoadingProjects(true);
            try {
                const res = await apiFetch(`${baseUrl}api/Profile/GetprevProjcts/${user.id}`, {
                    method: "GET"
                });
                if (res.ok) {
                    const data = await res.json();
                    setExistingProjects(Array.isArray(data) ? data : data.data || []);
                }
            } catch (err) {
                console.error("خطأ أثناء جلب المشاريع الحالية:", err);
            } finally {
                setLoadingProjects(false);
            }
        };

        fetchCurrentPastProjects();
    }, [user, baseUrl]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // 2. إضافة المشروع الجديد إلى القائمة المحلية المؤقتة قبل الحفظ النهائي
    const handleAddProjectToList = (e) => {
        e.preventDefault();
        if (!newProjectTitle.trim() || !newProjectLink.trim()) {
            Swal.fire({ icon: 'info', title: 'يرجى ملء اسم المشروع ورابطه أولاً' });
            return;
        }

        // إضافة المشروع للقائمة المحلية وتفريغ الحقول
        setExistingProjects([...existingProjects, { title: newProjectTitle, link: newProjectLink }]);
        setNewProjectTitle("");
        setNewProjectLink("");
    };

    // 3. دالة الحفظ الشاملة لجميع التغييرات (البيانات والمشاريع) والعودة للبروفايل
    const handleSave = async (e) => {
        e.preventDefault();

        setLoading(true);
        Swal.fire({
            title: 'جاري حفظ التغييرات...',
            allowOutsideClick: false,
            didOpen: () => { Swal.showLoading(); }
        });

        try {
            const data = new FormData();

            data.append("id", userId);
            data.append("fullName", formData.fullName);
            data.append("skills", formData.skills || "");
            data.append("bio", formData.bio || "");
            data.append("email", user.email || "");
            data.append("userName", user.userName || "");
            data.append("phoneNumber", user.phoneNumber || "");
            data.append("role", formData.role || user.role || "");
            data.append("participationID", "0");

            // إرسال قائمة المشاريع السابقة مدمجة مع نموذج البيانات الكلي
            if (existingProjects.length > 0) {
                data.append("pastProjectsJson", JSON.stringify(existingProjects));
            }

            if (selectedFile) {
                data.append("ProfileImage", selectedFile);
            }

            const res = await apiFetch(`${baseUrl}api/Login/UpdateUser`, {
                method: 'PUT',
                body: data
            });

            if (!res.ok) throw new Error("فشل في تحديث البيانات");

            Swal.fire({
                icon: 'success',
                title: 'تم الحفظ بنجاح',
                timer: 1500,
                showConfirmButton: false
            });

            // التوجيه الفوري لصفحة الملف الشخصي بعد النجاح
            navigate('/profile');

        } catch (err) {
            console.error(err);
            Swal.fire({ icon: 'error', title: 'حدث خطأ أثناء الحفظ' });
        } finally {
            setLoading(false);
            Swal.close();
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
                    .project-badge { background: #f0f7f4; border-right: 3px solid ${mainGreen}; border-radius: 8px; padding: 10px 15px; font-size: 0.85rem; }
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card edit-card shadow-lg p-4 p-md-5">
                        <h4 className="fw-bold mb-4 text-center" style={{ color: mainGreen }}>تعديل بيانات الحساب</h4>

                        <div className="avatar-wrapper mb-5 shadow-sm">
                            <img src={imagePreview} className="avatar-img shadow-sm" alt="Profile" />
                            <label htmlFor="img-input" className="upload-badge shadow">
                                <i className="bi bi-camera-fill"></i>
                            </label>
                            <input id="img-input" type="file" hidden onChange={handleImageChange} accept="image/*" />
                        </div>

                        {/* قسم إدارة وعرض المشاريع السابقة */}
                        <div className="mb-5 p-4 rounded-4 border bg-white">
                            <h6 className="fw-bold mb-3 text-dark">
                                <i className="bi bi-collection text-success me-1"></i> معرض أعمالك ومشاريعك السابقة
                            </h6>
                            
                            {/* عرض المشاريع المحملة أو المضافة حديثاً */}
                            <div className="row g-2 mb-3">
                                {loadingProjects ? (
                                    <p className="text-muted small">جاري تحميل أعمالك الحالية...</p>
                                ) : existingProjects.length > 0 ? (
                                    existingProjects.map((proj, idx) => (
                                        <div key={idx} className="col-md-6">
                                            <div className="project-badge d-flex justify-content-between align-items-center">
                                                <span className="fw-bold text-dark text-truncate ms-2">{proj.title || proj.projectName}</span>
                                                <a href={proj.link || proj.projectLink} target="_blank" rel="noreferrer" className="badge bg-secondary text-decoration-none">معاينة</a>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-muted small px-2">لم تقم بإضافة مشاريع سابقة بعد، أضف مشاريعك بالأسفل ليتم حفظها.</p>
                                )}
                            </div>

                            {/* حقول الإدخال لتجهيز مشروع جديد */}
                            <div className="bg-light p-3 rounded-3 border-dashed">
                                <span className="small fw-bold text-secondary d-block mb-2">تجهيز مشروع جديد لإضافته:</span>
                                <div className="row g-2">
                                    <div className="col-md-5">
                                        <input 
                                            type="text" 
                                            className="form-control form-control-sm" 
                                            placeholder="اسم المشروع" 
                                            value={newProjectTitle}
                                            onChange={(e) => setNewProjectTitle(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-5">
                                        <input 
                                            type="url" 
                                            className="form-control form-control-sm text-start" 
                                            placeholder="رابط المشروع أو مستودع GitHub" 
                                            value={newProjectLink}
                                            onChange={(e) => setNewProjectLink(e.target.value)}
                                        />
                                    </div>
                                    <div className="col-md-2">
                                        <button type="button" className="btn btn-sm text-white w-100 h-100 rounded-3 fw-bold" style={{ backgroundColor: mainGreen }} onClick={handleAddProjectToList}>
                                            إدراج
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* النموذج الرئيسي لحفظ كافة البيانات المحدثة */}
                        <form onSubmit={handleSave}>
                            <div className="row g-4">
                                <div className="col-md-12">
                                    <label className="small fw-bold mb-2 text-secondary">الاسم الكامل</label>
                                    <input
                                        type="text"
                                        className="form-control fw-bold"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="small fw-bold mb-2 text-secondary">الكلية</label>
                                    <input disabled type="text" className="form-control" value="IT" />
                                </div>

                                <div className="col-md-6">
                                    <label className="small fw-bold mb-2 text-secondary">التخصص الجامعي الرئيسي</label>
                                    <input
                                        disabled
                                        type="text"
                                        className="form-control"
                                        value={formData.role}
                                        placeholder="مثلاً: هندسة البرمجيات"
                                    />
                                </div>

                                <div className="col-12">
                                    <label className="small fw-bold mb-2 text-secondary">المهارات</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="مثلاً: React, C#, SQL"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                    />
                                </div>

                                <div className="col-md-12">
                                    <label className="small fw-bold mb-2 text-secondary">نبذة تعريفية</label>
                                    <textarea
                                        className="form-control"
                                        placeholder="اكتب نبذة مختصرة عن نفسك..."
                                        rows={3}
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-5">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn btn-success flex-grow-1 py-3 fw-bold rounded-4 shadow-sm border-0"
                                    style={{ backgroundColor: mainGreen }}
                                >
                                    حفظ التغييرات
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-light px-4 py-3 fw-bold rounded-4 text-muted border"
                                    onClick={() => navigate('/profile')}
                                >
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

export default EditProfile;