import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import NoticeList from "@/components/NoticeList";
import CreateNotice from "@/components/forms/CreateNotice";
import { useDeleteNoticeMutation, useGetNoticePaginationMutation } from "@/redux/api/noticeApi";
import { Plus, List } from "lucide-react";

const ITEMS_PER_PAGE = 100;

const Notice = () => {
  const [getNoticePagination] = useGetNoticePaginationMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [mode, setMode] = useState("view");
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchNotice = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ page: 1, limit: ITEMS_PER_PAGE, publish_status: "" });
      const response = await getNoticePagination(query).unwrap();
      const releases = Array.isArray(response?.data?.data) ? response.data.data : [];
      setNotices(releases);
    } catch (error) {
      console.error("Error fetching notices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setMode("update");
  };

  const handleDelete = async (noticeId) => {
    try {
      const response = await deleteNotice({ noticeId });
      if (response?.data?.status) fetchNotice();
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  useEffect(() => { fetchNotice(); }, [getNoticePagination]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === "view" ? "Notices" : selectedNotice?.id ? "Edit Notice" : "Create Notice"}
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {mode === "view" ? "Manage and publish notices" : "Fill in the details below"}
          </p>
        </div>
        <Button
          onClick={() => { setMode(mode === "view" ? "create" : "view"); if (mode !== "view") setSelectedNotice({}); }}
          variant={mode === "view" ? "default" : "outline"}
          className="gap-2"
        >
          {mode === "view" ? <><Plus className="w-4 h-4" /> Create Notice</> : <><List className="w-4 h-4" /> Notices List</>}
        </Button>
      </div>

      {mode === "view" ? (
        <NoticeList
          currentNotices={notices}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
        />
      ) : (
        <CreateNotice
          mode={mode}
          setMode={setMode}
          selectedNotice={selectedNotice}
          onSuccess={fetchNotice}
        />
      )}
    </div>
  );
};

export default Notice;
