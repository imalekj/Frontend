import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { apiFetch } from '../api';
export const CompetitionsPage = () => {
    const [mainTab, setMainTab] = useState('الكل'); 
    const [categoryFilter, setCategoryFilter] = useState('الكل');
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const { isLoggedIn } = useContext(AuthContext);
    
    const mainGreen = '#1a5d44';
    const accentGold = '#c5a059';
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

                const [allData, setAllData] = useState([]);




               useEffect(() => {
    apiFetch(`${baseUrl}api/Posts/GetAllProject`, {
        headers: {
            "ngrok-skip-browser-warning": "true"
        }
    })
    .then(res => res.json())
    .then(data => setAllData(data))
    .catch(err => console.log(err));
}, []);
const filteredResults = allData.filter(item => {

    const matchesTab =
        mainTab === 'الكل' ||
        (mainTab === 'مشروع' && item.isGraduationProject) ||
        (mainTab === 'مسابقة' && !item.isGraduationProject);

    const matchesCategory = true; // مؤقتًا (ما عندك category)

    const matchesSearch = (item.name ?? "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    return matchesTab && matchesCategory && matchesSearch;
});
    // دالة التعامل مع النشر
    const handleCreatePost = () => {
        if (isLoggedIn) {
            navigate('/create-post');
        } else {
            // توجيهه لتسجيل الدخول إذا لم يكن مسجلاً
            navigate('/login');
        }
    };

    return (
        <div className="container py-5 text-end bg-white" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .page-header { border-bottom: 2px solid #f1f5f3; padding-bottom: 30px; margin-bottom: 40px; }
                    .search-container .form-control {
                        border-radius: 12px;
                        padding: 12px 20px 12px 45px;
                        border: 1px solid #e2e8f0;
                        background: #f8fafc;
                    }
                    .tab-switcher {
                        background: #f1f5f3;
                        padding: 5px;
                        border-radius: 12px;
                        display: inline-flex;
                    }
                    .tab-btn {
                        padding: 8px 30px;
                        border-radius: 10px;
                        border: none;
                        font-weight: 700;
                        font-size: 0.9rem;
                        transition: 0.3s;
                        color: #64748b;
                        background: transparent;
                    }
                    .tab-btn.active {
                        background: white;
                        color: ${mainGreen};
                        box-shadow: 0 2px 8px rgba(0,0,0,0.05);
                    }
                    .comp-card {
                        border: 1px solid #edf2f7;
                        border-radius: 16px;
                        overflow: hidden;
                        transition: 0.3s;
                    }
                    .comp-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 12px 24px rgba(0,0,0,0.06);
                        border-color: ${mainGreen};
                    }
                    .img-wrapper { position: relative; height: 160px; overflow: hidden; }
                    .type-tag {
                        position: absolute;
                        top: 15px;
                        right: 15px;
                        padding: 4px 14px;
                        border-radius: 8px;
                        font-size: 0.75rem;
                        font-weight: 800;
                        z-index: 2;
                    }
                    .tag-مسابقة { background: ${accentGold}; color: white; }
                    .tag-مشروع { background: ${mainGreen}; color: white; }
                    .category-label {
                        color: ${mainGreen};
                        font-size: 0.75rem;
                        font-weight: 800;
                        letter-spacing: 0.5px;
                    }
                    .requirement-box {
                        background: #fdfdfd;
                        border-right: 3px solid ${mainGreen};
                        padding: 10px;
                        border-radius: 4px;
                    }
                    .btn-create {
                        background: ${mainGreen};
                        color: white;
                        border-radius: 12px;
                        padding: 10px 24px;
                        font-weight: 800;
                        transition: 0.3s;
                        border: none;
                    }
                    .btn-create:hover {
                        background: #144935;
                        color: white;
                        transform: scale(1.05);
                    }
                `}
            </style>

            <div className="page-header d-md-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-3">
                    <div>
                        <h2 className="fw-900 mb-2">استكشاف الفرص</h2>
                        <p className="text-muted fw-bold small mb-0">اكتشف المسابقات الرسمية ومشاريع التخرج القائمة</p>
                    </div>
                    
                    <button 
                        className="btn btn-create shadow-sm ms-3 d-flex align-items-center gap-2"
                        onClick={handleCreatePost}
                    >
                        <i className="bi bi-plus-circle-fill fs-5"></i>
                        <span>نشر فرصة</span>
                    </button>
                </div>
                
                <div className="search-container mt-3 mt-md-0" style={{ width: '300px' }}>
                    <div className="position-relative">
                        <input 
                            type="text" 
                            className="form-control shadow-sm border-0" 
                            placeholder="ابحث عن مهارة أو عنوان..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="bi bi-search position-absolute" style={{left: '15px', top: '13px', color: '#94a3b8'}}></i>
                    </div>
                </div>
            </div>

            <div className="row mb-5 gy-4 align-items-center">
                <div className="col-lg-6 text-center text-lg-end">
                    <div className="tab-switcher shadow-sm">
                        {['الكل', 'مسابقة', 'مشروع'].map(tab => (
                            <button 
                                key={tab}
                                className={`tab-btn ${mainTab === tab ? 'active' : ''}`}
                                onClick={() => setMainTab(tab)}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                <div className="col-lg-6">
                    <div className="d-flex justify-content-center justify-content-lg-start gap-2 flex-wrap">
                        <span className="small fw-bold text-muted ms-2 align-self-center">تصفية حسب:</span>
                        {['الكل', 'برمجيات', 'أعمال', 'IT'].map(cat => (
                            <button 
                                key={cat}
                                className={`btn btn-sm px-3 rounded-pill fw-bold ${categoryFilter === cat ? 'btn-dark' : 'btn-outline-light text-dark border'}`}
                                onClick={() => setCategoryFilter(cat)}
                                style={{ fontSize: '0.8rem' }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="row g-4">
                {filteredResults.length > 0 ? filteredResults.map(item => (
                    <div key={item.projectID} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="card comp-card h-100 bg-white border-0 shadow-sm">
                            <div className="img-wrapper">
                                <div className={`type-tag tag-${item.type}`}>{item.type}</div>
                                <img src={item.image} className="w-100 h-100 shadow-sm" style={{ objectFit: 'cover' }} alt="" />
                                <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                            </div>
                            
                          <div className="card-body p-4">

                                {/* TOP INFO */}
                                <div className="d-flex justify-content-between mb-2">

                                    <span className="category-label">
                                        {item.projectLocation}
                                    </span>

                                    <span className="text-muted fw-bold" style={{ fontSize: '0.7rem' }}>
                                        {new Date(item.endDate).toLocaleDateString('ar-EG')}
                                    </span>

                                </div>

                                {/* TITLE */}
                                <h6
                                    className="fw-900 mb-3"
                                    style={{
                                        lineHeight: '1.5',
                                        height: '2.8em',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {item.name}
                                </h6>

                                {/* DESCRIPTION / REQUIREMENT */}
                                <div className="requirement-box mb-3">

                                    <div className="d-flex align-items-center gap-2">

                                        <i className="bi bi-person-badge text-success"></i>

                                        <span className="small fw-bold text-dark">
                                            {item.descriptions}
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                <button 
                                    className="btn btn-outline-success w-100 fw-bold py-2 shadow-sm"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    onClick={() => navigate(`/competition/${item.projectID}`)}
                                >
                                    عرض التفاصيل
                                </button>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5">
                        <div className="display-1 text-light mb-3"><i className="bi bi-search"></i></div>
                        <h5 className="text-muted fw-bold">لم نجد أي فرص تطابق خيارات البحث</h5>
                    </div>
                )}
            </div>
        </div>
    );
};
