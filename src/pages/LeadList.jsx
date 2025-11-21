import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/supabase";

export default function LeadList() {
  const [leads, setLeads] = useState([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    api.fetchLeads().then(setLeads);
  }, []);

  const filtered = leads.filter(
    (l) =>
      l.full_name.toLowerCase().includes(q.toLowerCase()) ||
      l.phone.includes(q)
  );

  // Count status for insights
  const countStatus = (status) =>
    leads.filter((l) => l.status.toLowerCase() === status).length;

  const total = leads.length;
  const newCount = countStatus("new");
  const contactedCount = countStatus("contacted");
  const progressCount = countStatus("in progress");
  const notInterestedCount = countStatus("not interested");

  // Donut chart % values
  const percent = (count) => (total ? (count / total) * 100 : 0);

  // Status color styles
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-700";
      case "contacted":
        return "bg-green-100 text-green-700";
      case "in progress":
        return "bg-yellow-100 text-yellow-700";
      case "not interested":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h2 className="text-4xl font-extrabold mb-6 text-gray-900 tracking-tight">
        Lead Insights & Management
      </h2>

      {/* ---------------------- INSIGHTS SECTION ---------------------- */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">
        {/* Donut Chart */}
        <div className="bg-white p-6 shadow-lg rounded-2xl flex flex-col items-center justify-center">
          <h3 className="text-xl font-semibold mb-4">Lead Status Overview</h3>

          <svg width="200" height="200" viewBox="0 0 42 42" className="donut">
            <circle
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke="#e5e7eb"
              strokeWidth="6"
            ></circle>

            {/* NEW */}
            <circle
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke="#3b82f6"
              strokeWidth="6"
              strokeDasharray={`${percent(newCount)} ${100 - percent(newCount)}`}
              strokeDashoffset="25"
            ></circle>

            {/* CONTACTED */}
            <circle
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke="#22c55e"
              strokeWidth="6"
              strokeDasharray={`${percent(contactedCount)} ${100 - percent(contactedCount)}`}
              strokeDashoffset={25 - percent(newCount)}
            ></circle>

            {/* IN PROGRESS */}
            <circle
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke="#eab308"
              strokeWidth="6"
              strokeDasharray={`${percent(progressCount)} ${100 - percent(progressCount)}`}
              strokeDashoffset={25 - percent(newCount + contactedCount)}
            ></circle>

            {/* NOT INTERESTED */}
            <circle
              r="15.915"
              cx="21"
              cy="21"
              fill="transparent"
              stroke="#ef4444"
              strokeWidth="6"
              strokeDasharray={`${percent(notInterestedCount)} ${100 - percent(notInterestedCount)}`}
              strokeDashoffset={25 - percent(newCount + contactedCount + progressCount)}
            ></circle>
          </svg>

          {/* Legend */}
          <div className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span> New: {newCount}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-green-500"></span> Contacted: {contactedCount}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-yellow-500"></span> In Progress: {progressCount}
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500"></span> Not Interested: {notInterestedCount}
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Total Leads", value: total, color: "bg-gray-800 text-white" },
            { label: "New Leads", value: newCount, color: "bg-blue-100 text-blue-800" },
            { label: "Contacted", value: contactedCount, color: "bg-green-100 text-green-800" },
            { label: "In Progress", value: progressCount, color: "bg-yellow-100 text-yellow-800" },
          ].map((card, index) => (
            <div
              key={index}
              className={`${card.color} p-6 rounded-xl shadow-md text-center font-semibold text-lg`}
            >
              {card.label}
              <div className="text-3xl mt-1 font-bold">{card.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------- SEARCH BAR ---------------------- */}
      <input
        type="text"
        placeholder="Search leads by name or phone..."
        className="w-full p-3 mb-6 rounded-xl border shadow-sm focus:ring-2 focus:ring-indigo-400 outline-none"
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />

      {/* ---------------------- LEAD CARDS ---------------------- */}
      <div className="space-y-4">
        {filtered.map((lead) => (
          <Link
            key={lead.id}
            to={`/leads/${lead.id}`}
            className="block bg-white p-5 rounded-xl shadow-sm border hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">{lead.full_name}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  📞 {lead.phone || "N/A"}
                </p>
                <p className="text-gray-600 text-sm">
                  📧 {lead.email || "N/A"}
                </p>
              </div>

              <span
                className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>
          </Link>
        ))}

        {filtered.length === 0 && (
          <div className="text-gray-500 text-center py-10">No leads found.</div>
        )}
      </div>
    </div>
  );
}
