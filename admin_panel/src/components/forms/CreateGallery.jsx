import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";
import { Button } from "../ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

const CreateGallery = ({ setMode, onUploadSuccess }) => {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: {
      galleryImages: [],
      event: "",
    },
  });

  const imageRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCustomEvent, setIsCustomEvent] = useState(false);
  const [customEvent, setCustomEvent] = useState("");
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customGalleryEvents")) || [];
    setAllEvents(saved);
  }, []);

  const handleImageChange = (event, fieldOnChange) => {
    const files = Array.from(event.target.files);
    const validFiles = [];
    const previews = [];

    files.forEach((file) => {
      if (file.size > 1048576) {
        toast.error(`"${file.name}" is larger than 1MB.`);
      } else {
        validFiles.push(file);
        previews.push(URL.createObjectURL(file));
      }
    });

    setImageFiles(validFiles);
    setImagePreviews(previews);
    setValue("galleryImages", validFiles);
    fieldOnChange(validFiles);
  };

  const removeImages = () => {
    setImageFiles([]);
    setImagePreviews([]);
    setValue("galleryImages", []);
  };

  const removeSingleImage = (index) => {
    const newFiles = imageFiles.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setImageFiles(newFiles);
    setImagePreviews(newPreviews);
    setValue("galleryImages", newFiles);
  };

  const onSubmit = async (formData) => {
    if (!imageFiles.length) {
      toast.error("Please select at least one image.");
      return;
    }

    const eventToSubmit = isCustomEvent ? customEvent.trim() : formData.event;

    if (!eventToSubmit) {
      toast.error("Please provide an event name.");
      return;
    }

    if (isCustomEvent && !allEvents.includes(eventToSubmit)) {
      const updatedEvents = [...allEvents, eventToSubmit];
      localStorage.setItem("customGalleryEvents", JSON.stringify(updatedEvents));
      setAllEvents(updatedEvents);
    }

    const API = import.meta.env.VITE_REACT_APP_API_URL;

    setLoading(true);
    try {
      const uploaded = [];
      for (const file of imageFiles) {
        const data = new FormData();
        data.append("image", file);
        data.append("event", eventToSubmit);

        const res = await fetch(`${API}/api/gallery/upload`, {
          method: "POST",
          body: data,
        });

        if (!res.ok) throw new Error("Upload failed");
        const result = await res.json();
        uploaded.push(result);
      }

      toast.success("Images uploaded successfully!");
      reset();
      removeImages();
      setCustomEvent("");
      setIsCustomEvent(false);
      setMode && setMode("view");
      onUploadSuccess && onUploadSuccess(uploaded);
    } catch (err) {
      toast.error("Upload failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Event Selection */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Event <span className="text-destructive">*</span></label>
        <Controller
          name="event"
          control={control}
          rules={{ required: !isCustomEvent && "Event is required" }}
          render={({ field, fieldState: { error } }) => (
            <>
              <select
                {...field}
                onChange={(e) => {
                  const value = e.target.value;
                  field.onChange(value);
                  if (value === "__new__") {
                    setIsCustomEvent(true);
                  } else {
                    setIsCustomEvent(false);
                    setCustomEvent("");
                  }
                }}
                className={cn(
                  "flex h-10 w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  error ? "border-destructive" : "border-input"
                )}
              >
                <option value="">-- Select Event --</option>
                <option value="__new__">+ Add New Event</option>
                {allEvents.map((event, idx) => (
                  <option key={idx} value={event}>
                    {event}
                  </option>
                ))}
              </select>
              {error && <p className="text-xs text-destructive">{error.message}</p>}
            </>
          )}
        />
        {isCustomEvent && (
          <input
            type="text"
            placeholder="Enter new event name"
            value={customEvent}
            onChange={(e) => setCustomEvent(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          />
        )}
      </div>

      {/* Image Upload */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Insert Images <span className="text-destructive">*</span></label>
        <Controller
          name="galleryImages"
          control={control}
          rules={{ required: "At least one image is required" }}
          render={({ field, fieldState: { error } }) => (
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleImageChange(e, field.onChange)}
                className="hidden"
                ref={imageRef}
              />
              <div
                className={cn(
                  "border-2 border-dashed rounded-xl cursor-pointer p-4 transition-colors min-h-[120px]",
                  error ? "border-destructive" : "border-border hover:border-primary/50 hover:bg-accent/50"
                )}
                onClick={() => imageRef.current && imageRef.current.click()}
              >
                {imagePreviews.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground font-medium">Click to upload or drag and drop images</p>
                    <p className="text-xs text-muted-foreground mt-1">Max 1MB each · JPG, PNG, WebP</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative group">
                        <img
                          src={src}
                          alt={`Preview ${idx + 1}`}
                          className="h-20 w-20 object-cover rounded-lg border border-border"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeSingleImage(idx); }}
                          className="absolute -top-1.5 -right-1.5 p-0.5 bg-destructive text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {error && <p className="text-xs text-destructive mt-1">{error.message}</p>}
            </div>
          )}
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={() => { reset(); removeImages(); setCustomEvent(""); setIsCustomEvent(false); setMode && setMode("view"); }}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Uploading..." : "Save Images"}
        </Button>
      </div>
    </form>
  );
};

CreateGallery.propTypes = {
  setMode: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default CreateGallery;
