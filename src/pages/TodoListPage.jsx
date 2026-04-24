import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext'; 

export const TodoListPage = () => {
    const { teamId } = useParams(); 
    const navigate = useNavigate();
    const { user } = useAuth(); 
    const mainGreen = '#1a5d44';
    
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    const isOwner = user?.role === 'admin' || user?.id === 101; 

    const fetchTeamTasks = async () => {
        setLoading(true);
        try {
            // محاكاة جلب البيانات من API
            setTimeout(() => {
                const mockTasks = [
                    { id: 1, text: 'تحليل المتطلبات النهائية للمشروع', completed: true },
                    { id: 2, text: 'تصميم واجهة المستخدم (Figma)', completed: false },
                    { id: 3, text: 'إعداد قاعدة بيانات MySQL', completed: false },
                ];
                setTasks(mockTasks);
                setLoading(false);
                toast.success('تم تحديث قائمة المهام');
            }, 800);
        } catch (error) {
            toast.error('حدث خطأ أثناء جلب البيانات');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeamTasks();
    }, [teamId]);

    const addTask = (e) => {
        e.preventDefault();
        
        // تم إزالة شرط (if (!isOwner)) للسماح لجميع الأعضاء
        if (!newTask.trim()) return;
        
        const task = { 
            id: Date.now(), 
            text: newTask, 
            completed: false,
            addedBy: user?.name || 'عضو الفريق' // إضافة اسم الشخص الذي أضاف المهمة (اختياري)
        };
        
        setTasks([task, ...tasks]);
        setNewTask('');
        toast.success('تمت إضافة المهمة بواسطة ' + (user?.name || 'عضو'));
    };

    const toggleComplete = (id) => {
        setTasks(tasks.map(task => 
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id) => {
        // تم إزالة شرط الصلاحية هنا أيضاً للسماح للجميع بالحذف
        setTasks(tasks.filter(task => task.id !== id));
        toast.error('تم حذف المهمة');
    };

    const completionRate = tasks.length > 0 
        ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) 
        : 0;

    return (
        <div className="min-vh-100 py-5" style={{ backgroundColor: '#f4f7f6', fontFamily: 'Cairo, sans-serif' }} dir="rtl">
            <Toaster position="top-center" />
            
            <style>
                {`
                    .todo-card { border-radius: 20px; border: none; }
                    .task-item { background: #ffffff; border-radius: 15px; border: 1px solid #eef2f5; transition: 0.3s ease; }
                    .task-item:hover { transform: translateY(-3px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                    .completed-text { text-decoration: line-through; color: #adb5bd; }
                    .btn-refresh { background: ${mainGreen}; color: white; border-radius: 12px; border: none; padding: 10px 20px; font-weight: 600; transition: 0.3s; }
                    .btn-refresh:hover { opacity: 0.9; }
                    .btn-add { background: ${mainGreen}; color: white; border-radius: 0 12px 12px 0; border: none; padding: 0 25px; }
                    .input-task { border-radius: 12px 0 0 12px !important; border: 1px solid #eef2f5; padding: 15px; }
                    .custom-checkbox { width: 22px; height: 22px; cursor: pointer; border: 2px solid ${mainGreen}; border-radius: 6px; }
                    .progress-custom { height: 10px; border-radius: 10px; background-color: #e9ecef; }
                `}
            </style>

            <div className="container">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 d-flex justify-content-between align-items-center flex-wrap gap-3">
                        <div>
                            <button onClick={() => navigate(-1)} className="btn btn-sm btn-outline-secondary mb-2 rounded-pill">
                                <i className="bi bi-arrow-right me-1"></i> العودة
                            </button>
                            <h2 className="fw-bold mb-1" style={{ color: mainGreen }}>قائمة مهام الفريق المشتركة</h2>
                            <p className="text-muted mb-0 small">بإمكان جميع أعضاء الفريق التعاون في إدارة المهام</p>
                        </div>
                        <button className="btn-refresh shadow-sm" onClick={fetchTeamTasks} disabled={loading}>
                            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-arrow-repeat me-2"></i>}
                            تحديث البيانات
                        </button>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        {/* نموذج الإضافة يظهر للجميع الآن */}
                        <div className="card todo-card shadow-sm p-4 mb-4 animate__animated animate__fadeIn">
                            <form onSubmit={addTask}>
                                <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden' }}>
                                    <input 
                                        type="text" 
                                        className="form-control input-task bg-light text-end" 
                                        placeholder="أضف مهمة للفريق يا {user?.name}..."
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                    <button type="submit" className="btn-add">إضافة مهمة</button>
                                </div>
                            </form>
                        </div>

                        <div className="todo-content">
                            {loading ? (
                                <div className="text-center py-5 shadow-sm bg-white rounded-4">
                                    <div className="spinner-border" style={{ color: mainGreen }} role="status"></div>
                                    <p className="mt-3 text-muted">جاري تحميل المهام التعاونية...</p>
                                </div>
                            ) : tasks.length === 0 ? (
                                <div className="text-center py-5 shadow-sm bg-white rounded-4 border-2 border-dashed">
                                    <i className="bi bi-journal-x fs-1 text-muted"></i>
                                    <p className="text-muted mt-2">لا توجد مهام حالية. ابدأ بإضافة أول مهمة!</p>
                                </div>
                            ) : (
                                <div className="tasks-container">
                                    {tasks.map(task => (
                                        <div key={task.id} className="task-item p-3 mb-3 d-flex align-items-center justify-content-between animate__animated animate__fadeInUp">
                                            <div className="d-flex align-items-center gap-3">
                                                <input 
                                                    type="checkbox" 
                                                    className="form-check-input custom-checkbox mt-0" 
                                                    checked={task.completed}
                                                    onChange={() => toggleComplete(task.id)}
                                                    style={{ accentColor: mainGreen }}
                                                />
                                                <div className="d-flex flex-column">
                                                    <span className={`fs-5 fw-medium ${task.completed ? 'completed-text' : 'text-dark'}`}>
                                                        {task.text}
                                                    </span>
                                                    {task.addedBy && <small className="text-muted" style={{fontSize: '0.7rem'}}>أضيفت بواسطة: {task.addedBy}</small>}
                                                </div>
                                            </div>
                                            {/* أيقونة الحذف متاحة للجميع الآن */}
                                            <button 
                                                onClick={() => deleteTask(task.id)} 
                                                className="btn btn-outline-danger border-0 rounded-circle"
                                            >
                                                <i className="bi bi-trash3"></i>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {!loading && tasks.length > 0 && (
                            <div className="card border-0 bg-white p-4 shadow-sm rounded-4 mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold" style={{ color: mainGreen }}>إنجاز الفريق</span>
                                    <span className="badge rounded-pill p-2" style={{ backgroundColor: mainGreen }}>
                                        {completionRate}%
                                    </span>
                                </div>
                                <div className="progress progress-custom">
                                    <div 
                                        className="progress-bar progress-bar-striped progress-bar-animated" 
                                        role="progressbar" 
                                        style={{ 
                                            width: `${completionRate}%`,
                                            backgroundColor: mainGreen 
                                        }}
                                    ></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};