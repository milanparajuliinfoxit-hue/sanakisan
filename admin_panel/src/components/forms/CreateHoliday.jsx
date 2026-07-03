import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { X, CalendarDays, Loader2, Gift } from "lucide-react";
import PropTypes from "prop-types";

const API = import.meta.env.VITE_REACT_APP_API_URL;

const HolidayFormModal = ({ mode = "create", holiday = null, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [holidayDate, setHolidayDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const isEdit = mode === "edit";

  useEffect(() => {
    if (isEdit && holiday) {
      setTitle(holiday.title || "");
      setHolidayDate(holiday.holiday_date || "");
    }
  }, [isEdit, holiday]);

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Holiday title is required.";
    else if (title.trim().length < 2) e.title = "Title must be at least 2 characters.";
    if (!holidayDate) e.holidayDate = "Please select a holiday date.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      let res;
      if (isEdit) {
        res = await axios.put(`${API}/api/update-holiday/${holiday.id}`, {
          title: title.trim(),
          holidayDate,
        });
      } else {
        res = await axios.post(`${API}/api/create-holiday`, {
          title: title.trim(),
          holidayDate,
        });
      }

      if (res.data.status) {
        toast.success(res.data.message || `Holiday ${isEdit ? "updated" : "created"} successfully!`);
        onSuccess?.(res.data.data);
      } else {
        toast.error(res.data.message || "Something went wrong.");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
              <Gift className="w-4 h-4 text-red-500" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                {isEdit ? "Edit Holiday" : "Create New Holiday"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isEdit ? "Update the holiday details below." : "Fill in the details to add a new holiday."}
              </p>
            </div>
          </div>
          <button onClick={handleClose} disabled={loading}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate>
          <div className="px-6 py-5 space-y-5">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Holiday Title <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => { setTitle(e.target.value); if (errors.title) setErrors(p => ({ ...p, title: "" })); }}
                placeholder="e.g. Dashain, Holi, Christmas"
                disabled={loading}
                className={`w-full h-10 px-3 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50 ${
                  errors.title ? "border-destructive focus:ring-destructive/30" : "border-border"
                }`}
              />
              {errors.title && <p className="text-xs text-destructive">{errors.title}</p>}
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                Holiday Date (A.D) <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                <input
                  type="date"
                  value={holidayDate}
                  onChange={(e) => { setHolidayDate(e.target.value); if (errors.holidayDate) setErrors(p => ({ ...p, holidayDate: "" })); }}
                  disabled={loading}
                  className={`w-full h-10 pl-9 pr-3 rounded-lg border text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all disabled:opacity-50 ${
                    errors.holidayDate ? "border-destructive focus:ring-destructive/30" : "border-border"
                  }`}
                />
              </div>
              {errors.holidayDate && <p className="text-xs text-destructive">{errors.holidayDate}</p>}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/30 rounded-b-2xl">
            <button type="button" onClick={handleClose} disabled={loading}
              className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-40">
              Cancel
            </button>
            <button type="submit" disabled={loading}
              className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 min-w-[110px] justify-center">
              {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : isEdit ? "Save Changes" : "Create Holiday"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

HolidayFormModal.propTypes = {
  mode: PropTypes.oneOf(["create", "edit"]),
  holiday: PropTypes.object,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
};

export default HolidayFormModal;
