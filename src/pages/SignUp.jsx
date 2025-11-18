// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FcGoogle } from "react-icons/fc";
// import {
//     createUserWithEmailAndPassword,
//     updateProfile,
//     signInWithPopup,
//     GoogleAuthProvider,
// } from "firebase/auth";
// import { auth } from "../firebase";
// import { toast } from "react-hot-toast";

// export default function SignUp() {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });

//     const navigate = useNavigate();

//     // Handle input field changes
//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData((prev) => ({
//             ...prev,
//             [name]: value,
//         }));
//     };

//     // Handle form submission (Email/Password sign-up)
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const userCredential = await createUserWithEmailAndPassword(
//                 auth,
//                 formData.email,
//                 formData.password
//             );
//             await updateProfile(userCredential.user, {
//                 displayName: formData.name,
//             });
//             toast.success("Account created successfully!");
//             navigate("/"); // Redirect to home or profile
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     // Google sign-in logic
//     const handleGoogleSignIn = async () => {
//         const provider = new GoogleAuthProvider();
//         try {
//             await signInWithPopup(auth, provider);
//             toast.success("Signed in with Google");
//             navigate("/");
//         } catch (error) {
//             toast.error(error.message);
//         }
//     };

//     return (
//         <div className="flex flex-col min-h-screen items-center justify-center bg-blue-800 overflow-auto">
//             <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl">
//                 <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
//                     Create an Account
//                 </h1>

//                 <form className="space-y-4" onSubmit={handleSubmit}>
//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Your Name
//                         </label>
//                         <input
//                             type="text"
//                             name="name"
//                             value={formData.name}
//                             onChange={handleChange}
//                             placeholder="Your Name"
//                             required
//                             className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Your Email
//                         </label>
//                         <input
//                             type="email"
//                             name="email"
//                             value={formData.email}
//                             onChange={handleChange}
//                             placeholder="youremail@email.com"
//                             required
//                             className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-gray-700">
//                             Password
//                         </label>
//                         <input
//                             type="password"
//                             name="password"
//                             value={formData.password}
//                             onChange={handleChange}
//                             placeholder="********"
//                             required
//                             className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                         />
//                     </div>

//                     <button
//                         type="submit"
//                         className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
//                     >
//                         Sign Up
//                     </button>
//                 </form>

//                 <div className="flex items-center my-4">
//                     <div className="flex-grow border-t border-gray-300"></div>
//                     <span className="mx-4 text-gray-500 font-medium">OR</span>
//                     <div className="flex-grow border-t border-gray-300"></div>
//                 </div>


//                 {/* Google Sign In */}
//                 <div className="flex flex-col gap-4 my-4">
//                     <button
//                         type="button"
//                         onClick={handleGoogleSignIn}
//                         className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium"
//                     >
//                         <FcGoogle className="text-xl block " />
//                         Sign in with Google
//                     </button>
//                 </div>

//                 {/* Link to Login */}
//                 <p className="text-sm font-light text-gray-500 text-center">
//                     Already have an account?
//                     <Link to="/sign-in">
//                         <span className="font-medium inline text-[#3b82f6] hover:underline ml-1">
//                             Log in
//                         </span>
//                     </Link>
//                 </p>
//                 <p className="text-sm font-light text-gray-500 text-center p-4">
//                     Are you an Admin ?
//                     <Link to="/admin/sign-up">
//                         <span className="font-medium inline text-[#3b82f6] hover:underline ml-1">
//                             Admin Signup
//                         </span>
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";

export default function SignUp() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Save user data to Firestore
    const saveUserToFirestore = async (userId, userData) => {
        try {
            await setDoc(doc(db, "users", userId), {
                ...userData,
                createdAt: new Date().toISOString(),
                role: "user", // Default role for normal users
            });
        } catch (error) {
            console.error("Error saving user to Firestore:", error);
            throw error;
        }
    };

    // Handle form submission (Email/Password sign-up)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                formData.email,
                formData.password
            );
            
            // Update display name
            await updateProfile(userCredential.user, {
                displayName: formData.name,
            });

            // Save user data to Firestore
            await saveUserToFirestore(userCredential.user.uid, {
                name: formData.name,
                email: formData.email,
            });

            toast.success("Account created successfully!");
            navigate("/"); // Redirect to home or profile
        } catch (error) {
            console.error("Sign up error:", error);
            if (error.code === "auth/email-already-in-use") {
                toast.error("Email already in use");
            } else if (error.code === "auth/weak-password") {
                toast.error("Password should be at least 6 characters");
            } else {
                toast.error("Failed to create account");
            }
        }
    };

    // Google sign-in logic
    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const userCredential = await signInWithPopup(auth, provider);
            const user = userCredential.user;

            // Check if user already exists in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));

            if (!userDoc.exists()) {
                // New user - save to Firestore
                await saveUserToFirestore(user.uid, {
                    name: user.displayName || "User",
                    email: user.email,
                });
                toast.success("Account created with Google!");
            } else {
                toast.success("Signed in with Google!");
            }

            navigate("/");
        } catch (error) {
            console.error("Google sign in error:", error);
            toast.error("Google sign-in failed");
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
                            className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            className="mt-1 block w-full p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
                    >
                        Sign Up
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
                        className="w-full flex items-center justify-center gap-3 border border-gray-300 hover:border-gray-500 text-black p-3 rounded-lg transition shadow-sm hover:shadow-md font-medium"
                    >
                        <FcGoogle className="text-xl block " />
                        Sign in with Google
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
                <p className="text-sm font-light text-gray-500 text-center p-4">
                    Are you an Admin ?
                    <Link to="/admin/sign-up">
                        <span className="font-medium inline text-[#3b82f6] hover:underline ml-1">
                            Admin Signup
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    );
}