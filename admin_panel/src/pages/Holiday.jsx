import { useEffect, useState } from "react";
import CreateHoliday from "../components/forms/CreateHoliday";
import axios from "axios";
import { CalendarDays, Gift, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Holiday = () => {
  const [open, setOpen] = useState(false);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchHolidaysList = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/get-holidays`);
      setHolidays(res.data.data || []);
    } catch (err) {
      console.log("Error fetching holidays:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHolidaysList();
  }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Holidays</h1>
          <p className="text-muted-foreground mt-1">Manage organization holidays</p>
        </div>
        <Button onClick={() => setOpen(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Create Holiday
        </Button>
      </div>

      {/* Holiday List */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-primary" />
            Holiday List
          </h2>
          <span className="text-sm text-muted-foreground">
            {holidays.length} {holidays.length === 1 ? "Holiday" : "Holidays"}
          </span>
        </div>

        {loading ? (
          <div className="divide-y">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="px-5 py-4 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-muted" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded w-1/3 mb-2" />
                    <div className="h-3 bg-muted rounded w-1/4" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : holidays.length === 0 ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <Gift className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No holidays yet</h3>
            <p className="text-sm text-muted-foreground mt-1">Create your first holiday</p>
          </div>
        ) : (
          <div className="divide-y">
            {holidays.map((item) => (
              <div
                key={item.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-100 flex items-center justify-center">
                    <Gift className="w-4 h-4 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <CalendarDays className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{item.holiday_date}</span>
                    </div>
                  </div>
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
