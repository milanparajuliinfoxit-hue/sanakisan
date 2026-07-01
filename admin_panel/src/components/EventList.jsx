import { useState } from "react";
import PropTypes from "prop-types";
import { Button } from "./ui/button";
import { DeleteIcon, Edit } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";

const EventList = ({
  currentEvents,
  currentPage,
  totalPages,
  handlePageChange,
  handleEdit,
  handleDelete,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventId, setEventId] = useState(null);

  return (
    <div>
      {isDialogOpen && (
        <AlertDialog
          onSubmit={() => {
            handleDelete(eventId);
            setIsDialogOpen(false);
            setEventId(null);
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setEventId(null);
          }}
          warningMessage="Delete"
          isCancel={true}
          message="Are you sure want to delete event?"
        />
      )}

      <div className="relative">
        {/* Table Header */}
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <tr className="text-left">
              <th style={{ width: "10%" }}>Image</th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "20%" }}
              >
                Title
              </th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "30%" }}
              >
                Content
              </th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "10%" }}
              >
                Author
              </th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "10%" }}
              >
                Status
              </th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "15%" }}
              >
                Event Date
              </th>
              <th
                className="py-2 border-b border-gray-300"
                style={{ width: "5%" }}
              >
                Action
              </th>
            </tr>
          </thead>
        </table>

        {/* Table Body */}
        <div className="overflow-y-auto max-h-[500px]">
          <table className="table-fixed w-full border-collapse">
            <tbody>
              {currentEvents?.map((event) => (
                <tr key={event.id} className="hover:bg-slate-200 text-left">
                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    <CustomImage
                      src={event.featuredImage}
                      className="h-16 w-20 object-cover rounded"
                    />
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "20%" }}
                  >
                    {event.title}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "30%" }}
                  >
                    <div
                      className="line-clamp-3"
                      dangerouslySetInnerHTML={{
                        __html: event.content,
                      }}
                    />
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {event.author}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "10%" }}
                  >
                    {event.publish_status}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300"
                    style={{ width: "15%" }}
                  >
                    {new Date(event.event_date).toISOString().split("T")[0]}
                  </td>

                  <td
                    className="py-2 border-b border-gray-300 space-x-2"
                    style={{ width: "5%" }}
                  >
                    <button onClick={() => handleEdit(event)}>
                      <Edit color="blue" />
                    </button>

                    <button
                      onClick={() => {
                        setEventId(event.id);
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

EventList.propTypes = {
  currentEvents: PropTypes.arrayOf(PropTypes.object).isRequired,
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  handlePageChange: PropTypes.func.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default EventList;