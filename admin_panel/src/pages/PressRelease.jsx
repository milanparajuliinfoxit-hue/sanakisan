
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import PressReleaseList from '@/components/PressReleaseList';
import CreatePressRelease from '@/components/forms/CreatePressRelease';
import { useDeletePressMutation, useGetPressMutation } from '@/redux/api/pressApi';
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 100;

const PressRelease = () => {

  const [mode, setMode] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [pressReleases, setPressReleases] = useState([]);
  const [selectedPressRelease, setSelectedPressRelease] = useState(null);
  const totalPages = Math.ceil(pressReleases.length / ITEMS_PER_PAGE);

  const [getPress] = useGetPressMutation();
  const [deletePress] = useDeletePressMutation();

  const fetchPressReleases = async () => {
    try {
      const query = new URLSearchParams({
        page: 1,
        limit: ITEMS_PER_PAGE,
        publish_status: '',
        status: 1
      });
      const response = await getPress(query);
      const releases = Array.isArray(response?.data?.data?.data) ? response.data.data.data : [];
      setPressReleases(releases);
    } catch (error) {
      console.error('Error fetching press releases:', error);
    }
  };  

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleEdit = (pressRelease) => {
    setSelectedPressRelease(pressRelease);
    setMode('update');
  };

  const handleDelete = async (pressReleaseId) => {
    try {

      const response = await deletePress({ pressReleaseId });

      if (response?.data?.status) {
        toast.success(response?.data.message);
        fetchPressReleases();
      }
    } catch (error) {
      throw new Error(error?.message);
    }

  }

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPressReleases = Array.isArray(pressReleases)
  ? pressReleases.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  : [];

  useEffect(() => {

    fetchPressReleases();
  }, [getPress]);
  
  return (
    <div className="flex flex-col space-y-4 py-4 px-6">
      <div className="flex justify-between mb-4 items-center">
        <CardTitle className="text-blue-700">{mode == 'view' ? "All Press Releases" : "Create Press Release"}</CardTitle>
        <Button
          onClick={() => setMode(mode == 'view' ? "create" : 'view')}
          className="text-lg">{mode !== 'view' ? "Press Releases List" : "Create Press Release"}</Button>
      </div>
      {mode == "view" ?
        <PressReleaseList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentPressReleases={currentPressReleases}
          currentPage={currentPage}
          handleEdit={handleEdit} 
          handleDelete={handleDelete}
        /> : <CreatePressRelease
          mode={mode}
          setMode={setMode}
          selectedPressRelease={selectedPressRelease}
        />}
    </div>
  )
}

export default PressRelease


