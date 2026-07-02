import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { FileText, Upload, Eye, Trash2, RefreshCw, X, ZoomIn, ZoomOut } from "lucide-react";
import AlertDialog from "../components/AlertDialog";

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

// ─── Upload / Edit Form ────────────────────────────────────────────────────
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
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 mb-6">
        {existing ? "Replace Bada Patra Image" : "Upload Bada Patra"}
      </h2>
      <form onSubmit={onSubmit} className="space-y-6">
        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
            dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 bg-gray-50"
          }`}
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
              <Upload className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600 font-medium">Click or drag & drop to upload</p>
              <p className="text-xs text-gray-400 mt-1">JPG, JPEG, PNG, WEBP · Max 2MB</p>
            </div>
          )}
        </div>

        {preview && (
          <button
            type="button"
            onClick={() => { setFile(null); setPreview(existing ? imageUrl(existing.image) : null); }}
            className="text-xs text-red-500 hover:underline"
          >
            Remove selected image
          </button>
        )}

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium transition"
          >
            {loading ? "Saving..." : existing ? "Update" : "Save"}
          </button>
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

// ─── View Modal ────────────────────────────────────────────────────────────
function ViewModal({ record, onClose }) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h3 className="text-lg font-bold text-gray-800">नागरिक बडा पत्र — Preview</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => setZoom((z) => Math.max(0.5, z - 0.25))} className="p-2 rounded-lg hover:bg-gray-100">
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-500 w-12 text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(3, z + 0.25))} className="p-2 rounded-lg hover:bg-gray-100">
              <ZoomIn className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 ml-2">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className="overflow-auto max-h-[75vh] flex items-center justify-center bg-gray-50 p-6">
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

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function BadaPatra() {
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list"); // list | form
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
      <div className="p-6 max-w-5xl mx-auto">
        <BadaPatraForm
          existing={record}
          onSuccess={handleSuccess}
          onCancel={() => setMode("list")}
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">नागरिक बडा पत्र</h1>
          <p className="text-gray-500 mt-1">Manage the official Bada Patra document image</p>
        </div>
        {!record && !loading && (
          <button
            onClick={() => setMode("form")}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium transition shadow-md"
          >
            <Upload className="w-4 h-4" />
            Upload Bada Patra
          </button>
        )}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-xl font-semibold text-gray-800">Current Bada Patra</h2>
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : !record ? (
          <div className="py-20 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
              <FileText className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-700">No Bada Patra uploaded yet</h3>
            <p className="text-gray-500 mt-1 mb-6">Upload the official document image to display it on the website.</p>
            <button
              onClick={() => setMode("form")}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium transition"
            >
              <Upload className="w-4 h-4" />
              Upload Now
            </button>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex flex-col sm:flex-row gap-6 items-start">
              {/* Thumbnail */}
              <div
                className="w-full sm:w-48 h-48 rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition flex-shrink-0"
                onClick={() => setViewOpen(true)}
              >
                <img
                  src={imageUrl(record.image)}
                  alt="Bada Patra"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Meta */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Uploaded</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(record.createdAt).toLocaleDateString("en-NP", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-gray-500 mb-1">Last Updated</p>
                    <p className="text-gray-800 font-medium">
                      {new Date(record.updatedAt).toLocaleDateString("en-NP", {
                        year: "numeric", month: "long", day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setViewOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm transition"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => setMode("form")}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Replace
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-medium text-sm transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
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
