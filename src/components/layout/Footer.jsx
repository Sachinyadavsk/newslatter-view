
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="mt-20 bg-gray-950 py-12 text-gray-300">
            <div className="container-main grid gap-10 md:grid-cols-3">

                <div>
                    <Link to="/" className="text-2xl font-extrabold text-white">
                        Daily<span className="text-red-500">News.</span>
                    </Link>
                    <p className="mt-4 text-sm leading-7 text-gray-400">
                        Your trusted destination for the latest news,
                        technology, business, sports and world updates.
                    </p>
                </div>

                <div>
                    <h3 className="mb-4 font-bold text-white">Quick Links</h3>
                    <div className="space-y-3 text-sm">
                        <Link className="block hover:text-white" to="/">Home</Link>
                        <Link className="block hover:text-white" to="/news">Latest News</Link>
                        <Link className="block hover:text-white" to="/login">Login</Link>
                        <Link className="block hover:text-white" to="/register">Register</Link>
                    </div>
                </div>

                <div>
                    <h3 className="mb-4 font-bold text-white">Stay Informed</h3>
                    <p className="text-sm text-gray-400">
                        Read the latest stories and discover what's happening
                        around the world.
                    </p>
                </div>

            </div>

            <div className="container-main mt-10 border-t border-gray-800 pt-6 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} DailyNews. All rights reserved.
            </div>
        </footer>
    );
}
