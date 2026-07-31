import React, { useContext, useState } from "react";
import { useLoaderData } from "react-router-dom";
import Swal from "sweetalert2";
import { AuthContext } from "./Contexts/AuthContext";
import ChatBox from "./ChatBox";

function Taskdetails() {
  const task = useLoaderData();
  const { user } = useContext(AuthContext);
  const [status, setStatus] = useState(task.status || "lost");

const markRecovered = async () => {
  try {
    const res = await fetch(`http://localhost:5000/${task._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ status: "recovered" }),
    });

    let data = null;
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else if (res.status !== 204) {
      await res.text();
    }

    const isSuccess =
      res.ok &&
      (data?.modifiedCount > 0 ||
        data?.success === true ||
        data?.updatedItem ||
        data?.status === "recovered" ||
        res.status === 200 ||
        res.status === 204);

    if (isSuccess) {
      setStatus("recovered");
      Swal.fire("Success", "Item marked as recovered!", "success");
    } else {
      throw new Error("No changes made.");
    }
  } catch (error) {
    console.error("Recovery update failed:", error);
    Swal.fire("Error", "Update failed. Please try again.", "error");
  }
};

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-200 rounded-lg shadow-lg mt-10">
      {task.thumbnail ? (
        <img
          src={task.thumbnail}
          alt={task.title}
          className="h-64 w-full object-cover rounded-lg mb-6"
        />
      ) : (
        <div className="h-64 w-full bg-slate-300 flex items-center justify-center rounded-lg mb-6 text-slate-600">
          No image available
        </div>
      )}

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

      {user && <ChatBox task={task} currentUser={user} />}
    </div>
  );
}

export default Taskdetails;
