// src/components/DiscountBanner.jsx
import { useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase"; // adjust the path if needed

const DiscountBanner = () => {
  const [showBanner, setShowBanner] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check user login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // true if user exists, false otherwise
    });

    return () => unsubscribe();
  }, []);

  // Don't render the banner if user is logged in or banner is dismissed
  if (!showBanner || isLoggedIn) {
    return null;
  }

  return (
    <div className="bg-blue-500 text-black py-3 px-4 flex justify-center items-center relative font-semibold text-sm sm:text-base">
      <span className="text-center">
        🎉 <strong>20% OFF for new users</strong> — Sign Up now !!!
      </span>
      <button
        onClick={() => setShowBanner(false)}
        className="absolute right-4 text-xl font-bold text-black hover:text-red-600 top-1/2 -translate-y-1/2"
        aria-label="Close Banner"
      >
        ×
      </button>
    </div>
  );
};

export default DiscountBanner;

