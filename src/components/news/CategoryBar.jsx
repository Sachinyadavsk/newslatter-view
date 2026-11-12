
import { Link } from "react-router-dom";

export default function CategoryBar({ categories }) {
    return (
        <div className="flex gap-3 overflow-x-auto py-3">
            <Link
                to="/news"
                className="shrink-0 rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white"
            >
                All News
            </Link>

            {categories.map((category) => (
                <Link
                    key={category.id}
                    to={`/news?category=${encodeURIComponent(category.slug)}`}
                    className="shrink-0 rounded-full border bg-white px-5 py-2 text-sm font-semibold text-gray-700 hover:border-red-600 hover:text-red-600"
                >
                    {category.name}
                </Link>
            ))}
        </div>
    );
}
