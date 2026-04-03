import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        try {
            return savedUser && savedUser !== "undefined" ? JSON.parse(savedUser) : null;
        } catch {
            return null;
        }
    });

    const login = (userToken, userData) => {
        // التأكد من تخزين التوكن كنص وليس ككائن
        const tokenString = typeof userToken === 'object' ? userToken.token : userToken;

        localStorage.setItem('token', tokenString);
        localStorage.setItem('user', JSON.stringify(userData));

        setToken(tokenString);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ token, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);