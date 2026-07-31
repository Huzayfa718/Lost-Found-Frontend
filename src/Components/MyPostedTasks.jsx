import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { AuthContext } from './Contexts/AuthContext';

function MyPostedTasks() {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;

    fetch('http://localhost:5000')
      .then(res => res.json())
      .then(data => {
        const list = Array.isArray(data) ? data : data?.items || [];
        const filtered = list.filter(
          task => task.email === user.email || task.name === user.displayName
        );
        setTasks(filtered);
      })
      .catch(err => {
        console.error('Error fetching tasks:', err);
      });
  }, [user]);

  const handleDelete = (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:5000/${id}`, {
        method: 'DELETE',
        credentials: 'include', // ✅ Include the token cookie
      })
        .then(res => res.json())
        .then(() => {
          setTasks(prevTasks => prevTasks.filter(task => task._id !== id));
          Swal.fire('Deleted!', 'Your task has been deleted.', 'success');
        })
        .catch(err => {
          console.error('Delete error:', err);
          Swal.fire('Error', 'Failed to delete task. Please try again.', 'error');
        });
    }
  });
};


  return (
    <div className="max-w-6xl mx-auto h-[500px] p-6">
      <h2 className="text-3xl font-bold text-center mb-6">My Posted Items</h2>
      <table className="table w-full">
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Date Lost</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-4">
                No items found.
              </td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task._id}>
                <td>{task.title}</td>
                <td>{task.category}</td>
                <td>{task.dateLost ? new Date(task.dateLost).toLocaleDateString() : 'N/A'}</td>
                <td className="space-x-2">
                  <Link to={`/updatetask/${task._id}`} className="btn btn-sm btn-warning">
                    Update
                  </Link>
                  <button onClick={() => handleDelete(task._id)} className="btn btn-sm btn-error">
                    Delete
                  </button>
                  <button className="btn btn-sm btn-info">Bids</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default MyPostedTasks;
