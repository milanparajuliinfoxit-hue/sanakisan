import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Upload, Eye, Trash2, RefreshCw, X, ZoomIn, ZoomOut, Download } from "lucide-react";
import AlertDialog from "../components/AlertDialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const API = import.meta.env.VITE_REACT_APP_API_URL;

const getToken = () => {
  try {
    const persisted = JSON.parse(localStorage.getItem("persist:root") || "{}");
    const auth = JSON.parse(persisted.auth || "{}");
    return auth.access_token || null;
  } catch {
    return null;
  }
};

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${getToken()}` },
});

const imageUrl = (filename) =>
  filename ? `${API}/${filename}` : null;

function BadaPatraForm({ existing, onSuccess, onCancel }) {
  const inputRef = useRef(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(existing ? imageUrl(existing.image) : null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (f) => {
    if (!f) return;
    const allowed = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowed.includes(f.type)) {
      toast.error("Only jpg, jpeg, png, webp allowed.");
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      toast.error("File must be under 2MB.");
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file && !existing) {
      toast.error("Please select an image.");
      return;
    }
    setLoading(true);
    try {
      const form = new FormData();
      if (file) form.append("image", file);

      if (existing) {
        await axios.put(`${API}/api/admin/bada-patra/${existing.id}`, form, authHeaders());
        toast.success("Bada Patra updated successfully.");
      } else {
        await axios.post(`${API}/api/admin/bada-patra`, form, authHeaders());
        toast.success("Bada Patra uploaded successfully.");
      }
      onSuccess();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border bg-card max-w-lg">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-lg font-semibold text-foreground">
          {existing ? "Replace Bada Patra Image" : "Upload Bada Patra"}
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">Upload an official document image</p>
      </div>
      <form onSubmit={onSubmit} className="p-5 space-y-5">
        <div
          className={cn(
            "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors",
            dragOver ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-muted/30"
          )}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => handleFile(e.target.files[0])}
          />
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="max-h-64 mx-auto rounded-lg object-contain shadow"
            />
          ) : (
            <div className="py-8">
              <Upload className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-foreground font-medium">Click or drag & drop to upload</p>
              <p className="text-xs text-muted-foreground mt-1">JPG, JPEG, PNG, WEBP · Max 2MB</p>
            </div>
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={() => { setFile(null); setPreview(existing ? imageUrl(existing.image) : null); }}
            className="text-xs text-destructive hover:underline"
          >
            Remove selected image
          </button>
        )}

        <div className="flex gap-3 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : existing ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
}

BadaPatraForm.propTypes = {
  existing: PropTypes.shape({
    id: PropTypes.number,
    image: PropTypes.string,
  }),
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

BadaPatraForm.defaultProps = {
  existing: null,
};

function ViewModal({ record, onClose }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h3 className="text-base font-semibold text-foreground">नागरिक बडा पत्र — Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Zoom out">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-xs text-muted-foreground w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="p-1.5 rounded-lg hover:bg-accent transition-colors" title="Zoom in">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = imageUrl(record.image);
                link.download = "bada-patra";
                link.click();
              }}
              className="p-1.5 rounded-lg hover:bg-accent transition-colors ml-1"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-accent transition-colors ml-1" title="Close">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-muted/30 p-6">
          <img
            src={imageUrl(record.image)}
            alt="Bada Patra"
            style={{ transform: `scale(${zoom})`, transformOrigin: "center", transition: "transform 0.2s" }}
            className="rounded-lg shadow-lg max-w-full"
          />
        </div>
      </div>
    </div>
  );
}

ViewModal.propTypes = {
  record: PropTypes.shape({
    image: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default function BadaPatra() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const fetchBadaPatra = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/api/bada-patra`);
      setRecord(res.data.data || null);
    } catch {
      toast.error("Failed to load Bada Patra.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBadaPatra(); }, []);

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/api/admin/bada-patra/${record.id}`, authHeaders());
      toast.success("Bada Patra deleted.");
      setRecord(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed.");
    } finally {
      setDeleteConfirm(false);
    }
  };

  const handleSuccess = () => {
    setMode("list");
    fetchBadaPatra();
  };

  if (mode === "form") {
    return (
      <div className="p-6 animate-fade-in">
        <BadaPatraForm
          existing={record}
          onSuccess={handleSuccess}
          onCancel={() => setMode("list")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">नागरिक बडा पत्र</h1>
          <p className="text-muted-foreground mt-1">Manage the official Bada Patra document image</p>
        </div>
        {!record && !loading && (
          <Button onClick={() => setMode("form")} className="gap-2">
            <Upload className="w-4 h-4" /> Upload Bada Patra
          </Button>
        )}
      </div>

      {/* Content */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="text-base font-semibold text-foreground">Current Bada Patra</h2>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading...</p>
          </div>
        ) : !record ? (
          <div className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No Bada Patra uploaded yet</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-6">Upload the official document image to display it on the website.</p>
            <Button onClick={() => setMode("form")} className="gap-2">
              <Upload className="w-4 h-4" /> Upload Now
            </Button>
          </div>
        ) : (
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Thumbnail */}
              <div
                className="w-full sm:w-48 h-48 rounded-xl overflow-hidden border border-border shadow-sm cursor-pointer group flex-shrink-0"
                onClick={() => setViewOpen(true)}
              >
                <img
                  src={imageUrl(record.image)}
                  alt="Bada Patra"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>

              {/* Meta */}
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-semibold text-foreground mb-4">Document Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Uploaded</p>
                    <p className="text-foreground font-medium">
                      {record.createdAt ? new Date(record.createdAt).toLocaleDateString("en-NP", {
                        year: "numeric", month: "long", day: "numeric",
                      }) : "N/A"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-foreground font-medium">
                      {record.updatedAt ? new Date(record.updatedAt).toLocaleDateString("en-NP", {
                        year: "numeric", month: "long", day: "numeric",
                      }) : "N/A"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => setViewOpen(true)} className="gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> View
                  </Button>
                  <Button size="sm" onClick={() => setMode("form")} className="gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5" /> Replace
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => setDeleteConfirm(true)} className="gap-1.5">
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* View Modal */}
      {viewOpen && record && (
        <ViewModal record={record} onClose={() => setViewOpen(false)} />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <AlertDialog
          warningMessage="Delete Bada Patra?"
          message="This will permanently remove the Bada Patra image from the website. This action cannot be undone."
          submitText="Yes, Delete"
          cancelText="Cancel"
          isCancel
          onSubmit={handleDelete}
          onCancel={() => setDeleteConfirm(false)}
        />
      )}
    </div>
  );
}
