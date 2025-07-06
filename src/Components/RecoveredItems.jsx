// RecoveredItems.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function RecoveredItems() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetch("https://lostfoundserver-five.vercel.app/items/status/recovered")
      .then(res => res.json())
      .then(data => setItems(data))
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
            <div key={item._id} className="card bg-white shadow-lg p-5 rounded-lg">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Date Lost:</strong> {item.dateLost ? new Date(item.dateLost).toLocaleDateString() : "N/A"}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <Link to={`/taskdetails/${item._id}`} className="btn btn-primary w-full mt-4">
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
