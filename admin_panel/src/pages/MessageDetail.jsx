import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft, Mail, Phone, User, Calendar, Clock, Globe,
  Monitor, Smartphone, Cpu, MessageSquare, Archive, Trash2,
  X, CheckCircle2, Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useGetContactMessageByIdQuery,
  useMarkMessageAsReadMutation,
  useUpdateMessageStatusMutation,
  useDeleteContactMessageMutation,
} from "@/redux/api/contactMessageApi";

const statusBadge = (status, size = "sm") => {
  const map = {
    NEW: { label: "NEW", cls: "bg-blue-50 text-blue-700 border-blue-200 ring-blue-500/20", dot: "bg-blue-500" },
    READ: { label: "READ", cls: "bg-amber-50 text-amber-700 border-amber-200 ring-amber-500/20", dot: "bg-amber-500" },
    REPLIED: { label: "REPLIED", cls: "bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-500/20", dot: "bg-emerald-500" },
    ARCHIVED: { label: "ARCHIVED", cls: "bg-slate-100 text-slate-500 border-slate-200 ring-slate-500/20", dot: "bg-slate-400" },
  };
  const s = map[status] || map.NEW;
  const sizeCls = size === "lg" ? "px-3 py-1.5 text-sm gap-2" : "px-2.5 py-1 text-xs gap-1.5";
  return (
    <span className={cn("inline-flex items-center rounded-full font-medium border ring-1", sizeCls, s.cls)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
};

function InfoRow({ icon: Icon, label, value, mono }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={cn("mt-0.5 text-sm text-foreground break-words", mono && "font-mono text-xs")}>
          {value || "—"}
        </p>
      </div>
    </div>
  );
}

function parseUserAgent(ua) {
  if (!ua) return { browser: "—", os: "—" };
  let browser = "Unknown";
  let os = "Unknown";

  if (ua.includes("Firefox/")) browser = "Firefox";
  else if (ua.includes("Edg/")) browser = "Edge";
  else if (ua.includes("Chrome/")) browser = "Chrome";
  else if (ua.includes("Safari/")) browser = "Safari";
  else if (ua.includes("MSIE") || ua.includes("Trident/")) browser = "Internet Explorer";

  if (ua.includes("Windows NT 10")) os = "Windows 10";
  else if (ua.includes("Windows NT 11")) os = "Windows 11";
  else if (ua.includes("Windows NT 6.3")) os = "Windows 8.1";
  else if (ua.includes("Windows NT 6.1")) os = "Windows 7";
  else if (ua.includes("Mac OS X")) os = "macOS";
  else if (ua.includes("Linux") && ua.includes("Android")) os = "Android";
  else if (ua.includes("iPhone") || ua.includes("iPad")) os = "iOS";
  else if (ua.includes("Linux")) os = "Linux";

  return { browser, os };
}

function StatusChangeModal({ currentStatus, onClose, onConfirm, loading }) {
  const [selected, setSelected] = useState(currentStatus);
  const statuses = ["NEW", "READ", "REPLIED", "ARCHIVED"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-sm border border-border" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <h2 className="text-base font-semibold text-foreground">Change Status</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setSelected(s)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all",
                selected === s
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : "border-border text-muted-foreground hover:border-muted-foreground/30 hover:bg-muted/50"
              )}
            >
              <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0", selected === s ? "border-primary" : "border-muted-foreground/40")}>
                {selected === s && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
              </div>
              <span className="flex items-center gap-2">{statusBadge(s)}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-border bg-muted/50">
          <button onClick={onClose} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
            Cancel
          </button>
          <button
            onClick={() => onConfirm(selected)}
            disabled={loading || selected === currentStatus}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving…</> : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ArchiveConfirm({ item, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Archive className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Archive Message?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                This message from <span className="font-medium text-foreground">{item.full_name}</span> will be moved to archive.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
          <button onClick={onCancel} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all disabled:opacity-50">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Archiving…</> : <><Archive className="w-3.5 h-3.5" /> Archive</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function DeleteConfirm({ item, onCancel, onConfirm, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onCancel}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md border border-border overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <Trash2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-foreground">Delete Message?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Are you sure you want to permanently delete this message from <span className="font-medium text-foreground">{item.full_name}</span>? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-muted/50 border-t border-border">
          <button onClick={onCancel} disabled={loading}
            className="px-4 h-9 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:bg-muted transition-all disabled:opacity-50">
            Cancel
          </button>
          <button onClick={onConfirm} disabled={loading}
            className="flex items-center gap-2 px-4 h-9 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-all disabled:opacity-50">
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting…</> : <><Trash2 className="w-3.5 h-3.5" /> Delete</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-pulse max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <div className="w-9 h-9 rounded-xl bg-muted" />
        <div className="h-6 w-48 bg-muted rounded" />
        <div className="h-6 w-20 bg-muted rounded-full" />
      </div>
      <div className="h-48 bg-muted rounded-2xl" />
      <div className="h-64 bg-muted rounded-2xl" />
      <div className="h-40 bg-muted rounded-2xl" />
    </div>
  );
}

export default function MessageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [markAsRead] = useMarkMessageAsReadMutation();
  const [updateStatus, { isLoading: statusLoading }] = useUpdateMessageStatusMutation();
  const [deleteMessage, { isLoading: deleteLoading }] = useDeleteContactMessageMutation();

  const { data: res, isLoading, error } = useGetContactMessageByIdQuery(id);
  const item = res?.data;

  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (item && !item.is_read) {
      markAsRead(item.id);
    }
  }, [item?.id]);

  if (isLoading) return <DetailSkeleton />;

  if (error || !item) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="w-16 h-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
            <MessageSquare className="w-8 h-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Message Not Found</h2>
          <p className="text-sm text-muted-foreground mt-1.5 mb-6">The message you are looking for does not exist or has been removed.</p>
          <button onClick={() => navigate("/messages")}
            className="flex items-center gap-2 px-4 h-10 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
            <ArrowLeft className="w-4 h-4" /> Back to Messages
          </button>
        </div>
      </div>
    );
  }

  const { browser, os } = parseUserAgent(item.user_agent);

  const handleStatusChange = async (newStatus) => {
    try {
      const res2 = await updateStatus({ id: item.id, status: newStatus }).unwrap();
      toast.success(res2.message);
      setShowStatusModal(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update status.");
    }
  };

  const handleArchive = async () => {
    try {
      const res2 = await deleteMessage(item.id).unwrap();
      toast.success(res2.message);
      setShowArchiveModal(false);
      navigate("/messages");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to archive.");
    }
  };

  const handleDelete = async () => {
    try {
      const res2 = await deleteMessage(item.id).unwrap();
      toast.success(res2.message);
      setShowDeleteModal(false);
      navigate("/messages");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete.");
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* ── Header ───────────────────────────────────────────── */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => navigate("/messages")}
              className="w-9 h-9 rounded-xl border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all flex-shrink-0"
              title="Back to Messages"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground truncate">
                Message #{item.id}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                {new Date(item.createdAt).toLocaleString("en-US", {
                  day: "numeric", month: "long", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {statusBadge(item.status, "lg")}
          </div>
        </div>

        {/* ── Action Buttons ───────────────────────────────────── */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowStatusModal(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-all"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            Change Status
          </button>
          {item.status !== "ARCHIVED" && (
            <button
              onClick={() => setShowArchiveModal(true)}
              className="flex items-center gap-2 px-4 h-9 rounded-lg border border-border text-sm font-medium text-foreground hover:bg-muted transition-all"
            >
              <Archive className="w-3.5 h-3.5" />
              Archive
            </button>
          )}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center gap-2 px-4 h-9 rounded-lg border border-destructive/30 text-sm font-medium text-destructive hover:bg-destructive/5 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>

        {/* ── Contact Information Card ─────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Contact Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InfoRow icon={User} label="Full Name" value={item.full_name} />
              <InfoRow icon={Mail} label="Email" value={item.email} />
              <InfoRow icon={Phone} label="Phone" value={item.phone} />
            </div>
          </div>
        </div>

        {/* ── Message Card ─────────────────────────────────────── */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
              Message
            </h2>
          </div>
          <div className="p-6">
            <div className="bg-background rounded-xl border border-border p-5 md:p-6 max-h-[500px] overflow-y-auto">
              <p className="text-sm md:text-base text-foreground leading-relaxed whitespace-pre-wrap break-words">
                {item.message}
              </p>
            </div>
          </div>
        </div>

        {/* ── Submission Information Card ──────────────────────── */}
        <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Submission Information
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="sm:col-span-2 lg:col-span-1">
                <InfoRow
                  icon={Calendar}
                  label="Submitted At"
                  value={new Date(item.createdAt).toLocaleString("en-US", {
                    day: "numeric", month: "long", year: "numeric",
                    hour: "2-digit", minute: "2-digit",
                  })}
                />
              </div>
              {item.read_at && (
                <div>
                  <InfoRow
                    icon={Clock}
                    label="Read At"
                    value={new Date(item.read_at).toLocaleString("en-US", {
                      day: "numeric", month: "long", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  />
                </div>
              )}
              <div>
                <InfoRow icon={Globe} label="Status" value={statusBadge(item.status)} />
              </div>
              <div>
                <InfoRow icon={Globe} label="IP Address" value={item.ip_address} mono />
              </div>
              <div>
                <InfoRow icon={Monitor} label="Browser" value={browser} />
              </div>
              <div>
                <InfoRow icon={Cpu} label="Operating System" value={os} />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <InfoRow
                  icon={Smartphone}
                  label="User Agent"
                  value={item.user_agent}
                  mono
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── Modals ─────────────────────────────────────────────── */}
      {showStatusModal && (
        <StatusChangeModal
          currentStatus={item.status}
          onClose={() => setShowStatusModal(false)}
          onConfirm={handleStatusChange}
          loading={statusLoading}
        />
      )}
      {showArchiveModal && (
        <ArchiveConfirm
          item={item}
          onCancel={() => setShowArchiveModal(false)}
          onConfirm={handleArchive}
          loading={deleteLoading}
        />
      )}
      {showDeleteModal && (
        <DeleteConfirm
          item={item}
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={handleDelete}
          loading={deleteLoading}
        />
      )}
    </div>
  );
}
