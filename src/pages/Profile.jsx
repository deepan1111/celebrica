// src/pages/Profile.jsx

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Profile() {
    const [user, setUser] = useState(null);

    // Fetch and set the authenticated user
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-xl text-gray-500">
                Loading profile...
            </div>
        );
    }

    return (
        <div className="flex justify-center items-center py-10 bg-gradient-to-br from-gray-50 to-white min-h-screen font-poppins">
            <div className="bg-white shadow-2xl rounded-3xl px-8 py-10 w-full max-w-2xl border border-gray-200">

                {/* Profile Header */}
                <div className="flex items-center gap-6">
                    <img
                        src={user.photoURL || "https://i.ibb.co/ZYW3VTp/brown-brim.png"} // fallback photo
                        alt="User"
                        className="w-24 h-24 rounded-full border-4 border-purple-500 object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{user.displayName || "Your Name"}</h2>
                        <p className="text-sm text-purple-600 font-medium">Registered User</p>
                    </div>
                </div>

                {/* Divider */}
                <hr className="my-6 border-gray-200" />

                {/* Email and Details */}
                <div className="text-left space-y-4 text-sm text-gray-700">
                    <p>
                        <span className="font-medium text-gray-900">Email: </span> {user.email}
                    </p>
                    <p>
                        <span className="font-medium text-gray-900">User Type: </span> Regular User

                    </p>
                    <p>
                        <span className="font-medium text-gray-900">Member Since: </span>{" "}
                        {new Date(user.metadata?.creationTime).toLocaleDateString()}
                    </p>
                </div>



                {/* Action Buttons */}
                <div className="mt-6 flex justify-evenly gap-3">
                    <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-full text-sm font-medium">
                        View My Events
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-medium">
                        Edit Profile
                    </button>
                    <button

                        className="bg-red-500 text-white px-4 py-2 rounded-full font-medium hover:bg-red-600"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
}
