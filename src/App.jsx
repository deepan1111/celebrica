


import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Categories from './pages/Categories';
import Contact from './pages/Contact';
import Orders from "./pages/Order";

import Layout from './components/Layout';
import Home from './pages/Home';
import Services from './pages/Services';
import SignIn from './pages/SignIn';
import EventDetails from './pages/EventDetails';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import ForgotPassword from "./components/ForgetPassword"; 

import './App.css'
import AdminDashboard from './pages/admin/AdminDashboard';

import AdminSignIn from './pages/admin/AdimnSignin';
import AdminSignUp from './pages/admin/AdminSignup';
import ManageUsers from './pages/admin/ManageUsers';
import AdminRoute from './components/AdminRoute';
import ManageContacts from './pages/admin/ManageContacts';
import ManageOrders from './pages/admin/ManageOrders';
// Create a wrapper component to use useLocation
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <Layout hideNavbar={isAdminRoute}>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/categories" element={<Categories/>}/>
        <Route path="/services" element={<Services/>}/>
        <Route path="/contact" element={<Contact/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/event/:id" element={<EventDetails/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/cart" element={<Cart/>}/>
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/orders" element={<Orders />} />
        
        {/* Admin Routes */}
        <Route path="/admin/sign-in" element={<AdminSignIn/>}/> 
        <Route path="/admin/sign-up" element={<AdminSignUp/>}/>
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <AdminDashboard/>
            </AdminRoute>
          }
        />
        <Route 
          path="/admin/users" 
          element={
            <AdminRoute>
              <ManageUsers/>
            </AdminRoute>
          }
        />
         <Route 
          path="/admin/contacts" 
          element={
            <AdminRoute>
              <ManageContacts/>
            </AdminRoute>
          }
        /> 
          <Route 
          path="/admin/orders" 
          element={
            <AdminRoute>
              <ManageOrders/>
            </AdminRoute>
          }
        />
      </Routes>
    </Layout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;


// src/App.js (UPDATED)
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Categories from './pages/Categories';
// import Contact from './pages/Contact';
// import Orders from "./pages/Order";
// import Layout from './components/Layout';
// import Home from './pages/Home';
// import Services from './pages/Services';
// import SignIn from './pages/SignIn';
// import EventDetails from './pages/EventDetails';
// import SignUp from './pages/SignUp';
// import Profile from './pages/Profile';
// import Cart from './pages/Cart';

// // Admin imports
// // import AdminSignIn from './pages/admin/AdminSignIn';
// import AdminSignUp from './pages/admin/AdminSignup';
// // import AdminDashboard from './pages/admin/AdminDashboard';
// // import ManageUsers from './pages/admin/ManageUsers';
// // import ManageOrders from './pages/admin/ManageOrders';
// // import ManageContacts from './pages/admin/ManageContacts';
// // import AdminRoute from './components/AdminRoute';

// import './App.css'

// function App() {
//   return(
//     <BrowserRouter>
//       <Routes>
//         {/* Regular User Routes */}
//         <Route path="/" element={<Layout><Home/></Layout>}/>
//         <Route path="/categories" element={<Layout><Categories/></Layout>}/>
//         <Route path="/services" element={<Layout><Services/></Layout>}/>
//         <Route path="/contact" element={<Layout><Contact/></Layout>}/>
//         <Route path="/sign-in" element={<SignIn/>}/>
//         <Route path="/sign-up" element={<SignUp/>}/>
//         <Route path="/event/:id" element={<Layout><EventDetails/></Layout>}/>
//         <Route path="/profile" element={<Layout><Profile/></Layout>}/>
//         <Route path="/cart" element={<Layout><Cart/></Layout>}/>
//         <Route path="/orders" element={<Layout><Orders /></Layout>} />

//         {/* Admin Routes - Public */}
//         {/* <Route path="/admin/sign-in" element={<AdminSignIn/>}/> */}
//         <Route path="/admin/sign-up" element={<AdminSignUp/>}/>

//         {/* Admin Routes - Protected */}
//         {/* <Route 
//           path="/admin/dashboard" 
//           element={
//             <AdminRoute>
//               <AdminDashboard/>
//             </AdminRoute>
//           }
//         />
//         <Route 
//           path="/admin/users" 
//           element={
//             <AdminRoute>
//               <ManageUsers/>
//             </AdminRoute>
//           }
//         />
//         <Route 
//           path="/admin/orders" 
//           element={
//             <AdminRoute>
//               <ManageOrders/>
//             </AdminRoute>
//           }
//         />
//         <Route 
//           path="/admin/contacts" 
//           element={
//             <AdminRoute>
//               <ManageContacts/>
//             </AdminRoute>
//           }
//         /> */}
//       </Routes>
//     </BrowserRouter>
//   )
// }

// export default App