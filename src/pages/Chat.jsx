import React, { useState, useEffect, useRef, useContext } from 'react';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';
import { AuthContext } from '../context/AuthContext';
import { AppColors } from '../theme/AppColors';

export const Chat = () => {
    const scrollRef = useRef(null);
    const { user } = useContext(AuthContext); 
    const [view, setView] = useState('inbox');
    const [activeChat, setActiveChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        { id: 1, chatId: 1, text: "أهلاً بالجميع، هل نبدأ بالعمل؟", sender: "سارة", senderId: "user_sara", time: "10:30 AM", isMe: false },
        { id: 2, chatId: 1, text: "أنا جاهز تماماً!", sender: "أنا", time: "10:32 AM", isMe: true },
        { id: 3, chatId: 2, text: "مرحباً مالك، أعجبتني مهاراتك!", sender: "ليث أحمد", senderId: "user_leith", time: "11:05 AM", isMe: false },
    ]);

    const [contacts, setContacts] = useState([
        { id: 1, name: "مبدعو الزيتونة", lastMsg: "سارة: أهلاً بالجميع...", unread: 2, type: 'team', icon: 'people-fill', leaderId: user?.id || 'me' },
        { id: 4, name: "نادي الأمن السيبراني", lastMsg: "عمر: تم تحديث الرابط", unread: 0, type: 'team', icon: 'shield-lock-fill', leaderId: 'other' },
        { id: 2, name: "ليث أحمد", status: "متصل الآن", avatar: "Leith", online: true, type: 'individual' },
        { id: 3, name: "ديما علي", status: "نشط منذ 5 دقائق", avatar: "Dima", online: false, type: 'individual' }
    ]);

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

    const handleCreateChat = (type) => {
        Swal.fire({
            title: type === 'group' ? 'إنشاء مجموعة جديدة' : 'بدء محادثة خاصة',
            input: 'text',
            inputPlaceholder: type === 'group' ? 'اسم المجموعة' : 'الرقم الجامعي أو الاسم',
            showCancelButton: true,
            confirmButtonColor: AppColors.primaryGreen,
            confirmButtonText: 'إنشاء',
            cancelButtonText: 'إلغاء'
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                const newChat = {
                    id: Date.now(),
                    name: result.value,
                    type: type === 'group' ? 'team' : 'individual',
                    lastMsg: "تم إنشاء المحادثة حديثاً",
                    icon: type === 'group' ? 'people-fill' : null,
                    leaderId: type === 'group' ? user?.id || 'me' : null
                };
                setContacts([newChat, ...contacts]);
                Swal.fire('تم!', 'تم إنشاء المحادثة بنجاح', 'success');
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
        setMessages([...messages, msg]);
        setNewMessage("");
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
                `}
            </style>

            <div className="list-container shadow-lg border position-relative">
                {loading && <div className="loading-overlay"><div className="spinner-border text-success"></div></div>}

                {view === 'inbox' && (
                    <>
                        <div className="p-4 border-bottom bg-white d-flex justify-content-between align-items-center shadow-sm">
                            <h5 className="fw-bold mb-0" style={{ color: AppColors.primaryGreen }}>المحادثات الطلابية</h5>
                            <div className="d-flex gap-2">
                                <button className="btn-create shadow-sm small" onClick={() => handleCreateChat('private')}>
                                    <i className="bi bi-person-plus-fill ms-2"></i>محادثة
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
                                            <img src={`https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`} className="rounded-circle border" width="55" height="55" alt="" />
                                        ) : (
                                            <div className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: '55px', height: '55px', background: AppColors.primaryGreen }}>
                                                <i className={`bi bi-${item.icon} fs-4`}></i>
                                            </div>
                                        )}
                                        {item.online && <span className="position-absolute bottom-0 end-0 rounded-circle border-2 border-white" style={{ width: '15px', height: '15px', background: AppColors.lightGreenTextDark }}></span>}
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
                                    <small className="text-success fw-bold" style={{ fontSize: '0.7rem' }}>{activeChat.type === 'team' ? 'مجموعة عمل' : 'نشط الآن'}</small>
                                </div>
                                <img src={activeChat.avatar ? `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg` : zujLogo} className="rounded-circle border" width="45" height="45" alt="" />
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
                                        {!msg.isMe && activeChat.type === 'team' && <div className="fw-bold mb-1" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{msg.sender}</div>}
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