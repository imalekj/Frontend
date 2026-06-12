import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import zujLogo from '../assets/logo.png';
import { useAuth } from '../context/AuthContext';
import { AppColors } from '../theme/AppColors';
import { apiFetch } from '../api';

export const Chat = () => {
    // 1. استقبال الـ ID الممرر من صفحة تفاصيل الفريق (مثال: 1020)
    const { projectId } = useParams(); 
    const navigate = useNavigate();
    const scrollRef = useRef(null);
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [teamInfo, setTeamInfo] = useState(null);
    
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    const { user } = useAuth();

    // 2. جلب أعضاء الفريق والرسائل الخاصة بهذه الغرفة مباشرة عند تحميل الصفحة
    useEffect(() => {
        const initializeChatRoom = async () => {
            if (!projectId) return;
            setLoading(true);
            try {
                // أ. جلب بيانات الفريق وأعضائه بناءً على الـ ID الممرر في الرابط
                const teamResponse = await apiFetch(`${baseUrl}api/Teams/GetAllTeamMembersByProjectId?projectId=${projectId}`);
                if (teamResponse.ok) {
                    const teamMembers = await teamResponse.json();
                    setTeamInfo({
                        id: projectId,
                        name: "محادثة الفريق الجماعية",
                        members: teamMembers
                    });
                }

                // ب. جلب الرسائل السابقة الخاصة بغرفة المحادثة هذه من الـ DB
                // ملاحظة: يتم تمرير الـ projectId كـ roomId في دالة الـ GetMessages بالـ Backend لديك
                const messagesResponse = await apiFetch(`${baseUrl}api/Chat/GetMessages/${projectId}`);
                if (messagesResponse.ok) {
                    const messagesData = await messagesResponse.json();
                    setMessages(messagesData);
                }

            } catch (error) {
                console.error("Error initializing chat:", error);
                Swal.fire('خطأ', 'فشل في تحميل محادثة الفريق', 'error');
            } finally {
                setLoading(false);
            }
        };

        initializeChatRoom();
    }, [projectId, baseUrl]);

    // تحجيم وتمرير صندوق المحادثة للأسفل عند وصول رسائل جديدة
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // 3. إرسال الرسالة والربط مع الـ Endpoint: /api/Chat/SendMessage
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageDto = {
            chatId: projectId, // استخدام الـ id الخاص بالفريق كمعرّف للغرفة المشتركة
            text: newMessage.trim(),
            sender: user?.userName || "أنا"
        };

        try {
            // إرسال الرسالة إلى الـ Backend بحسب الـ Swagger المرفق لديك
            const response = await apiFetch(`${baseUrl}api/Chat/SendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageDto)
            });

            if (response.ok) {
                // تحديث الواجهة فوراً بالرسالة الجديدة بعد نجاح الحفظ في السيرفر
                const savedMsg = {
                    id: Date.now(),
                    chatId: projectId,
                    text: newMessage.trim(),
                    sender: user?.userName || "أنا",
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isMe: true
                };
                setMessages(prev => [...prev, savedMsg]);
                setNewMessage("");
            } else {
                throw new Error("Failed to send message");
            }
        } catch (error) {
            console.error(error);
            Swal.fire('تنبيه', 'لم يتمكن النظام من إرسال الرسالة حالياً', 'warning');
        }
    };

    return (
        <div className="container py-4 text-end" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
            <style>
                {`
                    .chat-container { max-width: 950px; margin: 0 auto; background: ${AppColors.backgroundCard}; border-radius: 20px; overflow: hidden; height: 85vh; display: flex; flex-direction: column; }
                    .chat-box { background: #e5ddd5; background-image: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png'); flex-grow: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 10px; }
                    .bubble { max-width: 75%; padding: 10px 15px; border-radius: 12px; font-size: 0.95rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
                    .bubble-me { background: ${AppColors.primaryGreen}; color: white; align-self: flex-start; border-top-right-radius: 2px; }
                    .bubble-other { background: white; color: ${AppColors.textPrimary}; align-self: flex-end; border-top-left-radius: 2px; }
                    .loading-overlay { position: absolute; inset: 0; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; z-index: 10; }
                `}
            </style>

            <div className="chat-container shadow-lg border position-relative">
                {loading && (
                    <div className="loading-overlay">
                        <div className="spinner-border text-success"></div>
                    </div>
                )}

                {/* رأس محادثة الفريق المباشرة */}
                <div className="p-3 border-bottom bg-white d-flex justify-content-between align-items-center shadow-sm">
                    {/* عند الضغط على رجوع يعود تلقائياً لصفحة تفاصيل الفريق السابقة */}
                    <button className="btn border-0 fw-bold" style={{ color: AppColors.primaryGreen }} onClick={() => navigate(-1)}>
                        <i className="bi bi-chevron-right ms-1"></i> العودة للفريق
                    </button>

                    <div className="d-flex align-items-center gap-3">
                        <div className="text-start">
                            <div className="fw-bold" style={{ color: AppColors.textPrimary }}>
                                {teamInfo ? `غرفة محادثة الفريق #${projectId}` : "جاري تحميل الغرفة..."}
                            </div>
                            <small className="text-success fw-bold" style={{ fontSize: '0.7rem' }}>
                                متصل الآن • {teamInfo?.members?.length || 0} أعضاء في الفريق
                            </small>
                        </div>
                        <div className="text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                            style={{ width: '45px', height: '45px', background: AppColors.primaryGreen }}>
                            <i className="bi bi-people-fill fs-5"></i>
                        </div>
                    </div>
                    <div></div>
                </div>

                {/* صندوق عرض الرسائل المتدفقة */}
                <div ref={scrollRef} className="chat-box">
                    {messages.length === 0 ? (
                        <div className="text-center my-auto text-muted opacity-70">
                            <i className="bi bi-chat-quote fs-1 d-block mb-2"></i>
                            لا توجد رسائل سابقة في هذه المجموعة. ابدأ النقاش مع زملائك الآن!
                        </div>
                    ) : (
                        messages.map(msg => {
                            // التحقق إن كانت الرسالة مرسلة من المستخدم الحالي أم عضو آخر بالفريق
                            const isMe = msg.sender === user?.userName || msg.isMe;
                            return (
                                <div key={msg.id} className={`d-flex flex-column ${isMe ? 'align-items-start' : 'align-items-end'}`}>
                                    <div className={`bubble ${isMe ? 'bubble-me' : 'bubble-other'}`}>
                                        {!isMe && (
                                            <div className="fw-bold mb-1" style={{ fontSize: '0.7rem', opacity: 0.8 }}>{msg.sender}</div>
                                        )}
                                        <div>{msg.text}</div>
                                        <small className={`d-block mt-1 ${isMe ? 'text-white-50' : 'text-muted'}`} style={{ fontSize: '0.65rem' }}>
                                            {msg.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </small>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* نموذج كتابة وإرسال الرسائل لقاعدة البيانات */}
                <div className="p-4 bg-light border-top">
                    <form onSubmit={handleSendMessage} className="d-flex gap-3">
                        <button type="submit" className="btn text-white rounded-circle shadow" style={{ background: AppColors.primaryGreen, width: '50px', height: '50px' }}>
                            <i className="bi bi-send-fill"></i>
                        </button>
                        <input
                            type="text"
                            className="form-control rounded-pill border-0 px-4 text-end shadow-sm"
                            placeholder="اكتب رسالة لأعضاء فريقك المشترك..."
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                        />
                    </form>
                </div>
            </div>
        </div>
    );
};