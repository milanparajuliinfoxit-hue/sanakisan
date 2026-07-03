import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ChevronLeft, ChevronRight, Plus, Trash2, Eye, Download, X,
  Images, ImageIcon, Grid3X3, List, CheckSquare, Square, Upload
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateGallery from "@/components/forms/CreateGallery";
import PropTypes from "prop-types";

const API = import.meta.env.VITE_REACT_APP_API_URL;
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";
const imgUrl = (img) => `${API}/api/getgalleryimage/${img.title || img.image_name}`;

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ images, index, onClose, onDelete }) {
  const [current, setCurrent] = useState(index);
  const img = images[current];

  const prev = useCallback(() => setCurrent(i => (i - 1 + images.length) % images.length), [images.length]);
  const next = useCallback(() => setCurrent(i => (i + 1) % images.length), [images.length]);

  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose, prev, next]);

  if (!img) return null;

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = imgUrl(img);
    a.download = img.title || img.image_name || "image";
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/92" onClick={onClose}>
      <div className="relative flex flex-col items-center w-full h-full p-4" onClick={e => e.stopPropagation()}>
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-3 bg-gradient-to-b from-black/70 to-transparent z-10">
          <div>
            <p className="text-white font-medium text-sm truncate max-w-xs">{img.title || img.image_name || "Image"}</p>
            <p className="text-white/60 text-xs">{fmt(img.save_in || img.createdAt)}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleDownload} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={() => { onDelete(img); onClose(); }} className="p-2 rounded-lg bg-white/10 hover:bg-red-500/80 text-white transition-colors">
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <img src={imgUrl(img)} alt={img.title} className="max-h-[80vh] max-w-full object-contain rounded-lg shadow-2xl" />
        </div>

        {images.length > 1 && (
          <>
            <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/50 text-white text-xs">
          {current + 1} / {images.length}
        </div>
      </div>
    </div>
  );
}

Lightbox.propTypes = {
  images: PropTypes.array.isRequired,
  index: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

// ── Image Card ────────────────────────────────────────────────────────────────
function ImageCard({ img, onPreview, onDelete, selected, onToggleSelect, viewMode }) {
  const handleDownload = (e) => {
    e.stopPropagation();
    const a = document.createElement("a");
    a.href = imgUrl(img);
    a.download = img.title || img.image_name || "image";
    a.click();
  };

  if (viewMode === "list") {
    return (
      <div className={cn("flex items-center gap-4 px-4 py-3 rounded-lg border transition-all duration-150 hover:bg-muted/30",
        selected ? "border-primary/40 bg-primary/5" : "border-border bg-card")}>
        <button type="button" onClick={() => onToggleSelect(img.id)} className="flex-shrink-0">
          {selected ? <CheckSquare className="w-4 h-4 text-primary" /> : <Square className="w-4 h-4 text-muted-foreground" />}
        </button>
        <img src={imgUrl(img)} alt={img.title} className="w-12 h-12 rounded-lg object-cover border border-border flex-shrink-0" loading="lazy" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground truncate">{img.title || img.image_name || "Image"}</p>
          <p className="text-xs text-muted-foreground">{fmt(img.save_in || img.createdAt)}</p>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button onClick={() => onPreview(img)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"><Eye className="w-4 h-4" /></button>
          <button onClick={handleDownload} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"><Download className="w-4 h-4" /></button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(img); }} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all"><Trash2 className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("group relative rounded-xl border overflow-hidden transition-all duration-200 cursor-pointer",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border hover:shadow-md hover:border-primary/20")}
      onClick={() => onPreview(img)}
    >
      <button type="button"
        onClick={(e) => { e.stopPropagation(); onToggleSelect(img.id); }}
        className={cn("absolute top-2 left-2 z-10 p-0.5 rounded-md transition-all duration-150",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
        {selected ? <CheckSquare className="w-5 h-5 text-primary drop-shadow" /> : <Square className="w-5 h-5 text-white drop-shadow" />}
      </button>

      <img src={imgUrl(img)} alt={img.title} loading="lazy"
        className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105" />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button onClick={(e) => { e.stopPropagation(); onPreview(img); }} className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm"><Eye className="w-3.5 h-3.5 text-foreground" /></button>
        <button onClick={handleDownload} className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm"><Download className="w-3.5 h-3.5 text-foreground" /></button>
        <button onClick={(e) => { e.stopPropagation(); onDelete(img); }} className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm"><Trash2 className="w-3.5 h-3.5 text-red-600" /></button>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
        <p className="text-white text-xs truncate">{img.title || img.image_name}</p>
      </div>
    </div>
  );
}

ImageCard.propTypes = {
  img: PropTypes.object.isRequired,
  onPreview: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  onToggleSelect: PropTypes.func.isRequired,
  viewMode: PropTypes.string,
};

// ── Album Detail Page ─────────────────────────────────────────────────────────
export default function GalleryAlbum() {
  const { eventName } = useParams();
  const navigate = useNavigate();
  const albumName = decodeURIComponent(eventName);

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [selected, setSelected] = useState(new Set());
  const [showUpload, setShowUpload] = useState(false);
  const [lightboxImages, setLightboxImages] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showBulkDelete, setShowBulkDelete] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/gallery?event=${encodeURIComponent(albumName)}`);
      const data = await res.json();
      setImages(data.sort((a, b) => b.id - a.id));
    } catch {
      toast.error("Failed to load images.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, [albumName]);

  const handleUploadSuccess = (newImages) => {
    setImages(prev => [...newImages, ...prev]);
    setShowUpload(false);
  };

  const handleDelete = (img) => setDeleteTarget(img);

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`${API}/api/gallery/${deleteTarget.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setImages(prev => prev.filter(i => i.id !== deleteTarget.id));
      toast.success("Image deleted.");
    } catch {
      toast.error("Failed to delete image.");
    } finally {
      setDeleteTarget(null);
    }
  };

  const confirmBulkDelete = async () => {
    const ids = [...selected];
    let deleted = 0;
    for (const id of ids) {
      try {
        const res = await fetch(`${API}/api/gallery/${id}`, { method: "DELETE" });
        if (res.ok) { deleted++; setImages(prev => prev.filter(i => i.id !== id)); }
      } catch { /* continue */ }
    }
    toast.success(`${deleted} image${deleted > 1 ? "s" : ""} deleted.`);
    setSelected(new Set());
    setShowBulkDelete(false);
  };

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const openLightbox = (img) => {
    const idx = images.findIndex(i => i.id === img.id);
    setLightboxImages(images);
    setLightboxIndex(idx >= 0 ? idx : 0);
  };

  const lastUpdated = images[0]?.save_in || images[0]?.createdAt;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ── Breadcrumb ── */}
      <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <Link to="/gallery" className="hover:text-foreground transition-colors">Gallery</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground font-medium capitalize">{albumName}</span>
      </nav>

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate("/gallery")}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground capitalize">{albumName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {images.length} image{images.length !== 1 ? "s" : ""}
              {lastUpdated && <> · Last updated {fmt(lastUpdated)}</>}
            </p>
          </div>
        </div>
        <button onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm">
          <Upload className="w-4 h-4" /> Upload Images
        </button>
      </div>

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* View Toggle */}
        <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden">
          <button onClick={() => setViewMode("grid")}
            className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")}
            className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            <List className="w-4 h-4" />
          </button>
        </div>

        {/* Select All */}
        {images.length > 0 && (
          <button
            onClick={() => {
              const allIds = images.map(i => i.id);
              const allSelected = allIds.every(id => selected.has(id));
              setSelected(allSelected ? new Set() : new Set(allIds));
            }}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded hover:bg-muted border border-border">
            {images.every(i => selected.has(i.id)) ? "Deselect All" : "Select All"}
          </button>
        )}

        {/* Bulk Actions */}
        {selected.size > 0 && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-primary/30 bg-primary/5">
            <span className="text-sm font-medium text-foreground">{selected.size} selected</span>
            <button onClick={() => setShowBulkDelete(true)}
              className="flex items-center gap-1.5 px-3 h-7 rounded-md bg-destructive text-destructive-foreground text-xs font-medium hover:bg-destructive/90 transition-colors">
              <Trash2 className="w-3 h-3" /> Delete
            </button>
            <button onClick={() => setSelected(new Set())}
              className="flex items-center gap-1.5 px-2 h-7 rounded-md border border-border text-xs text-muted-foreground hover:bg-muted transition-colors">
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* ── Content ── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl border bg-card overflow-hidden">
              <div className="h-44 bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
            <Images className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">No Images Yet</h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">Upload your first image to this album.</p>
          <button onClick={() => setShowUpload(true)}
            className="mt-5 flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            <Plus className="w-4 h-4" /> Upload Images
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(img => (
            <ImageCard key={img.id} img={img} viewMode="grid"
              selected={selected.has(img.id)}
              onToggleSelect={toggleSelect}
              onPreview={openLightbox}
              onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {images.map(img => (
            <ImageCard key={img.id} img={img} viewMode="list"
              selected={selected.has(img.id)}
              onToggleSelect={toggleSelect}
              onPreview={openLightbox}
              onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-foreground">Upload Images</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Adding to album: <span className="font-medium capitalize">{albumName}</span></p>
              </div>
              <button onClick={() => setShowUpload(false)}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <CreateGallery
              onClose={() => setShowUpload(false)}
              onUploadSuccess={handleUploadSuccess}
              defaultEvent={albumName}
            />
          </div>
        </div>
      )}

      {/* ── Lightbox ── */}
      {lightboxImages && (
        <Lightbox
          images={lightboxImages}
          index={lightboxIndex}
          onClose={() => setLightboxImages(null)}
          onDelete={(img) => { handleDelete(img); setLightboxImages(null); }}
        />
      )}

      {/* ── Delete Confirm ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteTarget(null)} />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Delete Image?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">This will permanently remove the image. This action cannot be undone.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
                <button onClick={() => setDeleteTarget(null)}
                  className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">Cancel</button>
                <button onClick={confirmDelete}
                  className="px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all">Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bulk Delete Confirm ── */}
      {showBulkDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBulkDelete(false)} />
          <div className="relative z-10 w-full max-w-md mx-4">
            <div className="bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="p-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Delete {selected.size} Image{selected.size > 1 ? "s" : ""}?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">This will permanently remove the selected images. This cannot be undone.</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
                <button onClick={() => setShowBulkDelete(false)}
                  className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">Cancel</button>
                <button onClick={confirmBulkDelete}
                  className="px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all">Delete All</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
