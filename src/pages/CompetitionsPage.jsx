import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';
import { AppColors } from '../theme/AppColors';

export const CompetitionsPage = () => {
    const [mainTab, setMainTab] = useState('الكل');
    const [facultyFilter, setFacultyFilter] = useState('الكل');
    const [searchTerm, setSearchTerm] = useState('');

    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);

    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const [allData, setAllData] = useState([]);

    const faculties = [
        'الكل',
        ' العلوم وتكنولوجيا المعلومات',
        ' الهندسة والتكنولوجيا',
        ' الصيدلة',
        ' التمريض',
        ' الآداب',
        ' الأعمال',
        ' الحقوق',
        ' العمارة والتصميم'
    ];

    useEffect(() => {
        apiFetch(`${baseUrl}api/Posts/GetAllProject`, {
            headers: {
                "ngrok-skip-browser-warning": "true"
            }
        })
            .then(res => res.json())
            .then(data => setAllData(data))
            .catch(err => console.log(err));
    }, [baseUrl]);

    const filteredResults = allData
        .filter(item => {
            const matchesTab =
                mainTab === 'الكل' ||
                (mainTab === 'مشروع' && item.isGraduationProject) ||
                (mainTab === 'مسابقة' && !item.isGraduationProject);

            const matchesFaculty =
                facultyFilter === 'الكل' ||
                (item.projectLocation ?? "").trim().toLowerCase() === facultyFilter.trim().toLowerCase();

            const matchesSearch = (item.name ?? "")
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
                (item.skills ?? "")
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());

            return matchesTab && matchesFaculty && matchesSearch;
        })
        .sort((a, b) => b.projectID - a.projectID);

    const handleCreatePost = () => {
        navigate('/create-post');
    };

    return (
        <div className="container py-5 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif', maxWidth: '1200px', backgroundColor: AppColors.backgroundCard }}>
            <style>
                {`
                    .page-header { border-bottom: 2px solid ${AppColors.borderRow}; padding-bottom: 30px; margin-bottom: 40px; }
                    .search-container .form-control {
                        border-radius: 14px;
                        padding: 14px 20px 14px 45px;
                        border: 1.5px solid ${AppColors.borderInput};
                        background: ${AppColors.backgroundScreenLight};
                        font-size: 0.95rem;
                        transition: 0.3s;
                        color: ${AppColors.textPrimary};
                    }
                    .search-container .form-control:focus {
                        border-color: ${AppColors.primaryGreen};
                        box-shadow: 0 0 0 0.25rem rgba(27, 94, 56, 0.1);
                        background: ${AppColors.backgroundCard};
                    }
                    .tab-switcher {
                        background: ${AppColors.borderRow};
                        padding: 6px;
                        border-radius: 14px;
                        display: inline-flex;
                    }
                    .tab-btn {
                        padding: 10px 35px;
                        border-radius: 10px;
                        border: none;
                        font-weight: 700;
                        font-size: 0.95rem;
                        transition: 0.3s;
                        color: ${AppColors.textSecondary};
                        background: transparent;
                    }
                    .tab-btn.active {
                        background: ${AppColors.backgroundCard};
                        color: ${AppColors.primaryGreen};
                        box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                    }
                    .faculty-select {
                        border-radius: 14px;
                        padding: 12px 20px;
                        border: 1.5px solid ${AppColors.borderInput};
                        background-color: ${AppColors.backgroundScreenLight};
                        font-weight: 700;
                        color: ${AppColors.textSecondary};
                        font-size: 0.9rem;
                        transition: 0.3s;
                        cursor: pointer;
                    }
                    .faculty-select:focus {
                        border-color: ${AppColors.primaryGreen};
                        box-shadow: 0 0 0 0.25rem rgba(27, 94, 56, 0.1);
                    }
                    .comp-card {
                        border: none;
                        border-radius: 20px;
                        overflow: hidden;
                        transition: 0.3s;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                        background: ${AppColors.backgroundCard};
                    }
                    .comp-card:hover {
                        transform: translateY(-6px);
                        box-shadow: 0 15px 35px rgba(27, 94, 56, 0.08);
                    }
                    .img-wrapper { position: relative; height: 180px; overflow: hidden; }
                    .type-tag {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        padding: 6px 16px;
                        border-radius: 10px;
                        font-size: 0.8rem;
                        font-weight: 800;
                        z-index: 2;
                        box-shadow: 0 4px 10px rgba(0,0,0,0.15);
                    }
                    .tag-مسابقة { background: ${AppColors.accentGold}; color: white; }
                    .tag-مشروع { background: ${AppColors.primaryGreen}; color: white; }
                    .category-label {
                        color: ${AppColors.badgeDoneText};
                        font-size: 0.8rem;
                        font-weight: 800;
                        background: ${AppColors.badgeDoneBackground};
                        padding: 4px 12px;
                        border-radius: 8px;
                        border: 1px solid ${AppColors.badgeDoneBorder};
                    }
                    .requirement-box {
                        background: ${AppColors.backgroundScreenLight};
                        border-right: 4px solid ${AppColors.primaryGreen};
                        padding: 12px;
                        border-radius: 8px;
                        height: 75px;
                        overflow: hidden;
                    }
                    .btn-create {
                        background: ${AppColors.primaryGreen};
                        color: white;
                        border-radius: 14px;
                        padding: 12px 28px;
                        font-weight: 800;
                        transition: 0.3s;
                        border: none;
                        box-shadow: 0 4px 14px rgba(27, 94, 56, 0.2);
                    }
                    .btn-create:hover {
                        background: ${AppColors.primaryDark};
                        color: white;
                        transform: translateY(-2px);
                        box-shadow: 0 6px 20px rgba(27, 94, 56, 0.3);
                    }
                    .btn-details {
                        border: 2px solid ${AppColors.borderInput};
                        color: ${AppColors.textSecondary};
                        border-radius: 12px;
                        font-weight: 700;
                        transition: 0.2s;
                        background: transparent;
                    }
                    .btn-details:hover {
                        border-color: ${AppColors.primaryGreen};
                        background: ${AppColors.primaryGreen};
                        color: white;
                        box-shadow: 0 4px 12px rgba(27, 94, 56, 0.15);
                    }
                `}
            </style>

            <div className="page-header d-lg-flex justify-content-between align-items-center gap-4">
                <div className="d-sm-flex align-items-center justify-content-between justify-content-lg-start gap-4 flex-grow-1 mb-4 mb-lg-0">
                    <div>
                        <h1 className="fw-black mb-2" style={{ fontSize: '2.2rem', color: AppColors.textPrimary }}>استكشاف الفرص</h1>
                        <p className="fw-medium mb-0" style={{ color: AppColors.textSecondary }}>اكتشف المسابقات الرسمية ومشاريع التخرج القائمة بجميع الكليات</p>
                    </div>

                    <button
                        className="btn btn-create shadow-sm d-flex align-items-center gap-2 mt-3 mt-sm-0"
                        onClick={handleCreatePost}
                    >
                        <i className="bi bi-plus-circle-fill fs-5"></i>
                        <span>نشر فرصة جديدة</span>
                    </button>
                </div>

                <div className="search-container col-12 col-lg-4">
                    <div className="position-relative">
                        <input
                            type="text"
                            className="form-control border-0 shadow-sm"
                            placeholder="ابحث عن مهارة، عنوان، كلمة مفتاحية..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="bi bi-search position-absolute" style={{ left: '18px', top: '15px', color: AppColors.textHint, fontSize: '1.1rem' }}></i>
                    </div>
                </div>
            </div>

            <div className="row mb-5 g-4 align-items-center p-3 rounded-4 mx-0 shadow-sm" style={{ backgroundColor: AppColors.backgroundScreenLight }}>
                <div className="col-xl-5 col-lg-6 text-center text-lg-end">
                    <div className="tab-switcher shadow-sm border" style={{ backgroundColor: AppColors.backgroundCard }}>
                        {['الكل', 'مسابقة', 'مشروع'].map(tab => (
                            <button
                                key={tab}
                                className={`tab-btn ${mainTab === tab ? 'active' : ''}`}
                                onClick={() => setMainTab(tab)}
                            >
                                {tab === 'الكل' ? 'عرض الكل' : tab === 'مسابقة' ? 'المسابقات' : 'مشاريع التخرج'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="col-xl-7 col-lg-6 d-flex justify-content-center justify-content-lg-start align-items-center gap-3 flex-wrap">
                    <span className="fw-bold d-flex align-items-center gap-1" style={{ color: AppColors.textSecondary }}>
                        <i className="bi bi-funnel-fill" style={{ color: AppColors.primaryGreen }}></i>
                        تصفية حسب الكلية:
                    </span>
                    <select
                        className="form-select faculty-select w-auto shadow-sm"
                        value={facultyFilter}
                        onChange={(e) => setFacultyFilter(e.target.value)}
                    >
                        {faculties.map((fac, idx) => (
                            <option key={idx} value={fac}>{fac}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="row g-4">
                {filteredResults.length > 0 ? filteredResults.map(item => {
                    const itemType = item.isGraduationProject ? 'مشروع' : 'مسابقة';
                    return (
                        <div key={item.projectID} className="col-xl-3 col-lg-4 col-md-6">
                            <div className="card comp-card h-100 border-0 shadow-sm">
                                <div className="img-wrapper">
                                    <div className={`type-tag tag-${itemType}`}>{itemType}</div>
                                    <img
                                        src={item.image || "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80"}
                                        className="w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        alt={item.name}
                                    />
                                    <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: '60%', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }}></div>
                                </div>

                                <div className="card-body p-4 d-flex flex-column justify-content-between">
                                    <div>
                                        <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                                            <span className="category-label text-truncate" style={{ maxWidth: '140px' }}>
                                                <i className="bi bi-building me-1"></i>
                                                {item.projectLocation || "الجامعة"}
                                            </span>
                                            <span className="fw-semibold small d-flex align-items-center gap-1" style={{ color: AppColors.textSecondary }}>
                                                <i className="bi bi-calendar-event" style={{ color: AppColors.textHint }}></i>
                                                {item.endDate ? new Date(item.endDate).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }) : ""}
                                            </span>
                                        </div>

                                        <h5
                                            className="fw-bold mb-3"
                                            style={{
                                                color: AppColors.textPrimary,
                                                lineHeight: '1.6',
                                                height: '3em',
                                                overflow: 'hidden',
                                                display: '-webkit-box',
                                                WebkitLineClamp: '2',
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {item.name}
                                        </h5>

                                        <div className="requirement-box mb-2">
                                            <div className="d-flex align-items-start gap-2">
                                                <i className="bi bi-text-paragraph mt-1" style={{ color: AppColors.primaryGreen }}></i>
                                                <span className="small fw-medium" style={{ color: AppColors.textSecondary, display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                                    {item.descriptions}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                    <button
                                        className="btn btn-details w-100 py-2.5 d-flex align-items-center justify-content-center gap-2"
                                        onClick={() => navigate(`/competition/${item.projectID}`)}
                                    >
                                        <span>عرض التفاصيل كاملاً</span>
                                        <i className="bi bi-arrow-left-short fs-5"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                }) : (
                    <div className="col-12 text-center py-5 my-4 rounded-4 border border-dashed" style={{ backgroundColor: AppColors.backgroundScreenLight, borderColor: AppColors.borderInput }}>
                        <div className="display-3 mb-3" style={{ color: AppColors.textHint }}><i className="bi bi-folder-x"></i></div>
                        <h4 className="fw-bold mb-2" style={{ color: AppColors.textPrimary }}>لا توجد نتائج مطابقة</h4>
                        <p className="mb-0" style={{ color: AppColors.textSecondary }}>جرّب تغيير خيارات الفلترة أو كتابة مهارات ومصطلحات بحث أخرى</p>
                    </div>
                )}
            </div>
        </div>
    );
};