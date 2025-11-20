// // src/pages/EventDetails.jsx
// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { auth, db } from "../firebase"; // Make sure this path is correct
// import { onAuthStateChanged } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";

// export default function EventDetails() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [event, setEvent] = useState(null);
//   const [user, setUser] = useState(null);
//   const [adding, setAdding] = useState(false);

//   useEffect(() => {
//     // Fetch event data
//     fetch("/servicesData.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const matchedEvent = data.find((item) => item.id === Number(id));
//         setEvent(matchedEvent);
//       })
//       .catch((err) => console.error("Error loading event data:", err));
//   }, [id]);

//   useEffect(() => {
//     // Listen to auth state
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);
//   const handleAddToCart = async () => {
//   if (!user) {
//     alert("Please sign in to add items to your cart.");
//     navigate("/sign-in");
//     return;
//   }
//   console.log("🔍 User ID:", user.uid);
//   console.log("🔍 Event:", event);
//   try {
//     setAdding(true);
//     const cartRef = doc(db, "users", user.uid, "cart", String(event.id));
    
//     console.log("🔍 Writing to path:", cartRef.path);
    
//     await setDoc(cartRef, {
//       id: event.id,
//       title: event.title,
//       image: event.image,
//       cost: event.cost,
//       description: event.description,
//       location: event.location,
//       duration: event.duration,
//       addedAt: new Date().toISOString(),
//     });
    
//     console.log("✅ Successfully added to cart!");
//     alert("Event added to cart!");
//   } catch (err) {
//     console.error("❌ Full error object:", err);
//     console.error("❌ Error code:", err.code);
//     console.error("❌ Error message:", err.message);
//     console.error("❌ Error name:", err.name);
//     alert(`Failed to add to cart: ${err.message}`); // ✅ FIXED: Added opening (
//   } finally {
//     setAdding(false);
//   }
// };

//   // const handleAddToCart = async () => {
//   //   if (!user) {
//   //     alert("Please sign in to add items to your cart.");
//   //     navigate("/sign-in");
//   //     return;
//   //   }

//   //   try {
//   //     setAdding(true);
//   //     const cartRef = doc(db, "users", user.uid, "cart", `event-${event.id}`);
//   //     await setDoc(cartRef, {
//   //       ...event,
//   //       addedAt: new Date(),
//   //     });
//   //     alert("Event added to cart!");
//   //   } catch (err) {
//   //     console.error("Error adding to cart:", err);
//   //     alert("Failed to add to cart.");
//   //   } finally {
//   //     setAdding(false);
//   //   }
//   // };

//   if (!event) {
//     return (
//       <div className="text-center py-20 text-xl text-red-500">
//         Event not found!
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto px-6 py-12 font-poppins">
//       <div className="flex flex-col md:flex-row gap-10 items-center bg-white shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01]">
//         {/* Image */}
//         <img
//           src={event.image}
//           alt={event.title}
//           className="w-full md:w-[45%] h-[300px] object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
//         />

//         {/* Event Content */}
//         <div className="w-full md:w-[55%] p-6 space-y-4">
//           <h2 className="text-3xl font-bold text-gray-800">{event.title}</h2>
//           <p className="text-gray-600 text-base leading-relaxed">{event.description}</p>

//           <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-500">
//             <p>
//               <span className="font-semibold text-gray-700">📍 Location:</span> {event.location}
//             </p>
//             <p>
//               <span className="font-semibold text-gray-700">⏳ Duration:</span> {event.duration}
//             </p>
//           </div>

//           <p className="text-xl font-semibold text-blue-600 mt-4">
//             ₹{event.cost}
//           </p>

//           <button
//             onClick={handleAddToCart}
//             disabled={adding}
//             className="mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {adding ? "Adding..." : "Add to Cart"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );

// }


// src/pages/EventDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore";
import { Star } from "lucide-react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [adding, setAdding] = useState(false);
  
  // Feedback states
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [review, setReview] = useState("");
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);
  const [userHasFeedback, setUserHasFeedback] = useState(false);

  useEffect(() => {
    // Fetch event data
    fetch("/servicesData.json")
      .then((res) => res.json())
      .then((data) => {
        const matchedEvent = data.find((item) => item.id === Number(id));
        setEvent(matchedEvent);
      })
      .catch((err) => console.error("Error loading event data:", err));
  }, [id]);

  useEffect(() => {
    // Listen to auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Fetch all feedbacks for this event
    if (id) {
      fetchFeedbacks();
    }
  }, [id, user]);

  const fetchFeedbacks = async () => {
    try {
      const feedbacksSnap = await getDocs(collection(db, "feedbacks"));
      const eventFeedbacks = [];
      
      feedbacksSnap.forEach((doc) => {
        const data = doc.data();
        if (data.eventId === Number(id)) {
          eventFeedbacks.push({ id: doc.id, ...data });
          
          // Check if current user already submitted feedback
          if (user && data.userId === user.uid) {
            setUserHasFeedback(true);
          }
        }
      });
      
      // Sort by date (newest first)
      eventFeedbacks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setFeedbacks(eventFeedbacks);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };

  const handleAddToCart = async () => {
    if (!user) {
      alert("Please sign in to add items to your cart.");
      navigate("/sign-in");
      return;
    }
    
    try {
      setAdding(true);
      const cartRef = doc(db, "users", user.uid, "cart", String(event.id));
      
      await setDoc(cartRef, {
        id: event.id,
        title: event.title,
        image: event.image,
        cost: event.cost,
        description: event.description,
        location: event.location,
        duration: event.duration,
        addedAt: new Date().toISOString(),
      });
      
      alert("Event added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert(`Failed to add to cart: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    
    if (!user) {
      alert("Please sign in to submit feedback.");
      navigate("/sign-in");
      return;
    }

    if (rating === 0) {
      alert("Please select a rating.");
      return;
    }

    if (userHasFeedback) {
      alert("You have already submitted feedback for this event.");
      return;
    }

    try {
      setSubmittingFeedback(true);
      
      const feedbackRef = doc(collection(db, "feedbacks"));
      await setDoc(feedbackRef, {
        eventId: event.id,
        eventTitle: event.title,
        userId: user.uid,
        userName: user.displayName || user.email,
        userEmail: user.email,
        rating: rating,
        review: review.trim(),
        createdAt: new Date().toISOString(),
      });

      alert("Thank you for your feedback!");
      setRating(0);
      setReview("");
      setUserHasFeedback(true);
      fetchFeedbacks(); // Refresh feedback list
    } catch (error) {
      console.error("Error submitting feedback:", error);
      alert("Failed to submit feedback. Please try again.");
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const renderStars = (currentRating, isInteractive = false) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={isInteractive ? 32 : 20}
            className={`${
              star <= (isInteractive ? (hoveredRating || rating) : currentRating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            } ${isInteractive ? "cursor-pointer transition-all hover:scale-110" : ""}`}
            onClick={isInteractive ? () => setRating(star) : undefined}
            onMouseEnter={isInteractive ? () => setHoveredRating(star) : undefined}
            onMouseLeave={isInteractive ? () => setHoveredRating(0) : undefined}
          />
        ))}
      </div>
    );
  };

  const calculateAverageRating = () => {
    if (feedbacks.length === 0) return 0;
    const sum = feedbacks.reduce((acc, fb) => acc + fb.rating, 0);
    return (sum / feedbacks.length).toFixed(1);
  };

  if (!event) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Event not found!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-poppins">
      {/* Event Details */}
      <div className="flex flex-col md:flex-row gap-10 items-center bg-white shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01] mb-12">
        <img
          src={event.image}
          alt={event.title}
          className="w-full md:w-[45%] h-[300px] object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
        />

        <div className="w-full md:w-[55%] p-6 space-y-4">
          <h2 className="text-3xl font-bold text-gray-800">{event.title}</h2>
          <p className="text-gray-600 text-base leading-relaxed">{event.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-gray-500">
            <p>
              <span className="font-semibold text-gray-700">📍 Location:</span> {event.location}
            </p>
            <p>
              <span className="font-semibold text-gray-700">⏳ Duration:</span> {event.duration}
            </p>
          </div>

          <p className="text-xl font-semibold text-blue-600 mt-4">
            ₹{event.cost}
          </p>

          {/* Average Rating Display */}
          {feedbacks.length > 0 && (
            <div className="flex items-center gap-2 pt-2">
              {renderStars(Math.round(calculateAverageRating()))}
              <span className="text-gray-600 font-medium">
                {calculateAverageRating()} ({feedbacks.length} {feedbacks.length === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          )}

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Rating & Reviews</h3>

        {/* Submit Feedback Form */}
        {!userHasFeedback ? (
          <form onSubmit={handleSubmitFeedback} className="mb-8 pb-8 border-b border-gray-200">
            <h4 className="text-lg font-semibold text-gray-700 mb-4">Leave Your Feedback</h4>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Your Rating <span className="text-red-500">*</span>
              </label>
              {renderStars(rating, true)}
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Your Review (Optional)
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this event..."
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength="500"
              />
              <p className="text-sm text-gray-500 mt-1">{review.length}/500 characters</p>
            </div>

            <button
              type="submit"
              disabled={submittingFeedback || rating === 0}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submittingFeedback ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        ) : (
          <div className="mb-8 pb-8 border-b border-gray-200 bg-green-50 p-4 rounded-lg">
            <p className="text-green-700 font-medium">✓ You have already submitted feedback for this event. Thank you!</p>
          </div>
        )}

        {/* Display All Feedbacks */}
        <div>
          <h4 className="text-lg font-semibold text-gray-700 mb-4">
            All Reviews ({feedbacks.length})
          </h4>

          {feedbacks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No reviews yet. Be the first to review this event!</p>
          ) : (
            <div className="space-y-4">
              {feedbacks.map((feedback) => (
                <div key={feedback.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-800">{feedback.userName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(feedback.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    {renderStars(feedback.rating)}
                  </div>
                  {feedback.review && (
                    <p className="text-gray-700 mt-2">{feedback.review}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}