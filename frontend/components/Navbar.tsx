import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface NavItem {
    href: string;
    label: string;
}

const Navbar: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [activeSection, setActiveSection] = useState<string>("Home");
    
    const navItems: NavItem[] = [
        { href: "#Home", label: "Home" },
        { href: "/auth/login", label: "Sign In" },
    ];

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            
            // Get all sections and their positions (only for section links starting with #)
            const sectionPositions = navItems
                .filter(item => item.href.startsWith('#')) // Only process section links
                .map(item => {
                    const section = document.querySelector(item.href) as HTMLElement;
                    if (section) {
                        return {
                            id: item.href.slice(1), // Remove '#' for comparison
                            top: section.offsetTop,
                            bottom: section.offsetTop + section.offsetHeight
                        };
                    }
                    return null;
                }).filter((section): section is NonNullable<typeof section> => section !== null);

            // Find which section is currently in view
            const scrollPosition = window.scrollY + 100; // Adding offset for better detection
            const currentSection = sectionPositions.find(section => 
                scrollPosition >= section.top && scrollPosition < section.bottom
            );

            if (currentSection) {
                setActiveSection(currentSection.id);
            }
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Call once to set initial state
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isOpen]);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        // Only prevent default for section links (starting with #)
        if (href.startsWith('#')) {
            e.preventDefault();
            const section = document.querySelector(href) as HTMLElement;
            if (section) {
                window.scrollTo({
                    top: section.offsetTop - 80, // Adjusted offset for better positioning
                    behavior: "smooth"
                });
                setActiveSection(href.slice(1));
            }
        }
        // For other links, let Next.js handle the navigation
        setIsOpen(false);
    };

    return (
        <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
            isOpen
                ? "bg-white/90 backdrop-blur-xl"
                : scrolled
                ? "bg-white/10 backdrop-blur-xl border-b border-white/20"
                : "bg-transparent"
        }`}>
            <div className="mx-auto px-4 sm:px-6 lg:px-[10%]">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <a
                            href="#Home"
                            onClick={(e) => scrollToSection(e, "#Home")}
                            className="text-xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent flex items-center space-x-2"
                        >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 flex items-center justify-center">
                                <span className="text-white text-sm font-bold">A</span>
                            </div>
                            <span>AGRI-HOPE</span>
                        </a>
                    </div>
    
                    {/* Desktop Navigation */}
                    <div className="hidden md:block">
                        <div className="ml-8 flex items-center space-x-8">
                            {navItems.map((item) => (
                                item.href.startsWith('#') ? (
                                    <a
                                        key={item.label}
                                        href={item.href}
                                        onClick={(e) => scrollToSection(e, item.href)}
                                        className="group relative px-1 py-2 text-sm font-medium"
                                    >
                                        <span
                                            className={`relative z-10 transition-colors duration-300 ${
                                                activeSection === item.href.slice(1)
                                                    ? "bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-semibold"
                                                    : "text-gray-700 group-hover:text-gray-900"
                                            }`}
                                        >
                                            {item.label}
                                        </span>
                                        <span
                                            className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transform origin-left transition-transform duration-300 ${
                                                activeSection === item.href.slice(1)
                                                    ? "scale-x-100"
                                                    : "scale-x-0 group-hover:scale-x-100"
                                            }`}
                                        />
                                    </a>
                                ) : (
                                    <Link key={item.label} href={item.href}>
                                        <span className="group relative px-1 py-2 text-sm font-medium cursor-pointer">
                                            <span className="relative z-10 transition-colors duration-300 text-gray-700 group-hover:text-gray-900">
                                                {item.label}
                                            </span>
                                            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-pink-500 to-rose-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100" />
                                        </span>
                                    </Link>
                                )
                            ))}
                        </div>
                    </div>
    
                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className={`relative p-2 text-gray-700 hover:text-gray-900 transition-transform duration-300 ease-in-out transform ${
                                isOpen ? "rotate-90 scale-125" : "rotate-0 scale-100"
                            }`}
                        >
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>
                </div>
            </div>
    
            {/* Mobile Menu Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out ${
                    isOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-[-100%] pointer-events-none"
                }`}
                style={{ top: "64px", height: "calc(100vh - 64px)" }}
            >
                <div className="flex flex-col h-full">
                    <div className="px-4 py-6 space-y-4 flex-1">
                        {navItems.map((item) => (
                            item.href.startsWith('#') ? (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={`block px-4 py-3 text-lg font-medium ${
                                        activeSection === item.href.slice(1)
                                            ? "bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent font-semibold"
                                            : "text-gray-700 hover:text-gray-900"
                                    }`}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <Link key={item.label} href={item.href}>
                                    <span 
                                        className="block px-4 py-3 text-lg font-medium text-gray-700 hover:text-gray-900 cursor-pointer"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.label}
                                    </span>
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;