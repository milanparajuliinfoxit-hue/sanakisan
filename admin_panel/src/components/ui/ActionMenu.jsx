import { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shared portal-based action menu used across all admin list pages.
 * Renders into document.body to escape any overflow:hidden parent containers.
 * Automatically flips position when near viewport edges.
 */
export function ActionMenu({ onEdit, onDelete, items }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, openUp: false });
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const MENU_WIDTH = 152;
  const MENU_HEIGHT = 88; // approx height for 2 items

  const calculatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const spaceBelow = viewportHeight - rect.bottom;
    const spaceRight = viewportWidth - rect.left;

    const openUp = spaceBelow < MENU_HEIGHT + 8;
    const openLeft = spaceRight < MENU_WIDTH + 8;

    setCoords({
      top: openUp ? rect.top - MENU_HEIGHT - 4 : rect.bottom + 4,
      left: openLeft ? rect.right - MENU_WIDTH : rect.left,
      openUp,
    });
  }, []);

  const handleOpen = (e) => {
    e.stopPropagation();
    if (!open) calculatePosition();
    setOpen((v) => !v);
  };

  // Close on outside click or scroll
  useEffect(() => {
    if (!open) return;
    const close = (e) => {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        triggerRef.current && !triggerRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    const closeOnScroll = () => setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("scroll", closeOnScroll, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("scroll", closeOnScroll, true);
    };
  }, [open]);

  // Default items: Edit + Delete
  const menuItems = items ?? [
    {
      label: "Edit",
      icon: <Pencil className="w-3.5 h-3.5 text-muted-foreground" />,
      onClick: () => { setOpen(false); onEdit?.(); },
      className: "text-foreground hover:bg-muted",
    },
    { type: "separator" },
    {
      label: "Delete",
      icon: <Trash2 className="w-3.5 h-3.5" />,
      onClick: () => { setOpen(false); onDelete?.(); },
      className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30",
    },
  ];

  return (
    <>
      <button
        ref={triggerRef}
        onClick={handleOpen}
        aria-haspopup="true"
        aria-expanded={open}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          role="menu"
          style={{
            position: "fixed",
            top: coords.top,
            left: coords.left,
            width: MENU_WIDTH,
            zIndex: 9999,
          }}
          className="bg-popover border border-border rounded-xl shadow-lg py-1 animate-scale-in"
        >
          {menuItems.map((item, i) =>
            item.type === "separator" ? (
              <div key={i} className="my-1 border-t border-border" />
            ) : (
              <button
                key={i}
                role="menuitem"
                onClick={item.onClick}
                className={cn(
                  "w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:bg-muted",
                  item.className
                )}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>,
        document.body
      )}
    </>
  );
}

export default ActionMenu;
