import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext'; 
import { AppColors } from '../theme/AppColors';

export const EditProfile = () => {
    const navigate = useNavigate();
    const { user, login } = useAuth();
    const userId = user?.id;
    const [selectedFile, setSelectedFile] = useState(null);
    const mainGreen = AppColors.primaryGreen || '#1a5d44';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        role: "",
        skills: "",
        url: "",
        bio: "",
    });
    
    const defaultImg = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
    const [imagePreview, setImagePreview] = useState(defaultImg);

    useEffect(() => {
        if (!userId) return;

        const fetchUserInfo = async () => {
            try {
                const res = await apiFetch(`${baseUrl}api/Login/GetUserInfo/${userId}`);
                if (!res.ok) throw new Error("فشل في جلب البيانات");

                const data = await res.json();

                setFormData({
                    fullName: data.fullName || data.name || "",
                    role: data.role || "",
                    skills: data.skills || "",
                    url: data.githubUrl || data.url || "",
                    bio: data.bio || "",
                });

                if (data.imagePath) {
                    setImagePreview(
                        data.imagePath.startsWith("http")
                            ? data.imagePath
                            : `${baseUrl}${data.imagePath}`
                    );
                }

            } catch (err) {
                console.error("Error fetching user info:", err);
            }
        };

        fetchUserInfo();
    }, [userId, baseUrl]);

const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
        setSelectedFile(file);
        setImagePreview(URL.createObjectURL(file));
    }
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
        const data = new FormData();

        data.append("id", userId);
        data.append("fullName", formData.fullName);
        data.append("url", formData.url || "");
        data.append("skills", formData.skills || "");
        data.append("bio", formData.bio || "");

        data.append("email", user.email || "");
        data.append("userName", user.userName || "");
        data.append("phoneNumber", user.phoneNumber || "");
        data.append("role", user.role || "");
        data.append("participationID", "0");

        if (selectedFile) {
            data.append("ProfileImage", selectedFile);
        }

        const res = await apiFetch(`${baseUrl}api/Login/UpdateUser`, {
            method: 'PUT',
            body: data
        });

        if (!res.ok) throw new Error("فشل في تحديث البيانات");

        // ✅ success UI
        Swal.fire({
            icon: 'success',
            title: 'تم الحفظ بنجاح',
            timer: 1500,
            showConfirmButton: false
        });

        navigate('/profile');

    } catch (err) {
        console.error(err);

        // ❌ error UI
        Swal.fire({
            icon: 'error',
            title: 'حدث خطأ أثناء الحفظ'
        });

    } finally {
        setLoading(false);
        Swal.close(); // 🔥 THIS FIXES INFINITE LOADING
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
                `}
            </style>

            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card edit-card shadow-lg p-4 p-md-5">
                        <h4 className="fw-bold mb-4 text-center" style={{ color: mainGreen }}>تعديل بيانات الحساب</h4>

                        <form onSubmit={handleSave}>
                            <div className="avatar-wrapper mb-5 shadow-sm">
                                <img src={imagePreview} className="avatar-img shadow-sm" alt="Profile" />
                                <label htmlFor="img-input" className="upload-badge shadow">
                                    <i className="bi bi-camera-fill"></i>
                                </label>
                                <input id="img-input" type="file" hidden onChange={handleImageChange} accept="image/*" />
                            </div>

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
                                    <input
                                        disabled
                                        type="text"
                                        className="form-control"
                                        placeholder="مثلاً: كلية الهندسة وتكنولوجيا المعلومات"
                                        value="IT"
                                    />
                                </div>

                                <div className="col-md-6">
                                    <label className="small fw-bold mb-2 text-secondary">التخصص الجامعي الرئيسي</label>
                                    <input
                                        disabled
                                        type="text"
                                        className="form-control"
                                        placeholder="مثلاً: هندسة البرمجيات"
                                        value={formData.role}
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
                                    <label className="small fw-bold mb-2 text-secondary">رابط ملف GitHub</label>
                                    <input
                                        type="url"
                                        className="form-control text-start"
                                        dir="ltr"
                                        placeholder="https://github.com/username"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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
