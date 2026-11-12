
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Register() {
    const { register, user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (user) return <Navigate to="/" replace />;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password.length < 8) {
            return setError("Password must contain at least 8 characters.");
        }

        if (form.password !== form.confirmPassword) {
            return setError("Passwords do not match.");
        }

        setLoading(true);

        try {
            await register({
                name: form.name,
                email: form.email,
                password: form.password
            });

            navigate("/", { replace: true });
        } catch (err) {
            setError(
                err.response?.data?.message || "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-main flex min-h-[75vh] items-center justify-center py-12">

            <div className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">

                <h1 className="text-3xl font-extrabold">Create Account</h1>

                <p className="mt-2 text-gray-500">
                    Join DailyNews today.
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                    {[
                        { name: "name", label: "Full Name", type: "text" },
                        { name: "email", label: "Email Address", type: "email" },
                        { name: "password", label: "Password", type: "password" },
                        { name: "confirmPassword", label: "Confirm Password", type: "password" }
                    ].map((field) => (
                        <div key={field.name}>
                            <label className="mb-2 block text-sm font-semibold">
                                {field.label}
                            </label>

                            <input
                                type={field.type}
                                required
                                minLength={field.name.includes("password") ? 8 : undefined}
                                value={form[field.name]}
                                onChange={(e) => setForm({
                                    ...form,
                                    [field.name]: e.target.value
                                })}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                                placeholder={field.label}
                            />
                        </div>
                    ))}

                    <button
                        disabled={loading}
                        className="w-full rounded-lg bg-red-600 py-3 font-bold text-white hover:bg-red-700 disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>

                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already registered?{" "}
                    <Link to="/login" className="font-bold text-red-600">
                        Login
                    </Link>
                </p>

            </div>
        </div>
    );
}
