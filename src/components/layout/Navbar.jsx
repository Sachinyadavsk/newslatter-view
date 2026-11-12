
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    Menu, X, Search, UserCircle, LogOut,
    LayoutDashboard
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const submitSearch = (e) => {
        e.preventDefault();

        if (search.trim()) {
            navigate(`/search?q=${encodeURIComponent(search.trim())}`);
            setSearch("");
            setMenuOpen(false);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const linkClass = ({ isActive }) =>
        `text-sm font-semibold transition ${isActive ? "text-red-600" : "text-gray-700 hover:text-red-600"
        }`;

    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <div className="container-main">
                <div className="flex h-20 items-center justify-between gap-4">

                    <Link to="/" className="text-2xl font-extrabold tracking-tight">
                        Daily<span className="text-red-600">News.</span>
                    </Link>

                    <nav className="hidden items-center gap-7 lg:flex">
                        <NavLink to="/" className={linkClass}>Home</NavLink>
                        <NavLink to="/news" className={linkClass}>Latest News</NavLink>
                        <NavLink to="/news?category=technology" className={linkClass}>Technology</NavLink>
                        <NavLink to="/news?category=sports" className={linkClass}>Sports</NavLink>
                        <NavLink to="/news?category=business" className={linkClass}>Business</NavLink>
                    </nav>

                    <div className="hidden items-center gap-4 md:flex">
                        <form onSubmit={submitSearch} className="flex items-center rounded-full bg-gray-100 px-3">
                            <Search size={17} className="text-gray-500" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search news..."
                                className="w-36 bg-transparent px-2 py-2 text-sm outline-none"
                            />
                        </form>

                        {user ? (
                            <>
                                {(user.role === "admin" || user.role === "author") && (
                                    <Link to="/admin" title="Dashboard">
                                        <LayoutDashboard size={20} />
                                    </Link>
                                )}

                                <Link to="/profile" title="Profile">
                                    <UserCircle size={22} />
                                </Link>

                                <button onClick={handleLogout} title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    <button
                        className="lg:hidden"
                        onClick={() => setMenuOpen(!menuOpen)}
                        aria-label="Toggle navigation"
                    >
                        {menuOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {menuOpen && (
                    <div className="space-y-4 border-t py-5 lg:hidden">
                        <Link onClick={() => setMenuOpen(false)} to="/" className="block">Home</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/news" className="block">Latest News</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/news?category=technology" className="block">Technology</Link>
                        <Link onClick={() => setMenuOpen(false)} to="/news?category=sports" className="block">Sports</Link>

                        <form onSubmit={submitSearch} className="flex gap-2">
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search news"
                                className="min-w-0 flex-1 rounded-lg border px-3 py-2"
                            />
                            <button className="rounded-lg bg-red-600 px-4 text-white">
                                <Search size={18} />
                            </button>
                        </form>

                        {user ? (
                            <>
                                <Link to="/profile" className="block">My Profile</Link>
                                {(user.role === "admin" || user.role === "author") && (
                                    <Link to="/admin" className="block">Dashboard</Link>
                                )}
                                <button onClick={handleLogout} className="text-red-600">
                                    Logout
                                </button>
                            </>
                        ) : (
                            <Link to="/login" className="block text-red-600">Login / Register</Link>
                        )}
                    </div>
                )}
            </div>
        </header>
    );
}
