import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { API_URL } from '../context/AppContext';
import AuthLayout from '../components/AuthLayout';

const VerifyOTP = () => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email || '';

    const handleChange = (element, index) => {
        if (isNaN(element.value)) return false;

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const otpCode = otp.join('');
        if (otpCode.length < 6) {
            setError('Please enter all 6 digits');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp_code: otpCode }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Email verified successfully! You can now login.');
                navigate('/');
            } else {
                setError(data.detail || 'Invalid OTP');
            }
        } catch (err) {
            setError('Failed to connect to server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout
            title="Verify Email"
            subtitle={`We sent a 6-digit code to ${email}`}
            image="/Idea.png"
            alternativeLink="/"
            alternativeText="Back to Login?"
        >
            <form onSubmit={handleVerify}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '24px' }}>
                    {otp.map((data, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength="1"
                            value={data}
                            onChange={e => handleChange(e.target, index)}
                            onFocus={e => e.target.select()}
                            className="input-field"
                            style={{
                                width: '45px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                borderRadius: '10px',
                            }}
                            onKeyUp={e => {
                                if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
                                    e.target.previousSibling.focus();
                                }
                            }}
                        />
                    ))}
                </div>

                {error && <p style={{ color: 'var(--color-danger)', fontSize: '14px', marginBottom: '20px', textAlign: 'center' }}>{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                    style={{
                        width: '100%',
                        height: '48px',
                    }}
                >
                    {loading ? 'Verifying...' : 'Verify Email'}
                </button>
            </form>

            <p style={{ marginTop: '24px', fontSize: '14px', color: 'var(--color-text-dim)', textAlign: 'center' }}>
                Didn't receive code? <span style={{ color: 'var(--color-accent)', cursor: 'pointer', fontWeight: 'bold' }}>Resend</span>
            </p>
        </AuthLayout>
    );
};

export default VerifyOTP;
