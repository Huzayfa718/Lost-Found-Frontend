import React, { useEffect } from "react";
import { useLoaderData, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const items = useLoaderData();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollToFeatured) {
      const el = document.getElementById("featured-items");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  return (
    <div className="space-y-12">
      {/* Banner / Slider */}
     <div className="w-full h-[300px] md:h-[500px] mb-10">
  <div className="carousel w-full h-full">
    {/* Slide 1 */}
    <div id="slide1" className="carousel-item relative w-full">
      <img
        src="https://www.shutterstock.com/image-vector/lost-found-vintage-rusty-metal-260nw-1044510262.jpg"
        className="w-full object-cover"
        alt="Slide 1"
      />
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide3" className="btn btn-circle">❮</a>
        <a href="#slide2" className="btn btn-circle">❯</a>
      </div>
    </div>

    {/* Slide 2 */}
    <div id="slide2" className="carousel-item relative w-full">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbuWwM3vApbo5J7rf-ZJIVz8bwXVr03-DoPg&s"
        className="w-full object-cover"
        alt="Slide 2"
      />
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide1" className="btn btn-circle">❮</a>
        <a href="#slide3" className="btn btn-circle">❯</a>
      </div>
    </div>

    {/* Slide 3 */}
    <div id="slide3" className="carousel-item relative w-full">
      <img
        src="https://hawaiianhumane.org/wp-content/uploads/2023/11/LostWebsiteBanners_BannerImage_1000x300.png"
        className="w-full object-cover"
        alt="Slide 3"
      />
      <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
        <a href="#slide2" className="btn btn-circle">❮</a>
        <a href="#slide1" className="btn btn-circle">❯</a>
      </div>
    </div>
  </div>
</div>



      {/* Extra Section 1: Why Choose WhereIsIt */}
      

      {/* Featured Lost & Found Items Section */}
      <motion.section
        id="featured-items"
        className="max-w-6xl mx-auto px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Latest Lost & Found Items</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map(item => item.status !== "recovered" && (
            <div key={item._id} className="card bg-white shadow-lg p-5 rounded-lg">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p><strong>Category:</strong> {item.category}</p>
              <p><strong>Type:</strong> {item.postType}</p>
              <p><strong>Location:</strong> {item.location}</p>
              <p><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</p>
    <Link to={`/taskdetails/${item._id}`} className="btn btn-primary w-full mt-4">
  View Details
</Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link to="/allItems" className="btn btn-outline btn-primary">
            See All Items
          </Link>
        </div>
      </motion.section>

      <motion.section 
        className="bg-gray-100 py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">Why Choose WhereIsIt?</h2>
          <p className="text-lg max-w-3xl mx-auto">
            We connect lost belongings with their owners quickly and securely. Our platform empowers you to report,
            browse, and recover items with ease and trust.
          </p>
        </div>
      </motion.section>

      {/* Extra Section 2: User Testimonials */}
      <motion.section
        className="py-10"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <div className="max-w-6xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold mb-4">What Our Users Say</h2>
          <p className="text-lg italic max-w-3xl mx-auto">
            "Thanks to WhereIsIt, I found my lost wallet in no time! The platform is easy to use and the community is
            very helpful."
          </p>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;
