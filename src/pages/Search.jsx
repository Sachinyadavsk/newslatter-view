
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../api/axios";
import NewsCard from "../components/news/NewsCard";
import Loader from "../components/common/Loader";

export default function Search() {
    const [params] = useSearchParams();
    const query = params.get("q") || "";

    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const searchNews = async () => {
            setLoading(true);
            setError("");

            try {
                const { data } = await api.get("/news", {
                    params: { search: query, limit: 50 }
                });

                if (active) setNews(data.data || []);
            } catch (err) {
                if (active) {
                    setError(err.response?.data?.message || "Search failed.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        if (query.trim()) {
            searchNews();
        } else {
            setNews([]);
            setLoading(false);
        }

        return () => {
            active = false;
        };
    }, [query]);

    return (
        <div className="container-main py-12">

            <h1 className="text-3xl font-extrabold">
                Search Results
            </h1>

            <p className="mt-2 text-gray-500">
                Results for: <strong>{query}</strong>
            </p>

            {loading ? (
                <Loader />
            ) : error ? (
                <p className="mt-8 text-red-600">{error}</p>
            ) : news.length === 0 ? (
                <div className="mt-10 rounded-xl bg-white p-10 text-center">
                    <h2 className="text-xl font-bold">No results found</h2>
                    <p className="mt-2 text-gray-500">
                        Try searching with another keyword.
                    </p>
                    <Link to="/news" className="mt-4 inline-block text-red-600">
                        Browse latest news
                    </Link>
                </div>
            ) : (
                <>
                    <p className="mb-6 mt-8 text-sm text-gray-500">
                        Found {news.length} articles.
                    </p>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {news.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>
                </>
            )}

        </div>
    );
}
