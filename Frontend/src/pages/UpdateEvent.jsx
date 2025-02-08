import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState({ name: "", description: "", date: "", location: "" });
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(""); 

  
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`https://event-management-xi-eight.vercel.app/api/events/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch event details.");
        }
        const data = await response.json();
        setEvent(data); 
      } catch (err) {
        console.error("Error fetching event:", err);
        setError("Failed to load event details. Please try again later.");
      } finally {
        setLoading(false); 
      }
    };
    fetchEvent();
  }, [id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEvent((prevEvent) => ({
      ...prevEvent,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token"); 

    if (!token) {
      setError("You must be logged in to update an event.");
      return;
    }

    try {
      const response = await fetch(`https://event-management-xi-eight.vercel.app/api/events/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify(event), 
      });

      if (response.ok) {
        navigate("/"); 
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update event."); 
      }
    } catch (err) {
      console.error("Error updating event:", err);
      setError("An error occurred while updating the event.");
    }
  };


  if (loading) {
    return <div className="p-6 text-center">Loading event details...</div>;
  }


  if (error) {
    return <div className="p-6 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold text-blue-500 mb-4">Update Event</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md bg-white p-6 shadow-md rounded">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={event.name}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded"
            placeholder="Enter event name"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            name="description"
            value={event.description}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded"
            placeholder="Enter event description"
            rows="4"
            required
          />
        </div>
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Event Date</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={event.date}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded"
            required
          />
        </div>
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={event.location}
            onChange={handleChange}
            className="mt-1 block w-full border p-2 rounded"
            placeholder="Enter event location"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Update Event
        </button>
      </form>
    </div>
  );
};

export default UpdateEvent;
