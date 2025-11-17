import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import './App.css'

function App() {

  return(
    <BrowserRouter>
     <Layout>
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
        
      <Route path="/orders" element={<Orders />} />

        {/* Add more routes as needed */}
      </Routes>
     </Layout>
    </BrowserRouter>
  )
  
}

export default App
