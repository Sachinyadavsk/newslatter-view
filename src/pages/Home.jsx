
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Newspaper } from "lucide-react";

import api from "../api/axios";
import NewsCard from "../components/news/NewsCard";
import CategoryBar from "../components/news/CategoryBar";
import Loader from "../components/common/Loader";

export default function Home() {
    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadHome = async () => {
            try {
                const [newsResponse, categoryResponse] = await Promise.all([
                    api.get("/news?page=1&limit=7"),
                    api.get("/categories")
                ]);

                setNews(newsResponse.data.data || []);
                setCategories(categoryResponse.data.data || []);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load news. Please try again."
                );
            } finally {
                setLoading(false);
            }
        };

        loadHome();
    }, []);

    if (loading) return <Loader />;

    const featured = news[0];
    const latest = news.slice(1);

    return (
        <div className="container-main py-8">

            {/* Breaking news */}
            <div className="mb-8 flex items-center gap-3 overflow-hidden rounded-lg bg-red-600 px-4 py-3 text-white">
                <span className="shrink-0 text-xs font-extrabold uppercase tracking-widest">
                    <Flame className="mr-1 inline" size={17} />
                    Breaking
                </span>

                <p className="truncate text-sm">
                    Stay updated with the latest news and important headlines.
                </p>
            </div>

            <CategoryBar categories={categories} />

            {error && (
                <p className="my-5 rounded-lg bg-red-50 p-4 text-red-700">
                    {error}
                </p>
            )}

            {!error && news.length === 0 && (
                <div className="my-12 rounded-xl bg-white p-12 text-center">
                    <Newspaper className="mx-auto text-gray-400" size={40} />
                    <h2 className="mt-4 text-xl font-bold">No news available</h2>
                    <p className="mt-2 text-gray-500">
                        Please check back later.
                    </p>
                </div>
            )}

            {featured && (
                <section className="mt-8">
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold">Top Story</h2>
                        <span className="text-sm font-semibold text-red-600">Featured</span>
                    </div>

                    <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-2">
                        <Link to={`/news/${featured.slug}`} className="block overflow-hidden">
                            {featured.image ? (
                                <img
                                    src={`${import.meta.env.VITE_UPLOAD_URL}/uploads/${featured.image}`}
                                    alt={featured.title}
                                    className="h-72 w-full object-cover lg:h-full"
                                />
                            ) : (
                                <div className="h-72 bg-gray-200 lg:h-full" />
                            )}
                        </Link>

                        <div className="flex flex-col justify-center p-7 md:p-10">
                            <span className="text-sm font-bold uppercase text-red-600">
                                {featured.category_name}
                            </span>

                            <Link to={`/news/${featured.slug}`}>
                                <h1 className="mt-4 text-2xl font-extrabold leading-tight md:text-4xl hover:text-red-600">
                                    {featured.title}
                                </h1>
                            </Link>

                            <p className="mt-5 leading-7 text-gray-500 line-clamp-3">
                                {featured.description}
                            </p>

                            <Link
                                to={`/news/${featured.slug}`}
                                className="mt-7 inline-flex w-fit items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white hover:bg-red-700"
                            >
                                Read Full Story <ArrowRight size={18} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {latest.length > 0 && (
                <section className="mt-14">
                    <div className="mb-7 flex items-center justify-between">
                        <h2 className="text-2xl font-extrabold">Latest News</h2>
                        <Link to="/news" className="flex items-center gap-2 text-sm font-semibold text-red-600">
                            View All <ArrowRight size={16} />
                        </Link>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {latest.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
