import CreateMember from "@/components/forms/CreateMember";
import TeamMemberList from "@/components/TeamMemberList";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDeleteTeamMemberMutation, useGetMemberPaginationMutation } from '@/redux/api/memberApi';
import { toast } from 'react-toastify';


const ITEMS_PER_PAGE = 100;

const Team = () => {

  const [mode, setMode] = useState('view');
  const [deleteTeamMember] = useDeleteTeamMemberMutation(); 
  const [currentPage, setCurrentPage] = useState(1);
  const [teamMembers, setTeamMembers] = useState([]);
  const totalPages = Math.ceil(teamMembers.length / ITEMS_PER_PAGE);
  const [getMemberPagination] = useGetMemberPaginationMutation();
  const [editSelectedItem,setEditSelectedItem] = useState()

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  

  const handleEdit =(value)=>{
    setEditSelectedItem(value)
    setMode('update')
  }
  const fetchMember = async () => {
    try {
      const response = await getMemberPagination();
      const releases = Array.isArray(response?.data?.data?.data) ? response.data.data.data : [];
      setTeamMembers(releases);
    } catch (error) {
      console.error('Error fetching member:', error);
    }
  }; 

  const handleDelete = async (id) => {
    try {
     const response =  await deleteTeamMember({id});
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
    <div className="flex flex-col space-y-4 py-4 px-6">
      <div className="flex justify-between mb-4 items-center">
        <CardTitle className="text-blue-700">{mode == 'view' ? "All Members List" : "Create Team Member"}</CardTitle>

        <Button
          onClick={() => setMode(mode == 'view' ? "create" : 'view')}
          className="text-lg">{mode !== 'view' ? "Members List" : "Create Member"}</Button>
      </div>
      {mode == "view" ?
        <TeamMemberList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentMembers={currentMembers}
          currentPage={currentPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          setMode={setMode}
        /> : <CreateMember editSelectedItem={editSelectedItem} mode={mode} setMode={setMode} />}
    </div>

  )
}

export default Team

