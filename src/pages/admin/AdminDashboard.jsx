// // src/pages/admin/AdminDashboard.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { auth, db } from "../../firebase";
// import { collection, getDocs } from "firebase/firestore";
// import { signOut } from "firebase/auth";
// import { toast } from "react-hot-toast";
// import {
//   Users,
//   Package,
//   Mail,
//   ShoppingCart,
//   LogOut,
//   TrendingUp,
//   IndianRupee,
// } from "lucide-react";

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [stats, setStats] = useState({
//     totalUsers: 0,
//     totalOrders: 0,
//     totalRevenue: 0,
//     pendingOrders: 0,
//     totalContacts: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchDashboardStats();
//   }, []);

//   const fetchDashboardStats = async () => {
//     try {
//       // Fetch all users
//       const usersSnap = await getDocs(collection(db, "users"));
//       const totalUsers = usersSnap.size;

//       // Fetch all orders from all users
//       let totalOrders = 0;
//       let totalRevenue = 0;
//       let pendingOrders = 0;

//       for (const userDoc of usersSnap.docs) {
//         const ordersSnap = await getDocs(
//           collection(db, "users", userDoc.id, "orders")
//         );
//         totalOrders += ordersSnap.size;

//         ordersSnap.forEach((orderDoc) => {
//           const orderData = orderDoc.data();
//           totalRevenue += orderData.totalCost || 0;
//           if (orderData.status === "pending") {
//             pendingOrders++;
//           }
//         });
//       }

//       // Fetch contacts
//       const contactsSnap = await getDocs(collection(db, "contacts"));
//       const totalContacts = contactsSnap.size;

//       setStats({
//         totalUsers,
//         totalOrders,
//         totalRevenue,
//         pendingOrders,
//         totalContacts,
//       });
//     } catch (error) {
//       console.error("Error fetching dashboard stats:", error);
//       toast.error("Failed to load dashboard stats");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       toast.success("Logged out successfully");
//       navigate("/admin/sign-in");
//     } catch (error) {
//       toast.error("Error logging out");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-100">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600 text-lg">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   const statCards = [
//     {
//       title: "Total Users",
//       value: stats.totalUsers,
//       icon: Users,
//       color: "bg-blue-500",
//       link: "/admin/users",
//     },
//     {
//       title: "Total Orders",
//       value: stats.totalOrders,
//       icon: ShoppingCart,
//       color: "bg-green-500",
//       link: "/admin/orders",
//     },
//     {
//       title: "Pending Orders",
//       value: stats.pendingOrders,
//       icon: Package,
//       color: "bg-yellow-500",
//       link: "/admin/orders",
//     },
//     {
//       title: "Total Revenue",
//       value: `₹${stats.totalRevenue.toLocaleString()}`,
//       icon: IndianRupee,
//       color: "bg-purple-500",
//       link: "/admin/orders",
//     },
//     {
//       title: "Contact Messages",
//       value: stats.totalContacts,
//       icon: Mail,
//       color: "bg-red-500",
//       link: "/admin/contacts",
//     },
//   ];

//   const quickActions = [
//     {
//       title: "Manage Users",
//       description: "View and manage all registered users",
//       icon: Users,
//       link: "/admin/users",
//       color: "text-blue-600 bg-blue-50",
//     },
//     {
//       title: "Manage Orders",
//       description: "View and update order statuses",
//       icon: ShoppingCart,
//       link: "/admin/orders",
//       color: "text-green-600 bg-green-50",
//     },
//     {
//       title: "View Contacts",
//       description: "Check customer inquiries",
//       icon: Mail,
//       link: "/admin/contacts",
//       color: "text-red-600 bg-red-50",
//     },


//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 font-poppins">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
//         <div className="max-w-7xl mx-auto px-4 py-6">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold">Admin Dashboard</h1>
//               <p className="text-blue-100 mt-1">
//                 Welcome back, {auth.currentUser?.displayName || "Admin"}
//               </p>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
//             >
//               <LogOut size={18} />
//               Logout
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 py-8">
//         {/* Stats Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
//           {statCards.map((stat, index) => (
//             <Link
//               key={index}
//               to={stat.link}
//               className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200"
//             >
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-gray-500 text-sm font-medium">
//                     {stat.title}
//                   </p>
//                   <p className="text-2xl font-bold text-gray-800 mt-2">
//                     {stat.value}
//                   </p>
//                 </div>
//                 <div className={`${stat.color} p-3 rounded-lg`}>
//                   <stat.icon className="text-white" size={24} />
//                 </div>
//               </div>
//             </Link>
//           ))}
//         </div>

//         {/* Quick Actions */}
//         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
//           <div className="flex items-center gap-2 mb-6">
//             <TrendingUp className="text-blue-600" size={24} />
//             <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             {quickActions.map((action, index) => (
//               <Link
//                 key={index}
//                 to={action.link}
//                 className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group"
//               >
//                 <div
//                   className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}
//                 >
//                   <action.icon size={24} />
//                 </div>
//                 <h3 className="text-lg font-semibold text-gray-800 mb-2">
//                   {action.title}
//                 </h3>
//                 <p className="text-gray-600 text-sm">{action.description}</p>
//               </Link>
//             ))}
//           </div>
//         </div>

//         {/* Welcome Message */}
//         <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
//           <h3 className="text-lg font-semibold text-gray-800 mb-2">
//             👋 Welcome to the Admin Panel
//           </h3>
//           <p className="text-gray-600">
//             Manage your event management platform efficiently. Use the quick
//             actions above to navigate to different sections.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }


// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { toast } from "react-hot-toast";
import {
  Users,
  Package,
  Mail,
  ShoppingCart,
  LogOut,
  TrendingUp,
  IndianRupee,
  Star,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    pendingOrders: 0,
    totalContacts: 0,
    totalReviews: 0,
    averageRating: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Fetch all users
      const usersSnap = await getDocs(collection(db, "users"));
      const totalUsers = usersSnap.size;

      // Fetch all orders from all users
      let totalOrders = 0;
      let totalRevenue = 0;
      let pendingOrders = 0;

      for (const userDoc of usersSnap.docs) {
        const ordersSnap = await getDocs(
          collection(db, "users", userDoc.id, "orders")
        );
        totalOrders += ordersSnap.size;

        ordersSnap.forEach((orderDoc) => {
          const orderData = orderDoc.data();
          totalRevenue += orderData.totalCost || 0;
          if (orderData.status === "pending") {
            pendingOrders++;
          }
        });
      }

      // Fetch contacts
      const contactsSnap = await getDocs(collection(db, "contacts"));
      const totalContacts = contactsSnap.size;

      // Fetch feedbacks
      const feedbacksSnap = await getDocs(collection(db, "feedbacks"));
      const totalReviews = feedbacksSnap.size;
      
      let totalRating = 0;
      feedbacksSnap.forEach((doc) => {
        totalRating += doc.data().rating || 0;
      });
      const averageRating = totalReviews > 0 ? (totalRating / totalReviews).toFixed(1) : 0;

      setStats({
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrders,
        totalContacts,
        totalReviews,
        averageRating,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard stats");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/admin/sign-in");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: Users,
      color: "bg-blue-500",
      link: "/admin/users",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: "bg-green-500",
      link: "/admin/orders",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Package,
      color: "bg-yellow-500",
      link: "/admin/orders",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: IndianRupee,
      color: "bg-purple-500",
      link: "/admin/orders",
    },
    {
      title: "Contact Messages",
      value: stats.totalContacts,
      icon: Mail,
      color: "bg-red-500",
      link: "/admin/contacts",
    },
    {
      title: "Total Reviews",
      value: stats.totalReviews,
      icon: Star,
      color: "bg-orange-500",
      link: "/admin/feedbacks",
    },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage all registered users",
      icon: Users,
      link: "/admin/users",
      color: "text-blue-600 bg-blue-50",
    },
    {
      title: "Manage Orders",
      description: "View and update order statuses",
      icon: ShoppingCart,
      link: "/admin/orders",
      color: "text-green-600 bg-green-50",
    },
    {
      title: "View Contacts",
      description: "Check customer inquiries",
      icon: Mail,
      link: "/admin/contacts",
      color: "text-red-600 bg-red-50",
    },
    {
      title: "View Feedbacks",
      description: "Check customer reviews and ratings",
      icon: Star,
      link: "/admin/feedbacks",
      color: "text-orange-600 bg-orange-50",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1">
                Welcome back, {auth.currentUser?.displayName || "Admin"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition font-medium"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-800 mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="text-white" size={24} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Average Rating Card */}
        {stats.totalReviews > 0 && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-orange-200 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  ⭐ Average Customer Rating
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-orange-600">
                    {stats.averageRating}
                  </span>
                  <span className="text-gray-600">out of 5.0</span>
                </div>
                <p className="text-gray-600 mt-2">
                  Based on {stats.totalReviews} customer {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
              <Star className="text-orange-500" size={64} fill="currentColor" />
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-800">Quick Actions</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all group"
              >
                <div
                  className={`inline-flex p-3 rounded-lg ${action.color} mb-4 group-hover:scale-110 transition-transform`}
                >
                  <action.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            👋 Welcome to the Admin Panel
          </h3>
          <p className="text-gray-600">
            Manage your event management platform efficiently. Use the quick
            actions above to navigate to different sections.
          </p>
        </div>
      </div>
    </div>
  );
}