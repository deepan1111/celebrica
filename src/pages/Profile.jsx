// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  User,
  Mail,
  Calendar,
  Shield,
  Edit3,
  LogOut,
  ShoppingCart,
  Package,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Loader,
  Camera,
  Save,
  X,
} from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
    reviewsGiven: 0,
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState("");
  const [savingName, setSavingName] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setNewDisplayName(currentUser.displayName || "");
        await fetchUserStats(currentUser.uid);
      } else {
        navigate("/sign-in");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchUserStats = async (userId) => {
    try {
      // Fetch user orders
      const ordersSnap = await getDocs(collection(db, "users", userId, "orders"));
      
      let totalOrders = 0;
      let completedOrders = 0;
      let pendingOrders = 0;
      let cancelledOrders = 0;
      let totalSpent = 0;

      ordersSnap.forEach((doc) => {
        const order = doc.data();
        totalOrders++;
        totalSpent += order.totalCost || 0;

        if (order.status === "completed") completedOrders++;
        else if (order.status === "pending") pendingOrders++;
        else if (order.status === "cancelled") cancelledOrders++;
      });

      // Fetch user reviews
      const feedbacksSnap = await getDocs(collection(db, "feedbacks"));
      let reviewsGiven = 0;
      
      feedbacksSnap.forEach((doc) => {
        if (doc.data().userId === userId) {
          reviewsGiven++;
        }
      });

      setStats({
        totalOrders,
        completedOrders,
        pendingOrders,
        cancelledOrders,
        totalSpent,
        reviewsGiven,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      navigate("/sign-in");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleUpdateName = async () => {
    if (!newDisplayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    if (newDisplayName === user.displayName) {
      setIsEditingName(false);
      return;
    }

    try {
      setSavingName(true);
      await updateProfile(auth.currentUser, {
        displayName: newDisplayName.trim(),
      });
      
      // Force refresh the user state
      setUser({ ...user, displayName: newDisplayName.trim() });
      toast.success("Name updated successfully!");
      setIsEditingName(false);
    } catch (error) {
      console.error("Error updating name:", error);
      toast.error("Failed to update name");
    } finally {
      setSavingName(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader className="animate-spin text-purple-600 mb-4" size={48} />
        <p className="text-xl text-gray-600">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const statCards = [
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      textColor: "text-blue-600",
      bgLight: "bg-blue-50",
    },
    {
      label: "Completed",
      value: stats.completedOrders,
      icon: CheckCircle,
      color: "bg-green-500",
      textColor: "text-green-600",
      bgLight: "bg-green-50",
    },
    {
      label: "Pending",
      value: stats.pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      textColor: "text-yellow-600",
      bgLight: "bg-yellow-50",
    },
    {
      label: "Cancelled",
      value: stats.cancelledOrders,
      icon: XCircle,
      color: "bg-red-500",
      textColor: "text-red-600",
      bgLight: "bg-red-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-blue-50 py-8 px-4 font-poppins">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          {/* Cover Image */}
          <div className="h-32 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>

          {/* Profile Info */}
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-16">
              {/* Avatar and Name */}
              <div className="flex flex-col md:flex-row md:items-end gap-4">
                <div className="relative">
                  <img
                    src={user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email)}&size=128&background=9333ea&color=fff&bold=true`}
                    alt="Profile"
                    className="w-32 h-32 rounded-2xl border-4 border-white shadow-lg object-cover"
                  />
                  <button className="absolute bottom-2 right-2 bg-purple-600 text-white p-2 rounded-full hover:bg-purple-700 transition shadow-lg">
                    <Camera size={16} />
                  </button>
                </div>

                <div className="mb-4">
                  {/* Name Edit Section */}
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="text-2xl font-bold text-gray-800 border-2 border-purple-300 rounded-lg px-3 py-1 focus:outline-none focus:border-purple-600"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateName}
                        disabled={savingName}
                        className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition disabled:opacity-50"
                      >
                        {savingName ? <Loader size={18} className="animate-spin" /> : <Save size={18} />}
                      </button>
                      <button
                        onClick={() => {
                          setIsEditingName(false);
                          setNewDisplayName(user.displayName || "");
                        }}
                        className="bg-gray-300 text-gray-700 p-2 rounded-lg hover:bg-gray-400 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <h1 className="text-3xl font-bold text-gray-800">
                        {user.displayName || "User"}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="text-purple-600 hover:text-purple-700 transition"
                        title="Edit name"
                      >
                        <Edit3 size={20} />
                      </button>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mt-1">
                    <Shield className="text-purple-600" size={16} />
                    <span className="text-sm font-medium text-purple-600">Verified Member</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => navigate("/orders")}
                  className="flex items-center gap-2 bg-purple-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-purple-700 transition shadow-md"
                >
                  <Package size={18} />
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-red-600 transition shadow-md"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            </div>

            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email Address</p>
                  <p className="text-sm font-semibold text-gray-800">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Calendar className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Member Since</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {new Date(user.metadata?.creationTime).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <User className="text-purple-600" size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Account Type</p>
                  <p className="text-sm font-semibold text-gray-800">Premium User</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`${stat.bgLight} p-2.5 rounded-lg`}>
                  <stat.icon className={stat.textColor} size={22} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-1">{stat.value}</p>
              <p className="text-sm text-gray-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Spending Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-purple-100 p-3 rounded-lg">
                <ShoppingCart className="text-purple-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Total Spending</h3>
                <p className="text-sm text-gray-500">Lifetime value</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-purple-600">₹{stats.totalSpent.toLocaleString()}</p>
          </div>

          {/* Reviews Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star className="text-orange-600" size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Reviews Given</h3>
                <p className="text-sm text-gray-500">Your feedback count</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-orange-600">{stats.reviewsGiven}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/services")}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition"
            >
              <ShoppingCart className="text-purple-600" size={28} />
              <span className="text-sm font-medium text-gray-700">Browse Events</span>
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition"
            >
              <Package className="text-blue-600" size={28} />
              <span className="text-sm font-medium text-gray-700">My Orders</span>
            </button>
            <button
              onClick={() => navigate("/cart")}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition"
            >
              <ShoppingCart className="text-green-600" size={28} />
              <span className="text-sm font-medium text-gray-700">View Cart</span>
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="flex flex-col items-center gap-2 p-4 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition"
            >
              <Mail className="text-orange-600" size={28} />
              <span className="text-sm font-medium text-gray-700">Contact Us</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}