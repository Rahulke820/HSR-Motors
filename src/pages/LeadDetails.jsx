import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../lib/supabase";

export default function LeadDetails() {
  const { id } = useParams();
  const [lead, setLead] = useState(null);
  const [activities, setActivities] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    api.fetchLeadById(id).then(setLead);
    api.fetchActivities(id).then(setActivities);
    api.fetchStatusHistory(id).then(setHistory);
  }, [id]);

  if (!lead)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );

  // Function to assign badge color for lead status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-200 text-blue-800";
      case "contacted":
        return "bg-green-200 text-green-800";
      case "in progress":
        return "bg-yellow-200 text-yellow-800";
      case "not interested":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-gray-50 via-purple-50 to-pink-50">
      <h2 className="text-3xl font-bold mb-6 text-gray-900">{lead.full_name}</h2>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Lead Info */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xl mb-4">Lead Info</h3>
          <p className="text-sm mb-2"><strong>Phone:</strong> {lead.phone}</p>
          <p className="text-sm mb-2"><strong>Email:</strong> {lead.email}</p>
          <p className="text-sm mb-2">
            <strong>Status:</strong>{" "}
            <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(lead.status)}`}>
              {lead.status}
            </span>
          </p>
          <p className="text-sm mb-2"><strong>Source:</strong> {lead.source}</p>
        </div>

        {/* Activities */}
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
          <h3 className="font-semibold text-xl mb-4">Activities</h3>
          {activities.length > 0 ? (
            <div className="space-y-4">
              {activities.map((a) => (
                <div key={a.id} className="border-l-4 border-blue-400 pl-3 py-2 bg-gray-50 rounded">
                  <div className="flex justify-between">
                    <span className="font-medium">{a.type}</span>
                    <span className="text-xs text-gray-500">{a.outcome}</span>
                  </div>
                  <div className="text-sm mt-1">{a.note}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No activities found.</p>
          )}
        </div>
      </div>

      {/* Status History */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
        <h3 className="font-semibold text-xl mb-4">Status History</h3>
        {history.length > 0 ? (
          <ul className="relative border-l border-gray-300 pl-6">
            {history.map((h, index) => (
              <li key={h.id} className="mb-6">
                <span className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1.5"></span>
                <p className="text-sm">
                  <span className="font-medium">{h.previous_status}</span> ➜{" "}
                  <span className="font-semibold">{h.new_status}</span>
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No status history available.</p>
        )}
      </div>
    </div>
  );
}
  