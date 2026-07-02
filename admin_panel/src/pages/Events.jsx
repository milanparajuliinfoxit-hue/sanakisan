import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react';
import CreateEvent from '@/components/forms/CreateEvent'
import EventList from '@/components/EventList'
import { useDeleteEventMutation, useGetEventPaginationMutation } from '@/redux/api/eventApi'
import { Plus, List } from 'lucide-react'

const Events = () => {
  const ITEMS_PER_PAGE = 100;

  const [mode, setMode] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const [getEventPagination] = useGetEventPaginationMutation();
  const [editSelectedItem, setEditSelectedItem] = useState()
  const [deleteEvent] = useDeleteEventMutation()

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const fetchEvent = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: 1,
        limit: ITEMS_PER_PAGE,
        publish_status: '',
      });
      const response = await getEventPagination(query).unwrap();
      const releases = Array.isArray(response?.data?.data) ? response.data.data : [];
      setEvents(releases);
    } catch (error) {
      console.error('Error fetching member:', error);
    } finally {
      setLoading(false);
    }
  }; 

  const handleDelete = async (eventId) => {
    try {
      const response = await deleteEvent({eventId});
      if (response?.data?.status) {
        fetchEvent()
      }
    } catch (error) {
      throw new Error(error?.message);
    }
  }

  useEffect(() => { 
    fetchEvent();
  }, [getEventPagination]);

  const handleEdit = (value) => {
    setEditSelectedItem(value)
    setMode('update')
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {mode === 'view' ? "Events" : editSelectedItem ? "Edit Event" : "Create Event"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {mode === 'view' ? "Manage and publish events" : "Fill in the details below"}
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
            <><Plus className="w-4 h-4" /> Create Event</>
          ) : (
            <><List className="w-4 h-4" /> Events List</>
          )}
        </Button>
      </div>

      {mode === "view" ? (
        <EventList
          handlePageChange={handlePageChange}
          totalPages={totalPages}
          currentEvents={currentEvents}
          currentPage={currentPage}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
          loading={loading}
        />
      ) : (
        <CreateEvent
          selectedEvent={editSelectedItem}
          setMode={setMode}
          mode={mode}
        />
      )}
    </div>
  )
}

export default Events
