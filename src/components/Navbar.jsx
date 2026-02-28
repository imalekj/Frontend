import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';

export const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(true);
    const [notifCount, setNotifCount] = useState(3);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [showNotifDropdown, setShowNotifDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    
    const navigate = useNavigate();
    const mainGreen = '#1a5d44';
    const userRef = useRef(null);
    const notifRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (userRef.current && !userRef.current.contains(event.target)) setShowUserDropdown(false);
            if (notifRef.current && !notifRef.current.contains(event.target)) setShowNotifDropdown(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        setShowUserDropdown(false);
        
        Swal.fire({
            title: 'تسجيل الخروج',
            text: "هل أنت متأكد من أنك تريد مغادرة المنصة؟",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: mainGreen,
            cancelButtonColor: '#d33',
            confirmButtonText: 'نعم، سجل الخروج',
            cancelButtonText: 'إلغاء',
            reverseButtons: true,
            customClass: {
                popup: 'rounded-4 shadow-lg',
                title: 'fw-bold',
            }
        }).then((result) => {
            if (result.isConfirmed) {
                setIsLoggedIn(false);
                Swal.fire({
                    title: 'تم!',
                    text: 'تم تسجيل خروجك بنجاح.',
                    icon: 'success',
                    timer: 1500,
                    showConfirmButton: false,
                    confirmButtonColor: mainGreen
                });
                navigate('/login');
            }
        });
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== "") {
            navigate(`/leaderboard?search=${searchQuery}`);
        }
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top py-2" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .search-container { max-width: 220px; transition: all 0.3s ease; }
                    .search-container:focus-within { max-width: 280px; }
                    .search-input { background: #f1f5f9; border: none; border-radius: 10px; padding: 7px 35px 7px 15px; font-size: 0.8rem; }
                    .nav-link { font-weight: 600; color: #64748b !important; font-size: 0.9rem; padding: 0.5rem 0.8rem !important; }
                    .nav-link.active { color: ${mainGreen} !important; background: rgba(26, 93, 68, 0.05); border-radius: 8px; }
                    .custom-dropdown { position: absolute; top: 115%; left: 0; z-index: 1000; min-width: 220px; background: white; border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.08); border: 1px solid #edf2f7; padding: 8px 0; animation: slideDown 0.2s ease-out; }
                    @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
                    .dropdown-item { transition: 0.2s; font-size: 0.85rem; padding: 10px 15px; display: flex; align-items: center; gap: 10px; color: #475569; border: none; background: transparent; width: 100%; text-align: right; }
                    .dropdown-item:hover { background: #f8fafc; color: ${mainGreen}; }
                `}
            </style>

            <div className="container">
                {/* الشعار */}
                <Link to="/" className="navbar-brand d-flex align-items-center order-0 ms-lg-4">
                    <img src={zujLogo} width="40" height="40" alt="Zuj Logo" className="rounded-circle" />
                    <div className="text-end me-2 d-none d-sm-block">
                        <span className="fw-bold d-block mb-0" style={{ color: mainGreen, fontSize: '0.9rem', lineHeight: '1.2' }}>جامعة الزيتونة</span>
                        <small className="text-muted" style={{ fontSize: '0.6rem' }}>منصة الكفاءات</small>
                    </div>
                </Link>

                <button className="navbar-toggler border-0 shadow-none order-2" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <i className="bi bi-list fs-2"></i>
                </button>

            
                <div className="collapse navbar-collapse order-3 order-lg-1" id="navbarNav">
                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-1 flex-row-reverse">
                        <li className="nav-item"><NavLink className="nav-link" to="/" end>الرئيسية</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/competitions">المسابقات</NavLink></li>
                        <li className="nav-item"><NavLink className="nav-link" to="/leaderboard">المتصدرين</NavLink></li>
                        {isLoggedIn && (
                            <>
                                <li className="nav-item"><NavLink className="nav-link" to="/my-teams">فرقي</NavLink></li>
                                <li className="nav-item"><NavLink className="nav-link" to="/chat">الدردشة</NavLink></li>
                            </>
                        )}
                    </ul>

                    <div className="search-container position-relative ms-lg-4 d-none d-lg-block">
                        <i className="bi bi-search position-absolute" style={{ right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: '0.8rem' }}></i>
                        <input
                            type="text"
                            className="form-control search-input text-end"
                            placeholder="ابحث هنا..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

    
                <div className="d-flex align-items-center gap-2 order-1 order-lg-2 me-auto me-lg-0 ms-2">
                    {isLoggedIn ? (
                        <>
                            <div className="position-relative" ref={notifRef}>
                                <button className="btn btn-link p-2 text-secondary shadow-none position-relative" onClick={() => setShowNotifDropdown(!showNotifDropdown)}>
                                    <i className="bi bi-bell fs-5"></i>
                                    {notifCount > 0 && <span className="position-absolute top-0 start-0 translate-middle badge rounded-circle bg-danger p-1" style={{ width: '8px', height: '8px', marginTop: '10px' }}></span>}
                                </button>
                                {showNotifDropdown && (
                                    <div className="custom-dropdown text-end">
                                        <div className="px-3 py-2 border-bottom fw-bold small text-muted">الإشعارات</div>
                                        <div className="p-3 text-center small text-muted">لا توجد إشعارات جديدة حالياً</div>
                                    </div>
                                )}
                            </div>

                            <Link to="/create-post" className="btn btn-sm text-white px-3 rounded-pill d-none d-md-block fw-bold" style={{ backgroundColor: mainGreen }}>
                                <i className="bi bi-plus-lg ms-1"></i> نشر
                            </Link>

                            <div className="position-relative ms-1" ref={userRef}>
                                <button className="btn border-0 p-1 d-flex align-items-center gap-2 shadow-none" onClick={() => setShowUserDropdown(!showUserDropdown)}>
                                    <div className="text-end d-none d-xl-block">
                                        <div className="fw-bold text-dark lh-1" style={{ fontSize: '0.8rem' }}>مالك جابر</div>
                                    </div>
                                    <img src="https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg" className="rounded-circle border" width="34" height="34" alt="user" />
                                </button>
                                {showUserDropdown && (
                                    <div className="custom-dropdown text-end">
                                        <Link className="dropdown-item" to="/profile" onClick={() => setShowUserDropdown(false)}>
                                            <i className="bi bi-person-circle fs-6"></i> ملفي الشخصي
                                        </Link>
                                        
                                        <hr className="my-1 opacity-10" />
                                        
                                        <button onClick={handleLogout} className="dropdown-item text-danger fw-bold">
                                            <i className="bi bi-box-arrow-left fs-6"></i> تسجيل الخروج
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-sm px-4 fw-bold text-white rounded-pill shadow-sm" style={{ backgroundColor: mainGreen }}>دخول</Link>
                    )}
                </div>
            </div>
        </nav>
    );
};