import { useState, useEffect, useMemo, useRef } from "react";
import { fetchNotices } from "../api/config";
import { useDebounce } from "./useDebounce";

const LIMIT = 9;

export function useNotices() {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, 300);
  const prevSearch = useRef(debouncedSearch);

  useEffect(() => {
    // Reset page when search changes without a separate setState effect
    const effectivePage = prevSearch.current !== debouncedSearch ? 1 : page;
    prevSearch.current = debouncedSearch;
    if (effectivePage !== page) { setPage(effectivePage); return; }

    let cancelled = false;
    fetchNotices(LIMIT, effectivePage)
      .then((data) => {
        if (cancelled) return;
        const items = data?.data || data?.notices || data?.rows || data || [];
        const count = data?.total || data?.count || items.length;
        setNotices(Array.isArray(items) ? items : []);
        setTotal(count);
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [page, debouncedSearch]);

  const filtered = useMemo(() =>
    debouncedSearch
      ? notices.filter((n) =>
          n.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
          n.description?.toLowerCase().includes(debouncedSearch.toLowerCase())
        )
      : notices,
    [notices, debouncedSearch]
  );

  const totalPages = Math.ceil(total / LIMIT);

  return {
    notices: filtered,
    loading,
    page,
    setPage,
    total,
    totalPages,
    search,
    setSearch,
    debouncedSearch,
    LIMIT,
  };
}
