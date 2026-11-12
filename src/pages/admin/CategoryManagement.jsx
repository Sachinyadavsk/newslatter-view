
import { useCallback, useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";

import api from "../../api/axios";
import Loader from "../../components/common/Loader";

export default function CategoryManagement() {
    const [categories, setCategories] = useState([]);
    const [name, setName] = useState("");
    const [editId, setEditId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const loadCategories = useCallback(async () => {
        try {
            const { data } = await api.get("/categories");
            setCategories(data.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Unable to load categories.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const resetForm = () => {
        setName("");
        setEditId(null);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name.trim()) return;

        setSaving(true);
        setError("");

        try {
            if (editId) {
                await api.put(`/categories/${editId}`, {
                    name: name.trim()
                });
            } else {
                await api.post("/categories", {
                    name: name.trim()
                });
            }

            resetForm();
            await loadCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save category."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this category?")) return;

        try {
            await api.delete(`/categories/${id}`);
            await loadCategories();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete category. It may be used by existing news."
            );
        }
    };

    if (loading) return <Loader />;

    return (
        <div className="mx-auto max-w-4xl">

            <h1 className="text-3xl font-extrabold">
                Category Management
            </h1>

            <p className="mt-2 text-gray-500">
                Organize your news articles into categories.
            </p>

            {error && (
                <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="mt-7 flex flex-wrap gap-3 rounded-xl border bg-white p-5"
            >
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter category name"
                    required
                    maxLength={150}
                    className="min-w-0 flex-1 rounded-lg border px-4 py-3 outline-none focus:border-red-600"
                />

                <button
                    disabled={saving}
                    className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-3 font-semibold text-white"
                >
                    <Plus size={18} />
                    {saving ? "Saving..." : editId ? "Update" : "Add Category"}
                </button>

                {editId && (
                    <button
                        type="button"
                        onClick={resetForm}
                        className="rounded-lg border px-4"
                        aria-label="Cancel edit"
                    >
                        <X size={18} />
                    </button>
                )}
            </form>

            <div className="mt-7 overflow-hidden rounded-xl border bg-white">

                <div className="border-b p-5">
                    <h2 className="font-bold">
                        All Categories ({categories.length})
                    </h2>
                </div>

                <div className="divide-y">
                    {categories.map((category) => (
                        <div
                            key={category.id}
                            className="flex items-center justify-between gap-3 p-5"
                        >
                            <div>
                                <h3 className="font-bold">{category.name}</h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    {category.slug} · {category.news_count} articles
                                </p>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={() => {
                                        setName(category.name);
                                        setEditId(category.id);
                                        setError("");
                                    }}
                                    className="text-blue-600"
                                    title="Edit"
                                >
                                    <Pencil size={18} />
                                </button>

                                <button
                                    onClick={() => handleDelete(category.id)}
                                    className="text-red-600"
                                    title="Delete"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}

                    {categories.length === 0 && (
                        <p className="p-8 text-center text-gray-500">
                            No categories found.
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
}
