import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/pages/HomePage";
import AboutUs from "./components/pages/Aboutus";
import Register from "./components/pages/Register";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Categories from "./components/pages/Categories";
import AddBusinessForm from "./components/pages/AddBusinessForm";
import Login from "./components/pages/Login";
import ResetPassword from "./components/pages/ResetPassword";
import Services from "./components/pages/Services";
import BusinessCard from "./components/layout/BusinessCard";
import RazorpayPayment from "./components/layout/razorpay";


const App = () => {
  const handleCategoryChange = (category) => {
    console.log("Selected category:", category);
  };

  
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        {/* Navbar */}
        <Navbar onCategoryChange={handleCategoryChange} />
       

        <main className="flex-grow">
          <Routes>
            <Route path="/razorpay" element={<RazorpayPayment />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/aboutus" element={<AboutUs />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/resetPassword" element={<ResetPassword />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/addform" element={<AddBusinessForm />} />
            <Route path="/businesscard" element={<BusinessCard/>} />
            <Route path="/services" element={<Services />} />
            <Route path="/" element={<Navigate to="/home" />} />
          </Routes>
        </main>

        <RazorpayPayment />
        
        {/* Footer */}
        <Footer />
      </div>
    </Router>
  );
};

export default App;