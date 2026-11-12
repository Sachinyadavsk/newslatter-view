
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Newspaper,
    Folder,
    PlusCircle,
    Home,
    LogOut
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const links = [
        {
            label: "Dashboard",
            path: "/admin",
            icon: LayoutDashboard,
            end: true
        },
        {
            label: "News Management",
            path: "/admin/news",
            icon: Newspaper
        },
        {
            label: "Add News",
            path: "/admin/news/create",
            icon: PlusCircle
        }
    ];

    if (user?.role === "admin") {
        links.push({
            label: "Categories",
            path: "/admin/categories",
            icon: Folder
        });
    }

    return (
        <div className="min-h-screen bg-gray-100 md:flex">

            <aside className="w-full shrink-0 bg-gray-950 text-white md:min-h-screen md:w-64">

                <div className="border-b border-gray-800 p-6">
                    <h2 className="text-2xl font-extrabold">
                        Daily<span className="text-red-500">News.</span>
                    </h2>
                    <p className="mt-2 text-xs text-gray-400">
                        {user?.name} · {user?.role}
                    </p>
                </div>

                <nav className="flex gap-2 overflow-x-auto p-4 md:flex-col">
                    {links.map((link) => {
                        const Icon = link.icon;

                        return (
                            <NavLink
                                key={link.path}
                                to={link.path}
                                end={link.end}
                                className={({ isActive }) =>
                                    `flex shrink-0 items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive
                                        ? "bg-red-600 text-white"
                                        : "text-gray-300 hover:bg-gray-800"
                                    }`
                                }
                            >
                                <Icon size={19} />
                                {link.label}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="flex gap-3 border-t border-gray-800 p-4 md:mt-8 md:flex-col">
                    <NavLink to="/" className="flex items-center gap-3 text-sm text-gray-300 hover:text-white">
                        <Home size={18} />
                        Visit Website
                    </NavLink>

                    <button
                        onClick={() => {
                            logout();
                            navigate("/login");
                        }}
                        className="flex items-center gap-3 text-sm text-red-400 hover:text-red-300"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

            </aside>

            <main className="min-w-0 flex-1 p-5 md:p-8">
                <Outlet />
            </main>

        </div>
    );
}
