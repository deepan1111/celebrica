
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { Menu, X, ShoppingCart, Package, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // 🔍 Track authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 🔓 Logout handler
  const handleLogout = async () => {
    await signOut(auth);
    setIsMenuOpen(false);
    navigate("/sign-in");
  };

  // Close menu when clicking a link
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Sticky Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 w-full px-4 py-3 bg-white shadow-md font-poppins">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* 🔗 Logo Link */}
          <div>
            <Link to="/" onClick={closeMenu}>
              <img
                src="/logo.png"
                alt="Celebrica"
                className="h-[50px] md:h-[60px] w-auto object-contain"
              />
            </Link>
          </div>

          {/* 🔗 Desktop Navigation Links */}
          <ul className="hidden md:flex space-x-8 text-md font-medium text-black">
            <li>
              <Link to="/" className="hover:text-purple-500 transition">
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className="hover:text-purple-500 transition">
                Categories
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-purple-500 transition">
                Services
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-purple-500 transition">
                Contact
              </Link>
            </li>
          </ul>

          {/* 🔘 Desktop Right Side Buttons */}
          <div className="space-x-3 hidden md:flex items-center">
            {!user ? (
              // 🔐 Not Logged In
              <>
                <Link
                  to="/sign-in"
                  className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  Log in
                </Link>
                <Link
                  to="/sign-up"
                  className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900 transition"
                >
                  Sign up
                </Link>
              </>
            ) : (
              // 🧑‍🎓 Logged In
              <>
                <Link
                  to="/orders"
                  className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  My Orders
                </Link>
                <Link
                  to="/cart"
                  className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  My Cart
                </Link>
                <Link
                  to="/profile"
                  className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition"
                >
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* 🍔 Hamburger Menu Button (Mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-black hover:text-purple-500 transition p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-[66px] md:h-[76px]"></div>

      {/* 📱 Mobile Menu Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={closeMenu}
        ></div>
      )}

      {/* 📱 Mobile Menu Sidebar */}
      <div
        className={`fixed top-[66px] right-0 h-[calc(100vh-66px)] w-[280px] bg-white shadow-2xl z-40 transform transition-transform duration-300 ease-in-out md:hidden ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto py-6">
            <ul className="space-y-2 px-4">
              <li>
                <Link
                  to="/"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-black hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
                >
                  🏠 Home
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-black hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
                >
                  📁 Categories
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-black hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
                >
                  🎯 Services
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  onClick={closeMenu}
                  className="block px-4 py-3 text-black hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium"
                >
                  📧 Contact
                </Link>
              </li>
            </ul>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4"></div>

            {/* User Actions */}
            <div className="px-4 space-y-2">
              {!user ? (
                // 🔐 Not Logged In
                <>
                  <Link
                    to="/sign-in"
                    onClick={closeMenu}
                    className="block w-full text-center border border-black text-black px-4 py-3 rounded-full font-medium hover:bg-gray-100 transition"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/sign-up"
                    onClick={closeMenu}
                    className="block w-full text-center bg-black text-white px-4 py-3 rounded-full font-medium hover:bg-gray-900 transition"
                  >
                    Sign up
                  </Link>
                </>
              ) : (
                // 🧑‍🎓 Logged In
                <>
                  <div className="bg-purple-50 rounded-lg p-3 mb-4">
                    <p className="text-sm text-gray-600">Signed in as</p>
                    <p className="font-semibold text-gray-800 truncate">
                      {user.displayName || user.email}
                    </p>
                  </div>
                  
                  <Link
                    to="/orders"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-100 rounded-lg transition font-medium"
                  >
                    <Package size={20} />
                    My Orders
                  </Link>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-100 rounded-lg transition font-medium"
                  >
                    <ShoppingCart size={20} />
                    My Cart
                  </Link>
                  <Link
                    to="/profile"
                    onClick={closeMenu}
                    className="flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-100 rounded-lg transition font-medium"
                  >
                    <User size={20} />
                    Profile
                  </Link>
                  
                  <div className="border-t border-gray-200 my-3"></div>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 w-full bg-red-500 text-white px-4 py-3 rounded-full font-medium hover:bg-red-600 transition"
                  >
                    <LogOut size={20} />
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}