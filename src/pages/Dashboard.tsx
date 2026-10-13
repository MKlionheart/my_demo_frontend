
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import { api } from '../lib/axios';
import { authToken } from '../lib/auth-token';
import type { ProfileResponse } from '../services/auth.service';

interface DashboardProps {
    title: string;
    allowedRoles: number[];
}

export default function Dashboard({
    title,
    allowedRoles,
}: DashboardProps) {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<ProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let cancelled = false;

        async function loadProfile() {
            try {
                const response = await api.get<ProfileResponse>('/auth/profile');

                if (cancelled) return;

                if (!allowedRoles.includes(response.data.roleId)) {
                    setError('You do not have permission to access this page.');
                    return;
                }

                setProfile(response.data);
            } catch (err) {
                if (cancelled) return;

                if (
                    axios.isAxiosError(err) &&
                    err.response?.status === 401
                ) {
                    authToken.clear();
                    navigate('/login', { replace: true });
                } else {
                    setError('Unable to load your profile.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        void loadProfile();

        return () => {
            cancelled = true;
        };
    }, [allowedRoles, navigate]);

    function handleLogout() {
        authToken.clear();
        navigate('/login', { replace: true });
    }

    if (loading) {
        return <main className="dashboard">Loading...</main>;
    }

    return (
        <main className="dashboard">
            <header className="dashboard-header">
                <div>
                    <h1>{title}</h1>
                    {profile && (
                        <p>
                            Welcome! {profile.email}
                        </p>
                    )}
                </div>

                <button onClick={handleLogout}>Logout</button>
            </header>

            {error && <p className="error">{error}</p>}

            {profile && !error && (
                <section className="dashboard-card">
                    <h2>Account details</h2>
                    <p>User ID: {profile.userId}</p>
                    <p>Email: {profile.email}</p>
                    <p>Role ID: {profile.roleId}</p>
                    <p>Authentication successful.</p>
                </section>
            )}
        </main>
    );
}
