import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const CompetitionsPage = () => {
    const [mainTab, setMainTab] = useState('الكل'); 
    const [categoryFilter, setCategoryFilter] = useState('الكل');
    const [searchTerm, setSearchTerm] = useState('');
    
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const accentGold = '#c5a059';

    const allData = [
        { 
            id: 1, 
            type: "مسابقة", 
            title: "مسابقة الأمن السيبراني الوطنية (CTF)", 
            date: "10 يونيو 2024", 
            category: "IT", 
            required: "مطلوب طالبين إضافيين", 
            tags: ["Network", "Linux"],
            image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400&q=80"
        },
        { 
            id: 2, 
            type: "مشروع", 
            title: "تطبيق ذكي لإدارة المكتبة المركزية", 
            date: "مستمر", 
            category: "برمجيات", 
            required: "مطلوب مصمم UI/UX", 
            tags: ["Figma", "React"],
            image: "https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?w=400&q=80" 
        },
        { 
            id: 3, 
            type: "مسابقة", 
            title: "تحدي الابتكار وريادة الأعمال", 
            date: "20 يونيو 2024", 
            category: "أعمال", 
            required: "مطلوب خبير تسويق", 
            tags: ["Pitching", "Analysis"],
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&q=80"
        },
        { 
            id: 4, 
            type: "مشروع", 
            title: "نظام تتبع حافلات الجامعة الذكي", 
            date: "فصل دراسي", 
            category: "برمجيات", 
            required: "مطلوب 3 مطورين Flutter", 
            tags: ["GPS", "Mobile"],
            image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80"
        },
    ];

    const filteredResults = allData.filter(item => {
        const matchesTab = mainTab === 'الكل' || item.type === mainTab;
        const matchesCategory = categoryFilter === 'الكل' || item.category === categoryFilter;
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesTab && matchesCategory && matchesSearch;
    });

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
                        shadow: 0 2px 8px rgba(0,0,0,0.05);
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
                `}
            </style>

            <div className="page-header d-md-flex justify-content-between align-items-center">
                <div>
                    <h2 className="fw-900 mb-2">استكشاف الفرص</h2>
                    <p className="text-muted fw-bold small">اكتشف المسابقات الرسمية ومشاريع التخرج القائمة</p>
                </div>
                <div className="search-container mt-3 mt-md-0" style={{ width: '350px' }}>
                    <div className="position-relative">
                        <input 
                            type="text" 
                            className="form-control" 
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
                    <div key={item.id} className="col-xl-3 col-lg-4 col-md-6">
                        <div className="card comp-card h-100 bg-white border-0 shadow-sm">
                            <div className="img-wrapper">
                                <div className={`type-tag tag-${item.type}`}>{item.type}</div>
                                <img src={item.image} className="w-100 h-100 shadow-sm" style={{ objectFit: 'cover' }} alt="" />
                                <div style={{ position: 'absolute', bottom: 0, right: 0, left: 0, height: '50%', background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)' }}></div>
                            </div>
                            
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between mb-2">
                                    <span className="category-label">{item.category}</span>
                                    <span className="text-muted x-small fw-bold" style={{fontSize: '0.7rem'}}>{item.date}</span>
                                </div>
                                <h6 className="fw-900 mb-3" style={{ lineHeight: '1.5', height: '2.8em', overflow: 'hidden' }}>{item.title}</h6>
                                
                                <div className="requirement-box mb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <i className="bi bi-person-badge text-success"></i>
                                        <span className="small fw-bold text-dark">{item.required}</span>
                                    </div>
                                </div>

                                <div className="d-flex flex-wrap gap-1 mb-0">
                                    {item.tags.map(tag => (
                                        <span key={tag} className="badge bg-light text-secondary fw-normal" style={{ fontSize: '0.65rem', border: '1px solid #eee' }}>
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="card-footer bg-transparent border-0 p-4 pt-0">
                                <button 
                                    className="btn btn-outline-success w-100 fw-bold py-2 shadow-sm"
                                    style={{ borderRadius: '10px', fontSize: '0.85rem' }}
                                    onClick={() => navigate(`/competition/${item.id}`)}
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