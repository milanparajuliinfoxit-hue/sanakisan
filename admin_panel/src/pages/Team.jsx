import CreateMember from "@/components/forms/CreateMember";
import TeamMemberList from "@/components/TeamMemberList";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useDeleteTeamMemberMutation, useGetMemberPaginationMutation } from '@/redux/api/memberApi';
import { Plus, List } from 'lucide-react';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 100;

const Team = () => {
  const [mode, setMode] = useState('view');
  const [deleteTeamMember] = useDeleteTeamMemberMutation(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);
  const [getMemberPagination] = useGetMemberPaginationMutation();
  const [editSelectedItem, setEditSelectedItem] = useState()

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (value) => {
    setEditSelectedItem(value)
    setMode('update')
  }

  const fetchMember = async () => {
    setLoading(true);
    try {
      const response = await getMemberPagination();
      const releases = Array.isArray(response?.data?.data?.data) ? response.data.data.data : [];
      setTeamMembers(releases);
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  }; 

  const handleDelete = async (id) => {
    try {
      const response = await deleteTeamMember({id});
      fetchMember();
      if (response?.data.status) {
        toast.success(response?.data.message);
      }
    } catch (error) {
      console.error("Failed to delete member:", error);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentMembers = teamMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  useEffect(() => { 
    fetchMember();
  }, [getMemberPagination]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'view' ? "Team Members" : editSelectedItem ? "Edit Team Member" : "Create Team Member"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'view' ? "Manage your organization's team members" : "Fill in the details below"}
          </p>
        </div>
        <Button
          onClick={() => {
            setMode(mode === 'view' ? "create" : 'view');
            if (mode !== 'view') setEditSelectedItem(null);
          }}
          variant={mode === 'view' ? "default" : "outline"}
          className="gap-2"
        >
          {mode === 'view' ? (
            <><Plus className="w-4 h-4" /> Add Member</>
          ) : (
            <><List className="w-4 h-4" /> Members List</>
          )}
        </Button>
      </div>

      {mode === "view" ? (
        <TeamMemberList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentMembers={currentMembers}
          currentPage={currentPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
        />
      ) : (
        <CreateMember editSelectedItem={editSelectedItem} mode={mode} setMode={setMode} />
      )}
    </div>
  )
}

export default Team
