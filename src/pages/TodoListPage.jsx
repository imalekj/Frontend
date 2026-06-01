import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../api';
import { AppColors } from '../theme/AppColors';

export const TodoListPage = () => {
    const { teamId: ProjectId } = useParams();
    const navigate = useNavigate();
    const { user, token } = useAuth();
    const baseUrl = import.meta.env.VITE_API_BASE_URL;
    
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        if (!ProjectId) return;
        setLoading(true);
        try {
            const res = await apiFetch(`${baseUrl}api/Teams/GetAllTaskByProjectId?ProjectId=${ProjectId}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });
            
            if (!res.ok) throw new Error("Failed to fetch tasks");
            
            const data = await res.json();
            const taskList = Array.isArray(data) ? data : (data && Array.isArray(data.data) ? data.data : []);
            
            const formattedTasks = taskList.map(task => ({
                id: task.taskid || task.id,
                text: task.taskName || task.text || '',
                completed: task.isDone || task.completed || false,
                description: task.description || '',
                projectId: task.projectID || task.projectId,
                addedBy: task.addedBy || ''
            }));

            setTasks(formattedTasks);
        } catch (err) {
            console.error(err);
            setTasks([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [ProjectId, token, baseUrl]);

    const addTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const res = await apiFetch(`${baseUrl}api/Teams/addTaskByTeamID`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    projectId: ProjectId,
                    taskName: newTask.trim()
                })
            });

            if (!res.ok) throw new Error("Failed to add task");

            setNewTask('');
            toast.success('تمت إضافة المهمة بنجاح ✅');
            fetchTasks();
        } catch (err) {
            console.error(err);
            toast.error('حدث خطأ أثناء إضافة المهمة ❌');
        }
    };

    const toggleComplete = async (id) => {
        const targetTask = tasks.find(t => t.id === id);
        if (!targetTask) return;

        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));

        try {
            const res = await apiFetch(`${baseUrl}api/Teams/UpdateTaskStatus`, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    taskId: id,
                    isDone: !targetTask.completed
                })
            });

            if (!res.ok) throw new Error("Failed to update status");
            toast.success('تم تحديث حالة المهمة 🔄');
        } catch (err) {
            console.error(err);
            setTasks(prev => prev.map(task =>
                task.id === id ? { ...task, completed: targetTask.completed } : task
            ));
            toast.error('فشل تحديث حالة المهمة ❌');
        }
    };

    const deleteTask = async (id) => {
        try {
            const res = await apiFetch(`${baseUrl}api/Teams/deleteTaskByTaskID?taskId=${id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error("فشل الحذف");

            setTasks(prev => prev.filter(task => task.id !== id));
            toast.success('تم حذف المهمة ✅');
        } catch (err) {
            console.error(err);
            toast.error('حدث خطأ أثناء الحذف ❌');
        }
    };

    const safeTasks = Array.isArray(tasks) ? tasks : [];
    const completionRate = safeTasks.length > 0
        ? Math.round((safeTasks.filter(t => t.completed).length / safeTasks.length) * 100)
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
                    .btn-refresh { background: ${AppColors.primaryGreen || '#1a5d44'}; color: white; border-radius: 12px; border: none; padding: 10px 20px; font-weight: 600; transition: 0.3s; }
                    .btn-refresh:hover { opacity: 0.9; }
                    .btn-add { background: ${AppColors.primaryGreen || '#1a5d44'}; color: white; border-radius: 12px 0 0 12px; border: none; padding: 0 25px; }
                    .input-task { border-radius: 0 12px 12px 0 !important; border: 1px solid #eef2f5; padding: 15px; }
                    .custom-checkbox { width: 22px; height: 22px; cursor: pointer; border: 2px solid ${AppColors.primaryGreen || '#1a5d44'}; border-radius: 6px; }
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
                            <h2 className="fw-bold mb-1" style={{ color: AppColors.primaryGreen || '#1a5d44' }}>قائمة مهام الفريق المشتركة</h2>
                            <p className="text-muted mb-0 small">بإمكان جميع أعضاء الفريق التعاون في إدارة المهام</p>
                        </div>
                        <button
                            className="btn-refresh shadow-sm animate__animated animate__fadeIn"
                            onClick={fetchTasks}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="spinner-border spinner-border-sm me-2"></span>
                            ) : (
                                <i className="bi bi-arrow-repeat me-2"></i>
                            )}
                            تحديث البيانات
                        </button>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card todo-card shadow-sm p-4 mb-4">
                            <form onSubmit={addTask}>
                                <div className="input-group shadow-sm" style={{ borderRadius: '12px', overflow: 'hidden', direction: 'ltr' }}>
                                    <button type="submit" className="btn-add">إضافة مهمة</button>
                                    <input
                                        type="text"
                                        className="form-control input-task bg-light text-end"
                                        placeholder={`أضف مهمة للفريق يا ${user?.name || user?.fullName || 'زميلي'}...`}
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        <div className="todo-content">
                            {loading ? (
                                <div className="text-center py-5 shadow-sm bg-white rounded-4">
                                    <div className="spinner-border" style={{ color: AppColors.primaryGreen || '#1a5d44' }} role="status"></div>
                                    <p className="mt-3 text-muted">جاري تحميل المهام التعاونية...</p>
                                </div>
                            ) : safeTasks.length === 0 ? (
                                <div className="text-center py-5 shadow-sm bg-white rounded-4 border-2 border-dashed">
                                    <i className="bi bi-journal-x fs-1 text-muted"></i>
                                    <p className="text-muted mt-2">لا توجد مهام حالية. ابدأ بإضافة أول مهمة!</p>
                                </div>
                            ) : (
                                <div className="tasks-container">
                                    {safeTasks.map(task => (
                                        <div key={task.id} className="task-item p-3 mb-3 d-flex align-items-center justify-content-between">
                                            <div className="d-flex align-items-center gap-3">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input custom-checkbox mt-0"
                                                    checked={task.completed}
                                                    onChange={() => toggleComplete(task.id)}
                                                    style={{ accentColor: AppColors.primaryGreen || '#1a5d44' }}
                                                />
                                                <div className="d-flex flex-column">
                                                    <span className={`fs-5 fw-medium ${task.completed ? 'completed-text' : 'text-dark'}`}>
                                                        {task.text}
                                                    </span>
                                                    {task.addedBy && <small className="text-muted" style={{ fontSize: '0.7rem' }}>أضيفت بواسطة: {task.addedBy}</small>}
                                                </div>
                                            </div>
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

                        {!loading && safeTasks.length > 0 && (
                            <div className="card border-0 bg-white p-4 shadow-sm rounded-4 mt-4">
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span className="fw-bold" style={{ color: AppColors.primaryGreen || '#1a5d44' }}>إنجاز الفريق</span>
                                    <span className="badge rounded-pill p-2" style={{ backgroundColor: AppColors.primaryGreen || '#1a5d44', color: 'white' }}>
                                        {completionRate}%
                                    </span>
                                </div>
                                <div className="progress progress-custom">
                                    <div
                                        className="progress-bar progress-bar-striped progress-bar-animated"
                                        role="progressbar"
                                        style={{
                                            width: `${completionRate}%`,
                                            backgroundColor: AppColors.primaryGreen || '#1a5d44'
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