import { useState } from "react";
import { Button } from "./ui/button";
import { DeleteIcon, Edit, Users, ChevronLeft, ChevronRight } from "lucide-react";
import AlertDialog from "./AlertDialog";
import CustomImage from "./CustomImage";
import { TableSkeleton } from "./LoadingSkeleton";
import PropTypes from "prop-types"

const TeamMemberList = ({
  handlePageChange,
  totalPages,
  currentMembers,
  currentPage,
  handleEdit,
  handleDelete,
  loading
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [memberId, setMemberId] = useState(null);

  if (loading) {
    return <TableSkeleton rows={5} />;
  }

  if (!currentMembers?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No team members yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Add your first team member to get started.</p>
      </div>
    );
  }

  return (
    <div>
      {isDialogOpen && (
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
          warningMessage="Delete Team Member"
          isCancel={true}
          message="Are you sure you want to delete this team member? This action cannot be undone."
        />
      )}

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[60px]">Image</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Position</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Committee Type</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contact</th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tenure</th>
                <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider w-[80px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {currentMembers?.map((member, index) => (
                <tr key={index} className="hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <CustomImage
                      src={member.feature_image}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-foreground">{member.name}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{member.committeePosition?.name || member.position || '—'}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {member.committeeType?.name || member.type || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{member.email}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{member.contact}</td>
                  <td className="py-3 px-4 text-sm text-muted-foreground">{member.tenure}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => handleEdit(member)}
                        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                      >
                        <Edit className="w-3.5 h-3.5 text-blue-600" />
                      </button>
                      <button
                        onClick={() => {
                          setMemberId(member.id);
                          setIsDialogOpen(true);
                        }}
                        className="p-1.5 rounded-lg hover:bg-accent transition-colors"
                      >
                        <DeleteIcon className="w-3.5 h-3.5 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

TeamMemberList.propTypes = {
  handlePageChange: PropTypes.func,
  totalPages: PropTypes.number,
  currentMembers: PropTypes.array,
  currentPage: PropTypes.number,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  loading: PropTypes.bool,
}

export default TeamMemberList;
