import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return (savedUser && savedUser !== "undefined" && savedUser !== "null") ? JSON.parse(savedUser) : null;
        } catch (e) {
            return null;
        }
    });

    const login = (userToken, userData) => {
        let tokenValue = userToken;
        
        // حل مشكلة [object Object] الظاهرة في الصور
        if (typeof userToken === 'object' && userToken !== null) {
            tokenValue = userToken.token || userToken.accessToken;
        }

        if (tokenValue) {
            localStorage.setItem('token', tokenValue);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setToken(tokenValue);
            setUser(userData);
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout, isLoggedIn: !!token }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
};