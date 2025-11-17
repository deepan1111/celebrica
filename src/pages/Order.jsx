// src/pages/Orders.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Package, Calendar, IndianRupee } from "lucide-react";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ordersRef = collection(db, "users", user.uid, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const ordersList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Status badge colors
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Loading your orders...
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center font-poppins">
        <Package size={80} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-6">
          You haven't placed any orders. Start shopping now!
        </p>
        <a
          href="/"
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition"
        >
          Browse Services
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-poppins">
      <div className="flex items-center justify-center mb-8">
        <Package size={32} className="text-blue-600 mr-3" />
        <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-xl shadow-lg p-6 hover:shadow-xl transition"
          >
            {/* Order Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 pb-4 border-b">
              <div className="mb-3 md:mb-0">
                <div className="flex items-center text-sm text-gray-500 mb-1">
                  <Calendar size={16} className="mr-2" />
                  <span>Order placed on {formatDate(order.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-400">Order ID: {order.id}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <IndianRupee size={20} className="text-blue-600" />
                  <span className="text-2xl font-bold text-gray-800">
                    {order.totalCost.toLocaleString()}
                  </span>
                </div>
                <span
                  className={`px-4 py-1.5 rounded-full text-sm font-medium ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <p className="text-sm text-gray-600 mb-4 font-medium">
                Items ({order.items.length})
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-sm text-gray-800 mb-1 truncate">
                      {item.title}
                    </h4>
                    <p className="text-blue-600 font-medium text-sm">
                      {item.cost}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}