"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { FiMenu, FiX, FiUser } from "react-icons/fi"
import { useRouter } from "next/navigation"

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)
    const router = useRouter()

    useEffect(() => {
        // Check if user is logged in
        const checkLoginStatus = () => {
            const accessToken = localStorage.getItem('accessToken')
            setIsLoggedIn(!!accessToken)
        }

        // Check on mount
        checkLoginStatus()

        // Add event listener for storage changes
        window.addEventListener('storage', checkLoginStatus)

        return () => {
            window.removeEventListener('storage', checkLoginStatus)
        }
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        localStorage.removeItem('userId')
        setIsLoggedIn(false)
        router.push('/login')
    }

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const navItems = [
        { label: "Trang Chủ", href: "/" },
        { label: "Đặt xe", href: "/booking" },
        { label: "Về chúng tôi", href: "/aboutus" },
        { label: "Liên Hệ", href: "/contact" },
        { label: "Tính năng", href: "/features" },
        { label: "Blog", href: "/blog" },
        { label: "Fanpage", href: "/page" },
    ]

    const AuthButtons = () => {
        if (isLoggedIn) {
            return (
                <div className="relative">
                    <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 text-gray-600 hover:text-green-500"
                    >
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <FiUser className="text-white text-xl" />
                        </div>
                    </button>

                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                            <Link
                                href="/profile"
                                className="block px-4 py-2 text-gray-800 hover:bg-green-50"
                            >
                                Thông tin cá nhân
                            </Link>
                            <Link
                                href="/my-bookings"
                                className="block px-4 py-2 text-gray-800 hover:bg-green-50"
                            >
                                Lịch sử đặt xe
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 text-red-600 hover:bg-green-50"
                            >
                                Đăng xuất
                            </button>
                        </div>
                    )}
                </div>
            )
        }

        return (
            <>
                <Link
                    href="/login"
                    className="text-gray-600 hover:text-green-500 transition-colors text-lg font-medium"
                >
                    Đăng nhập
                </Link>
                <Link
                    href="/register"
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
                >
                    Đăng ký
                </Link>
            </>
        )
    }

    return (
        <nav className="flex items-center justify-between px-4 py-4 bg-white shadow-sm">
            {/* Logo */}
            <Link href="/" className="flex items-center">
                <Image src="/favicon.svg" alt="VinShuttle" width={40} height={40} className="object-contain" />
                <span className="ml-3 text-black text-2xl font-bold">VinShuttle</span>
            </Link>

            {/* Desktop Navigation - Dịch sang trái xa hơn */}
            <div className="hidden md:flex justify-center items-center space-x-12 ml-24 mr-auto pl-72">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className="text-gray-600 hover:text-green-500 transition-colors text-lg font-medium"
                    >
                        {item.label}
                    </Link>
                ))}
            </div>

            {/* Auth Buttons - Now using the AuthButtons component */}
            <div className="hidden md:flex items-center space-x-4">
                <AuthButtons />
            </div>

            {/* Mobile Menu Button */}
            <button onClick={toggleMenu} className="md:hidden text-gray-600 text-2xl">
                {isOpen ? <FiX /> : <FiMenu />}
            </button>

            {/* Mobile Navigation - Updated with AuthButtons */}
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-[60%] bg-white shadow-md flex flex-col items-center py-6 space-y-4 z-50 rounded-b-lg transition-all duration-300">
                    <button onClick={toggleMenu} className="absolute top-4 right-6 text-2xl text-gray-600">
                        <FiX />
                    </button>

                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-gray-600 hover:text-green-500 transition-colors text-lg font-medium"
                            onClick={() => setIsOpen(false)}
                        >
                            {item.label}
                        </Link>
                    ))}

                    <div className="flex flex-col space-y-2">
                        <AuthButtons />
                    </div>
                </div>
            )}
        </nav>
    )
}
