// src/pages/EventSinglePage.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { fetchEventById, fetchEvents } from "../api/config";
import { formatDate } from "../utils/dateUtils";
import { adToBs, BS_MONTHS, BS_MONTHS_EN, nepaliDigits } from "../utils/bsCalendarUtils";
import { getImageUrl } from "../api/config"; 

export default function EventSinglePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventById(id)
        .then(data => {
          setEvent(data);
          setLoading(false);
        })
        .catch(err => {
          console.error("Error fetching event:", err);
          setLoading(false);
        });
    } else {
      fetchEvents(100)
        .then(data => {
          setEvents(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  // Single event view
  if (id) {
    if (loading) {
      return (
        <div className="py-12 px-4 bg-primary-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 mx-auto mb-4"></div>
            <p className="text-gray-500">Loading event details...</p>
          </div>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="py-12 px-4 bg-primary-50 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-primary-900 mb-2">Event Not Found</h2>
            <p className="text-gray-500 mb-6">The event you're looking for doesn't exist.</p>
            <Link to="/events" className="inline-flex items-center gap-2 bg-primary-700 text-white px-6 py-2.5 rounded-lg">
              <FaArrowLeft /> Back to Events
            </Link>
          </div>
        </div>
      );
    }

    const evBs = event.event_date ? adToBs(new Date(event.event_date)) : null;
    
    // Get the correct image URL using the helper function
    const imageUrl = event.featuredImage;//image location in db
    const fullImageUrl = imageUrl ? getImageUrl(imageUrl) : null;

    return (
      <section className="min-h-screen bg-emerald-50/70 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link to="/events" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900">
            <FaArrowLeft /> Back to all events
          </Link>

          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
            {/* Image Display Section */}
            {fullImageUrl ? (
              <div className="relative w-full h-60 md:h-96 bg-gray-100">
                <img 
                  src={fullImageUrl} 
                  alt={event.title || "Event image"} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback if image fails to load
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = `
                      <div class="w-full h-full flex items-center justify-center bg-primary-100">
                        <FaCalendarAlt class="text-5xl text-primary-400" />
                      </div>
                    `;
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-primary-100 flex items-center justify-center">
                <FaCalendarAlt className="text-5xl text-primary-400" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h1 className="mb-4 font-display text-3xl font-semibold text-emerald-950 md:text-4xl">
                {event.title}
              </h1>
              
              <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
                {event.event_date && (
                  <div className="flex items-center gap-2">
                    <FaCalendarAlt className="text-accent" />
                    <span>{formatDate(event.event_date)}</span>
                    {evBs && (
                      <span className="text-slate-400">
                        ({nepaliDigits(evBs.day)} {BS_MONTHS[evBs.month]} {nepaliDigits(evBs.year)} BS)
                      </span>
                    )}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2">
                    <FaMapMarkerAlt className="text-accent" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>

              {event.content && (
                <div 
                  className="prose prose-sm max-w-none leading-8 text-slate-700" 
                  dangerouslySetInnerHTML={{ __html: event.content }} 
                />
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Events listing view (when no id)
  return (
    <section className="min-h-screen bg-emerald-50/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-800">
            <FaCalendarAlt className="text-2xl text-white" />
          </div>
          <h1 className="mb-2 font-display text-4xl font-semibold text-emerald-950">All Events</h1>
          <p className="text-slate-600">Browse through all our events and activities</p>
        </div>

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="rounded-[2rem] border border-emerald-100 bg-white py-16 text-center">
            <FaCalendarAlt className="mx-auto mb-3 text-5xl text-slate-300" />
            <p className="text-slate-500">No events found.</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((eventItem) => {
              const evBs = eventItem.event_date ? adToBs(new Date(eventItem.event_date)) : null;
              const imageUrl = eventItem.featuredImage || eventItem.image || eventItem.featured_image;
              const fullImageUrl = imageUrl ? getImageUrl(imageUrl) : null;
              
              return (
                <Link key={eventItem.id} to={`/events/${eventItem.id}`} className="group overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-white shadow-sm transition hover:border-emerald-200">
                  {fullImageUrl ? (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={fullImageUrl} 
                        alt={eventItem.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = `
                            <div class="w-full h-full flex items-center justify-center bg-primary-100">
                              <FaCalendarAlt class="text-3xl text-primary-400" />
                            </div>
                          `;
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-primary-100 flex items-center justify-center">
                      <FaCalendarAlt className="text-3xl text-primary-400" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-2">
                      {evBs && (
                        <div className="flex-shrink-0 w-12 rounded-2xl bg-emerald-800 py-1.5 text-center text-white">
                          <div className="text-base font-bold leading-none">{nepaliDigits(evBs.day)}</div>
                          <div className="text-[9px] opacity-80">{BS_MONTHS_EN[evBs.month].slice(0, 3)}</div>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="line-clamp-2 text-lg font-semibold text-emerald-950 transition group-hover:text-emerald-700">
                          {eventItem.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          {eventItem.event_date && (
                            <span className="flex items-center gap-1">
                              <FaCalendarAlt className="text-accent text-[10px]" />
                              {formatDate(eventItem.event_date)}
                            </span>
                          )}
                          {eventItem.location && (
                            <span className="flex items-center gap-1">
                              <FaMapMarkerAlt className="text-accent text-[10px]" />
                              {eventItem.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {eventItem.content && (
                      <p className="mt-2 line-clamp-2 text-sm leading-7 text-slate-600">
                        {eventItem.content.replace(/<[^>]*>/g, "")}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}