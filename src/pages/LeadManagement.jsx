import React, { useEffect, useState } from "react";
import { api } from "../lib/supabase";

export default function LeadManagement() {
  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api.fetchLeads().then(setLeads);
  }, []);

  // Status counts
  const statusCounts = {
    new: leads.filter((l) => l.status.toLowerCase() === "new").length,
    contacted: leads.filter((l) => l.status.toLowerCase() === "contacted").length,
    notInterested: leads.filter((l) => l.status.toLowerCase() === "not interested").length,
    inProgress: leads.filter((l) => l.status.toLowerCase() === "in progress").length,
  };

  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);

  const filteredLeads = leads.filter(
    (lead) =>
      lead.full_name.toLowerCase().includes(search.toLowerCase()) ||
      lead.status.toLowerCase().includes(search.toLowerCase())
  );

  // Pie Chart Calculations
  const pieData = [
    { label: "New", value: statusCounts.new, color: "#3b82f6" },
    { label: "Contacted", value: statusCounts.contacted, color: "#22c55e" },
    { label: "Not Interested", value: statusCounts.notInterested, color: "#ef4444" },
    { label: "In Progress", value: statusCounts.inProgress, color: "#eab308" },
  ];

  const radius = 70;
  const circumference = 2 * Math.PI * radius;

  let startOffset = 0;

  // Status badge color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "contacted":
        return "bg-green-100 text-green-800";
      case "not interested":
        return "bg-red-100 text-red-800";
      case "in progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight">
        Lead Management Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { title: "New Leads", value: statusCounts.new, color: "text-blue-700" },
          { title: "Contacted", value: statusCounts.contacted, color: "text-green-700" },
          { title: "Not Interested", value: statusCounts.notInterested, color: "text-red-700" },
          { title: "In Progress", value: statusCounts.inProgress, color: "text-yellow-700" },
        ].map((item, i) => (
          <div key={i} className="bg-white p-5 rounded-xl shadow hover:shadow-md transition">
            <p className="text-sm text-gray-500">{item.title}</p>
            <h3 className={`text-3xl font-bold ${item.color}`}>{item.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-10">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Lead Distribution (Pie Chart)
          </h3>

          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle cx="100" cy="100" r={radius} fill="transparent" stroke="#e5e7eb" strokeWidth="25" />

            {pieData.map((item, index) => {
              const percentage = total === 0 ? 0 : item.value / total;
              const strokeDasharray = circumference * percentage;
              const strokeDashoffset = circumference - startOffset;

              startOffset += strokeDasharray;

              return (
                <circle
                  key={index}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="25"
                  strokeDasharray={strokeDasharray + " " + circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              );
            })}
          </svg>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            {pieData.map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }}></div>
                <span>{item.label} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* BAR CHART */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Lead Comparison (Bar Chart)</h3>

          <svg width="100%" height="200">
            {pieData.map((item, index) => {
              const barWidth = 45;
              const gap = 35;
              const x = index * (barWidth + gap);
              const maxHeight = Math.max(...pieData.map((d) => d.value), 1);
              const height = (item.value / maxHeight) * 140;
              const y = 150 - height;

              return (
                <g key={index}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={height}
                    fill={item.color}
                    rx="6"
                  />
                  <text
                    x={x + barWidth / 2}
                    y="170"
                    textAnchor="middle"
                    className="text-xs fill-gray-800"
                  >
                    {item.label}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs fill-gray-900 font-semibold"
                  >
                    {item.value}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search leads..."
        className="mb-6 w-full p-3 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Lead Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-lg transition"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-lg text-gray-800">{lead.full_name}</h3>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                  lead.status
                )}`}
              >
                {lead.status}
              </span>
            </div>

            <p className="text-gray-600 text-sm">
              <strong>Email:</strong> {lead.email || "N/A"}
            </p>
            <p className="text-gray-600 text-sm mt-1">
              <strong>Phone:</strong> {lead.phone || "N/A"}
            </p>
          </div>
        ))}

        {filteredLeads.length === 0 && (
          <div className="text-center col-span-full text-gray-500 py-8 text-lg">
            No leads found.
          </div>
        )}
      </div>
    </div>
  );
}
