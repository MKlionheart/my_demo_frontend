
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authToken } from '../lib/auth-token';

export default function ProtectedRoute() {
    const token = authToken.get();
    const location = useLocation();

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return <Outlet />;
}
