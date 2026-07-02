import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { Button } from "../ui/button";

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
        if (refreshHolidays) refreshHolidays();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create holiday");
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">Create New Holiday</h2>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Holiday Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              placeholder="e.g. Dashain, Holi, Christmas"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Holiday Date (A.D)
            </label>
            <input
              type="date"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Holiday"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHoliday;
