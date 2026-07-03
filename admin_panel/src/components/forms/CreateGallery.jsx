import { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Upload, X, ImageIcon, Plus, Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateGallery = ({ onClose, onUploadSuccess, defaultEvent }) => {
  const imageRef = useRef(null);
  const [imageFiles, setImageFiles] = useState([]);
  const [fileStates, setFileStates] = useState([]); // {preview, name, size, status: 'pending'|'uploading'|'done'|'error'}
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(defaultEvent || "");
  const [allEvents, setAllEvents] = useState([]);
  const [eventSearch, setEventSearch] = useState("");
  const [showNewEvent, setShowNewEvent] = useState(false);
  const [newEventName, setNewEventName] = useState("");
  const [eventError, setEventError] = useState("");
  const [filesError, setFilesError] = useState("");

  const API = import.meta.env.VITE_REACT_APP_API_URL;

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customGalleryEvents")) || [];
    setAllEvents(saved);
  }, []);

  const filteredEvents = allEvents.filter(e => e.toLowerCase().includes(eventSearch.toLowerCase()));

  const processFiles = (files) => {
    const valid = [];
    Array.from(files).forEach((file) => {
      if (file.size > 1048576) {
        toast.error(`"${file.name}" exceeds 1MB limit.`);
      } else {
        valid.push(file);
      }
    });
    if (!valid.length) return;
    setImageFiles(prev => [...prev, ...valid]);
    setFileStates(prev => [
      ...prev,
      ...valid.map(f => ({
        preview: URL.createObjectURL(f),
        name: f.name,
        size: (f.size / 1024).toFixed(1) + " KB",
        status: "pending",
      })),
    ]);
    setFilesError("");
  };

  const handleFileInput = (e) => processFiles(e.target.files);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const removeFile = (idx) => {
    setImageFiles(prev => prev.filter((_, i) => i !== idx));
    setFileStates(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCreateEvent = () => {
    const name = newEventName.trim();
    if (!name) return;
    if (!allEvents.includes(name)) {
      const updated = [...allEvents, name];
      localStorage.setItem("customGalleryEvents", JSON.stringify(updated));
      setAllEvents(updated);
    }
    setSelectedEvent(name);
    setNewEventName("");
    setShowNewEvent(false);
    setEventSearch("");
    setEventError("");
  };

  const handleSubmit = async () => {
    let valid = true;
    if (!selectedEvent) { setEventError("Please select or create an event."); valid = false; }
    if (!imageFiles.length) { setFilesError("Please select at least one image."); valid = false; }
    if (!valid) return;

    setLoading(true);
    const uploaded = [];

    for (let i = 0; i < imageFiles.length; i++) {
      setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "uploading" } : f));
      try {
        const data = new FormData();
        data.append("image", imageFiles[i]);
        data.append("event", selectedEvent);
        const res = await fetch(`${API}/api/gallery/upload`, { method: "POST", body: data });
        if (!res.ok) throw new Error();
        const result = await res.json();
        uploaded.push(result);
        setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "done" } : f));
      } catch {
        setFileStates(prev => prev.map((f, idx) => idx === i ? { ...f, status: "error" } : f));
      }
    }

    setLoading(false);
    if (uploaded.length) {
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} uploaded successfully!`);
      onUploadSuccess?.(uploaded);
    }
    if (uploaded.length < imageFiles.length) {
      toast.error(`${imageFiles.length - uploaded.length} image(s) failed to upload.`);
    }
  };

  const handleCancel = () => {
    setImageFiles([]);
    setFileStates([]);
    setSelectedEvent("");
    setNewEventName("");
    setShowNewEvent(false);
    onClose?.();
  };

  const allDone = fileStates.length > 0 && fileStates.every(f => f.status === "done");

  return (
    <div className="flex flex-col min-h-0 flex-1">
      {/* ── Scrollable Body ── */}
      <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5 space-y-5">
      {/* Event Selection */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Event <span className="text-destructive">*</span></label>
        {selectedEvent ? (
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/40 bg-primary/5">
            <span className="text-sm font-medium text-foreground flex-1 capitalize">{selectedEvent}</span>
            <button type="button" onClick={() => setSelectedEvent("")}
              className="p-0.5 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <input value={eventSearch} onChange={e => setEventSearch(e.target.value)}
                placeholder="Search events…"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
            </div>
            {filteredEvents.length > 0 && (
              <div className="rounded-lg border border-border bg-card shadow-sm max-h-36 overflow-y-auto">
                {filteredEvents.map((ev, i) => (
                  <button key={i} type="button"
                    onClick={() => { setSelectedEvent(ev); setEventSearch(""); setEventError(""); }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors capitalize first:rounded-t-lg last:rounded-b-lg">
                    {ev}
                  </button>
                ))}
              </div>
            )}
            {!filteredEvents.length && eventSearch && (
              <p className="text-xs text-muted-foreground px-1">No events match "{eventSearch}"</p>
            )}
            {!showNewEvent ? (
              <button type="button" onClick={() => setShowNewEvent(true)}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
                <Plus className="w-3.5 h-3.5" /> Create New Event
              </button>
            ) : (
              <div className="flex gap-2">
                <input value={newEventName} onChange={e => setNewEventName(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleCreateEvent()}
                  placeholder="Enter event name"
                  autoFocus
                  className="flex-1 h-9 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all" />
                <button type="button" onClick={handleCreateEvent}
                  className="px-3 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
                  Save
                </button>
                <button type="button" onClick={() => { setShowNewEvent(false); setNewEventName(""); }}
                  className="px-3 h-9 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
        {eventError && <p className="text-xs text-destructive">{eventError}</p>}
      </div>

      {/* Upload Zone */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-foreground">Images <span className="text-destructive">*</span></label>
        <input type="file" accept="image/*" multiple onChange={handleFileInput} className="hidden" ref={imageRef} />
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !loading && imageRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl cursor-pointer flex flex-col items-center justify-center py-8 transition-all duration-200 select-none",
            isDragging ? "border-primary bg-primary/5 scale-[1.01]" : "border-border hover:border-primary/50 hover:bg-accent/30",
            loading && "pointer-events-none opacity-60"
          )}
        >
          <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-3 transition-colors",
            isDragging ? "bg-primary/10" : "bg-muted")}>
            <ImageIcon className={cn("w-6 h-6", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <p className="text-sm font-medium text-foreground">
            {isDragging ? "Drop images here" : "Drag & drop or click to browse"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WebP · Max 1MB each · Multiple files allowed</p>
        </div>
        {filesError && <p className="text-xs text-destructive">{filesError}</p>}
      </div>

      {/* File Previews */}
      {fileStates.length > 0 && (
        <div className="space-y-2 pr-1">
          {fileStates.map((f, i) => (
            <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-muted/20">
              <img src={f.preview} alt={f.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-border" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.size}</p>
                {f.status === "uploading" && (
                  <div className="mt-1 h-1 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary rounded-full animate-pulse w-2/3" />
                  </div>
                )}
              </div>
              <div className="flex-shrink-0">
                {f.status === "pending" && (
                  <button type="button" onClick={() => removeFile(i)} disabled={loading}
                    className="p-1 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground disabled:opacity-40">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                {f.status === "uploading" && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
                {f.status === "done" && <Check className="w-4 h-4 text-emerald-500" />}
                {f.status === "error" && <AlertCircle className="w-4 h-4 text-destructive" />}
              </div>
            </div>
          ))}
        </div>
      )}

      </div>{/* end scrollable body */}

      {/* ── Sticky Footer ── */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border flex-shrink-0 bg-card rounded-b-2xl">
        <p className="text-xs text-muted-foreground">
          {fileStates.length > 0 ? `${fileStates.length} file${fileStates.length > 1 ? "s" : ""} selected` : "No files selected"}
        </p>
        <div className="flex gap-3">
          <button type="button" onClick={handleCancel} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all disabled:opacity-40">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit}
            disabled={loading || allDone}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px] justify-center">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading…</> : allDone ? <><Check className="w-3.5 h-3.5" /> Uploaded</> : <><Upload className="w-3.5 h-3.5" /> Upload Images</>}
          </button>
        </div>
      </div>
    </div>
  );
};

CreateGallery.propTypes = {
  onClose: PropTypes.func,
  onUploadSuccess: PropTypes.func,
  defaultEvent: PropTypes.string,
};

export default CreateGallery;
