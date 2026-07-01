import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { DeleteIcon, Edit } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";

const PressReleaseList = ({
  currentPressReleases,
  currentPage,
  totalPages,
  handlePageChange,
  handleEdit,
  handleDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [pressReleaseId, setPressReleaseId] = useState(null);



  return (
    <div>
      {isDialogOpen && (
        <AlertDialog
          onSubmit={() => {
            handleDelete(pressReleaseId);
            setIsDialogOpen(false);
            setPressReleaseId(null);
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setPressReleaseId(null);
          }}
          warningMessage="Delete"
          isCancel={true}
          message="Are you sure want to delete press release?"
        />
      )}

      <div className="relative">
        {/* Table Header */}
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <tr className="text-left">
              <th style={{ width: "10%" }}>Image</th>
              <th style={{ width: "25%" }} className="py-2 border-b border-gray-300">
                Title
              </th>
              <th style={{ width: "30%" }} className="py-2 border-b border-gray-300">
                Content
              </th>
              <th style={{ width: "10%" }} className="py-2 border-b border-gray-300">
                Author
              </th>
              <th style={{ width: "10%" }} className="py-2 border-b border-gray-300">
                Status
              </th>
              <th style={{ width: "10%" }} className="py-2 border-b border-gray-300">
                Publish Date
              </th>
              <th style={{ width: "5%" }} className="py-2 border-b border-gray-300">
                Action
              </th>
            </tr>
          </thead>
        </table>

        {/* Scrollable Body */}
        <div className="overflow-y-auto max-h-[500px]">
          <table className="table-fixed w-full border-collapse">
            <tbody>
              {currentPressReleases?.map((pressRelease) => (
                <tr key={pressRelease.id} className="hover:bg-slate-200 text-left">
                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    <CustomImage
                  
                      src={pressRelease.featuredImage}
                      className="h-16 w-20 object-cover rounded"
                    />
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "25%" }}
                  >
                    {pressRelease.title}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "30%" }}
                  >
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: pressRelease.content,
                      }}
                    />
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {pressRelease.author}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {pressRelease.publishStatus}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {new Date(pressRelease.publishDate)
                      .toISOString()
                      .split("T")[0]}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300 space-x-2"
                    style={{ width: "5%" }}
                  >
                    <button onClick={() => handleEdit(pressRelease)}>
                      <Edit color="blue" />
                    </button>

                    <button
                      onClick={() => {
                        setPressReleaseId(pressRelease.id);
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

PressReleaseList.propTypes = {
  currentPressReleases: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default PressReleaseList;