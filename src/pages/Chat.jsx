import React, { useState, useEffect, useRef, useContext } from 'react';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { AppColors } from '../theme/AppColors';
import { apiFetch } from '../api';

export const Chat = () => {
    const scrollRef = useRef(null);
    const [view, setView] = useState('inbox');
    const [activeChat, setActiveChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [specializationUsers, setSpecializationUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user, token } = useAuth();
    const [specializationName, setSpecializationName] = useState('');
    const [messages, setMessages] = useState([
        
    ]);

    const [contacts, setContacts] = useState([
       
    ]);

    
            useEffect(() => {
            const fetchSpecialization = async () => {
                if (!user?.id) return;
        
                try {
                    const response = await apiFetch(
                        `${baseUrl}api/Profile/GetSpecialistNameByUserId/${user.id}`
                    );
        
                    if (!response.ok) {
                        throw new Error('Failed to fetch specialization');
                    }
        
                    const data = await response.text(); // or response.text()
                    setSpecializationName(data);
        
                    
                } catch (error) {
                    console.error('Error fetching specialization:', error);
                }
            };
        
            fetchSpecialization();
        }, [user?.id, baseUrl]);


    const fetchUsersBySpecialization = async (specializationName) => {
        setLoadingUsers(true);
        try {
          const response = await apiFetch(
           `${baseUrl}api/Chat/GetAllUserBySpecializationName/${(specializationName)}`
                            );
          const data = await response.json();
            setSpecializationUsers(data);

const mapped = data.map(u => ({
    id: u.id,
    name: u.userName,
    type: 'individual',
    lastMsg: '',
    unread: 0,
    imagePath: u.imagePath,
    online: false
}));

setContacts(mapped);
        } catch (error) {
           
            Swal.fire('خطأ', 'فشل في تحميل قائمة المستخدمين', 'error');
        } finally {
            setLoadingUsers(false);
        }
    };

  

    useEffect(() => {
        if (activeChat && activeChat.type === 'individual') {
            setLoading(true);
            setTimeout(() => setLoading(false), 500);
        }
    }, [activeChat]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, view]);


    console.log("specializationName:", specializationName);
console.log("users:", specializationUsers);

    const handleCreateChat = (type) => {
        if (type === 'private') {
            if (loadingUsers) {
                Swal.fire('جاري التحميل...', 'يرجى الانتظار', 'info');
                return;
            }

            if (specializationUsers.length === 0) {
                Swal.fire('لا يوجد مستخدمون', 'لم يتم العثور على مستخدمين متاحين', 'warning');
                return;
            }

            const options = specializationUsers.reduce((acc, u) => {
                acc[u.id] = u.userName;
                return acc;
            }, {});

            Swal.fire({
                title: 'بدء محادثة خاصة',
                input: 'select',
                inputOptions: options,
                inputPlaceholder: 'اختر مستخدماً',
                showCancelButton: true,
                confirmButtonColor: AppColors.primaryGreen,
                confirmButtonText: 'بدء',
                cancelButtonText: 'إلغاء'
            }).then((result) => {
                if (result.isConfirmed && result.value) {
                    const selectedUser = specializationUsers.find(u => String(u.id) === String(result.value));
                    const newChat = {
                        id: Date.now(),
                        name: selectedUser?.userName || result.value,
                        type: 'individual',
                        lastMsg: 'تم إنشاء المحادثة حديثاً',
                        avatar: selectedUser?.imagePath || null,
                        online: false
                    };
                    setContacts(prev => [newChat, ...prev]);
                    setActiveChat(newChat);
                    setView('chat');
                    Swal.fire('تم!', 'تم إنشاء المحادثة بنجاح', 'success');
                }
            });
            return;
        }

        Swal.fire({
            title: 'إنشاء مجموعة جديدة',
            input: 'text',
            inputPlaceholder: 'اسم المجموعة',
            showCancelButton: true,
            confirmButtonColor: AppColors.primaryGreen,
            confirmButtonText: 'إنشاء',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newChat = {
                    id: Date.now(),
                    name: result.value,
                    type: 'team',
                    lastMsg: 'تم إنشاء المحادثة حديثاً',
                    icon: 'people-fill',
                    leaderId: user?.id || 'me'
                };
                setContacts(prev => [newChat, ...prev]);
                Swal.fire('تم!', 'تم إنشاء المجموعة بنجاح', 'success');
            }
        });
    };

    const handleAdminAction = (action) => {
        const title = action === 'add' ? 'إضافة عضو جديد' : 'طرد عضو من المجموعة';
        Swal.fire({
            title: title,
            input: 'text',
            inputPlaceholder: 'أدخل الرقم الجامعي',
            showCancelButton: true,
            confirmButtonColor: action === 'add' ? AppColors.primaryGreen : AppColors.colorRed,
            confirmButtonText: action === 'add' ? 'إضافة' : 'طرد'
        }).then(res => {
            if (res.isConfirmed) Swal.fire('تمت العملية', 'تم تحديث قائمة الأعضاء', 'success');
        });
    };

    const handleLeaveGroup = () => {
        Swal.fire({
            title: 'هل أنت متأكد؟',
            text: "ستغادر هذه المجموعة ولن تظهر لك في القائمة",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: AppColors.colorRed,
            confirmButtonText: 'نعم، غادر',
            cancelButtonText: 'تراجع'
        }).then(res => {
            if (res.isConfirmed) {
                setContacts(contacts.filter(c => c.id !== activeChat.id));
                setView('inbox');
            }
        });
    };
    useEffect(() => {
    if (specializationName) {
        fetchUsersBySpecialization(specializationName);
    }
}, [specializationName]);
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        const msg = {
            id: Date.now(),
            chatId: activeChat.id,
            text: newMessage,
            sender: "أنا",
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isMe: true
        };
        setMessages(prev => [...prev, msg]);
        setNewMessage("");
    };

    const getAvatarSrc = (contact) => {
        if (contact?.imagePath) return `${baseUrl}/${contact.imagePath}`;
        return `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`;
    };

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .list-container { max-width: 950px; margin: 0 auto; background: ${AppColors.backgroundCard}; border-radius: 20px; overflow: hidden; height: 85vh; display: flex; flex-direction: column; }
                    .list-item { padding: 15px 20px; border-bottom: 1px solid ${AppColors.borderRow}; transition: 0.2s; cursor: pointer; display: flex; align-items: center; gap: 15px; }
                    .list-item:hover { background: ${AppColors.backgroundScreenLight}; }
                    .chat-box { background: #e5ddd5; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
                    .bubble { max-width: 75%; padding: 10px 15px; border-radius: 12px; font-size: 0.95rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                    .bubble-me { background: ${AppColors.primaryGreen}; color: white; align-self: flex-start; border-top-right-radius: 2px; }
                    .bubble-other { background: white; color: ${AppColors.textPrimary}; align-self: flex-end; border-top-left-radius: 2px; }
                    .action-btn-circle { width: 40px; height: 40px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; transition: 0.3s; color: white; }
                    .btn-create { background: ${AppColors.primaryGreen}; color: white; border: none; border-radius: 12px; padding: 10px 20px; font-weight: bold; transition: 0.3s; }
                    .btn-create:hover { background: ${AppColors.primaryGreenGradientEnd}; transform: translateY(-2px); }
                    .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
                `}
            </style>

            <div className="list-container shadow-lg border position-relative">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-success"></div>
                    </div>
                )}

                {view === 'inbox' && (
                    <>
                        <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center shadow-sm">
                            <h5 className="fw-bold mb-0" style={{ color: AppColors.primaryGreen }}>المحادثات الطلابية</h5>
                            <div className="d-flex gap-2">
                                <button className="btn-create shadow-sm small" onClick={() => handleCreateChat('private')} disabled={loadingUsers}>
                                    {loadingUsers
                                        ? <span className="spinner-border spinner-border-sm ms-2"></span>
                                        : <i className="bi bi-person-plus-fill ms-2"></i>
                                    }
                                    محادثة
                                </button>
                                <button className="btn-create shadow-sm small" style={{ backgroundColor: AppColors.accentBlue }} onClick={() => handleCreateChat('group')}>
                                    <i className="bi bi-people-fill ms-2"></i>مجموعة
                                </button>
                            </div>
                        </div>

                        <div className="overflow-auto flex-grow-1">
                            {contacts.map(item => (
                                <div key={item.id} className="list-item" onClick={() => { setActiveChat(item); setView('chat'); }}>
                                    <div className="position-relative">
                                        {item.type === 'individual' ? (
                                            <img
                                                src={getAvatarSrc(item)}
                                                className="rounded-circle border"
                                                width="55" height="55"
                                                alt={item.name}
                                                onError={(e) => { e.target.src = `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`; }}
                                            />
                                        ) : (
                                            <div className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                                                style={{ width: '55px', height: '55px', background: AppColors.primaryGreen }}>
                                                <i className={`bi bi-${item.icon} fs-4`}></i>
                                            </div>
                                        )}
                                        {item.online && (
                                            <span className="position-absolute bottom-0 end-0 rounded-circle border-2 border-white"
                                                style={{ width: '15px', height: '15px', background: AppColors.lightGreenTextDark }}></span>
                                        )}
                                    </div>
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="fw-bold" style={{ color: AppColors.textPrimary }}>{item.name}</span>
                                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>12:40 PM</small>
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <p className="mb-0 text-muted small text-truncate" style={{ maxWidth: '250px' }}>{item.lastMsg || 'لا توجد رسائل'}</p>
                                            {item.unread > 0 && <span className="badge rounded-pill bg-danger">{item.unread}</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'chat' && activeChat && (
                    <>
                        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center shadow-sm">
                            <button className="btn border-0 fw-bold" style={{ color: AppColors.primaryGreen }} onClick={() => setView('inbox')}>
                                <i className="bi bi-chevron-right ms-1"></i> رجوع
                            </button>

                            <div className="d-flex align-items-center gap-3">
                                <div className="text-start">
                                    <div className="fw-bold" style={{ color: AppColors.textPrimary }}>{activeChat.name}</div>
                                    <small className="text-success fw-bold" style={{ fontSize: '0.7rem' }}>
                                        {activeChat.type === 'team' ? 'مجموعة عمل' : 'نشط الآن'}
                                    </small>
                                </div>
                                <img
                                    src={activeChat.type === 'individual' ? getAvatarSrc(activeChat) : zujLogo}
                                    className="rounded-circle border"
                                    width="45" height="45"
                                    alt={activeChat.name}
                                    onError={(e) => { e.target.src = zujLogo; }}
                                />
                            </div>

                            <div className="d-flex gap-2">
                                {activeChat.type === 'team' && (
                                    <>
                                        {activeChat.leaderId === (user?.id || 'me') && (
                                            <>
                                                <button title="إضافة طالب" className="action-btn-circle" style={{ background: AppColors.primaryGreen }} onClick={() => handleAdminAction('add')}>
                                                    <i className="bi bi-person-plus-fill"></i>
                                                </button>
                                                <button title="طرد عضو" className="action-btn-circle" style={{ background: AppColors.colorRed }} onClick={() => handleAdminAction('kick')}>
                                                    <i className="bi bi-person-x-fill"></i>
                                                </button>
                                            </>
                                        )}
                                        <button title="مغادرة" className="action-btn-circle" style={{ background: '#6c757d' }} onClick={handleLeaveGroup}>
                                            <i className="bi bi-box-arrow-right"></i>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        <div ref={scrollRef} className="chat-box">
                            {messages.filter(m => m.chatId === activeChat.id).map(msg => (
                                <div key={msg.id} className={`d-flex flex-column ${msg.isMe ? 'align-items-start' : 'align-items-end'}`}>
                                    <div className={`bubble ${msg.isMe ? 'bubble-me' : 'bubble-other'}`}>
                                        {!msg.isMe && activeChat.type === 'team' && (
                                            <div className="fw-bold mb-1" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{msg.sender}</div>
                                        )}
                                        <div>{msg.text}</div>
                                        <small className={`d-block mt-1 ${msg.isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>{msg.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 bg-light border-top">
                            <form onSubmit={handleSendMessage} className="d-flex gap-3">
                                <button type="submit" className="btn text-white rounded-circle shadow" style={{ background: AppColors.primaryGreen, width: '50px', height: '50px' }}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control rounded-pill border-0 px-4 text-end shadow-sm"
                                    placeholder="اكتب رسالتك هنا للمشاركة..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
