import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FaCalendarAlt, FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";

import { fetchEventById, fetchEvents } from "../api/config";
import { formatDate } from "../utils/dateUtils";
import { adToBs, BS_MONTHS, nepaliDigits } from "../utils/bsCalendarUtils";
import { getImageUrl } from "../api/config";
import { SkeletonGrid } from "../components/Skeleton";

export default function EventSinglePage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([fetchEventById(id), fetchEvents(100)])
      .then(([eventData, eventsData]) => {
        setEvent(eventData);
        setEvents(Array.isArray(eventsData) ? eventsData : []);
      })
      .catch((err) => {
        console.error("Failed to fetch event:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Early return if no ID
  if (!id) {
    return <div>Invalid Event ID</div>;
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
          <p className="text-sm text-slate-500">Loading event details...</p>
        </div>
      </div>
    );
  }

  // Event Not Found
  if (!event) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 py-8">
        <div className="text-center">
          <FaCalendarAlt className="mx-auto mb-4 text-6xl text-slate-300" />
          <h2 className="mb-2 font-display text-2xl font-bold text-emerald-950">
            Event Not Found
          </h2>
          <p className="mb-6 text-slate-500">
            The event you're looking for doesn't exist.
          </p>
          <Link
            to="/events"
            className="btn-primary inline-flex items-center gap-2"
          >
            <FaArrowLeft /> Back to Events
          </Link>
        </div>
      </div>
    );
  }

  // Main Content
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events
    .filter((e) => {
      if (!e.event_date || e.id === event.id) return false;
      const date = new Date(e.event_date);
      date.setHours(0, 0, 0, 0);
      return date >= today;
    })
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
    .slice(0, 10);

  const evBs = event.event_date ? adToBs(new Date(event.event_date)) : null;
  const fullImageUrl = event.featuredImage
    ? getImageUrl(event.featuredImage)
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Main Event Content */}
        <section className="flex-1">
          <div className="mx-auto max-w-4xl">
            {/* Back Button */}
            <Link
              to="/events"
              className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-900"
            >
              <FaArrowLeft /> Back to all events
            </Link>

            <div className="overflow-hidden rounded-3xl border border-emerald-100 bg-white shadow-sm">
              {/* Featured Image - Actual Aspect Ratio (No forced cropping to view actall img) */}
              <div className="relative w-full bg-white">
                <div className="p-5">
                  <h1 className="mb-4 font-display text-xl sm:text-3xl md:text-3xl font-bold text-emerald-950 leading-tight">
                    {event.title}
                  </h1>
                </div>
                {fullImageUrl ? (
                  <img
                    src={fullImageUrl}
                    alt={event.title || "Event"}
                    className="w-full h-auto max-h-[420px] md:max-h-[520px] lg:max-h-[560px] object-contain mx-auto"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                      const parent = e.currentTarget.parentElement;
                      parent.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "bg-emerald-100",
                        "min-h-[260px]",
                        "md:min-h-[340px]",
                      );
                      parent.innerHTML += `
                <svg class="text-emerald-400 h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25M3 18.75A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75M3 18.75v-5.25M21 18.75v-5.25M9 10.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                </svg>`;
                    }}
                  />
                ) : (
                  <div className="flex h-64 md:h-80 lg:h-96 w-full items-center justify-center bg-emerald-100">
                    <FaCalendarAlt className="text-5xl text-emerald-400" />
                  </div>
                )}
              </div>

              {/* Event Details */}
              <div className="p-5 sm:p-6 md:p-8 lg:p-10">
                <div className="mb-6 flex flex-wrap gap-3 text-sm text-slate-600">
                  {event.event_date && (
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2">
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
                    <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2">
                      <FaMapMarkerAlt className="text-amber-500" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>

                {event.content && (
                  <div
                    className="prose prose-sm sm:prose-base max-w-none leading-relaxed text-slate-700 prose-headings:text-emerald-950 prose-a:text-emerald-700"
                    dangerouslySetInnerHTML={{ __html: event.content }}
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Sidebar */}
        <aside className="w-full lg:w-80 lg:sticky lg:top-8 self-start">
          <div className="rounded-3xl border border-emerald-100 bg-white p-5 sm:p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-bold text-emerald-950">
              Upcoming Events
            </h2>
            

            {upcomingEvents.length > 0 ? (
              <div className="max-h-[520px] space-y-4 overflow-y-auto pr-1 custom-scroll">
                {upcomingEvents.map((item) => {
                  const bsDate = item.event_date
                    ? adToBs(new Date(item.event_date))
                    : null;

                  return (
                    <Link
                      key={item.id}
                      to={`/events/${item.id}`}
                      className="block rounded-2xl border border-emerald-100 p-4 transition hover:border-emerald-300 hover:bg-emerald-50 active:scale-[0.985]"
                    >
                      {item.featuredImage && (
                        <img
                          src={getImageUrl(item.featuredImage)}
                          alt={item.title}
                          className="mb-3 h-36 w-full rounded-xl object-cover"
                        />
                      )}

                      <h3 className="line-clamp-2 font-semibold text-emerald-950 text-[17px] leading-tight">
                        {item.title}
                      </h3>

                      <div className="mt-3 space-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-2">
                          <FaCalendarAlt className="text-emerald-600 flex-shrink-0" />
                          <span>{formatDate(item.event_date)}</span>
                        </div>

                        {bsDate && (
                          <div className="text-xs text-slate-400 pl-6">
                            {nepaliDigits(bsDate.day)} {BS_MONTHS[bsDate.month]}{" "}
                            {nepaliDigits(bsDate.year)}
                          </div>
                        )}

                        {item.location && (
                          <div className="flex items-center gap-2">
                            <FaMapMarkerAlt className="text-emerald-600 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {item.location}
                            </span>
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-slate-500 py-8 text-center">
                No upcoming events available.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
