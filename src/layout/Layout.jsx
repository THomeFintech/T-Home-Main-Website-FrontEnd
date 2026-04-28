import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

function Layout() {
  return (
    <div className="min-h-screen bg-[#0b1a33] text-white flex flex-col">
      
      {/* NAVBAR */}
      <Navbar />

      {/* 🔥 THIS FIXES YOUR ISSUE */}
      <main className="flex-grow px-[100px]">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* CHATBOT */}
      <Chatbot />
    </div>
  );
}

export default Layout;