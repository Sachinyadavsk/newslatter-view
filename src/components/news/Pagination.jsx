
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
    page,
    totalPages,
    onPageChange
}) {
    if (totalPages <= 1) return null;

    return (
        <div className="mt-10 flex items-center justify-center gap-4">

            <button
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
            >
                <ChevronLeft size={18} />
                Previous
            </button>

            <span className="text-sm font-semibold">
                Page {page} of {totalPages}
            </span>

            <button
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 disabled:opacity-40"
            >
                Next
                <ChevronRight size={18} />
            </button>

        </div>
    );
}
