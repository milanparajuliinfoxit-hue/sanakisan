import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import CreateGallery from "@/components/forms/CreateGallery";
import { Images, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AlertDialog from "@/components/AlertDialog";

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  const API = import.meta.env.VITE_REACT_APP_API_URL;

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/gallery`);
      const data = await res.json();
      setImages(data.sort((a, b) => b.id - a.id));
    } catch {
      toast.error("Failed to load gallery images.");
    } finally {
      setLoading(false);
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
      const res = await fetch(`${API}/api/gallery/${deleteTarget.id}`, {
        method: "DELETE",
      });
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

  const groupedImages = images.reduce((acc, img) => {
    const event = img.event?.trim() || "Others";
    if (!acc[event]) acc[event] = [];
    acc[event].push(img);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-muted-foreground mt-1">Manage gallery images grouped by event</p>
        </div>
        <Button onClick={() => setShowUpload(true)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Images
        </Button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 animate-scale-in">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold text-foreground">Upload Gallery Images</h2>
              <button
                onClick={() => setShowUpload(false)}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <CreateGallery
                setMode={() => setShowUpload(false)}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden animate-pulse">
              <div className="h-40 bg-muted" />
              <div className="p-3">
                <div className="h-4 bg-muted rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
            <Images className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No images yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-6">Upload your first gallery images.</p>
          <Button onClick={() => setShowUpload(true)} className="gap-2">
            <Plus className="w-4 h-4" /> Upload Images
          </Button>
        </div>
      ) : (
        Object.entries(groupedImages).map(([event, eventImages]) => (
          <div key={event} className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h2 className="text-xl font-semibold text-foreground capitalize">{event}</h2>
              <span className="text-sm text-muted-foreground">({eventImages.length})</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {eventImages.map((img) => (
                <div
                  key={img.id}
                  className="group relative rounded-xl border bg-card overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                >
                  <img
                    src={`${API}/api/getgalleryimage/${img.title || img.image}`}
                    alt={img.title}
                    className="h-44 w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <button
                    onClick={() => handleDelete(img)}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" />
                  </button>
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                    <p className="text-white text-sm font-medium truncate">{img.title || "Gallery Image"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {/* Delete Confirmation */}
      {showConfirm && (
        <AlertDialog
          warningMessage="Delete Image?"
          message="This will permanently remove the image from the gallery. This action cannot be undone."
          submitText="Yes, Delete"
          cancelText="Cancel"
          isCancel
          onSubmit={confirmDelete}
          onCancel={() => { setShowConfirm(false); setDeleteTarget(null); }}
        />
      )}
    </div>
  );
}
