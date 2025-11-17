// import { Link, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../firebase"; // Adjust path if needed

// export default function Navbar() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   // 🔍 Track authentication state
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe(); // Clean up listener
//   }, []);

//   // 🔓 Logout handler
//   const handleLogout = async () => {
//     await signOut(auth);
//     navigate("/sign-in");
//   };

//   return (
//     <nav className="w-full px-4 py-3 flex justify-between items-center bg-white shadow-sm font-poppins">
//       {/* 🔗 Logo Link */}
//       <div>
//         <Link to="/">
//           <img
//             src="public/logo.png"
//             alt="Eventique"
//             className="h-[60px] w-auto object-fill"
//           />
//         </Link>
//       </div>

//       {/* 🔗 Navigation Links */}
//       <ul className="hidden md:flex space-x-8 text-md font-medium text-black">
//         <li><Link to="/" className="hover:text-purple-500">Home</Link></li>
//         <li><Link to="/categories" className="hover:text-purple-500">Categories</Link></li>
//         <li><Link to="/services" className="hover:text-purple-500">Services</Link></li>
//         <li><Link to="/contact" className="hover:text-purple-500">Contact</Link></li>
//       </ul>

//       {/* 🔘 Right Side Buttons */}
//       <div className="space-x-3 hidden md:flex">
//         {!user ? (
//           // 🔐 Not Logged In
//           <>
//             <Link
//               to="/sign-in"
//               className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100"
//             >
//               Log in
//             </Link>
//             <Link
//               to="/sign-up"
//               className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900"
//             >
//               Sign up
//             </Link>
//           </>
//         ) : (
//           // 🧑‍🎓 Logged In
//           <>
//             <Link
//               to="/cart"
//               className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
//             >
//               My Cart
//             </Link>
//             <Link
//               to="/profile"
//               className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
//             >
//               Profile
//             </Link>
//             <button
//               onClick={handleLogout}
//               className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }


import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

export default function Navbar() {
  const [user, setUser] = useState(null);
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
    navigate("/sign-in");
  };

  return (
    <nav className="w-full px-4 py-3 flex justify-between items-center bg-white shadow-sm font-poppins">
      {/* 🔗 Logo Link */}
      <div>
        <Link to="/">
          <img
            src="public/logo.png"
            alt="Eventique"
            className="h-[60px] w-auto object-fill"
          />
        </Link>
      </div>

      {/* 🔗 Navigation Links */}
      <ul className="hidden md:flex space-x-8 text-md font-medium text-black">
        <li><Link to="/" className="hover:text-purple-500">Home</Link></li>
        <li><Link to="/categories" className="hover:text-purple-500">Categories</Link></li>
        <li><Link to="/services" className="hover:text-purple-500">Services</Link></li>
        <li><Link to="/contact" className="hover:text-purple-500">Contact</Link></li>
      </ul>

      {/* 🔘 Right Side Buttons */}
      <div className="space-x-3 hidden md:flex">
        {!user ? (
          // 🔐 Not Logged In
          <>
            <Link
              to="/sign-in"
              className="border border-black text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              Log in
            </Link>
            <Link
              to="/sign-up"
              className="bg-black text-white px-4 py-2 rounded-full font-medium hover:bg-gray-900"
            >
              Sign up
            </Link>
          </>
        ) : (
          // 🧑‍🎓 Logged In
          <>
            <Link
              to="/orders"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              My Orders
            </Link>
            <Link
              to="/cart"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              My Cart
            </Link>
            <Link
              to="/profile"
              className="text-black border border-gray-300 px-4 py-2 rounded-full font-medium hover:bg-gray-100"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}