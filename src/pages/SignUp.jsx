


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
    sendEmailVerification,
} from "firebase/auth";
import { auth } from "../firebase";
import { toast } from "react-hot-toast";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission (Email/Password sign-up)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Password validation
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters");
            return;
        }

        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            
            // Update profile with name
            await updateProfile(userCredential.user, {
                displayName: formData.name,
            });

            // Optional: Send email verification
            await sendEmailVerification(userCredential.user);
            
            toast.success("Account created! Please check your email for verification.");
            navigate("/");
        } catch (error) {
            // Better error messages
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

    // Google sign-in logic
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        setLoading(true);
        try {
            await signInWithPopup(auth, provider);
            toast.success("Signed in with Google");
            navigate("/");
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
                <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                    Create an Account
                </h1>

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
                            placeholder="Your Name"
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
                            placeholder="youremail@email.com"
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
                        <p className="text-xs text-gray-500 mt-1">
                            Must be at least 6 characters
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
                    >
                        {loading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="mx-4 text-gray-500 font-medium">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Sign In */}
                <div className="flex flex-col gap-4 my-4">
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        <FcGoogle className="text-xl block" />
                        {loading ? "Signing in..." : "Sign in with Google"}
                    </button>
                </div>

                {/* Link to Login */}
                <p className="text-sm font-light text-gray-500 text-center">
                    Already have an account?
                    <Link to="/sign-in">
                        <span className="font-medium inline text-[#3b82f6] hover:underline ml-1">
                            Log in
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}