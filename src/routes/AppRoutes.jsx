
import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AdminLayout from "../components/layout/AdminLayout";

import ProtectedRoute from "../components/common/ProtectedRoute";

import Home from "../pages/Home";
import NewsList from "../pages/NewsList";
import NewsDetails from "../pages/NewsDetails";
import Search from "../pages/Search";
import Profile from "../pages/Profile";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/admin/Dashboard";
import NewsManagement from "../pages/admin/NewsManagement";
import NewsForm from "../pages/admin/NewsForm";
import CategoryManagement from "../pages/admin/CategoryManagement";

import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div className="container-main py-24 text-center">
            <h1 className="text-6xl font-extrabold">404</h1>
            <p className="mt-4 text-gray-500">Page not found.</p>
            <Link
                to="/"
                className="mt-6 inline-block rounded-lg bg-red-600 px-6 py-3 text-white"
            >
                Go Home
            </Link>
        </div>
    );
}

export default function AppRoutes() {
    return (
        <Routes>

            {/* Public website */}
            <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />

                <Route path="/news" element={<NewsList />} />

                <Route path="/news/:slug" element={<NewsDetails />} />

                <Route path="/search" element={<Search />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
            </Route>

            {/* Admin and author dashboard */}
            <Route element={<ProtectedRoute roles={["admin", "author"]} />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />

                    <Route path="news" element={<NewsManagement />} />

                    <Route path="news/create" element={<NewsForm />} />

                    <Route path="news/edit/:id" element={<NewsForm />} />
                </Route>
            </Route>

            {/* Admin-only category management */}
            <Route element={<ProtectedRoute roles={["admin"]} />}>
                <Route
                    path="/admin/categories"
                    element={<AdminLayout />}
                >
                    <Route index element={<CategoryManagement />} />
                </Route>
            </Route>

            <Route path="*" element={<NotFound />} />

        </Routes>
    );
}
