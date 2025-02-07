const express = require("express");
   const Event = require("../models/Event");
   const auth = require("../middleware/auth");
   const jwt = require("jsonwebtoken");
   const router = express.Router();


   router.post("/", auth, async (req, res) => {
     const { name, description, date, location } = req.body;
     try {
       const event = new Event({ name, description, date, location, createdBy: req.user.id });
       await event.save();
       res.status(201).json(event);
     } catch (err) {
       res.status(400).json({ error: err.message });
     }
   });

   router.get("/", async (req, res) => {
     try {
       const events = await Event.find().populate("createdBy", "username");
       res.json(events);
     } catch (err) {
       res.status(500).json({ error: err.message });
     }
   });



router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    try {
       
        const token = req.headers.authorization?.split(" ")[1]; 
        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }

     
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        console.log("User ID from token:", userId);

        const event = await Event.findById(id);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        console.log("Event Creator ID:", event.createdBy.toString());
        console.log("User Attempting Delete:", userId);

        
        if (event.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this event" });
        }

        
        await Event.findByIdAndDelete(id);
        res.json({ message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.put("/:id", auth, async (req, res) => {
  const { id } = req.params;
  const { name, description, date, location } = req.body;

  try {
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this event" });
    }

   
    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    await event.save();
    res.json({ message: "Event updated successfully", event });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});


   module.exports = router;