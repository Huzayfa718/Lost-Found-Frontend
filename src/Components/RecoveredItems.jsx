// RecoveredItems.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecoveredItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/status/recovered")
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.items || [];
        setItems(list);
      })
      .catch(err => console.error("Failed to fetch recovered items:", err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Recovered Items</h2>
      {items.length === 0 ? (
        <p className="text-center">No recovered items found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(item => (
            <div key={item._id} className="card bg-slate-900 text-white shadow-xl border border-slate-700 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-white">{item.title}</h3>
              <div className="mt-3 space-y-2 text-sm text-slate-200">
                <p><strong className="text-white">Category:</strong> {item.category}</p>
                <p><strong className="text-white">Date Lost:</strong> {item.dateLost ? new Date(item.dateLost).toLocaleDateString() : "N/A"}</p>
                <p><strong className="text-white">Status:</strong> {item.status}</p>
              </div>
              <Link to={`/taskdetails/${item._id}`} className="btn btn-primary w-full mt-5">
                View Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecoveredItems;
