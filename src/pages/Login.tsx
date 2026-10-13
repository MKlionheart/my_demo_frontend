
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

import { authToken } from '../lib/auth-token';
import { loginUser } from '../services/auth.service';

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();

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
            const result = await loginUser({ email, password });

            authToken.set(result.accessToken);

            switch (result.user.role.id) {
                case 1:
                    navigate('/admin', { replace: true });
                    break;
                case 2:
                    navigate('/dashboard', { replace: true });
                    break;
                default:
                    authToken.clear();
                    setError('Unknown user role');
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                setError(
                    err.response?.status === 401
                        ? 'Invalid email or password'
                        : 'Unable to connect to the server',
                );
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    }

    const message = (
        location.state as { message?: string } | null
    )?.message;

    return (
        <main className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h1>Login</h1>

                {message && <p>{message}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className="error">{error}</p>}

                <button disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>

                <p>
                    New user? <Link to="/register">Register</Link>
                </p>
            </form>
        </main>
    );
}
