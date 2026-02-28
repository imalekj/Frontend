import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';

export const Chat = () => {
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    const mainGreen = '#1a5d44';

    const [isAuthorized, setIsAuthorized] = useState(false);
    const [view, setView] = useState('inbox');
    const [activeChat, setActiveChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [messages, setMessages] = useState([
        { id: 1, chatId: 1, text: "أهلاً بالجميع، هل نبدأ بالعمل؟", sender: "سارة", senderId: "user_sara", time: "10:30 AM", isMe: false },
        { id: 2, chatId: 1, text: "أنا جاهز تماماً!", sender: "أنا", time: "10:32 AM", isMe: true },
        { id: 3, chatId: 2, text: "مرحباً أحمد، أعجبتني مهاراتك!", sender: "ليث أحمد", senderId: "user_leith", time: "11:05 AM", isMe: false },
    ]);

    const [contacts, setContacts] = useState([
        { id: 1, name: "مبدعو الزيتونة", lastMsg: "سارة: أهلاً بالجميع...", unread: 2, type: 'team', icon: 'people-fill' },
        { id: 4, name: "نادي الأمن السيبراني", lastMsg: "عمر: تم تحديث الرابط", unread: 0, type: 'team', icon: 'shield-lock-fill' },
        { id: 2, name: "ليث أحمد", status: "متصل الآن", avatar: "Leith", online: true, type: 'individual' },
        { id: 3, name: "ديما علي", status: "نشط منذ 5 دقائق", avatar: "Dima", online: false, type: 'individual' }
    ]);

    useEffect(() => {
        if (activeChat && activeChat.type === 'individual') {
            setLoading(true);
            setTimeout(() => {
                console.log(`تم جلب بيانات المستخدم ${activeChat.name} من قاعدة البيانات`);
                setLoading(false);
            }, 500);
        }
    }, [activeChat]);

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (!user) {
            navigate('/');
        } else {
            setIsAuthorized(true);
        }
    }, [navigate]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, view]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'عذراً...',
                text: 'لا يمكن إرسال رسالة فارغة!',
                confirmButtonColor: mainGreen,
                confirmButtonText: 'حسناً'
            });
            return;
        }

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

    const handleDeleteMessage = (msgId) => {
        Swal.fire({
            title: 'حذف الرسالة؟',
            text: "لن تتمكن من استعادة هذه الرسالة لاحقاً!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: mainGreen,
            confirmButtonText: 'نعم، احذفها',
            cancelButtonText: 'إلغاء',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                setMessages(messages.filter(m => m.id !== msgId));
                Swal.fire({
                    title: 'تم الحذف!',
                    icon: 'success',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        });
    };

    if (!isAuthorized) return null;

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .list-container { max-width: 900px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; height: 80vh; display: flex; flex-direction: column; }
                    .list-item { padding: 15px 20px; border-bottom: 1px solid #f0f0f0; transition: 0.2s; cursor: pointer; display: flex; align-items: center; gap: 15px; }
                    .list-item:hover { background: #f8fafc; }
                    .chat-box { background: #e5ddd5; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
                    .bubble { max-width: 75%; padding: 8px 12px; border-radius: 10px; font-size: 0.9rem; position: relative; cursor: pointer; }
                    .bubble-me { background: #dcf8c6; color: #333; align-self: flex-start; border-top-right-radius: 0; }
                    .bubble-other { background: white; color: #333; align-self: flex-end; border-top-left-radius: 0; }
                    .back-btn { background: none; border: none; color: ${mainGreen}; font-weight: bold; }
                    .loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.7); display: flex; justify-content: center; align-items: center; z-index: 10; }
                `}
            </style>

            <div className="list-container shadow-sm border position-relative">
                {loading && <div className="loading-overlay"><div className="spinner-border text-success"></div></div>}

                {view === 'inbox' && (
                    <>
                        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center">
                            <h5 className="fw-bold mb-0">المحادثات</h5>
                            <i className="bi bi-chat-dots-fill text-success fs-4"></i>
                        </div>
                        <div className="overflow-auto flex-grow-1">
                            {contacts.map(item => (
                                <div key={item.id} className="list-item" onClick={() => { setActiveChat(item); setView('chat'); }}>
                                    {item.type === 'individual' ? (
                                        <img src={`https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg`} className="rounded-circle border" width="50" height="50" alt="" />
                                    ) : (
                                        <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                                            <i className={`bi bi-${item.icon} fs-5`}></i>
                                        </div>
                                    )}
                                    <div className="flex-grow-1">
                                        <div className="d-flex justify-content-between">
                                            <span className="fw-bold">{item.name}</span>
                                            <small className="text-muted">12:40 PM</small>
                                        </div>
                                        <p className="mb-0 text-muted small text-truncate">{item.lastMsg || (item.online ? 'متصل الآن' : 'غير متصل')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {view === 'chat' && activeChat && (
                    <>
                        <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center shadow-sm">
                            <button className="back-btn" onClick={() => setView('inbox')}>
                                <i className="bi bi-chevron-right"></i> رجوع
                            </button>
                            <div className="d-flex align-items-center gap-2">
                                <div className="text-end">
                                    <div className="fw-bold small">{activeChat.name}</div>
                                    <small className="text-success" style={{ fontSize: '0.7rem' }}>نشط الآن</small>
                                </div>
                                <img src={activeChat.avatar ? `https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg` : zujLogo} className="rounded-circle border" width="35" height="35" alt="" />
                            </div>
                        </div>

                        <div ref={scrollRef} className="chat-box">
                            {messages.filter(m => m.chatId === activeChat.id).map(msg => (
                                <div key={msg.id}
                                    className={`d-flex flex-column ${msg.isMe ? 'align-items-start' : 'align-items-end'}`}
                                    onDoubleClick={() => msg.isMe && handleDeleteMessage(msg.id)}
                                >
                                    <div className={`bubble shadow-sm ${msg.isMe ? 'bubble-me' : 'bubble-other'}`}>
                                        <div className="text-wrap">{msg.text}</div>
                                        <small className="d-block mt-1 text-muted" style={{ fontSize: '0.6rem' }}>{msg.time}</small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-3 bg-light">
                            <form onSubmit={handleSendMessage} className="d-flex gap-2">
                                <button type="submit" className="btn text-white rounded-circle" style={{ background: mainGreen, width: '45px', height: '45px' }}>
                                    <i className="bi bi-send-fill"></i>
                                </button>
                                <input
                                    type="text"
                                    className="form-control rounded-pill border-0 px-4 text-end"
                                    placeholder="اكتب رسالة..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                />
                            </form>
                        </div>
                    </>
                )}
            </div>
            <div className="text-center mt-2">
                <small className="text-muted">انقر مزدوجاً على رسالتك لحذفها</small>
            </div>
        </div>
    );
};