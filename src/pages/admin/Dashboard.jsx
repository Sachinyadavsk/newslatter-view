
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Newspaper, Folder, FileText, PlusCircle,
    ArrowRight
} from "lucide-react";

import api from "../../api/axios";
import Loader from "../../components/common/Loader";
import { formatDate } from "../../utils/formatDate";

export default function Dashboard() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const [newsResponse, categoryResponse] = await Promise.all([
                    api.get("/news/admin/all?limit=5"),
                    api.get("/categories")
                ]);

                setNews(newsResponse.data.data || []);
                setCategories(categoryResponse.data.data || []);
            } catch (error) {
                console.error("Dashboard error:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    if (loading) return <Loader />;

    const published = news.filter(
        (item) => item.status === "published"
    ).length;

    const drafts = news.filter(
        (item) => item.status === "draft"
    ).length;

    const stats = [
        {
            title: "Recent Articles",
            value: news.length,
            icon: Newspaper,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Published (Recent)",
            value: published,
            icon: FileText,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Drafts (Recent)",
            value: drafts,
            icon: FileText,
            color: "bg-yellow-100 text-yellow-600"
        },
        {
            title: "Categories",
            value: categories.length,
            icon: Folder,
            color: "bg-purple-100 text-purple-600"
        }
    ];

    return (
        <div className="space-y-8">

            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold">Dashboard</h1>
                    <p className="mt-2 text-gray-500">
                        Welcome to your News Portal dashboard.
                    </p>
                </div>

                <Link
                    to="/admin/news/create"
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                >
                    <PlusCircle size={18} />
                    Add News
                </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <div
                            key={stat.title}
                            className="rounded-xl border bg-white p-6 shadow-sm"
                        >
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                                <Icon size={24} />
                            </div>

                            <p className="mt-5 text-sm text-gray-500">
                                {stat.title}
                            </p>

                            <h2 className="mt-1 text-3xl font-extrabold">
                                {stat.value}
                            </h2>
                        </div>
                    );
                })}
            </div>

            <section className="overflow-hidden rounded-xl border bg-white">
                <div className="flex items-center justify-between border-b p-5">
                    <h2 className="text-xl font-bold">Recent Articles</h2>

                    <Link to="/admin/news" className="flex items-center gap-1 text-sm font-semibold text-red-600">
                        View All <ArrowRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="p-4">Title</th>
                                <th className="p-4">Category</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Date</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {news.map((item) => (
                                <tr key={item.id}>
                                    <td className="max-w-xs p-4 font-semibold">
                                        {item.title}
                                    </td>

                                    <td className="p-4">
                                        {item.category_name}
                                    </td>

                                    <td className="p-4">
                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "published"
                                                ? "bg-green-100 text-green-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}>
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="whitespace-nowrap p-4 text-gray-500">
                                        {formatDate(item.created_at)}
                                    </td>
                                </tr>
                            ))}

                            {news.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

        </div>
    );
}
