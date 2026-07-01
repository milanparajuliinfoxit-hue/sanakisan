import { useState } from "react";
import { Button } from "./ui/button";
import { DeleteIcon, Edit } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";
import PropTypes from "prop-types"

const TeamMemberList = ({
  handlePageChange,
  totalPages,
  currentMembers,
  currentPage,
  handleEdit,
  handleDelete
}) => {

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);
  return (
    <div>
      {isDialogOpen &&
        <AlertDialog
          onSubmit={() => {
            handleDelete(memberId);
            setIsDialogOpen(false);
            setMemberId(null);
          }}
          onCancel={() => {
            setIsDialogOpen(false);
            setMemberId(null);
          }}
          warningMessage='Delete'
          isCancel={true}
          message={`Are you sure want to delete team member?`}
        />

      }
      
      <div className="relative">
        <table className="table-fixed w-full border-collapse">
          <thead className="sticky top-0 bg-white border-b border-gray-300 z-10">
            <tr className="text-left">
              <th style={{ width: "7%" }}>Image</th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "14%" }}
              >
                Name
              </th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "12%" }}
              >
                Position
              </th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "15%" }}
              >
                Type
              </th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "20%" }}
              >
                Email
              </th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "15%" }}
              >
                Contact
              </th>
              <th
                className="py-2 font-medium text-left text-black border-b border-gray-300"
                style={{ width: "10%" }}
              >
                Tenure
              </th>
              <th style={{ width: "6%" }}>Action</th>
            </tr>
          </thead>
        </table>
        <div className="overflow-y-auto max-h-[500px]">
          <table className="table-fixed w-full border-collapse">
            <tbody>
              {currentMembers?.map((member, index) => {
                return (
                  <tr key={index} className="hover:bg-slate-200 text-left">
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "7%" }}
                    >
                      {/* <img
                        src={member.feature_image}
                        className="size-12 object-fit rounded-full"
                        alt="Member"
                      /> */}
                      <CustomImage
                        src={member.feature_image}
                        className={`size-12 object-fit rounded-full`}
                      />
                    </td>
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "14%" }}
                    >
                      {member.name}
                    </td>
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "12%" }}
                    >
                      {member.position}
                    </td>
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "15%" }}
                    >
                      {member.type}
                    </td>
                    <td
                      className="flex-wrap py-2 border-b  border-gray-300"
                      style={{ maxWidth: "20%" }}
                    >
                      {member.email}
                    </td>
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "15%" }}
                    >
                      {member.contact}
                    </td>
                    <td
                      className=" py-2 border-b border-gray-300"
                      style={{ width: "10%" }}
                    >
                      {member.tenure}
                    </td>
                    <td className="space-x-2" style={{ width: "6%" }}>
                      <button
                        onClick={() => {
                          handleEdit(member);
                        }}
                      >
                        <Edit color="blue" />
                      </button>
                      <button
                        onClick={() => {
                          setMemberId(member.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        <DeleteIcon color="red" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

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

TeamMemberList.propTypes = {
  handlePageChange: PropTypes.func.isRequired,
  totalPages: PropTypes.number.isRequired,
  currentMembers: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  handleEdit: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
}

export default TeamMemberList;
