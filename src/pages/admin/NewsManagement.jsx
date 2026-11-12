
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search } from "lucide-react";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { formatDate } from "../../utils/formatDate";
import Loader from "../../components/common/Loader";

export default function NewsManagement() {
    const { user } = useAuth();

    const [news, setNews] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadNews = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const { data } = await api.get("/news/admin/all", {
                params: {
                    limit: 50,
                    search: search || undefined,
                    status: status || undefined
                }
            });

            setNews(data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load news.");
        } finally {
            setLoading(false);
        }
    }, [search, status]);

    useEffect(() => {
        const timer = setTimeout(loadNews, 300);
        return () => clearTimeout(timer);
    }, [loadNews]);

    const deleteNews = async (id) => {
        if (!window.confirm("Are you sure you want to delete this article?")) {
            return;
        }

        try {
            await api.delete(`/news/${id}`);
            await loadNews();
        } catch (err) {
            alert(err.response?.data?.message || "Unable to delete article.");
        }
    };

    return (
        <div>

            <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">News Management</h1>
                    <p className="mt-2 text-gray-500">
                        Manage your articles and publications.
                    </p>
                </div>

                <Link
                    to="/admin/news/create"
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
                >
                    <Plus size={18} />
                    Add News
                </Link>
            </div>

            <div className="mb-6 flex flex-wrap gap-3 rounded-xl border bg-white p-4">

                <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border px-3">
                    <Search size={18} className="text-gray-400" />

                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search articles..."
                        className="min-w-0 flex-1 py-3 outline-none"
                    />
                </div>

                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="rounded-lg border px-4 py-3"
                >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <p className="rounded-lg bg-red-50 p-4 text-red-600">{error}</p>
            ) : (
                <div className="overflow-x-auto rounded-xl border bg-white">
                    <table className="w-full text-left text-sm">

                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-4">Article</th>
                                <th className="p-4">Category</th>
                                {user?.role === "admin" && (
                                    <th className="p-4">Author</th>
                                )}
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {news.map((item) => (
                                <tr key={item.id}>
                                    <td className="max-w-xs p-4 font-semibold">
                                        {item.title}
                                    </td>

                                    <td className="p-4">{item.category_name}</td>

                                    {user?.role === "admin" && (
                                        <td className="p-4">{item.author_name}</td>
                                    )}

                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap p-4">
                                        {formatDate(item.created_at)}
                                    </td>

                                    <td className="p-4">
                                        <div className="flex gap-3">
                                            <Link
                                                to={`/admin/news/edit/${item.id}`}
                                                className="text-blue-600"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>

                                            <button
                                                onClick={() => deleteNews(item.id)}
                                                className="text-red-600"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}

                            {news.length === 0 && (
                                <tr>
                                    <td colSpan={user?.role === "admin" ? 6 : 5} className="p-10 text-center text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>

                    </table>
                </div>
            )}

        </div>
    );
}
