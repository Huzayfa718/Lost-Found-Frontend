import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function LostFoundItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("https://lostfoundserver-five.vercel.app/items", {
    credentials: 'include'
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error('Failed to fetch items, please login.');
      }
      return res.json();
    })
    .then((data) => {
      const unrecovered = data.filter(
        (item) => item.status === 'lost' || item.status === 'found'
      );
      setItems(unrecovered);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Failed to fetch items:", err);
      setLoading(false);
    });
}, []);

  if (loading) return <p>Loading items...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6 text-center">🧭 Lost & Found Items</h2>
      {items.length === 0 ? (
        <p className="text-center text-gray-600">No lost or found items available.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="card bg-white shadow-lg p-5 rounded-lg">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Status:</strong> {item.status}</p>
              <p><strong>Date:</strong> {item.date || 'N/A'}</p>
              <p><strong>Description:</strong> {item.description}</p>
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

export default LostFoundItems;
