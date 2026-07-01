import { useRef, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const CreateGallery = ({ mode, setMode, onUploadSuccess }) => {
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

  // Load custom events from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("customGalleryEvents")) || [];
    setAllEvents(saved);
  }, []);

  // Handle image input change
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

    // Save new event to localStorage if not already saved
    if (isCustomEvent && !allEvents.includes(eventToSubmit)) {
      const updatedEvents = [...allEvents, eventToSubmit];
      localStorage.setItem("customGalleryEvents", JSON.stringify(updatedEvents));
      setAllEvents(updatedEvents);
    }

    setLoading(true);
    try {
      const uploaded = [];
      for (const file of imageFiles) {
        const data = new FormData();
        data.append("image", file);
        data.append("event", eventToSubmit);

        const res = await fetch("http://localhost:5000/api/gallery/upload", {
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
    <div className="flex flex-col space-y-6 p-4 max-w-lg mx-auto bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-center">Upload Gallery Images</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Event Selection */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Select Event</label>
          <Controller
            name="event"
            control={control}
            rules={{ required: "Event is required" }}
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
                  className={`w-full p-2 border rounded ${
                    error ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">-- Select Event --</option>
                  <option value="__new__">+ Add New Event</option>
                  {allEvents.map((event, idx) => (
                    <option key={idx} value={event}>
                      {event}
                    </option>
                  ))}
                </select>
                {error && <p className="text-red-500 mt-1 text-sm">{error.message}</p>}
              </>
            )}
          />
          {isCustomEvent && (
            <input
              type="text"
              placeholder="Enter new event name"
              value={customEvent}
              onChange={(e) => setCustomEvent(e.target.value)}
              className="mt-2 w-full p-2 border rounded border-gray-300"
            />
          )}
        </div>

        {/* Image Upload */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Insert Images</label>
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
                  className="w-full p-4 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 flex flex-wrap justify-center min-h-[100px]"
                  onClick={() => imageRef.current && imageRef.current.click()}
                >
                  {imagePreviews.length === 0 ? (
                    <span className="text-gray-500 text-sm self-center">
                      Click to upload or drag and drop images
                    </span>
                  ) : (
                    imagePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`Preview ${idx + 1}`}
                        className="h-24 w-24 object-cover rounded border border-gray-300 m-1"
                      />
                    ))
                  )}
                </div>
                {error && <p className="text-red-500 mt-1 text-sm">{error.message}</p>}
              </div>
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-black hover:bg-gray-700 disabled:bg-blue-300 text-white font-semibold px-6 py-2 rounded"
          >
            {loading ? "Uploading..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              removeImages();
              setCustomEvent("");
              setIsCustomEvent(false);
              setMode && setMode("view");
            }}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

CreateGallery.propTypes = {
  mode: PropTypes.string,
  setMode: PropTypes.func,
  onUploadSuccess: PropTypes.func,
};

export default CreateGallery;
