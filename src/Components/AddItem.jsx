import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "./Contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddItem() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());

const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const itemData = Object.fromEntries(formData.entries());
  itemData.date = date; // attach selected date
  itemData.email = user?.email;
  itemData.name = user?.displayName;
  itemData.photoURL = user?.photoURL;

  try {
    const res = await fetch("https://lostfoundserver-five.vercel.app/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Important: send cookie for auth
      body: JSON.stringify(itemData),
    });

    if (!res.ok) throw new Error('Network response was not ok');

    await res.json();

    Swal.fire({
      icon: "success",
      title: "Item Added!",
      text: "Your lost/found post was successfully submitted.",
    });

    e.target.reset();

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Failed to add the item. Please try again.",
    });
  }
};

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Add Lost/Found Item</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Post Type */}
        <div>
          <label className="label">
            <span className="label-text">Post Type</span>
          </label>
          <select name="postType" className="select select-bordered w-full" required defaultValue="">
            <option disabled value="">Select type</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>
        </div>

        {/* Thumbnail */}
        <div>
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input type="url" name="thumbnail" className="input input-bordered w-full" required />
        </div>

        {/* Title */}
        <div>
          <label className="label">
            <span className="label-text">Item Title</span>
          </label>
          <input type="text" name="title" className="input input-bordered w-full" required />
        </div>

        {/* Description */}
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea name="description" className="textarea textarea-bordered w-full" required />
        </div>

        {/* Category */}
        <div>
          <label className="label">
            <span className="label-text">Category</span>
          </label>
          <select name="category" className="select select-bordered w-full" defaultValue="" required>
            <option disabled value="">Select a category</option>
            <option>Documents</option>
            <option>Electronics</option>
            <option>Pets</option>
            <option>Accessories</option>
            <option>Others</option>
          </select>
        </div>

        {/* Location */}
        <div>
          <label className="label">
            <span className="label-text">Location (where lost/found)</span>
          </label>
          <input type="text" name="location" className="input input-bordered w-full" required />
        </div>

        {/* Date */}
        <div>
          <label className="label">
            <span className="label-text">Date Lost/Found</span>
          </label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="input input-bordered w-full"
            dateFormat="yyyy-MM-dd"
            required
          />
        </div>

        {/* Read-only User Info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">
              <span className="label-text">Your Name</span>
            </label>
            <input type="text" name="name" value={user?.displayName || ''} readOnly className="input input-bordered bg-gray-100 w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <input type="email" name="email" value={user?.email || ''} readOnly className="input input-bordered bg-gray-100 w-full" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full mt-4">
          Add Post
        </button>
      </form>
    </div>
  );
}

export default AddItem;
