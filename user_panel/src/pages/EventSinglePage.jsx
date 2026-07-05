import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import { fetchEventById, fetchEvents } from "../api/config";
import { formatDate } from "../utils/dateUtils";
import {
  adToBs,
  BS_MONTHS,
  BS_MONTHS_EN,
  nepaliDigits,
} from "../utils/bsCalendarUtils";
import { getImageUrl } from "../api/config";
import { SkeletonGrid } from "../components/Skeleton";

export default function EventSinglePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventById(id)
        .then((data) => {
          setEvent(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      fetchEvents(100)
        .then((data) => {
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
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
            <p className="text-sm text-slate-500">Loading event details...</p>
          </div>
        </div>
      );
    }

    if (!event) {
      return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
          <div className="text-center">
            <FaCalendarAlt className="mx-auto mb-4 text-6xl text-slate-300" />
            <h2 className="mb-2 font-display text-2xl font-bold text-emerald-950">
              Event Not Found
            </h2>
            <p className="mb-6 text-slate-500">
              The event you're looking for doesn't exist.
            </p>
            <Link to="/events" className="btn-primary">
              <FaArrowLeft /> Back to Events
            </Link>
          </div>
        </div>
      );
    }

    const evBs = event.event_date ? adToBs(new Date(event.event_date)) : null;
    const imageUrl = event.featuredImage;
    const fullImageUrl = imageUrl ? getImageUrl(imageUrl) : null;

    return (
      <section className="min-h-screen bg-emerald-50/70 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Link
            to="/events"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
          >
            <FaArrowLeft /> Back to all events
          </Link>

          <div className="overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-sm">
            {fullImageUrl ? (
              <div className="relative w-full h-60 md:h-96 bg-slate-100">
                <img
                  src={fullImageUrl}
                  alt={event.title || "Event image"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.parentElement.classList.add(
                      "bg-emerald-100",
                      "flex",
                      "items-center",
                      "justify-center",
                    );
                    const icon = document.createElement("div");
                    icon.innerHTML =
                      '<svg class="text-emerald-400 h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75v-5.25M21 18.75v-5.25M9 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>';
                    e.target.parentElement.appendChild(icon.firstChild);
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-64 md:h-96 bg-emerald-100 flex items-center justify-center">
                <FaCalendarAlt className="text-5xl text-emerald-400" />
              </div>
            )}

            <div className="p-6 md:p-8">
              <h1 className="mb-4 font-display text-3xl font-bold text-emerald-950 md:text-4xl">
                {event.title}
              </h1>

              <div className="mb-6 flex flex-wrap gap-4 text-sm text-slate-600">
                {event.event_date && (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-1.5">
                    <FaCalendarAlt className="text-amber-500" />
                    <span>{formatDate(event.event_date)}</span>
                    {evBs && (
                      <span className="text-slate-400">
                        ({nepaliDigits(evBs.day)} {BS_MONTHS[evBs.month]}{" "}
                        {nepaliDigits(evBs.year)} BS)
                      </span>
                    )}
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center gap-2 bg-emerald-50 rounded-lg px-3 py-1.5">
                    <FaMapMarkerAlt className="text-amber-500" />
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

  // Events listing view
  return (
    <section className="min-h-screen bg-emerald-50/70 px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 shadow-lg">
            <FaCalendarAlt className="text-2xl text-white" />
          </div>
          <h1 className="mb-2 font-display text-4xl font-bold text-emerald-950">
            All Events
          </h1>
          <p className="text-slate-600">
            Browse through all our events and activities
          </p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton-shimmer h-48 rounded-[1.6rem]" />
            ))}
          </div>
        )}

        {!loading && events.length === 0 && (
          <div className="rounded-[2rem] border border-emerald-100 bg-white py-16 text-center shadow-sm">
            <FaCalendarAlt className="mx-auto mb-3 text-5xl text-slate-300" />
            <p className="text-slate-500">No events found.</p>
          </div>
        )}

        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((eventItem) => {
              const evBs = eventItem.event_date
                ? adToBs(new Date(eventItem.event_date))
                : null;
              const imageUrl =
                eventItem.featuredImage ||
                eventItem.image ||
                eventItem.featured_image;
              const fullImageUrl = imageUrl ? getImageUrl(imageUrl) : null;

              return (
                <Link
                  key={eventItem.id}
                  to={`/events/${eventItem.id}`}
                  className="group overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-emerald-200"
                >
                  {fullImageUrl ? (
                    <div className="h-48 overflow-hidden bg-emerald-100">
                      <img
                        src={fullImageUrl}
                        alt={eventItem.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.parentElement.classList.add(
                            "flex",
                            "items-center",
                            "justify-center",
                          );
                          const icon = document.createElement("div");
                          icon.innerHTML =
                            '<svg class="text-emerald-400 h-10 w-10" stroke="currentColor" fill="none" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75v-5.25M21 18.75v-5.25M9 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/></svg>';
                          e.target.parentElement.appendChild(icon.firstChild);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-emerald-100 flex items-center justify-center">
                      <FaCalendarAlt className="text-3xl text-emerald-400" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start gap-3 mb-3">
                      {evBs && (
                        <div className="flex-shrink-0 w-12 rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-800 py-1.5 text-center text-white shadow-sm">
                          <div className="text-base font-bold leading-none">
                            {nepaliDigits(evBs.day)}
                          </div>
                          <div className="text-[9px] opacity-80">
                            {BS_MONTHS_EN[evBs.month]?.slice(0, 3)}
                          </div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="line-clamp-2 text-lg font-semibold text-emerald-950 transition group-hover:text-emerald-700">
                          {eventItem.title}
                        </h3>
                        <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                          {eventItem.event_date && (
                            <span className="flex items-center gap-1.5">
                              <FaCalendarAlt className="text-amber-500 text-[10px]" />
                              {formatDate(eventItem.event_date)}
                            </span>
                          )}
                          {eventItem.location && (
                            <span className="flex items-center gap-1.5">
                              <FaMapMarkerAlt className="text-amber-500 text-[10px]" />
                              {eventItem.location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    {eventItem.content && (
                      <p className="line-clamp-2 text-sm leading-7 text-slate-600">
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
