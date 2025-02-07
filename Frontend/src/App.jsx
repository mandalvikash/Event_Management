import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
   import Login from "./pages/Login";
   import Register from "./pages/Register";
   import Dashboard from "./pages/Dashboard";
import CreateEvent from "./pages/CreateEvent";
import UpdateEvent from "./pages/UpdateEvent";

   function App() {
     return (
       <Router>
         <Routes>
           <Route path="/" element={<Dashboard />} />
           <Route path="/login" element={<Login />} />
           <Route path="/register" element={<Register />} />
           <Route path="/create-event" element={<CreateEvent />} />
           <Route path="/update-event/:id" element={<UpdateEvent />} />
         </Routes>
       </Router>
     );
   }

   export default App;