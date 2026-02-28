import React from 'react';
import zujLogo from '../assets/logo.png';

export const Footer = () => {
    return (
        <footer className="py-4 border-top bg-light mt-auto">
            <div className="container">
                <div className="d-flex flex-column align-items-center">
                    <img
                        src={zujLogo}
                        width="35"
                        alt="ZUJ Logo"
                        className="mb-2 opacity-75"
                        style={{ filter: 'grayscale(1)' }}
                    />
                    <h6 className="fw-bold text-dark mb-1" style={{ fontSize: '0.85rem' }}>جامعة الزيتونة الأردنية</h6>
                    <p className="text-muted mb-3" style={{ fontSize: '0.75rem' }}>منصة تواصل الفرق الطلابية - كلية تكنولوجيا المعلومات</p>

                    <div className="d-flex gap-3 mb-3">
                        <a href="#" className="text-muted"><i className="bi bi-facebook"></i></a>
                        <a href="#" className="text-muted"><i className="bi bi-twitter-x"></i></a>
                        <a href="#" className="text-muted"><i className="bi bi-linkedin"></i></a>
                    </div>

                    <hr className="w-25 my-2 opacity-25" />
                    <small className="text-muted" style={{ fontSize: '0.65rem' }}>
                        © 2026 جميع الحقوق محفوظة - تم التطوير بكلية IT
                    </small>
                </div>
            </div>
        </footer>
    );
};