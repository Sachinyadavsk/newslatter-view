
import { Link } from "react-router-dom";
import { CalendarDays, User } from "lucide-react";
import { formatDate } from "../../utils/formatDate";

const uploadURL = import.meta.env.VITE_UPLOAD_URL;

export default function NewsCard({ news }) {
    return (
        <article className="group overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

            <Link to={`/news/${news.slug}`} className="block overflow-hidden">
                {news.image ? (
                    <img
                        src={`${uploadURL}/uploads/${news.image}`}
                        alt={news.title}
                        loading="lazy"
                        className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-52 items-center justify-center bg-gray-100 text-gray-400">
                        No Image
                    </div>
                )}
            </Link>

            <div className="p-5">
                {news.category_name && (
                    <Link
                        to={`/news?category=${encodeURIComponent(news.category_slug || "")}`}
                        className="text-xs font-bold uppercase tracking-wider text-red-600"
                    >
                        {news.category_name}
                    </Link>
                )}

                <Link to={`/news/${news.slug}`}>
                    <h3 className="mt-3 text-lg font-bold leading-7 transition group-hover:text-red-600 line-clamp-2">
                        {news.title}
                    </h3>
                </Link>

                <p className="mt-3 text-sm leading-6 text-gray-500 line-clamp-3">
                    {news.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                        <User size={14} />
                        {news.author_name || "News Desk"}
                    </span>

                    <span className="flex items-center gap-1">
                        <CalendarDays size={14} />
                        {formatDate(news.created_at)}
                    </span>
                </div>
            </div>
        </article>
    );
}
