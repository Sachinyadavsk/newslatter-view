
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { UserCircle, Mail, Shield } from "lucide-react";

export default function Profile() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="container-main py-14">

            <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">

                <div className="text-center">
                    <UserCircle size={80} className="mx-auto text-red-600" />

                    <h1 className="mt-4 text-2xl font-extrabold">
                        {user.name}
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        My Account
                    </p>
                </div>

                <div className="mt-8 space-y-5 border-t pt-6">

                    <div className="flex items-center gap-3">
                        <Mail className="text-red-600" />
                        <div>
                            <p className="text-xs text-gray-400">Email</p>
                            <p className="font-semibold">{user.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Shield className="text-red-600" />
                        <div>
                            <p className="text-xs text-gray-400">Account Role</p>
                            <p className="font-semibold capitalize">{user.role}</p>
                        </div>
                    </div>

                </div>

                {(user.role === "admin" || user.role === "author") && (
                    <Link
                        to="/admin"
                        className="mt-8 block rounded-lg bg-red-600 py-3 text-center font-semibold text-white"
                    >
                        Open Dashboard
                    </Link>
                )}

            </div>
        </div>
    );
}
