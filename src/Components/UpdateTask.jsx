import React from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

function UpdateTask() {
  const task = useLoaderData();
  const navigate = useNavigate();

 const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData.entries());

  fetch(`https://lostfoundserver-five.vercel.app/items/${task._id}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ✅ Important for sending the HttpOnly cookie
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(() => {
      Swal.fire('Success!', 'Task updated successfully.', 'success');
      navigate('/myposts');
    })
    .catch((err) => {
      console.error('Update failed:', err);
      Swal.fire('Error', 'Something went wrong.', 'error');
    });
};

  return (
    <div className="max-w-xl mx-auto bg-base-200 p-6 rounded-xl shadow-lg mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">Update Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input defaultValue={task.title} name="title" className="input input-bordered w-full" placeholder="Title" />
        <select name="category" className="select select-bordered w-full" defaultValue={task.category}>
          <option>Web Development</option>
          <option>Design</option>
          <option>Writing</option>
          <option>Marketing</option>
        </select>
        <textarea defaultValue={task.description} name="description" className="textarea textarea-bordered w-full"></textarea>
        <input type="date" name="deadline" className="input input-bordered w-full" defaultValue={task.deadline} />
        <input type="number" name="budget" className="input input-bordered w-full" defaultValue={task.budget} />
        <input type="email" name="email" readOnly className="input input-bordered w-full bg-gray-100" value={task.email} />
        <input type="text" name="name" readOnly className="input input-bordered w-full bg-gray-100" value={task.name} />
        <button type="submit" className="btn btn-primary w-full">Update</button>
      </form>
    </div>
  );
}

export default UpdateTask;
