import { useState, useCallback } from "react";

const MIN_ZOOM = 50;
const MAX_ZOOM = 200;
const STEP = 25;

export function useDocument() {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const zoomIn = useCallback(() =>
    setZoom((z) => Math.min(z + STEP, MAX_ZOOM)), []);

  const zoomOut = useCallback(() =>
    setZoom((z) => Math.max(z - STEP, MIN_ZOOM)), []);

  const fitScreen = useCallback(() => setZoom(100), []);

  const toggleFullscreen = useCallback(() =>
    setIsFullscreen((f) => !f), []);

  const resetZoom = useCallback(() => {
    setZoom(100);
    setIsFullscreen(false);
  }, []);

  const download = useCallback(async (url, filename = "notice") => {
    if (!url) return;
    setDownloading(true);
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const ext = blob.type.includes("pdf") ? ".pdf"
        : blob.type.includes("png") ? ".png" : ".jpg";
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${filename}${ext}`;
      link.click();
      URL.revokeObjectURL(link.href);
    } catch {
      // fallback: open in new tab
      window.open(url, "_blank");
    } finally {
      setDownloading(false);
    }
  }, []);

  return {
    zoom, zoomIn, zoomOut, fitScreen,
    isFullscreen, toggleFullscreen,
    resetZoom, downloading, download,
    canZoomIn: zoom < MAX_ZOOM,
    canZoomOut: zoom > MIN_ZOOM,
  };
}
