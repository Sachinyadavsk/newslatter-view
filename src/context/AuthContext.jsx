
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import api from "../api/axios";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem("news_user")) || null;
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(true);

    const saveAuth = (data) => {
        localStorage.setItem("news_token", data.token);
        localStorage.setItem("news_user", JSON.stringify(data.user));
        setUser(data.user);
    };

    const logout = () => {
        localStorage.removeItem("news_token");
        localStorage.removeItem("news_user");
        setUser(null);
    };

    const login = async (formData) => {
        const { data } = await api.post("/auth/login", formData);
        saveAuth(data);
        return data;
    };

    const register = async (formData) => {
        const { data } = await api.post("/auth/register", formData);
        saveAuth(data);
        return data;
    };

    useEffect(() => {
        const token = localStorage.getItem("news_token");

        const verifyUser = async () => {
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const { data } = await api.get("/auth/profile");

                setUser(data.user);
                localStorage.setItem(
                    "news_user",
                    JSON.stringify(data.user)
                );
            } catch {
                logout();
            } finally {
                setLoading(false);
            }
        };

        verifyUser();

        const handleUnauthorized = () => {
            logout();
            setLoading(false);
        };

        window.addEventListener(
            "auth:unauthorized",
            handleUnauthorized
        );

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                handleUnauthorized
            );
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                isAuthor: user?.role === "author"
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}
