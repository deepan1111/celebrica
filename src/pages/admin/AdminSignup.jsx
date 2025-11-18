// src/pages/admin/AdminSignUp.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

const ADMIN_ACCESS_KEY = "ADMIN@123";

export default function AdminSignUp() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    accessKey: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate access key
    if (formData.accessKey !== ADMIN_ACCESS_KEY) {
      toast.error("Invalid admin access key!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Update profile with name
      await updateProfile(userCredential.user, {
        displayName: formData.name,
      });

      // Create admin user document in Firestore
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: formData.email,
        name: formData.name,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      toast.success("Admin account created successfully!");
      navigate("/admin/dashboard");
    } catch (error) {
      switch (error.code) {
        case "auth/email-already-in-use":
          toast.error("This email is already registered");
          break;
        case "auth/invalid-email":
          toast.error("Invalid email address");
          break;
        case "auth/weak-password":
          toast.error("Password is too weak");
          break;
        default:
          toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Prompt for access key first
    const accessKey = prompt("Enter Admin Access Key:");
    if (accessKey !== ADMIN_ACCESS_KEY) {
      toast.error("Invalid admin access key!");
      return;
    }

    const provider = new GoogleAuthProvider();
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Create admin user document
      await setDoc(doc(db, "users", result.user.uid), {
        email: result.user.email,
        name: result.user.displayName,
        role: "admin",
        createdAt: new Date().toISOString(),
      });

      toast.success("Admin account created with Google");
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        toast.error("Sign-in cancelled");
      } else {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-blue-800 overflow-auto">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Admin Sign Up</h1>
          <p className="text-sm text-gray-500 mt-2">
            Create your admin account
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Admin Name"
              required
              disabled={loading}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Your Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin@email.com"
              required
              disabled={loading}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              required
              minLength={6}
              disabled={loading}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Admin Access Key
            </label>
            <input
              type="password"
              name="accessKey"
              value={formData.accessKey}
              onChange={handleChange}
              placeholder="Enter secret access key"
              required
              disabled={loading}
              className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              🔐 Required for admin registration
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Create Admin Account"}
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="flex flex-col gap-4 my-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <FcGoogle className="text-xl" />
            {loading ? "Signing in..." : "Sign in with Google"}
          </button>
        </div>

        <p className="text-sm font-light text-gray-500 text-center">
          Already have an admin account?
          <Link to="/admin/sign-in">
            <span className="font-medium inline text-[#3b82f6] hover:underline ml-1">
              Sign In
            </span>
          </Link>
        </p>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <Link
            to="/sign-up"
            className="text-sm text-gray-600 hover:text-blue-600 block text-center"
          >
            ← Back to regular sign up
          </Link>
        </div>
      </div>
    </div>
  );
}