
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { registerUser } from '../services/auth.service';

export default function Register() {
    const navigate = useNavigate();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(
        event: React.FormEvent<HTMLFormElement>,
    ) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            await registerUser({
                firstName,
                lastName,
                email,
                password,
            });

            navigate('/login', {
                replace: true,
                state: { message: 'Registration successful. Please log in.' },
            });
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const message = err.response?.data?.message;

                setError(
                    Array.isArray(message)
                        ? message.join(', ')
                        : message ?? 'Registration failed',
                );
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Create account</h1>

                <input
                    placeholder="First name"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                />

                <input
                    placeholder="Last name"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password (min 8 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    minLength={8}
                    maxLength={72}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button disabled={loading}>
                    {loading ? 'Registering...' : 'Register'}
                </button>

                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </main>
    );
}
