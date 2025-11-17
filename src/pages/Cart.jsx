// // src/pages/Cart.jsx
// import { useEffect, useState } from "react";
// import { auth, db } from "../firebase";
// import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
// import { RxCross2 } from "react-icons/rx";

// export default function Cart() {
//   const [cartItems, setCartItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch Cart Items
//   const fetchCart = async () => {
//     const user = auth.currentUser;
//     if (!user) {
//       setCartItems([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       const cartRef = collection(db, "users", user.uid, "cart");
//       const cartSnap = await getDocs(cartRef);
//       const items = cartSnap.docs.map((docSnap) => ({
//         id: docSnap.id,
//         ...docSnap.data(),
//       }));
//       setCartItems(items);
//     } catch (error) {
//       console.error("Error fetching cart items:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // Delete Item from Cart
//   const handleDelete = async (itemId) => {
//     const user = auth.currentUser;
//     if (!user) return;

//     try {
//       await deleteDoc(doc(db, "users", user.uid, "cart", String(itemId)));
//       setCartItems((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   // Calculate Total Cost
//   const totalCost = cartItems.reduce((total, item) => {
//     const cost = parseInt(item.cost.replace(/[^0-9]/g, ""), 10) || 0;
//     return total + cost;
//   }, 0);

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-lg text-gray-600">
//         Loading your cart...
//       </div>
//     );
//   }

//   if (cartItems.length === 0) {
//     return (
//       <div className="text-center py-20 text-lg text-gray-500">
//         Your cart is empty.
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto py-12 px-4 font-poppins">
//       <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
//         🛒 My Cart
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//         {cartItems.map((item) => (
//           <div
//             key={item.id}
//             className="bg-white border rounded-xl shadow-lg overflow-hidden relative group transition-all hover:shadow-2xl"
//           >
//             <img
//               src={item.image}
//               alt={item.title}
//               className="h-48 w-full object-cover"
//             />
//             <div className="p-4 space-y-2">
//               <h3 className="text-lg font-semibold text-gray-800">
//                 {item.title}
//               </h3>
//               <p className="text-blue-600 font-medium">{item.cost}</p>
//             </div>

//             <button
//               onClick={() => handleDelete(item.id)}
//               className="absolute top-3 right-3 text-2xl text-gray-700 hover:text-red-600 transition"
//               title="Remove"
//             >
//               <RxCross2 />
//             </button>
//           </div>
//         ))}
//       </div>

//       {/* Total + Checkout */}
//       <div className="mt-12 border-t pt-6 text-center">
//         <p className="text-2xl font-bold text-gray-800 mb-4">
//           Total: ₹{totalCost.toLocaleString()}
//         </p>
//         <button
//           className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium px-8 py-3 rounded-lg hover:shadow-lg transition"
//           onClick={() => alert("Checkout functionality coming soon...")}
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// }


// src/pages/Cart.jsx
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { RxCross2 } from "react-icons/rx";
import { CheckCircle } from "lucide-react";
import { collection, getDocs, deleteDoc, doc, addDoc } from "firebase/firestore";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processingOrder, setProcessingOrder] = useState(false);

  // Fetch Cart Items
  const fetchCart = async () => {
    const user = auth.currentUser;
    if (!user) {
      setCartItems([]);
      setLoading(false);
      return;
    }

    try {
      const cartRef = collection(db, "users", user.uid, "cart");
      const cartSnap = await getDocs(cartRef);
      const items = cartSnap.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setCartItems(items);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Delete Item from Cart
  const handleDelete = async (itemId) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "cart", String(itemId)));
      setCartItems((prev) => prev.filter((item) => String(item.id) !== String(itemId)));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Calculate Total Cost
  const totalCost = cartItems.reduce((total, item) => {
    const cost = parseInt(item.cost.replace(/[^0-9]/g, ""), 10) || 0;
    return total + cost;
  }, 0);

  // Handle Checkout - Save order to Firebase and clear cart
  const handleCheckout = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setProcessingOrder(true);
    
    try {
      // 1. Create order document in Firestore
      const orderRef = collection(db, "users", user.uid, "orders");
      await addDoc(orderRef, {
        items: cartItems,
        totalCost: totalCost,
        status: "pending",
        createdAt: new Date().toISOString(),
      });

      // 2. Delete all cart items
      const cartRef = collection(db, "users", user.uid, "cart");
      const cartSnap = await getDocs(cartRef);
      const deletePromises = cartSnap.docs.map((docItem) => deleteDoc(docItem.ref));
      await Promise.all(deletePromises);

      // 3. Show success message
      setOrderPlaced(true);
      
      // 4. Clear local cart and close modal after 3 seconds
      setTimeout(() => {
        setCartItems([]);
        setShowCheckoutModal(false);
        setOrderPlaced(false);
      }, 3000);

    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setProcessingOrder(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-lg text-gray-600">
        Loading your cart...
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-20 text-lg text-gray-500">
        Your cart is empty.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4 font-poppins">
      <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">
        🛒 My Cart
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="bg-white border rounded-xl shadow-lg overflow-hidden relative group transition-all hover:shadow-2xl"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {item.title}
              </h3>
              <p className="text-blue-600 font-medium">{item.cost}</p>
            </div>

            <button
              onClick={() => handleDelete(item.id)}
              className="absolute top-3 right-3 text-2xl text-gray-700 hover:text-red-600 transition"
              title="Remove"
            >
              <RxCross2 />
            </button>
          </div>
        ))}
      </div>

      {/* Total + Checkout */}
      <div className="mt-12 border-t pt-6 text-center">
        <p className="text-2xl font-bold text-gray-800 mb-4">
          Total: ₹{totalCost.toLocaleString()}
        </p>
        <button
          className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-medium px-8 py-3 rounded-lg hover:shadow-lg transition"
          onClick={() => setShowCheckoutModal(true)}
        >
          Proceed to Checkout
        </button>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
            {!orderPlaced ? (
              <>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <RxCross2 size={24} />
                </button>

                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  Confirm Your Order
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Order Summary</p>
                    <p className="text-lg font-semibold text-gray-800">
                      {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Total Amount</p>
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{totalCost.toLocaleString()}
                    </p>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      📦 Your order will be saved and cart will be cleared.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCheckoutModal(false)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                    disabled={processingOrder}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={processingOrder}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50"
                  >
                    {processingOrder ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <div className="flex justify-center mb-4">
                  <CheckCircle size={64} className="text-green-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Order Placed! 🎉
                </h3>
                <p className="text-gray-600">
                  Your order has been successfully placed.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}