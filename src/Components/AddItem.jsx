import React, { useContext, useState } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "./Contexts/AuthContext";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function AddItem() {
  const { user } = useContext(AuthContext);
  const [date, setDate] = useState(new Date());
  const [uploading, setUploading] = useState(false);
  const [uploadedThumbnail, setUploadedThumbnail] = useState("");
  const [selectedImages, setSelectedImages] = useState([]);
  const imgbbApiKey = import.meta.env.VITE_IMGBB_API_KEY?.trim();

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const maxFileSize = 8 * 1024 * 1024;
    const invalidFile = files.find((file) => !file.type.startsWith("image/"));
    const oversizedFile = files.find((file) => file.size > maxFileSize);

    if (!imgbbApiKey) {
      Swal.fire({
        icon: "warning",
        title: "Missing image upload key",
        text: "Add VITE_IMGBB_API_KEY to your environment variables first.",
      });
      return;
    }

    if (invalidFile) {
      Swal.fire({
        icon: "warning",
        title: "Invalid file",
        text: "Please choose an image file only.",
      });
      return;
    }

    if (oversizedFile) {
      Swal.fire({
        icon: "warning",
        title: "Image is too large",
        text: "Please upload an image smaller than 8MB.",
      });
      return;
    }

    setSelectedImages(files);
    setUploading(true);

    try {
      const uploadedUrls = await Promise.all(
        files.map(async (file) => {
          const formDataImg = new FormData();
          formDataImg.append("image", file);

          const res = await fetch(
            `https://api.imgbb.com/1/upload?key=${imgbbApiKey}`,
            { method: "POST", body: formDataImg }
          );

          const data = await res.json();
          if (res.ok && data.success) return data.data.display_url || data.data.url;

          const errorMessage =
            data?.error?.message ||
            data?.status_txt ||
            `ImgBB rejected the upload with status ${res.status}`;
          throw new Error(errorMessage);
        })
      );

      setUploadedThumbnail(uploadedUrls[0] || "");
      Swal.fire({
        icon: "success",
        title: "Images uploaded",
        text: "Your image is ready to use.",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Upload failed",
        text: err.message || "Please try again with a different image.",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = Object.fromEntries(formData.entries());

    if (!uploadedThumbnail && !itemData.thumbnail) {
      Swal.fire({
        icon: "warning",
        title: "Image required",
        text: "Please upload an image or provide an image URL.",
      });
      return;
    }

    if (selectedImages.length && !uploadedThumbnail) {
      Swal.fire({
        icon: "warning",
        title: "Upload still in progress",
        text: "Please wait until the image upload completes.",
      });
      return;
    }

    itemData.thumbnail = uploadedThumbnail || itemData.thumbnail;
    itemData.date = date;
    itemData.email = user?.email;
    itemData.name = user?.displayName;
    itemData.photoURL = user?.photoURL;
    itemData.status = "unrecovered";

    try {
      const res = await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(itemData),
      });

      if (!res.ok) throw new Error("Network response was not ok");

      await res.json();

      Swal.fire({
        icon: "success",
        title: "Item Added!",
        text: "Your lost/found post was successfully submitted.",
      });

      setUploadedThumbnail("");
      setSelectedImages([]);
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
            <span className="label-text">Upload Image</span>
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="file-input file-input-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Image URL</span>
          </label>
          <input
            type="url"
            name="thumbnail"
            value={uploadedThumbnail}
            onChange={(e) => setUploadedThumbnail(e.target.value)}
            className="input input-bordered w-full"
            placeholder="Paste image URL or use upload above"
          />
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
            <input type="text" name="name" value={user?.displayName || ""} readOnly className="input input-bordered bg-gray-100 w-full" />
          </div>
          <div>
            <label className="label">
              <span className="label-text">Your Email</span>
            </label>
            <input type="email" name="email" value={user?.email || ""} readOnly className="input input-bordered bg-gray-100 w-full" />
          </div>
        </div>

        {/* Submit */}
        <button type="submit" className="btn btn-primary w-full mt-4" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Post"}
        </button>
      </form>
    </div>
  );
}

export default AddItem;
