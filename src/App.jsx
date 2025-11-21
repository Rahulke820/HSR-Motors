import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import LeadList from "./pages/LeadList";
import LeadDetails from "./pages/LeadDetails";
import LeadManagement from "./pages/LeadManagement";

export default function App() {
  return (
    <div>
      <header className="bg-gray-500 shadow">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between">
          <h1 className="font-bold text-xl">HSR MOTORS </h1>
          <nav className="space-x-4 height-full flex items-center text-gray-200">
            <Link to="/" className="hover:text-white-500">Dashboard</Link>
            <Link to="/leads" className="hover:text-white-500">Leads</Link>
            <Link to="/manage" className="hover:text-white-500">Manage</Link>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadList />} />
          <Route path="/leads/:id" element={<LeadDetails />} />
          <Route path="/manage" element={<LeadManagement />} />
        </Routes>
      </main>
    </div>
  );
}