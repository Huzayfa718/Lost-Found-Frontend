import React, { useEffect, useMemo, useState } from "react";
import { useLoaderData, Link, useLocation, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

const categories = ["All", "Documents", "Electronics", "Pets", "Accessories", "Others"];

function formatDate(date) {
  if (!date) return "N/A";
  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? date : parsed.toLocaleDateString();
}

function normalize(value) {
  return String(value || "").toLowerCase();
}

function ItemCard({ item, compact = false }) {
  return (
    <div className="bg-white border border-slate-200 shadow-sm overflow-hidden rounded-lg">
      {item.thumbnail ? (
        <img src={item.thumbnail} alt={item.title} className="h-44 w-full object-cover" />
      ) : (
        <div className="h-44 w-full bg-slate-100 flex items-center justify-center text-slate-500">
          No image available
        </div>
      )}
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <span
            className={`badge ${
              item.postType === "Lost" ? "badge-error" : "badge-success"
            } badge-outline`}
          >
            {item.postType || "Item"}
          </span>
          <span className="text-xs text-slate-500">{formatDate(item.date)}</span>
        </div>
        <h3 className="mt-3 text-lg font-bold text-slate-950 line-clamp-1">{item.title}</h3>
        {!compact && (
          <p className="mt-2 text-sm text-slate-600 line-clamp-2">
            {item.description || "No description added yet."}
          </p>
        )}
        <div className="mt-4 space-y-1 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">Category:</span> {item.category || "N/A"}
          </p>
          <p>
            <span className="font-semibold text-slate-900">Location:</span> {item.location || "N/A"}
          </p>
        </div>
        <Link to={`/taskdetails/${item._id}`} className="btn btn-neutral btn-sm w-full mt-5">
          View Details
        </Link>
      </div>
    </div>
  );
}

function Home() {
  const loadedItems = useLoaderData();
  const items = useMemo(() => (Array.isArray(loadedItems) ? loadedItems : []), [loadedItems]);
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [postType, setPostType] = useState("All");

  useEffect(() => {
    if (location.state?.scrollToFeatured) {
      const el = document.getElementById("featured-items");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const unrecoveredItems = useMemo(
    () => items.filter((item) => item.status !== "recovered"),
    [items]
  );

  const lostItems = useMemo(
    () => unrecoveredItems.filter((item) => item.postType === "Lost"),
    [unrecoveredItems]
  );

  const foundItems = useMemo(
    () => unrecoveredItems.filter((item) => item.postType === "Found"),
    [unrecoveredItems]
  );

  const recoveredItems = useMemo(
    () => items.filter((item) => item.status === "recovered"),
    [items]
  );

  const filteredItems = useMemo(() => {
    return unrecoveredItems.filter((item) => {
      const matchesCategory =
        selectedCategory === "All" || normalize(item.category) === normalize(selectedCategory);
      const matchesType = postType === "All" || item.postType === postType;
      const searchable = [
        item.title,
        item.category,
        item.location,
        item.description,
        item.postType,
      ]
        .map(normalize)
        .join(" ");

      return matchesCategory && matchesType && searchable.includes(normalize(query));
    });
  }, [postType, query, selectedCategory, unrecoveredItems]);

  const urgentItems = useMemo(
    () =>
      unrecoveredItems
        .filter((item) => ["documents", "electronics"].includes(normalize(item.category)))
        .slice(0, 3),
    [unrecoveredItems]
  );

  const activePreviewItems = query || selectedCategory !== "All" || postType !== "All";
  const heroImage =
    items.find((item) => item.thumbnail)?.thumbnail ||
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&q=80";

  return (
    <div className="bg-slate-50 text-slate-900">
      <section className="relative min-h-[520px] overflow-hidden">
        <img src={heroImage} alt="Lost and found items" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
          <motion.div
            className="max-w-3xl text-white"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-sm uppercase tracking-widest text-emerald-200 font-semibold">
              Community lost and found
            </p>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight">
              Lost something? Found something? Reconnect it here.
            </h1>
            <p className="mt-5 text-lg text-slate-100 max-w-2xl">
              Report items, browse recent posts, and help people recover important belongings faster.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/addItems" className="btn btn-success">
                Report an Item
              </Link>
              <Link to="/lostitems" className="btn btn-outline text-white border-white hover:bg-white hover:text-slate-950">
                Browse Lost
              </Link>
              <Link to="/founditems" className="btn btn-outline text-white border-white hover:bg-white hover:text-slate-950">
                Browse Found
              </Link>
            </div>
          </motion.div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
            {[
              ["Active posts", unrecoveredItems.length],
              ["Lost reports", lostItems.length],
              ["Found reports", foundItems.length],
              ["Recovered", recoveredItems.length],
            ].map(([label, value]) => (
              <div key={label} className="bg-white/95 rounded-lg p-4 shadow-sm">
                <p className="text-3xl font-extrabold text-slate-950">{value}</p>
                <p className="text-sm text-slate-600">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-lg shadow-xl border border-slate-200 p-5 md:p-6">
          <div className="grid lg:grid-cols-[1fr_220px_180px] gap-4">
            <label className="form-control">
              <span className="label-text mb-2 font-semibold">Search item, location, or detail</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Try wallet, ID card, campus, phone..."
                className="input input-bordered w-full bg-white text-slate-900 placeholder:text-slate-400 border-slate-300 focus:border-blue-500 focus:outline-blue-500"
              />
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-semibold">Category</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="select select-bordered w-full bg-white text-slate-900 border-slate-300 focus:border-blue-500 focus:outline-blue-500"
              >
                {categories.map((category) => (
                  <option key={category} className="bg-white text-slate-900">
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-control">
              <span className="label-text mb-2 font-semibold">Type</span>
              <select
                value={postType}
                onChange={(event) => setPostType(event.target.value)}
                className="select select-bordered w-full bg-white text-slate-900 border-slate-300 focus:border-blue-500 focus:outline-blue-500"
              >
                <option className="bg-white text-slate-900">All</option>
                <option className="bg-white text-slate-900">Lost</option>
                <option className="bg-white text-slate-900">Found</option>
              </select>
            </label>
          </div>

          {activePreviewItems && (
            <div className="mt-6" id="featured-items">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2 className="text-xl font-bold">Matching Items</h2>
                <p className="text-sm text-slate-500">{filteredItems.length} results</p>
              </div>
              {filteredItems.length ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredItems.slice(0, 6).map((item) => (
                    <ItemCard key={item._id} item={item} compact />
                  ))}
                </div>
              ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 text-center">
                  <h3 className="font-bold text-amber-950">No matching items found</h3>
                  <p className="text-sm text-amber-800 mt-2">
                    Try a different keyword or post the item so the community can help.
                  </p>
                  <Link to="/addItems" className="btn btn-warning btn-sm mt-4">
                    Add Item
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
          <div>
            <p className="text-sm uppercase tracking-widest text-emerald-700 font-semibold">Quick browse</p>
            <h2 className="text-3xl font-extrabold">Find by category</h2>
          </div>
          <Link to="/addItems" className="btn btn-neutral">
            Post New Item
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.slice(1).map((category) => {
            const count = unrecoveredItems.filter(
              (item) => normalize(item.category) === normalize(category)
            ).length;
            return (
              <button
                type="button"
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setPostType("All");
                  document.getElementById("featured-items")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="text-left bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:border-emerald-500 hover:shadow-md transition"
              >
                <span className="text-lg font-bold text-slate-950">{category}</span>
                <span className="block mt-2 text-sm text-slate-500">{count} active posts</span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="grid lg:grid-cols-2 gap-10">
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-extrabold">Latest Lost Items</h2>
                <Link to="/lostitems" className="link link-success font-semibold">
                  View all
                </Link>
              </div>
              {lostItems.length ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {lostItems.slice(0, 4).map((item) => (
                    <ItemCard key={item._id} item={item} compact />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <h3 className="font-bold">No lost items posted yet</h3>
                  <p className="text-sm text-slate-500 mt-2">Start by reporting a missing item.</p>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-2xl font-extrabold">Latest Found Items</h2>
                <Link to="/founditems" className="link link-success font-semibold">
                  View all
                </Link>
              </div>
              {foundItems.length ? (
                <div className="grid sm:grid-cols-2 gap-5">
                  {foundItems.slice(0, 4).map((item) => (
                    <ItemCard key={item._id} item={item} compact />
                  ))}
                </div>
              ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-8 text-center">
                  <h3 className="font-bold">No found items posted yet</h3>
                  <p className="text-sm text-slate-500 mt-2">Help someone by reporting what you found.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8">
          <div className="bg-emerald-950 text-white rounded-lg p-8">
            <p className="text-sm uppercase tracking-widest text-emerald-200 font-semibold">How it works</p>
            <h2 className="text-3xl font-extrabold mt-3">A clearer path from missing to returned.</h2>
            <div className="grid md:grid-cols-3 gap-5 mt-8">
              {[
                ["1", "Post details", "Add a photo, category, location, and date."],
                ["2", "Compare matches", "Browse similar lost and found reports."],
                ["3", "Recover safely", "Use item details and chat before meeting."],
              ].map(([step, title, text]) => (
                <div key={step} className="bg-white/10 border border-white/15 rounded-lg p-5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-300 text-slate-950 font-bold">
                    {step}
                  </span>
                  <h3 className="font-bold mt-4">{title}</h3>
                  <p className="text-sm text-emerald-50 mt-2">{text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg p-8 shadow-sm">
            <p className="text-sm uppercase tracking-widest text-amber-700 font-semibold">Priority watch</p>
            <h2 className="text-2xl font-extrabold mt-3">Important items needing attention</h2>
            <div className="mt-6 space-y-4">
              {urgentItems.length ? (
                urgentItems.map((item) => (
                  <Link
                    key={item._id}
                    to={`/taskdetails/${item._id}`}
                    className="block border border-slate-200 rounded-lg p-4 hover:border-amber-500 transition"
                  >
                    <div className="flex justify-between gap-4">
                      <h3 className="font-bold text-slate-950">{item.title}</h3>
                      <span className="badge badge-warning badge-outline">{item.category}</span>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">{item.location || "Location not added"}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  No document or electronics alerts right now.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 py-14 grid lg:grid-cols-3 gap-8">
          <div>
            <p className="text-sm uppercase tracking-widest text-emerald-300 font-semibold">Recovered stories</p>
            <h2 className="text-3xl font-extrabold mt-3">Every recovery builds trust.</h2>
            <p className="text-slate-300 mt-4">
              Highlighting recovered posts shows new users that the platform is active and worth using.
            </p>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-3 gap-4">
            {(recoveredItems.length ? recoveredItems.slice(0, 3) : unrecoveredItems.slice(0, 3)).map((item) => (
              <div key={item._id} className="bg-white/10 border border-white/10 rounded-lg p-5">
                <span className="badge badge-success badge-outline">
                  {item.status === "recovered" ? "Recovered" : item.postType}
                </span>
                <h3 className="font-bold mt-4">{item.title}</h3>
                <p className="text-sm text-slate-300 mt-2">
                  {item.location || "Shared by the community"}
                </p>
              </div>
            ))}
            {!items.length && (
              <div className="md:col-span-3 bg-white/10 border border-white/10 rounded-lg p-8 text-center">
                <h3 className="font-bold">No stories yet</h3>
                <p className="text-sm text-slate-300 mt-2">
                  The first posted item will appear here automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            ["Use clear photos", "Upload a sharp image and avoid sharing sensitive document numbers."],
            ["Add exact context", "Mention the nearest place, date, color, brand, and unique marks."],
            ["Meet carefully", "Confirm ownership details and choose a public place for handover."],
          ].map(([title, text]) => (
            <div key={title} className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-lg font-bold">{title}</h3>
              <p className="text-sm text-slate-600 mt-2">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;
