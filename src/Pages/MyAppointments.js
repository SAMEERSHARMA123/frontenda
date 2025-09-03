import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState([]);

  const user = JSON.parse(sessionStorage.getItem("user"));
  const token = sessionStorage.getItem("token");

  const allboking = async () => {
    if (!user || !user.email) {
      return alert("Please login first");
    }

    try {
      const result = await axios.get(
        `https://appoint-kjul.onrender.com/api/bookings/allbookings?email=${encodeURIComponent(
          user.email
        )}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Token bhejna zaroori hai
          },
        },
       
        
      );
 console.log(user.email)
      // Backend data ko frontend state ke format me map kar rahe hain
      const mappedAppointments = result.data.map((item) => ({
        id: item._id,
        date: new Date(item.createdAt).toLocaleDateString(),
        time: new Date(item.createdAt).toLocaleTimeString(),
        status: "Confirmed", // agar backend status field bheje to yahan use karo
        message: item.message,
        mobile: item.mobile,
        slot: item.slot,
      }));

      setAppointments(mappedAppointments);
    } catch (err) {
      console.log(err.response?.data || err.message);
    }
  };

  useEffect(() => {
    allboking();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = (id) => {
    setAppointments((prev) =>
      prev.map((appt) =>
        appt.id === id && appt.status !== "Cancelled"
          ? { ...appt, status: "Cancelled" }
          : appt
      )
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black dark:bg-black dark:text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl p-8 rounded-2xl shadow-xl bg-white dark:bg-gray-900"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">My Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-center text-gray-500">
            No appointments booked yet.
          </p>
        ) : (
          <div className="space-y-4">
            {appointments.map((appt) => (
              <motion.div
                key={appt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
              >
                <div>
                  <p className="font-medium">
                    {appt.date} at {appt.time}
                  </p>
                  <p className="text-sm text-gray-400">Mobile: {appt.mobile}</p>
                  <p className="text-sm text-gray-400">Message: {appt.message}</p>
                  <p className="text-sm text-gray-400">Slot: {appt.slot}</p>

                  <p
                    className={`text-sm mt-1 ${
                      appt.status === "Confirmed"
                        ? "text-green-500"
                        : appt.status === "Pending"
                        ? "text-yellow-500"
                        : "text-red-500"
                    }`}
                  >
                    {appt.status}
                  </p>
                </div>

                {appt.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancel(appt.id)}
                    className="mt-3 sm:mt-0 px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
