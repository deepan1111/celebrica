// src/pages/admin/AdminFeedbacks.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { toast } from "react-hot-toast";
import { Star, Trash2, ArrowLeft, Search, Filter } from "lucide-react";

export default function AdminFeedbacks() {
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("all");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const feedbacksSnap = await getDocs(collection(db, "feedbacks"));
      const feedbacksList = [];

      feedbacksSnap.forEach((doc) => {
        feedbacksList.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      // Sort by date (newest first)
      feedbacksList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbacks(feedbacksList);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      toast.error("Failed to load feedbacks");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (feedbackId) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) {
      return;
    }

    try {
      await deleteDoc(doc(db, "feedbacks", feedbackId));
      toast.success("Feedback deleted successfully");
      fetchFeedbacks();
    } catch (error) {
      console.error("Error deleting feedback:", error);
      toast.error("Failed to delete feedback");
    }
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={18}
            className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
          />
        ))}
      </div>
    );
  };

  const calculateStats = () => {
    const total = feedbacks.length;
    const avgRating = total > 0
      ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / total).toFixed(1)
      : 0;

    const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
      rating,
      count: feedbacks.filter((fb) => fb.rating === rating).length,
      percentage: total > 0 ? ((feedbacks.filter((fb) => fb.rating === rating).length / total) * 100).toFixed(0) : 0,
    }));

    return { total, avgRating, ratingDistribution };
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.eventTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.review?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRating =
      filterRating === "all" || feedback.rating === parseInt(filterRating);

    return matchesSearch && matchesRating;
  });

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading feedbacks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-poppins">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="flex items-center gap-2 text-white hover:text-orange-100 mb-4 transition"
          >
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold">Customer Feedbacks & Reviews</h1>
          <p className="text-orange-100 mt-1">
            Manage and monitor customer feedback
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Total Reviews</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stats.total}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Star className="text-orange-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium">Average Rating</p>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-3xl font-bold text-gray-800">{stats.avgRating}</p>
                  <span className="text-gray-500 text-sm">/ 5.0</span>
                </div>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Star className="text-yellow-600" size={24} fill="currentColor" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <p className="text-gray-500 text-sm font-medium mb-3">Rating Distribution</p>
            <div className="space-y-2">
              {stats.ratingDistribution.map((item) => (
                <div key={item.rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700 w-6">{item.rating}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 w-12 text-right">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by event, user, or review..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
          </div>
        </div>

        {/* Feedbacks List */}
        {filteredFeedbacks.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Star className="mx-auto text-gray-300 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No feedbacks found</h3>
            <p className="text-gray-500">
              {searchTerm || filterRating !== "all"
                ? "Try adjusting your search or filters"
                : "Customer reviews will appear here"}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFeedbacks.map((feedback) => (
              <div
                key={feedback.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {feedback.eventTitle}
                      </h3>
                      {renderStars(feedback.rating)}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>👤 {feedback.userName}</span>
                      <span>📧 {feedback.userEmail}</span>
                      <span>
                        📅{" "}
                        {new Date(feedback.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(feedback.id)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition"
                    title="Delete feedback"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>

                {feedback.review && (
                  <div className="bg-gray-50 rounded-lg p-4 mt-3">
                    <p className="text-gray-700 leading-relaxed">{feedback.review}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}