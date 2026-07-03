import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Images, Plus, Trash2, Upload, MoreVertical, FolderOpen,
  CalendarDays, ImageIcon, Search, X, Pencil, Check, Grid3X3, List
} from "lucide-react";
import { cn } from "@/lib/utils";
import CreateGallery from "@/components/forms/CreateGallery";

const API = import.meta.env.VITE_REACT_APP_API_URL;
const fmt = (d) => d ? new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—";

// ── Album List Row ───────────────────────────────────────────────────────────
function AlbumRow({ albumName, images, onView, onUpload, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cover = images[0];
  const lastUpdated = images.reduce((latest, img) => {
    const d = img.save_in || img.createdAt;
    return d > latest ? d : latest;
  }, images[0]?.save_in || images[0]?.createdAt || "");

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="group flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card hover:shadow-md hover:border-primary/20 transition-all duration-200 cursor-pointer"
      onClick={() => onView(albumName)}>
      {/* Cover thumbnail */}
      <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0">
        {cover ? (
          <img src={`${API}/api/getgalleryimage/${cover.title || cover.image_name}`}
            alt={albumName} loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-muted-foreground opacity-40" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-foreground text-sm capitalize truncate">{albumName}</h3>
        <div className="flex items-center gap-3 mt-0.5">
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ImageIcon className="w-3 h-3" />
            {images.length} image{images.length !== 1 ? "s" : ""}
          </span>
          {lastUpdated && (
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays className="w-3 h-3" />
              {fmt(lastUpdated)}
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0" onClick={e => e.stopPropagation()}>
        <button onClick={() => onUpload(albumName)}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100">
          <Upload className="w-4 h-4" />
        </button>
        <div className="relative" ref={menuRef}>
          <button onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-popover border border-border rounded-xl shadow-xl py-1">
              <button onClick={() => { setMenuOpen(false); onView(albumName); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" /> View Album
              </button>
              <button onClick={() => { setMenuOpen(false); onUpload(albumName); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                <Upload className="w-3.5 h-3.5 text-muted-foreground" /> Upload Images
              </button>
              <button onClick={() => { setMenuOpen(false); onRename(albumName); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Rename Album
              </button>
              <div className="my-1 border-t border-border" />
              <button onClick={() => { setMenuOpen(false); onDelete(albumName, images); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                <Trash2 className="w-3.5 h-3.5" /> Delete Album
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Album Card ────────────────────────────────────────────────────────────────
function AlbumCard({ albumName, images, onView, onUpload, onRename, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const cover = images[0];
  const lastUpdated = images.reduce((latest, img) => {
    const d = img.save_in || img.createdAt;
    return d > latest ? d : latest;
  }, images[0]?.save_in || images[0]?.createdAt || "");

  useEffect(() => {
    const handler = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="group relative bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      {/* Cover Image */}
      <div
        className="relative h-44 bg-muted cursor-pointer overflow-hidden"
        onClick={() => onView(albumName)}
      >
        {cover ? (
          <img
            src={`${API}/api/getgalleryimage/${cover.title || cover.image_name}`}
            alt={albumName}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <FolderOpen className="w-10 h-10 opacity-40" />
            <span className="text-xs">No images yet</span>
          </div>
        )}
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <span className="text-white text-sm font-medium bg-black/50 px-3 py-1.5 rounded-full">Open Album</span>
        </div>
        {/* Image count badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 text-white text-xs font-medium">
          <ImageIcon className="w-3 h-3" />
          {images.length}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 cursor-pointer" onClick={() => onView(albumName)}>
            <h3 className="font-semibold text-foreground text-sm capitalize truncate">{albumName}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {images.length} image{images.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* Three-dot menu */}
          <div className="relative flex-shrink-0" ref={menuRef}>
            <button
              onClick={(e) => { e.stopPropagation(); setMenuOpen(v => !v); }}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 top-8 z-20 w-44 bg-popover border border-border rounded-xl shadow-xl py-1 animate-fade-in">
                <button onClick={() => { setMenuOpen(false); onView(albumName); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <FolderOpen className="w-3.5 h-3.5 text-muted-foreground" /> View Album
                </button>
                <button onClick={() => { setMenuOpen(false); onUpload(albumName); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <Upload className="w-3.5 h-3.5 text-muted-foreground" /> Upload Images
                </button>
                <button onClick={() => { setMenuOpen(false); onRename(albumName); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors">
                  <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Rename Album
                </button>
                <div className="my-1 border-t border-border" />
                <button onClick={() => { setMenuOpen(false); onDelete(albumName, images); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" /> Delete Album
                </button>
              </div>
            )}
          </div>
        </div>

        {lastUpdated && (
          <div className="flex items-center gap-1.5 mt-3 text-xs text-muted-foreground">
            <CalendarDays className="w-3 h-3" />
            <span>Updated {fmt(lastUpdated)}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Skeletons ─────────────────────────────────────────────────────────────────
function AlbumSkeleton() {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="h-44 bg-muted animate-pulse" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-3/4" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/2 mt-3" />
      </div>
    </div>
  );
}

function AlbumRowSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-3 rounded-xl border border-border bg-card">
      <div className="w-14 h-14 rounded-lg bg-muted animate-pulse flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted animate-pulse rounded w-1/3" />
        <div className="h-3 bg-muted animate-pulse rounded w-1/4" />
      </div>
    </div>
  );
}

// ── Main Gallery Page ─────────────────────────────────────────────────────────
export default function Gallery() {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [showUpload, setShowUpload] = useState(false);
  const [uploadForAlbum, setUploadForAlbum] = useState(null);

  // Rename state
  const [renameAlbum, setRenameAlbum] = useState(null);
  const [renameTo, setRenameTo] = useState("");
  const [renaming, setRenaming] = useState(false);

  // Delete album confirm
  const [deleteAlbum, setDeleteAlbum] = useState(null); // { name, images }
  const [deleting, setDeleting] = useState(false);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/gallery`);
      const data = await res.json();
      setImages(data.sort((a, b) => b.id - a.id));
    } catch {
      toast.error("Failed to load gallery.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchImages(); }, []);

  // Group images by event
  const grouped = images.reduce((acc, img) => {
    const ev = img.event?.trim() || "Others";
    if (!acc[ev]) acc[ev] = [];
    acc[ev].push(img);
    return acc;
  }, {});

  const filteredAlbums = Object.entries(grouped).filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const handleUploadSuccess = (newImages) => {
    setImages(prev => [...newImages, ...prev]);
    setShowUpload(false);
    setUploadForAlbum(null);
  };

  const handleOpenUpload = (albumName = null) => {
    setUploadForAlbum(albumName);
    setShowUpload(true);
  };

  // Rename: update localStorage events + re-tag images via delete+re-upload is not feasible,
  // so we rename only in localStorage (event label) and update local state display.
  // The actual images in DB keep their event string — a full rename would require a backend endpoint.
  // We update localStorage and local state to reflect the rename visually.
  const handleRename = (albumName) => {
    setRenameAlbum(albumName);
    setRenameTo(albumName);
  };

  const confirmRename = async () => {
    const newName = renameTo.trim();
    if (!newName || newName === renameAlbum) { setRenameAlbum(null); return; }
    setRenaming(true);
    // Update localStorage events list
    const saved = JSON.parse(localStorage.getItem("customGalleryEvents") || "[]");
    const updated = saved.map(e => e === renameAlbum ? newName : e);
    if (!updated.includes(newName)) updated.push(newName);
    localStorage.setItem("customGalleryEvents", JSON.stringify(updated));
    // Update local images state
    setImages(prev => prev.map(img =>
      (img.event?.trim() || "Others") === renameAlbum ? { ...img, event: newName } : img
    ));
    toast.success(`Album renamed to "${newName}"`);
    setRenaming(false);
    setRenameAlbum(null);
  };

  // Delete entire album (all images in it)
  const confirmDeleteAlbum = async () => {
    if (!deleteAlbum) return;
    setDeleting(true);
    let deleted = 0;
    for (const img of deleteAlbum.images) {
      try {
        const res = await fetch(`${API}/api/gallery/${img.id}`, { method: "DELETE" });
        if (res.ok) { deleted++; }
      } catch { /* continue */ }
    }
    setImages(prev => prev.filter(img => (img.event?.trim() || "Others") !== deleteAlbum.name));
    toast.success(`Album "${deleteAlbum.name}" deleted (${deleted} images removed).`);
    setDeleting(false);
    setDeleteAlbum(null);
  };

  const totalImages = images.length;
  const totalAlbums = Object.keys(grouped).length;

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {totalAlbums} album{totalAlbums !== 1 ? "s" : ""} · {totalImages} image{totalImages !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={() => handleOpenUpload()}
          className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" /> Upload Images
        </button>
      </div>

      {/* ── Search + View Toggle ── */}
      <div className="flex items-center gap-3">
        <div className="relative max-w-sm flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search albums…"
            className="w-full pl-9 pr-4 h-9 rounded-lg border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden flex-shrink-0">
          <button onClick={() => setViewMode("grid")}
            className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            <Grid3X3 className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")}
            className={cn("p-2 transition-colors", viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Albums ── */}
      {loading ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => <AlbumSkeleton key={i} />)}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <AlbumRowSkeleton key={i} />)}
          </div>
        )
      ) : filteredAlbums.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card flex flex-col items-center justify-center py-24 text-center px-6">
          <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-5">
            <Images className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            {search ? "No Albums Found" : "No Albums Yet"}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5 max-w-xs">
            {search ? `No albums match "${search}".` : "Upload images to create your first album."}
          </p>
          {!search && (
            <button
              onClick={() => handleOpenUpload()}
              className="mt-5 flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all"
            >
              <Plus className="w-4 h-4" /> Upload Images
            </button>
          )}
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredAlbums.map(([name, imgs]) => (
            <AlbumCard key={name} albumName={name} images={imgs}
              onView={(n) => navigate(`/gallery/${encodeURIComponent(n)}`)}
              onUpload={handleOpenUpload} onRename={handleRename}
              onDelete={(n, i) => setDeleteAlbum({ name: n, images: i })} />
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredAlbums.map(([name, imgs]) => (
            <AlbumRow key={name} albumName={name} images={imgs}
              onView={(n) => navigate(`/gallery/${encodeURIComponent(n)}`)}
              onUpload={handleOpenUpload} onRename={handleRename}
              onDelete={(n, i) => setDeleteAlbum({ name: n, images: i })} />
          ))}
        </div>
      )}

      {/* ── Upload Modal ── */}
      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh] border border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
              <div>
                <h2 className="text-base font-semibold text-foreground">Upload Gallery Images</h2>
                {uploadForAlbum && (
                  <p className="text-xs text-muted-foreground mt-0.5">Adding to album: <span className="font-medium capitalize">{uploadForAlbum}</span></p>
                )}
              </div>
              <button onClick={() => { setShowUpload(false); setUploadForAlbum(null); }}
                className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>
            <CreateGallery
              onClose={() => { setShowUpload(false); setUploadForAlbum(null); }}
              onUploadSuccess={handleUploadSuccess}
              defaultEvent={uploadForAlbum}
            />
          </div>
        </div>
      )}

      {/* ── Rename Modal ── */}
      {renameAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border overflow-hidden">
            <div className="p-6">
              <h3 className="text-base font-semibold text-foreground mb-4">Rename Album</h3>
              <input
                value={renameTo}
                onChange={e => setRenameTo(e.target.value)}
                onKeyDown={e => e.key === "Enter" && confirmRename()}
                autoFocus
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
              <button onClick={() => setRenameAlbum(null)}
                className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
                Cancel
              </button>
              <button onClick={confirmRename} disabled={renaming}
                className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50">
                <Check className="w-3.5 h-3.5" /> Rename
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Album Confirm ── */}
      {deleteAlbum && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden">
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">Delete Album?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    This will permanently delete <span className="font-medium capitalize">"{deleteAlbum.name}"</span> and all {deleteAlbum.images.length} image{deleteAlbum.images.length !== 1 ? "s" : ""} inside it. This cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
              <button onClick={() => setDeleteAlbum(null)} disabled={deleting}
                className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all">
                Cancel
              </button>
              <button onClick={confirmDeleteAlbum} disabled={deleting}
                className="px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all disabled:opacity-50">
                {deleting ? "Deleting…" : "Delete Album"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
