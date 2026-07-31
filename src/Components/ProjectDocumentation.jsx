import React from "react";

const ProjectDocumentation = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Lost & Found Fullstack Project Documentation</h1>
        <p className="text-lg text-slate-600">
          A full-stack web application for reporting, tracking, and recovering lost and found items.
        </p>
      </div>

      <section className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Project Overview</h2>
        <p>
          This application helps users post lost or found items, view listings, mark items as recovered,
          and communicate through a built-in chat feature. The project is divided into a React frontend and
          an Express backend connected to MongoDB and Firebase Authentication.
        </p>
      </section>

      <section className="grid md:grid-cols-2 gap-6">
        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3">Frontend</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Built with React and Vite</li>
            <li>Uses React Router for page navigation</li>
            <li>Implements Firebase-based authentication</li>
            <li>Displays lost, found, and recovered item cards</li>
            <li>Supports item detail pages and task updates</li>
            <li>Includes a chatbox component for item-related conversations</li>
          </ul>
        </div>

        <div className="card bg-base-100 shadow-md p-6">
          <h3 className="text-xl font-semibold mb-3">Backend</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Built with Express.js</li>
            <li>Runs API routes through Vercel serverless entry points</li>
            <li>Connects to MongoDB for storing items and chats</li>
            <li>Uses Firebase Admin SDK for token verification</li>
            <li>Provides CRUD APIs for task management</li>
            <li>Supports chat conversation and message APIs</li>
          </ul>
        </div>
      </section>

      <section className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Main Features</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">Item Posting</h4>
            <p className="text-sm text-slate-600">Users can create lost/found item posts with images, descriptions, and location.</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">Item Listing</h4>
            <p className="text-sm text-slate-600">Lost and found items are displayed in categorized views.</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">Recovery Tracking</h4>
            <p className="text-sm text-slate-600">Items can be marked as recovered and shown in a dedicated recovered section.</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">Authentication</h4>
            <p className="text-sm text-slate-600">Protected routes and secure user sessions are handled through Firebase.</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">Chatbox</h4>
            <p className="text-sm text-slate-600">Users can open conversations related to an item and send messages.</p>
          </div>
          <div className="bg-base-100 p-4 rounded-lg">
            <h4 className="font-semibold">MongoDB Storage</h4>
            <p className="text-sm text-slate-600">Persistent data is stored in MongoDB collections for items and chat threads.</p>
          </div>
        </div>
      </section>

      <section className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Project Structure</h2>
        <pre className="bg-base-100 p-4 rounded-lg overflow-x-auto text-sm">
{`frontend/
  src/
    Components/
      AddItem.jsx
      Home.jsx
      Taskdetails.jsx
      ChatBox.jsx
      ...
    Routes/
      Routes.jsx
    Login/
    Register/
backend/
  api/
    index.js
  package.json
  vercel.json`}
        </pre>
      </section>

      <section className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>A user registers or logs in with Firebase.</li>
          <li>The user posts a lost or found item through the frontend form.</li>
          <li>The frontend sends the data to the backend API.</li>
          <li>The backend stores the record in MongoDB.</li>
          <li>Other users can browse the item, open task details, and use chat.</li>
          <li>When an item is recovered, its status is updated in the database.</li>
        </ol>
      </section>

      <section className="card bg-base-200 shadow-xl p-6">
        <h2 className="text-2xl font-semibold mb-4">Technology Stack</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold">Frontend</h4>
            <p className="text-sm text-slate-600">React, Vite, React Router, Firebase Auth, Tailwind/DaisyUI-style components.</p>
          </div>
          <div>
            <h4 className="font-semibold">Backend</h4>
            <p className="text-sm text-slate-600">Node.js, Express.js, MongoDB, Firebase Admin SDK, CORS, Cookie Parser.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProjectDocumentation;
