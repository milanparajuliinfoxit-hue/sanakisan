import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CreateGallery from "@/components/forms/CreateGallery";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUpload, setShowUpload] = useState(false);

  const fetchImages = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/gallery");
      const data = await res.json();
      // Sort by latest and set
      setImages(data.sort((a, b) => b.id - a.id));
    } catch {
      toast.error("Failed to load gallery images.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleUploadSuccess = (newImages) => {
    setImages((prev) => [...newImages, ...prev]);
    setShowUpload(false);
  };

  const handleDelete = async (img) => {
    setShowConfirm(true);
    setDeleteTarget(img);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(
        `http://localhost:5000/api/gallery/${deleteTarget.id}`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error();
      setImages((prev) => prev.filter((i) => i.id !== deleteTarget.id));
      toast.success("Image deleted!");
    } catch {
      toast.error("Failed to delete image.");
    } finally {
      setShowConfirm(false);
      setDeleteTarget(null);
    }
  };

  // Group images by event
  const groupedImages = images.reduce((acc, img) => {
    const event = img.event?.trim() || "Others";
    if (!acc[event]) acc[event] = [];
    acc[event].push(img);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto py-8 px-4">
      {/* Upload Button */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-semibold text-blue-700">All Gallery Images</h3>
        <button
          className="bg-black text-white px-5 py-2 rounded-lg font-semibold shadow hover:bg-gray-800 transition"
          onClick={() => setShowUpload(true)}
        >
          Add Images
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black text-2xl"
              onClick={() => setShowUpload(false)}
              title="Close"
            >
              &times;
            </button>
            <CreateGallery
              setMode={() => setShowUpload(false)}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No images found.
        </div>
      ) : (
        Object.entries(groupedImages).map(([event, eventImages]) => (
          <div key={event} className="mb-10">
            <h4 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
              {event}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {eventImages.map((img) => (
                <div
                  key={img.id}
                  className="border rounded-lg bg-white p-3 shadow relative"
                >
                  <img
                    src={`http://localhost:5000/api/getgalleryimage/${img.title || img.image}`}
                    alt={img.title}
                    className="h-40 w-full object-cover mb-2 rounded"
                  />
                  <button
                    className="absolute top-2 right-2 text-sm bg-red-600 text-white px-2 py-1 rounded hover:bg-black"
                    onClick={() => handleDelete(img)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs text-center">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">
              Are you sure you want to delete it?
            </h2>
            <div className="flex justify-center gap-4">
              <button
                className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-black transition"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
              <button
                className="bg-slate-500 text-white px-4 py-2 rounded hover:bg-black transition"
                onClick={() => {
                  setShowConfirm(false);
                  setDeleteTarget(null);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
