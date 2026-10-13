
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import {
    getAllUsers,
    type AdminUser,
} from '../services/auth.service';
import { authToken } from '../lib/auth-token';


export default function AdminDashboard() {
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const loadUsers = useCallback(async () => {
        setLoading(true);
        setError('');

        try {
            const data = await getAllUsers();

            const nonAdminUsers = data.filter(
                (user) => user.role.id !== 1,
            );

            setUsers(nonAdminUsers);
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.response?.status === 401) {
                    authToken.clear();
                    navigate('/login', { replace: true });
                    return;
                }

                if (err.response?.status === 403) {
                    setError('You do not have permission to view these users.');
                    return;
                }
            }

            setError('Failed to load users. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const activeUsers = users.filter((user) => user.isActive).length;

    function handleLogout() {
        authToken.clear();
        navigate('/login', { replace: true });
    }

    return (
        <main className="admin-dashboard">
            <header className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>View registered users and their account status.</p>
                </div>

                <div className="admin-header-actions">
                    <button
                        type="button"
                        onClick={() => void loadUsers()}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Refresh'}
                    </button>

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </header>

            <section className="admin-stats">
                <article className="admin-stat">
                    <span>Total users</span>
                    <strong>{users.length}</strong>
                </article>

                <article className="admin-stat">
                    <span>Active users</span>
                    <strong>{activeUsers}</strong>
                </article>

                <article className="admin-stat">
                    <span>Inactive users</span>
                    <strong>{users.length - activeUsers}</strong>
                </article>
            </section>

            <section className="admin-users">
                <h2>All Users</h2>

                {error && (
                    <p role="alert" className="admin-error">
                        {error}
                    </p>
                )}

                {loading ? (
                    <p>Loading users...</p>
                ) : !error && users.length === 0 ? (
                    <p>No users found.</p>
                ) : !error ? (
                    <div className="admin-table-wrapper">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th>Created</th>
                                </tr>
                            </thead>

                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id}>
                                        <td>{user.id}</td>
                                        <td>
                                            {user.firstName} {user.lastName}
                                        </td>
                                        <td>{user.email}</td>
                                        <td>{user.role.name}</td>
                                        <td>
                                            <span
                                                className={
                                                    user.isActive
                                                        ? 'status-active'
                                                        : 'status-inactive'
                                                }
                                            >
                                                {user.isActive ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td>
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : null}
            </section>
        </main>
    );
}
