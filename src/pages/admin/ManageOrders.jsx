// src/pages/admin/ManageOrders.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import {
  ShoppingCart,
  Search,
  Calendar,
  IndianRupee,
  Package,
  User,
  ArrowLeft,
  Filter,
} from "lucide-react";

export default function ManageOrders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const statuses = ["all", "pending", "confirmed", "completed", "cancelled"];

  useEffect(() => {
    fetchAllOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on search term and status
    let filtered = orders;

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.items?.some((item) =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    setFilteredOrders(filtered);
  }, [searchTerm, statusFilter, orders]);

  const fetchAllOrders = async () => {
    try {
      const usersSnap = await getDocs(collection(db, "users"));
      const allOrders = [];

      for (const userDoc of usersSnap.docs) {
        const userData = userDoc.data();
        const ordersSnap = await getDocs(
          collection(db, "users", userDoc.id, "orders")
        );

        ordersSnap.forEach((orderDoc) => {
          allOrders.push({
            id: orderDoc.id,
            userId: userDoc.id,
            userName: userData.displayName || "Unknown User",
            userEmail: userData.email || "N/A",
            ...orderDoc.data(),
          });
        });
      }

      // Sort by date (newest first)
      allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setOrders(allOrders);
      setFilteredOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, userId, newStatus) => {
    setUpdatingStatus(true);
    try {
      await updateDoc(doc(db, "users", userId, "orders", orderId), {
        status: newStatus,
      });

      // Update local state
      setOrders(
        orders.map((order) =>
          order.id === orderId && order.userId === userId
            ? { ...order, status: newStatus }
            : order
        )
      );

      if (selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }

      toast.success(`Order status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "confirmed":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const calculateStats = () => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      confirmed: orders.filter((o) => o.status === "confirmed").length,
      completed: orders.filter((o) => o.status === "completed").length,
      revenue: orders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (o.totalCost || 0), 0),
    };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/admin/dashboard")}
                className="p-2 hover:bg-blue-500 rounded-lg transition"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold">Manage Orders</h1>
                <p className="text-blue-100 mt-1">
                  View and update order statuses
                </p>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-blue-100">Total Orders</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-blue-100">Pending</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-blue-100">Confirmed</p>
              <p className="text-2xl font-bold">{stats.confirmed}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-blue-100">Completed</p>
              <p className="text-2xl font-bold">{stats.completed}</p>
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <p className="text-xs text-blue-100">Revenue</p>
              <p className="text-xl font-bold">₹{stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Filter */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by user, order ID, or item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status === "all"
                      ? "All Statuses"
                      : status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchTerm || statusFilter !== "all"
                ? "No orders found"
                : "No orders yet"}
            </h3>
            <p className="text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Customer orders will appear here"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={`${order.userId}-${order.id}`}
                  onClick={() => setSelectedOrder(order)}
                  className={`bg-white rounded-xl shadow-md p-5 cursor-pointer transition-all hover:shadow-lg ${
                    selectedOrder?.id === order.id &&
                    selectedOrder?.userId === order.userId
                      ? "ring-2 ring-blue-500"
                      : "border border-gray-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <User className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {order.userName}
                        </h3>
                        <p className="text-xs text-gray-500">{order.userEmail}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm mb-2">
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar size={14} />
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600 font-semibold">
                      <IndianRupee size={16} />
                      <span>{order.totalCost?.toLocaleString()}</span>
                    </div>
                  </div>

                  <p className="text-xs text-gray-400">Order ID: {order.id}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    {order.items?.length} item(s)
                  </p>
                </div>
              ))}
            </div>

            {/* Order Details */}
            <div className="lg:sticky lg:top-8 h-fit">
              {selectedOrder ? (
                <div className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800">
                      Order Details
                    </h2>
                    <span
                      className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() +
                        selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Order ID</p>
                      <p className="font-mono text-sm">{selectedOrder.id}</p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Customer</p>
                      <p className="font-semibold">{selectedOrder.userName}</p>
                      <p className="text-sm text-gray-600">
                        {selectedOrder.userEmail}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold">
                        {formatDate(selectedOrder.createdAt)}
                      </p>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">Total Cost</p>
                      <div className="flex items-center gap-1 text-2xl font-bold text-blue-600">
                        <IndianRupee size={20} />
                        <span>
                          {selectedOrder.totalCost?.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Update Status */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Update Order Status
                    </label>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        handleStatusUpdate(
                          selectedOrder.id,
                          selectedOrder.userId,
                          e.target.value
                        )
                      }
                      disabled={updatingStatus}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                    >
                      {statuses
                        .filter((s) => s !== "all")
                        .map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                    </select>
                  </div>

                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                      <Package size={18} />
                      Order Items ({selectedOrder.items?.length})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex gap-4 bg-gray-50 p-3 rounded-lg"
                        >
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-800 mb-1">
                              {item.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                              {item.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <p className="text-blue-600 font-medium text-sm">
                                {item.cost}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <Package size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    Select an Order
                  </h3>
                  <p className="text-gray-500">
                    Click on an order to view full details and update status
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}