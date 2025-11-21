import React, { useEffect, useState } from "react";
import { api } from "../lib/supabase";

export default function Dashboard() {
  const [leads, setLeads] = useState([]);

  useEffect(() => {
    api.fetchLeads().then(setLeads);
  }, []);

  // Count leads by status
  const byStatus = leads.reduce((acc, lead) => {
    acc[lead.status] = (acc[lead.status] || 0) + 1;
    return acc;
  }, {});

  const totalLeads = leads.length;

  // Colors for status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "#3b82f6";
      case "contacted":
        return "#22c55e";
      case "in progress":
        return "#facc15";
      case "not interested":
        return "#ef4444";
      default:
        return "#9ca3af";
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-gray-100">
      
      {/* ⭐ PRODUCT ANALYTICS TITLE ADDED HERE */}
      <h1 className="text-5xl font-extrabold mb-3 text-indigo-400 tracking-wide drop-shadow-xl">
        Product Analytics
      </h1>

      <h2 className="text-4xl font-extrabold mb-8 text-white tracking-wide drop-shadow-lg">
        Dashboard
      </h2>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 text-gray-900">
          <p className="text-sm text-gray-500">Total Leads</p>
          <h3 className="text-5xl font-extrabold text-indigo-600 mt-2">
            {totalLeads}
          </h3>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 text-gray-900 col-span-2">
          <p className="text-sm text-gray-500 mb-4">Status Summary</p>

          <ul className="space-y-4">
            {Object.entries(byStatus).map(([status, count]) => {
              const percent = ((count / totalLeads) * 100).toFixed(0);
              return (
                <li key={status}>
                  <div className="flex justify-between mb-1">
                    <span className="font-semibold capitalize">{status}</span>
                    <span className="font-bold text-indigo-700">{count}</span>
                  </div>

                  <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
                    <div
                      style={{
                        width: `${percent}%`,
                        backgroundColor: getStatusColor(status),
                      }}
                      className="h-3 rounded-full transition-all duration-700"
                    ></div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ------------------ DONUT CHART ------------------ */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 text-gray-900">
        <p className="text-sm text-gray-500 mb-4">Lead Status Donut Chart</p>

        <div className="flex justify-center">
          <svg width="260" height="260" viewBox="0 0 32 32">
            {(() => {
              const total = Object.values(byStatus).reduce((a, b) => a + b, 0);
              let cumulative = 0;

              return Object.entries(byStatus).map(([status, count]) => {
                const percentage = count / total;
                const start = cumulative * 100;
                const dash = `${percentage * 100} ${100 - percentage * 100}`;
                cumulative += percentage;

                return (
                  <circle
                    key={status}
                    r="12"
                    cx="16"
                    cy="16"
                    fill="transparent"
                    stroke={getStatusColor(status)}
                    strokeWidth="6"
                    strokeDasharray={dash}
                    strokeDashoffset={-start}
                    style={{ transition: "all 1s ease" }}
                  />
                );
              });
            })()}
          </svg>
        </div>

        <div className="grid grid-cols-2 gap-3 mt-6">
          {Object.entries(byStatus).map(([status, count]) => (
            <div key={status} className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getStatusColor(status) }}
              ></span>
              <span className="font-semibold capitalize">
                {status}: {count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------ LINE GRAPH ------------------ */}
      <div className="mt-8 bg-white p-6 rounded-2xl shadow-xl hover:scale-105 transition-all duration-300 text-gray-900">
        <p className="text-sm text-gray-500 mb-4">Lead Trend Graph</p>

        <div className="flex justify-center">
          <svg width="100%" height="200" viewBox="0 0 300 200">
            {[40, 80, 120, 160].map((y) => (
              <line key={y} x1="20" x2="280" y1={y} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            ))}

            {Object.entries(byStatus).map(([status, count], idx) => {
              const x = 40 + idx * 60;
              const y = 170 - count * 20;

              return (
                <g key={status}>
                  <circle cx={x} cy={y} r="5" fill={getStatusColor(status)} />

                  <text x={x} y={185} textAnchor="middle" fontSize="12" fill="#333">
                    {status}
                  </text>

                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="#000"
                    fontWeight="bold"
                  >
                    {count}
                  </text>
                </g>
              );
            })}

            <polyline
              fill="none"
              stroke="#4f46e5"
              strokeWidth="3"
              points={Object.entries(byStatus)
                .map(([status, count], idx) => {
                  const x = 40 + idx * 60;
                  const y = 170 - count * 20;
                  return `${x},${y}`;
                })
                .join(" ")}
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
