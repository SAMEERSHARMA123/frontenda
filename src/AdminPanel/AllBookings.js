import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, Calendar, Eye, X } from "lucide-react";
import axios from "axios";

export default function AdminBookings() {
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings for admin
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = sessionStorage.getItem("token");
        const response = await axios.get("https://appoint-kjul.onrender.com/api/bookings/admin/allbookings", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchAllBookings();
  }, []);

  // Apply filters
  const filteredBookings = bookings.filter(
    (b) =>
      (b.name.toLowerCase().includes(search.toLowerCase()) ||
        b.mobile.includes(search))
  );

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white px-6 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">All Bookings</h2>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search */}
          <div className="relative w-full md:w-1/2">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by name or mobile"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
          </div>

          {/* Date Filter */}
          <div className="relative w-full md:w-1/3">
            <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent focus:ring-2 focus:ring-black dark:focus:ring-white outline-none"
            />
          </div>
        </div>

        {/* Booking List */}
        {loading ? (
          <div className="text-center py-8">
            <p>Loading bookings...</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-800">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-100 dark:bg-gray-800">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Mobile</th>
                  <th className="p-3">Time Slot</th>
                  <th className="p-3">User Email</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((b) => (
                    <tr key={b._id} className="border-t border-gray-200 dark:border-gray-800">
                      <td className="p-3">{b.name}</td>
                      <td className="p-3">{b.mobile}</td>
                      <td className="p-3">{b.slot && b.slot !== 'Invalid Date' ? b.slot : 'N/A'}</td>
                      <td className="p-3">{b.user?.email || 'N/A'}</td>
                      <td className="p-3 text-center">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-black text-white dark:bg-white dark:text-black text-xs hover:opacity-90 transition"
                        >
                          <Eye size={14} /> View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Booking Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-md relative"
          >
            <button
              onClick={() => setSelectedBooking(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-xl font-bold mb-4">Booking Details</h3>
            <p className="mb-2"><strong>Name:</strong> {selectedBooking.name}</p>
            <p className="mb-2"><strong>Mobile:</strong> {selectedBooking.mobile}</p>
            <p className="mb-2"><strong>Time Slot:</strong> {selectedBooking.slot}</p>
            <p className="mb-2"><strong>User Email:</strong> {selectedBooking.user?.email || 'N/A'}</p>
            <p className="mb-2"><strong>User Name:</strong> {selectedBooking.user?.name || 'N/A'}</p>
            <p className="mb-2"><strong>Message:</strong> {selectedBooking.message || 'No message'}</p>
            <p className="mb-2"><strong>Booking ID:</strong> {selectedBooking._id}</p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
