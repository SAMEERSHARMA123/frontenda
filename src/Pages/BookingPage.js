import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BookAppointment() {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    mobile: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  // Fetch available slots on mount
  useEffect(() => {
    const fetchSlots = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const res = await axios.get("https://appoint-kjul.onrender.com/api/slots", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // res.data is an object: {"08:00 AM": {...}, ...}
        const slots = Object.entries(res.data)
          .filter(([_, v]) => !v.isFull)
          .map(([k]) => k);
        setAvailableSlots(slots);
      } catch (err) {
        setAvailableSlots([]);
      }
    };
    fetchSlots();
  }, []);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Select a date";
    if (!formData.time) newErrors.time = "Select a time slot";
    if (!formData.name) newErrors.name = "Enter your name";
    if (!/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = "Enter valid 10-digit mobile number";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validate()) {
    return alert("Please fix the errors before submitting");
  }

  try {
    const token = sessionStorage.getItem("token");
    
    if (!token) {
      alert("Please login first!");
      navigate("/login");
      return;
    }

    console.log("Submitting form data:", formData);

    const results = await axios.post(
      "https://appoint-kjul.onrender.com/api/bookings/booking",
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    console.log("Booking response:", results.data);
    alert("Booking successful!");
    navigate("/my-appointments");
    
  } catch (err) {
    console.error("Booking error:", err);
    
    if (err.response?.status === 400) {
      alert(err.response.data.message || "Bad request - please check your input");
    } else if (err.response?.status === 401) {
      alert("Please login again");
      navigate("/login");
    } else if (err.response?.status === 500) {
      alert("Server error - please try again later");
    } else {
      alert("Booking failed! Please try again.");
    }
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">
          Book an Appointment
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Date Picker */}
          <div>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.date && (
              <p className="text-red-500 text-sm mt-1">{errors.date}</p>
            )}
          </div>

          {/* Time Picker */}
          <div>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-orange outline-none"
            >
              <option value="">Select Time Slot</option>
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <option key={slot} value={slot}>{slot}</option>
                ))
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
            {errors.time && (
              <p className="text-red-500 text-sm mt-1">{errors.time}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
            {errors.mobile && (
              <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>
            )}
          </div>

          {/* Message */}
          <div>
            <textarea
              name="message"
              placeholder="Reason for visit (optional)"
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-black text-white dark:bg-white dark:text-black py-2 rounded-lg font-medium hover:opacity-90 transition"
          >
            Book Now
          </button>
        </form>
      </motion.div>
    </div>
  );
}
