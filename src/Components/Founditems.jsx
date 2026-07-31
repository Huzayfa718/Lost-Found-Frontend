import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';

const categories = ['All', 'Documents', 'Electronics', 'Pets', 'Accessories', 'Others'];

function normalize(value) {
  return String(value || '').toLowerCase();
}

function formatDate(date) {
  if (!date) return 'N/A';
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
}

function Founditems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sortBy, setSortBy] = useState('Newest');

  useEffect(() => {
    fetch('http://localhost:5000', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch items, please login.');
        }
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : data?.items || [];
        const foundItems = list.filter(
          (item) => item.postType === 'Found' && item.status === 'unrecovered'
        );
        setItems(foundItems);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch items:', err);
        setItems([]);
        setLoading(false);
      });
  }, []);

  const filteredItems = useMemo(() => {
    const matchedItems = items.filter((item) => {
      const matchesCategory = category === 'All' || normalize(item.category) === normalize(category);
      const searchText = [item.title, item.category, item.location, item.description]
        .map(normalize)
        .join(' ');

      return matchesCategory && searchText.includes(normalize(search));
    });

    return [...matchedItems].sort((a, b) => {
      const firstDate = new Date(a.date || 0).getTime();
      const secondDate = new Date(b.date || 0).getTime();
      return sortBy === 'Oldest' ? firstDate - secondDate : secondDate - firstDate;
    });
  }, [category, items, search, sortBy]);

  if (loading) return <p className="text-center py-10">Loading items...</p>;

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-emerald-950 text-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <p className="text-sm uppercase tracking-widest text-emerald-200 font-semibold">Found reports</p>
          <h2 className="text-3xl md:text-4xl font-extrabold mt-2">Found Items</h2>
          <p className="text-emerald-50 mt-3 max-w-2xl">
            Search items that people have found and reported for their owners.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm mb-8">
          <div className="grid lg:grid-cols-[1fr_220px_180px] gap-4">
            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-slate-800">Search found items</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                type="search"
                placeholder="Try keys, backpack, library, documents..."
                className="input input-bordered w-full bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-emerald-500 focus:outline-emerald-500"
              />
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-slate-800">Category</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="select select-bordered w-full bg-white text-slate-900 border-slate-300 focus:border-emerald-500 focus:outline-emerald-500"
              >
                {categories.map((itemCategory) => (
                  <option key={itemCategory} className="bg-white text-slate-900">
                    {itemCategory}
                  </option>
                ))}
              </select>
            </label>

            <label className="form-control">
              <span className="label-text mb-2 font-semibold text-slate-800">Sort</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="select select-bordered w-full bg-white text-slate-900 border-slate-300 focus:border-emerald-500 focus:outline-emerald-500"
              >
                <option className="bg-white text-slate-900">Newest</option>
                <option className="bg-white text-slate-900">Oldest</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-slate-600">
              Showing {filteredItems.length} of {items.length} found reports
            </p>
            {(search || category !== 'All' || sortBy !== 'Newest') && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setCategory('All');
                  setSortBy('Newest');
                }}
                className="btn btn-sm btn-outline border-slate-300 text-slate-700 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center shadow-sm">
            <h3 className="text-xl font-bold text-slate-950">No found items matched</h3>
            <p className="text-slate-500 mt-2">Try another keyword or category.</p>
            <Link to="/addItems" className="btn btn-success mt-5">
              Report Found Item
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="card bg-slate-900 text-white shadow-xl border border-slate-700 overflow-hidden rounded-xl"
              >
                {item.thumbnail ? (
                  <img src={item.thumbnail} alt={item.title} className="h-48 w-full object-cover" />
                ) : (
                  <div className="h-48 w-full bg-slate-800 flex items-center justify-center text-slate-400">
                    No image available
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                  <div className="space-y-2 text-sm text-slate-200">
                    <p>
                      <strong className="text-white">Category:</strong> {item.category}
                    </p>
                    <p>
                      <strong className="text-white">Status:</strong> {item.status}
                    </p>
                    <p>
                      <strong className="text-white">Date:</strong> {formatDate(item.date)}
                    </p>
                    <p>
                      <strong className="text-white">Location:</strong> {item.location || 'N/A'}
                    </p>
                    <p>
                      <strong className="text-white">Description:</strong> {item.description}
                    </p>
                  </div>
                  <Link to={`/taskdetails/${item._id}`} className="btn btn-primary w-full mt-5">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Founditems;
