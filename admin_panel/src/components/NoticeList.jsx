// components/NoticeList.jsx
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DeleteIcon, Edit } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";
import { useImage } from "@/hooks/useImage";

const NoticeList = ({
  currentNotices,
  currentPage,
  totalPages,
  handlePageChange,
  handleEdit,
  handleDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [noticeId, setNoticeId] = useState(null);
  const [previewPath, setPreviewPath] = useState(null);
  
  // Use the hook to fetch the preview image
  const { imageUrl: previewImageUrl, isLoading: isPreviewLoading } = useImage(previewPath);

  // Add keyboard support for ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && previewPath) {
        closePreview();
      }
    };
    
    document.addEventListener('keydown', handleEsc);
    
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [previewPath]);

  const showImagePreview = (imgPath) => {
    if (imgPath) {
      setPreviewPath(imgPath);
    }
  };

  const closePreview = () => {
    setPreviewPath(null);
  };

  return (
    <div>
      {/* Delete Dialog */}
      {isDialogOpen && (
        <AlertDialog
          onSubmit={() => {
            handleDelete(noticeId);
            setIsDialogOpen(false);
            setNoticeId(null);
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setNoticeId(null);
          }}
          warningMessage="Delete"
          isCancel={true}
          message="Are you sure want to delete notice?"
        />
      )}

      {/* Image Preview Modal */}
      {previewPath && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closePreview}
        >
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePreview}
              className="absolute -top-10 right-0 text-white text-4xl hover:text-gray-300"
            >
              ✕
            </button>

            {/* Large Image */}
            <div className="min-w-[200px] min-h-[200px] flex items-center justify-center">
              {isPreviewLoading ? (
                <div className="flex flex-col items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mb-4"></div>
                  <span>Loading image...</span>
                </div>
              ) : (
                <img
                  src={previewImageUrl || "/assets/image-placeholder.png"}
                  alt="Preview"
                  className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
                  onError={(e) => {
                    console.error('Preview image failed to load');
                    e.target.onerror = null;
                    e.target.src = '/assets/image-placeholder.png';
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        {/* Header */}
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <tr className="text-left">
              <th style={{ width: "10%" }}>Image</th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "20%" }}
              >
                Title
              </th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "30%" }}
              >
                Content
              </th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "10%" }}
              >
                Author
              </th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "10%" }}
              >
                Status
              </th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "15%" }}
              >
                Publish Date
              </th>
              <th
                className="py-2 font-medium border-b border-gray-300"
                style={{ width: "5%" }}
              >
                Action
              </th>
            </tr>
          </thead>
        </table>

        {/* Body */}
        <div className="overflow-y-auto max-h-[500px]">
          <table className="table-fixed w-full border-collapse">
            <tbody>
              {currentNotices?.map((notice) => (
                <tr key={notice.id} className="hover:bg-slate-200 text-left">
                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    <div 
                      onClick={() => showImagePreview(notice.featuredImage)}
                      className="cursor-pointer"
                    >
                      <CustomImage
                        src={notice.featuredImage}
                        className="h-16 w-20 object-cover rounded hover:opacity-80 transition"
                        alt={notice.title}
                      />
                    </div>
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "20%" }}
                  >
                    {notice.title}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "30%" }}
                  >
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: notice.content,
                      }}
                    />
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {notice.author}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {notice.publishStatus}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "15%" }}
                  >
                    {new Date(notice.publishDate).toISOString().split("T")[0]}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300 space-x-2"
                    style={{ width: "5%" }}
                  >
                    <button onClick={() => handleEdit(notice)}>
                      <Edit color="blue" />
                    </button>

                    <button
                      onClick={() => {
                        setNoticeId(notice.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      <DeleteIcon color="red" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </Button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <Button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

NoticeList.propTypes = {
  currentNotices: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default NoticeList;