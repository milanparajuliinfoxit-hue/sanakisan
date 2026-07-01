import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { X } from "lucide-react";

const CreateHoliday = ({ setOpen, refreshHolidays }) => {
  const [title, setTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/create-holiday`, {
        title,
        holidayDate,
      });

      if (res.data.status) {
        toast.success(res.data.message || "Holiday created successfully!");
        setTitle("");
        setHolidayDate("");
        setOpen(false);
        
        // Refresh parent list immediately
        if (refreshHolidays) refreshHolidays();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create holiday"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setHolidayDate("");
    setOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-xl font-semibold">Create New Holiday</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Holiday Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g. Dashain, Holi, Christmas"
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Holiday Date (A.D)
            </label>
            <input
              type="date"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 bg-gray-500 text-white font-medium hover:bg-gray-400 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition disabled:opacity-70"
            >
              {loading ? "Saving..." : "Save Holiday"}
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateHoliday;