const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getBadaPatra = async () => {
  const res = await fetch(`${API_BASE}/bada-patra`);
  if (!res.ok) throw new Error("Failed to fetch Bada Patra");
  const data = await res.json();
  return data.data || null;
};
