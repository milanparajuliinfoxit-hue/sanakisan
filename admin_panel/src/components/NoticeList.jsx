import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DeleteIcon, Edit } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";

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

  return (
    <div>
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
                    <CustomImage
                      src={notice.featuredImage}
                      className="h-16 w-20 object-cover rounded"
                    />
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