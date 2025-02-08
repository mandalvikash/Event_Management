import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateEvent = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to create an event");
      return;
    }

    try {
      await axios.post(
        "https://event-management-xi-eight.vercel.app/api/events",
        { name, description, date, location },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create event");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-center text-blue-600">Create Event</h2>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <input
            type="text"
            placeholder="Event Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Create Event
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
