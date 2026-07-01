const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Notices
export const fetchNotices = async (limit = 10, page = 1) => {
  const res = await fetch(
    `${API_BASE}/getnoticepagination?limit=${limit}&page=${page}&publish_status=published`,
  );

  if (!res.ok) throw new Error("Failed to fetch notices");

  const data = await res.json();
  return data.data.data;
};
//fettch notice
export const fetchNoticeById = async (id) => {
  const res = await fetch(`${API_BASE}/getnotice?noticeId=${id}`);

  if (!res.ok) throw new Error("Failed to fetch notice");

  const data = await res.json();
  return data.data;
};

// Blogs / Press Releases
export const fetchBlogs = async (limit = 10, page = 1) => {
  const res = await fetch(
    `${API_BASE}/getallpressrelease?limit=${limit}&page=${page}&publish_status=published&status=1`
  );

  const data = await res.json();
  const inner = data.data;

  return {
    data: inner?.data || [],
    totalItems: inner?.totalItems || 0,
  };
};

export const fetchBlogById = async (id) => {
  const res = await fetch(`${API_BASE}/getpressrelease?pressReleaseId=${id}`);

  if (!res.ok) throw new Error("Failed to fetch blog");

  const data = await res.json();
  return data.data;
};

// Gallery
export const fetchGallery = async (event = "") => {
  const url = event
    ? `${API_BASE}/gallery?event=${event}`
    : `${API_BASE}/gallery`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch gallery");

  return res.json();
};

// Events
export const fetchEvents = async (limit = 10, page = 1) => {
  const res = await fetch(
    `${API_BASE}/geteventpagination?limit=${limit}&page=${page}&publish_status=published`,
  );

  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  return data.data.data;
};

export const fetchEventById = async (id) => {
  const res = await fetch(`${API_BASE}/getevent?eventId=${id}`);
  if (!res.ok) throw new Error("Failed to fetch event");
  const data = await res.json();
  return data.data;
};

// Images
export const getImageUrl = (filename) => {
  if (!filename) return null;

  if (filename.startsWith("http")) {
    return filename;
  }

  const base = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  return `${base.replace("/api", "")}/${filename}`;
};
