
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

import NewsCard from "../components/news/NewsCard";
import CategoryBar from "../components/news/CategoryBar";
import Pagination from "../components/news/Pagination";
import Loader from "../components/common/Loader";

export default function NewsList() {
    const [searchParams, setSearchParams] = useSearchParams();

    const page = Number(searchParams.get("page")) || 1;
    const category = searchParams.get("category") || "";

    const [news, setNews] = useState([]);
    const [categories, setCategories] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/categories")
            .then(({ data }) => setCategories(data.data || []))
            .catch(() => setCategories([]));
    }, []);

    useEffect(() => {
        let active = true;

        const loadNews = async () => {
            setLoading(true);
            setError("");

            try {
                const { data } = await api.get("/news", {
                    params: {
                        page,
                        limit: 9,
                        category: category || undefined
                    }
                });

                if (!active) return;

                setNews(data.data || []);
                setTotalPages(data.pagination?.totalPages || 1);
            } catch (err) {
                if (active) {
                    setError(err.response?.data?.message || "Unable to load news.");
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadNews();

        return () => {
            active = false;
        };
    }, [page, category]);

    const changePage = (nextPage) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", String(nextPage));
        setSearchParams(params);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const changeCategory = (slug) => {
        const params = new URLSearchParams();
        if (slug) params.set("category", slug);
        params.set("page", "1");
        setSearchParams(params);
    };

    return (
        <div className="container-main py-10">

            <h1 className="text-3xl font-extrabold">Latest News</h1>
            <p className="mt-2 text-gray-500">
                Discover the latest stories and updates.
            </p>

            <div className="mt-6">
                <CategoryBar categories={categories} />
            </div>

            <div className="mb-6 flex flex-wrap gap-2">
                <button
                    onClick={() => changeCategory("")}
                    className={`rounded-full px-4 py-2 text-sm ${!category ? "bg-red-600 text-white" : "bg-white border"
                        }`}
                >
                    All
                </button>

                {categories.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => changeCategory(item.slug)}
                        className={`rounded-full px-4 py-2 text-sm ${category === item.slug
                            ? "bg-red-600 text-white"
                            : "border bg-white"
                            }`}
                    >
                        {item.name}
                    </button>
                ))}
            </div>

            {loading ? (
                <Loader />
            ) : error ? (
                <p className="rounded-lg bg-red-50 p-5 text-red-600">{error}</p>
            ) : news.length === 0 ? (
                <p className="rounded-lg bg-white p-10 text-center text-gray-500">
                    No news found in this category.
                </p>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {news.map((item) => (
                            <NewsCard key={item.id} news={item} />
                        ))}
                    </div>

                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={changePage}
                    />
                </>
            )}
        </div>
    );
}
