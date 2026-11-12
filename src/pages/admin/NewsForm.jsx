
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload } from "lucide-react";

import api from "../../api/axios";
import Loader from "../../components/common/Loader";

const initialForm = {
    title: "",
    description: "",
    content: "",
    category_id: "",
    status: "draft"
};

export default function NewsForm() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState(initialForm);
    const [categories, setCategories] = useState([]);
    const [image, setImage] = useState(null);
    const [currentImage, setCurrentImage] = useState("");
    const [loading, setLoading] = useState(!!id);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;

        const loadForm = async () => {
            try {
                const categoryResponse = await api.get("/categories");

                if (!active) return;

                setCategories(categoryResponse.data.data || []);

                if (id) {
                    const { data } = await api.get(
                        "/news/admin/all",
                        { params: { limit: 50 } }
                    );

                    const article = (data.data || []).find(
                        (item) => String(item.id) === String(id)
                    );

                    if (!article) {
                        setError("Article not found or not accessible.");
                        return;
                    }

                    setForm({
                        title: article.title || "",
                        description: article.description || "",
                        content: article.content || "",
                        category_id: String(article.category_id || ""),
                        status: article.status || "draft"
                    });

                    setCurrentImage(article.image || "");
                }
            } catch (err) {
                if (active) {
                    setError(
                        err.response?.data?.message ||
                        "Unable to load editor."
                    );
                }
            } finally {
                if (active) setLoading(false);
            }
        };

        loadForm();

        return () => {
            active = false;
        };
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            const formData = new FormData();

            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            if (image) {
                formData.append("image", image);
            }

            if (id) {
                await api.put(`/news/${id}`, formData);
            } else {
                await api.post("/news", formData);
            }

            navigate("/admin/news");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save article."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="mx-auto max-w-4xl">

            <Link
                to="/admin/news"
                className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-600"
            >
                <ArrowLeft size={18} />
                Back to News
            </Link>

            <div className="rounded-xl border bg-white p-6 md:p-8">

                <h1 className="text-2xl font-extrabold">
                    {id ? "Edit Article" : "Create New Article"}
                </h1>

                <p className="mt-2 text-gray-500">
                    Write and publish your news article.
                </p>

                {error && (
                    <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="mt-7 space-y-6">

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Article Title *
                        </label>

                        <input
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            required
                            maxLength={255}
                            placeholder="Enter news title"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Description *
                        </label>

                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            required
                            rows={3}
                            placeholder="Short news description"
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Category *
                        </label>

                        <select
                            name="category_id"
                            value={form.category_id}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                        >
                            <option value="">Select category</option>

                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Article Content *
                        </label>

                        <textarea
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            required
                            rows={14}
                            placeholder="Write full article content..."
                            className="w-full rounded-lg border px-4 py-3 leading-7 outline-none focus:border-red-600"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Featured Image
                        </label>

                        {currentImage && !image && (
                            <img
                                src={`${import.meta.env.VITE_UPLOAD_URL}/uploads/${currentImage}`}
                                alt="Current article"
                                className="mb-4 h-40 w-64 rounded-lg object-cover"
                            />
                        )}

                        <label className="flex cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed p-5 hover:border-red-500">
                            <Upload className="text-red-600" />

                            <div>
                                <p className="font-semibold">
                                    {image ? image.name : "Choose article image"}
                                </p>
                                <p className="mt-1 text-xs text-gray-500">
                                    JPG, PNG or WEBP. Maximum 5 MB.
                                </p>
                            </div>

                            <input
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={(e) => {
                                    setImage(e.target.files?.[0] || null);
                                }}
                            />
                        </label>

                        {image && (
                            <button
                                type="button"
                                onClick={() => setImage(null)}
                                className="mt-2 text-sm text-red-600"
                            >
                                Remove selected image
                            </button>
                        )}
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold">
                            Publication Status
                        </label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-4 py-3"
                        >
                            <option value="draft">Save as Draft</option>
                            <option value="published">Publish Now</option>
                        </select>
                    </div>

                    <div className="flex flex-wrap justify-end gap-3 border-t pt-6">
                        <Link
                            to="/admin/news"
                            className="rounded-lg border px-5 py-3 font-semibold"
                        >
                            Cancel
                        </Link>

                        <button
                            type="submit"
                            disabled={saving}
                            className="rounded-lg bg-red-600 px-7 py-3 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                        >
                            {saving
                                ? "Saving..."
                                : id ? "Update Article" : "Create Article"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
