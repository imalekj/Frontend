import React, { createContext, useState, useEffect, useContext } from 'react';


export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const getInitialUser = () => {
        try {
            const savedUser = localStorage.getItem('user');
            // التأكد أن القيمة موجودة وليست نص "undefined" أو فارغة
            if (savedUser && savedUser !== "undefined" && savedUser !== "null") {
                return JSON.parse(savedUser);
            }
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
        }
        return null;
    };

    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(getInitialUser());

    const login = (userToken, userData) => {
    
        localStorage.setItem('token', userToken);
        localStorage.setItem('user', JSON.stringify(userData));
        
    
        setToken(userToken);
        setUser(userData);
    };


    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    useEffect(() => {
        const handleStorageChange = () => {
            setToken(localStorage.getItem('token'));
            setUser(getInitialUser());
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export default AuthContext;