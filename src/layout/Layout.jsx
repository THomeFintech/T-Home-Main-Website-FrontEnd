import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Chatbot from "../components/Chatbot";

function Layout() {
  return (
    <div
      className="min-h-screen text-white flex flex-col"
      style={{
        background:
          "radial-gradient(1200px 680px at 20% -10%, rgba(90,140,255,0.18), transparent 62%), radial-gradient(980px 580px at 100% 0%, rgba(36,107,198,0.14), transparent 60%), linear-gradient(180deg, #071327 0%, #08162b 100%)",
      }}
    >
      
      {/* NAVBAR */}
      <Navbar />

      {/* 🔥 THIS FIXES YOUR ISSUE */}
      <main className="flex-grow px-4 sm:px-6 lg:px-16">
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