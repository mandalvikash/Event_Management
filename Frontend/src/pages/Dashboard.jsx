import React, { useEffect, useState } from "react";
import axios from "axios";
import EventCard from "./EventCard";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("https://event-management-2k1n2ooyn-vikash-mandals-projects.vercel.app");
        setEvents(response.data);
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const eventCreate=(ev)=>{
    navigate("/create-event");
  }


  if (loading) return <p className="text-center text-gray-600">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-semibold text-center text-blue-600">Event Dashboard</h2>
        <div className="flex items-center gap-3">
        <button
          onClick={eventCreate}
          className="px-6 py-2 text-white bg-blue-500 hover:bg-blue-700 rounded-md shadow-md transition duration-300"
        >
          Create Event
        </button>
        <button
          onClick={logout}
          className="px-6 py-2 text-white bg-red-500 hover:bg-red-700 rounded-md shadow-md transition duration-300"
        >
          Logout
        </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {events.map((event) => (
          <EventCard  key={event._id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
