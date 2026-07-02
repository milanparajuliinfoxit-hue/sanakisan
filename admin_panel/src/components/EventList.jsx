import { useState } from 'react';
import { Card } from './ui/card'
import { Button } from './ui/button'
import { DeleteIcon, Edit, CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import AlertDialog from './AlertDialog';
import CustomImage from './CustomImage';
import { CardSkeleton } from './LoadingSkeleton';
import PropTypes from "prop-types"
import { cn } from '@/lib/utils';

const EventList = ({ currentEvents, currentPage, totalPages, handlePageChange, handleEdit, handleDelete, loading }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [eventId, setEventId] = useState(null);

  if (loading) {
    return <CardSkeleton count={4} />;
  }

  if (!currentEvents?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <CalendarDays className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">No events yet</h3>
        <p className="text-sm text-muted-foreground mt-1">Create your first event to get started.</p>
      </div>
    );
  }

  return (
    <>
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
          warningMessage='Delete Event'
          isCancel={true}
          message="Are you sure you want to delete this event? This action cannot be undone."
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentEvents?.map((event) => (
          <Card key={event.id} className="group overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200">
            <div className="relative">
              <CustomImage
                src={event.featuredImage}
                className="h-44 w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5 text-blue-600" />
                </button>
                <button
                  onClick={() => {
                    setEventId(event.id);
                    setIsDialogOpen(true);
                  }}
                  className="p-1.5 bg-white/90 backdrop-blur rounded-lg hover:bg-white transition-colors shadow-sm"
                >
                  <DeleteIcon className="w-3.5 h-3.5 text-red-600" />
                </button>
              </div>
              {event.publish_status && (
                <span className={cn(
                  "absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-medium",
                  event.publish_status === "published"
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                )}>
                  {event.publish_status}
                </span>
              )}
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-foreground line-clamp-1">{event.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: event.content }} className="text-sm text-muted-foreground line-clamp-2" />
              <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground">
                <span>By {event.author}</span>
                {event.event_date && (
                  <>
                    <span className="text-border">|</span>
                    <span>{new Date(event.event_date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</span>
                  </>
                )}
              </div>
            </div>
          </Card>
        ))}
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
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      )}
    </>
  )
}

EventList.propTypes = {
  currentEvents: PropTypes.array,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  handlePageChange: PropTypes.func,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  loading: PropTypes.bool,
}

export default EventList
