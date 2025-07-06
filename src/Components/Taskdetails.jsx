import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";

function Taskdetails() {
  const task = useLoaderData();
  const [status, setStatus] = useState(task.status || "lost");

const markRecovered = () => {
  fetch(`https://lostfoundserver-five.vercel.app/items/${task._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // ✅ Include the HttpOnly cookie
    body: JSON.stringify({ status: "recovered" }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.modifiedCount > 0) {
        setStatus("recovered");
        Swal.fire("Success", "Item marked as recovered!", "success");
      } else {
        Swal.fire("Info", "No changes made.", "info");
      }
    })
    .catch(() => {
      Swal.fire("Error", "Update failed.", "error");
    });
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold mb-4">{task.title}</h2>
      <p><strong>Category:</strong> {task.category}</p>
      <p><strong>Type:</strong> {task.postType}</p>
      <p><strong>Location:</strong> {task.location}</p>
      <p><strong>Date:</strong> {new Date(task.date).toLocaleDateString()}</p>
      <p><strong>Description:</strong> {task.description}</p>
      <p>
        <strong>Status:</strong>{" "}
        <span className={`font-semibold ${status === "recovered" ? "text-green-600" : "text-red-500"}`}>{status}</span>
      </p>

      <div className="mt-6 space-y-2">
        <p><strong>Posted By:</strong> {task.name}</p>
        <p><strong>Email:</strong> {task.email}</p>
      </div>

      {status !== "recovered" && (
        <button onClick={markRecovered} className="btn btn-success w-full mt-6">
          Mark as Recovered
        </button>
      )}
    </div>
  );
}

export default Taskdetails;
