import { Button } from '@/components/ui/button'
import { CardTitle } from '@/components/ui/card'
import { useEffect, useState } from 'react';
import CreateEvent from '@/components/forms/CreateEvent'
import EventList from '@/components/EventList'
import { useDeleteEventMutation, useGetEventPaginationMutation } from '@/redux/api/eventApi'
import { toast } from 'react-toastify'

const Events = () => {
  const ITEMS_PER_PAGE = 100;

  const [mode, setMode] = useState('view');
  const [currentPage, setCurrentPage] = useState(1);
  const [events, setEvents] = useState([]);
  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE);
  const [getEventPagination] = useGetEventPaginationMutation();
  const [editSelectedItem,setEditSelectedItem] = useState()
  const [ deleteEvent] = useDeleteEventMutation()


  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentEvents = events.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const fetchEvent = async () => {
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
    }
  }; 

  const handleDelete = async (eventId) => {
    try {
      const response = await deleteEvent({eventId});
      if (response?.data?.status) {
        toast(response?.data.message);
        fetchEvent()
      }
    } catch (error) {
      throw new Error(error?.message);
    }

  }

  useEffect(() => { 
    fetchEvent();
  }, [getEventPagination]);

  const handleEdit =(value)=>{
    setEditSelectedItem(value)
    setMode('update')
  }
  return (
    <div className="flex flex-col space-y-4 py-4 px-6">
    <div className="flex justify-between mb-4 items-center">
      <CardTitle className="text-blue-700">{mode == 'view' ? "All Events" : "Create Event"}</CardTitle>
      <Button
        onClick={() => setMode(mode == 'view' ? "create" : 'view')}
        className="text-lg">{mode !== 'view' ? "Events List" : "Create Event"}</Button>
    </div>
    {mode == "view" ?
      <EventList
        handlePageChange={handlePageChange}
        totalPages={totalPages}
        currentEvents={currentEvents}
        currentPage={currentPage}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        /> : <CreateEvent
          selectedEvent={editSelectedItem} setMode={setMode} mode={mode}
        />}
  </div>
  )
}

export default Events


