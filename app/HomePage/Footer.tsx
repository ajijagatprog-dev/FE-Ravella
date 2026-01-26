export default function Footer() {
    return (
        <footer className="bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800 px-4 md:px-10 lg:px-40 py-16">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="text-primary">
                                <svg
                                    className="size-5"
                                    fill="none"
                                    viewBox="0 0 48 48"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M6 6H42L36 24L42 42H6L12 24L6 6Z"
                                        fill="currentColor"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-lg font-extrabold tracking-tight">RAVELLE</h2>
                        </div>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Defining modern elegance through minimalist design and sustainable
                            craftsmanship since 2018.
                        </p>
                        <div className="flex gap-4">
                            <a
                                className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                                href="#"
                            >
                                <span className="material-symbols-outlined text-lg!">public</span>
                            </a>
                            <a
                                className="size-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary hover:text-white transition-all"
                                href="#"
                            >
                                <span className="material-symbols-outlined text-lg!">share</span>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Shop</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    New Arrivals
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Best Sellers
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Accessories
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Gift Cards
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Customer Care</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Shipping Policy
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Returns & Exchanges
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Size Guide
                                </a>
                            </li>
                            <li>
                                <a className="hover:text-primary transition-colors" href="#">
                                    Contact Us
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold mb-6">Visit Us</h4>
                        <p className="text-sm text-gray-500 mb-2">
                            124 Fashion Ave, Suite 300
                            <br />
                            New York, NY 10018
                        </p>
                        <p className="text-sm text-gray-500">
                            Mon - Sat: 10:00 - 19:00
                            <br />
                            Sun: 11:00 - 17:00
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-400 text-xs">
                        © 2024 Ravelle Collective. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-gray-400">
                        <a className="hover:underline" href="#">
                            Privacy Policy
                        </a>
                        <a className="hover:underline" href="#">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
