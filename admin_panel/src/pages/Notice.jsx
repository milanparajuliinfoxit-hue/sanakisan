import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import NoticeList from '@/components/NoticeList';
import CreateNotice from '@/components/forms/CreateNotice';
import { useDeleteNoticeMutation, useGetNoticePaginationMutation } from '@/redux/api/noticeApi';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 100;

const Notice = () => {
  const [getNoticePagination] = useGetNoticePaginationMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const [mode, setMode] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState({});
  const totalPages = Math.ceil(notices.length / ITEMS_PER_PAGE);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const fetchNotice = async () => {
    try {
      const query = new URLSearchParams({
        page: 1,
        limit: ITEMS_PER_PAGE,
        publish_status: '',
      });
      const response = await getNoticePagination(query).unwrap();
      const releases = Array.isArray(response?.data?.data) ? response.data.data : [];
      setNotices(releases);
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentNotices = notices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => {
    fetchNotice();
  }, [getNoticePagination]);


  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setMode('update');
  };

  const handleDelete = async (noticeId) => {
    try {
      const response = await deleteNotice({ noticeId });
      if (response?.data?.status) {
        toast.success(response?.data.message);
        fetchNotice();
      }
    } catch (error) {
      throw new Error(error?.message);
    }

  };
  return (
    <div className="flex flex-col space-y-4 py-4 px-6">
      <div className="flex justify-between mb-4 items-center">
        <CardTitle className="text-blue-700">{mode == 'view' ? "All Notices" : "Create Notice"}</CardTitle>
        <Button
          onClick={() => setMode(mode == 'view' ? "create" : 'view')}
          className="text-lg">{mode !== 'view' ? "Notices List" : "Create Notice"}</Button>
      </div>
      {mode == "view" ?
        <NoticeList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentNotices={currentNotices}
          currentPage={currentPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        /> : <CreateNotice
          mode={mode}
          setMode={setMode}
          selectedNotice={selectedNotice}
        />}
    </div>
  );
};

export default Notice


