// src/pages/EventDetails.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase"; // Make sure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [adding, setAdding] = useState(false);

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
  const handleAddToCart = async () => {
  if (!user) {
    alert("Please sign in to add items to your cart.");
    navigate("/sign-in");
    return;
  }
  console.log("🔍 User ID:", user.uid);
  console.log("🔍 Event:", event);
  try {
    setAdding(true);
    const cartRef = doc(db, "users", user.uid, "cart", String(event.id));
    
    console.log("🔍 Writing to path:", cartRef.path);
    
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
    
    console.log("✅ Successfully added to cart!");
    alert("Event added to cart!");
  } catch (err) {
    console.error("❌ Full error object:", err);
    console.error("❌ Error code:", err.code);
    console.error("❌ Error message:", err.message);
    console.error("❌ Error name:", err.name);
    alert(`Failed to add to cart: ${err.message}`); // ✅ FIXED: Added opening (
  } finally {
    setAdding(false);
  }
};

  // const handleAddToCart = async () => {
  //   if (!user) {
  //     alert("Please sign in to add items to your cart.");
  //     navigate("/sign-in");
  //     return;
  //   }

  //   try {
  //     setAdding(true);
  //     const cartRef = doc(db, "users", user.uid, "cart", `event-${event.id}`);
  //     await setDoc(cartRef, {
  //       ...event,
  //       addedAt: new Date(),
  //     });
  //     alert("Event added to cart!");
  //   } catch (err) {
  //     console.error("Error adding to cart:", err);
  //     alert("Failed to add to cart.");
  //   } finally {
  //     setAdding(false);
  //   }
  // };

  if (!event) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Event not found!
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 font-poppins">
      <div className="flex flex-col md:flex-row gap-10 items-center bg-white shadow-xl rounded-2xl overflow-hidden transition-transform hover:scale-[1.01]">
        {/* Image */}
        <img
          src={event.image}
          alt={event.title}
          className="w-full md:w-[45%] h-[300px] object-cover rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none"
        />

        {/* Event Content */}
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

          <button
            onClick={handleAddToCart}
            disabled={adding}
            className="mt-6 bg-gradient-to-r from-green-600 to-green-700 text-white font-medium px-6 py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );

}
