import React from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
const EventCard = ({ event }) => {
  const navigate=useNavigate();
  const handleDelete = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found! User might not be authenticated.");
      return;
    }

    console.log("Deleting event with ID:", event._id);
    console.log("Token:", token);


    try {
      const response = await fetch(
        `https://event-management-xi-eight.vercel.app/api/events/${event._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json(); // Get error message

      if (response.ok) {
        console.log("Event deleted successfully!");
        window.location.reload();
      } else {
        console.error(
          "Failed to delete event:",
          data.message || response.statusText
        );
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };


  const token = localStorage.getItem("token");
  let loggedInUserId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      loggedInUserId = decoded.id; // Adjust according to your JWT payload structure
    } catch (error) {
      console.error("Invalid token:", error);
    }
  }

  console.log(loggedInUserId)
  console.log(event.createdBy._id)
  const handleUpdate = () => {
    navigate(`/update-event/${event._id}`); // Navigate to the UpdateEvent page
  };


  return (
    <div className="border border-gray-300 p-4 m-4 rounded-lg shadow-md bg-white">
      <div className="flex justify-between">
        <div>
          <h3 className="text-xl font-semibold text-blue-600">{event.name}</h3>
          <p className="text-gray-700 mt-2">{event.description}</p>
          <p className="mt-2 text-gray-600">
            <strong className="text-gray-800">Date:</strong>{" "}
            {new Date(event.date).toLocaleString()}
          </p>
          <p className="mt-2 text-gray-600">
            <strong className="text-gray-800">Location:</strong> {event.location}
          </p>
          <p className="mt-2 text-gray-600">
            <strong className="text-gray-800">Created By:</strong> {event.createdBy.username}
          </p>
        </div>

        {loggedInUserId === event.createdBy._id && (
          <div className="flex items-end">
            <div className="px-3">
              <button className="bg-green-500 text-white px-3 py-1 rounded-full cursor-pointer" onClick={handleUpdate}>
                Update
              </button>
            </div>
            <div>
              <button className="bg-red-500 text-white px-3 py-1 rounded-full cursor-pointer" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;
