
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";

import api from "../api/axios";
import Loader from "../components/common/Loader";
import { formatDate } from "../utils/formatDate";
import NewsCard from "../components/news/NewsCard";

export default function NewsDetails() {
    const { slug } = useParams();

    const [news, setNews] = useState(null);
    const [related, setRelated] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadArticle = async () => {
            setLoading(true);
            setError("");

            try {
                const { data } = await api.get(`/news/${encodeURIComponent(slug)}`);

                if (!active) return;

                setNews(data.data);

                const relatedResponse = await api.get("/news", {
                    params: {
                        category: data.data.category_slug,
                        limit: 4
                    }
                });

                if (active) {
                    setRelated(
                        (relatedResponse.data.data || [])
                            .filter((item) => item.id !== data.data.id)
                            .slice(0, 3)
                    );
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message || "Unable to load article."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadArticle();

        return () => {
            active = false;
        };
    }, [slug]);

    if (loading) return <Loader />;

    if (error || !news) {
        return (
            <div className="container-main py-20 text-center">
                <h1 className="text-3xl font-bold">Article not found</h1>
                <p className="mt-3 text-gray-500">{error}</p>
                <Link to="/news" className="mt-6 inline-block text-red-600">
                    Back to news
                </Link>
            </div>
        );
    }

    return (
        <div className="container-main py-10">

            <div className="mx-auto max-w-4xl">

                <Link
                    to={`/news?category=${encodeURIComponent(news.category_slug)}`}
                    className="text-sm font-bold uppercase tracking-wider text-red-600"
                >
                    {news.category_name}
                </Link>

                <h1 className="mt-4 text-3xl font-extrabold leading-tight md:text-5xl">
                    {news.title}
                </h1>

                <p className="mt-5 text-lg leading-8 text-gray-500">
                    {news.description}
                </p>

                <div className="my-6 flex flex-wrap gap-5 border-y py-5 text-sm text-gray-500">
                    <span className="flex items-center gap-2">
                        <User size={17} />
                        {news.author_name}
                    </span>

                    <span className="flex items-center gap-2">
                        <CalendarDays size={17} />
                        {formatDate(news.created_at)}
                    </span>
                </div>

                {news.image && (
                    <img
                        src={`${import.meta.env.VITE_UPLOAD_URL}/uploads/${news.image}`}
                        alt={news.title}
                        className="max-h-[550px] w-full rounded-xl object-cover"
                    />
                )}

                <article className="mt-9 break-words text-base leading-8 text-gray-700">
                    <div className="whitespace-pre-wrap">
                        {news.content}
                    </div>
                </article>

            </div>

            {related.length > 0 && (
                <section className="mt-16">
                    <h2 className="mb-7 text-2xl font-extrabold">
                        Related News
                    </h2>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {related.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>
                </section>
            )}

        </div>
    );
}
