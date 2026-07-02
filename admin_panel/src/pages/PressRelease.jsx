import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import PressReleaseList from '@/components/PressReleaseList';
import CreatePressRelease from '@/components/forms/CreatePressRelease';
import { useDeletePressMutation, useGetPressMutation } from '@/redux/api/pressApi';
import { Plus, List } from "lucide-react";

const ITEMS_PER_PAGE = 100;

const PressRelease = () => {
  const [mode, setMode] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [pressReleases, setPressReleases] = useState([]);
  const [selectedPressRelease, setSelectedPressRelease] = useState(null);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(pressReleases.length / ITEMS_PER_PAGE);

  const [getPress] = useGetPressMutation();
  const [deletePress] = useDeletePressMutation();

  const fetchPressReleases = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
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
        fetchPressReleases();
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentPressReleases = Array.isArray(pressReleases)
    ? pressReleases.slice(startIndex, startIndex + ITEMS_PER_PAGE)
    : [];

  useEffect(() => {
    fetchPressReleases();
  }, [getPress]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'view' ? "Press Releases" : selectedPressRelease ? "Edit Press Release" : "Create Press Release"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'view' ? "Manage and publish press releases" : "Fill in the details below"}
          </p>
        </div>
        <Button
          onClick={() => {
            setMode(mode === 'view' ? "create" : 'view');
            if (mode !== 'view') setSelectedPressRelease(null);
          }}
          variant={mode === 'view' ? "default" : "outline"}
          className="gap-2"
        >
          {mode === 'view' ? (
            <><Plus className="w-4 h-4" /> Create Press Release</>
          ) : (
            <><List className="w-4 h-4" /> Press Releases List</>
          )}
        </Button>
      </div>

      {mode === "view" ? (
        <PressReleaseList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentPressReleases={currentPressReleases}
          currentPage={currentPage}
          handleEdit={handleEdit} 
          handleDelete={handleDelete}
          loading={loading}
        />
      ) : (
        <CreatePressRelease
          mode={mode}
          setMode={setMode}
          selectedPressRelease={selectedPressRelease}
        />
      )}
    </div>
  )
}

export default PressRelease
