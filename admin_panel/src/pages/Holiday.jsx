import React, { useEffect, useState } from "react";
import CreateHoliday from "../components/forms/CreateHoliday";
import axios from "axios";
import { CalendarDays, FileText, Plus } from "lucide-react";

const Holiday = () => {
  const [open, setOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);

  const API = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchHolidaysList = async () => {
    try {
      const res = await axios.get(`${API}/api/get-holidays`);
      setHolidays(res.data.data || []);
    } catch (err) {
      console.log("Error fetching holidays:", err);
    }
  };

  useEffect(() => {
    fetchHolidaysList();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Holidays</h1>
          <p className="text-gray-500">Manage organization holidays</p>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-2 py-3 rounded-xl font-medium transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />
          Create Holiday
        </button>
      </div>

      {/* Holiday List - Modern UI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-blue-600" />
            Holiday List
          </h2>
          <span className="text-sm text-gray-500">
            {holidays.length} {holidays.length === 1 ? "Holiday" : "Holidays"}
          </span>
        </div>

        {holidays.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <CalendarDays className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No holidays yet</h3>
            <p className="text-gray-500 mt-1">Create your first holiday</p>
          </div>
        ) : (
          <div className="divide-y">
            {holidays.map((item) => (
              <div
                key={item.id}
                className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex items-center gap-4">
                  <FileText className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="font-medium text-gray-800">{item.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-gray-600">
                  <CalendarDays className="w-4 h-4 text-red-500" />
                  <span className="font-medium">{item.holiday_date}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {open && (
        <CreateHoliday 
          setOpen={setOpen} 
          refreshHolidays={fetchHolidaysList} 
        />
      )}
    </div>
  );
};

export default Holiday;