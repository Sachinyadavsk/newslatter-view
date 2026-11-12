
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
    const { login, user } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await login(form);

            const destination = location.state?.from?.pathname || "/";

            navigate(destination, { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-main flex min-h-[75vh] items-center justify-center py-12">

            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

                <h1 className="text-3xl font-extrabold">Welcome Back</h1>

                <p className="mt-2 text-gray-500">
                    Login to your DailyNews account.
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-5">

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Email Address
                        </label>

                        <input
                            type="email"
                            required
                            value={form.email}
                            onChange={(e) => setForm({
                                ...form,
                                email: e.target.value
                            })}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Enter email"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Password
                        </label>

                        <input
                            type="password"
                            required
                            value={form.password}
                            onChange={(e) => setForm({
                                ...form,
                                password: e.target.value
                            })}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                            placeholder="Enter password"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-red-600">
                        Register
                    </Link>
                </p>

            </div>
        </div>
    );
}
