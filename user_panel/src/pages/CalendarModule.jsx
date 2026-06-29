import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CalendarRange, ArrowRight, MapPin, Gift, CalendarDays } from "lucide-react";
import { FaArrowRight } from "react-icons/fa";
import { fetchEvents } from "../api/config";
import { formatDate } from "../utils/dateUtils";

// BS Calendar Utilities
import {
  BS_MONTHS,
  BS_MONTHS_EN,
  adToBs,
  bsToAd,
  nepaliDigits
} from '../utils/bsCalendarUtils';

// BSCalendar Component
import { BSCalendar } from '../components/BSCalander';

export default function CalendarModule() {
  const API = import.meta.env.VITE_API_URL;
  const todayBs = adToBs(new Date());
  const [selectedBs, setSelectedBs] = useState(todayBs);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch events once
  useEffect(() => {
    fetchEvents(50)
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Fetch holidays with polling (every 30 seconds for real-time updates)
  const fetchHolidays = async () => {
    try {
      const response = await axios.get(`${API}/get-holidays`);
      if (response.data.status) {
        setHolidays(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching holidays:", error);
    }
  };

  useEffect(() => {
    fetchHolidays();
    const interval = setInterval(fetchHolidays, 30000);
    return () => clearInterval(interval);
  }, [API]);

  // Build holidayMap: key = "year-month-day" -> array of titles
  const holidayMap = new Map();
  holidays.forEach(holiday => {
    if (!holiday.holiday_date) return;
    const adDate = new Date(holiday.holiday_date);
    if (isNaN(adDate)) return;
    const bs = adToBs(adDate);
    const key = `${bs.year}-${bs.month}-${bs.day}`;
    if (!holidayMap.has(key)) {
      holidayMap.set(key, []);
    }
    holidayMap.get(key).push(holiday.title);
  });

  // Event dates for dot indicators
  const eventDates = events
    .filter(e => e.event_date)
    .map(e => adToBs(new Date(e.event_date)));

  // Events on selected BS date
  const selectedAdDate = bsToAd(selectedBs.year, selectedBs.month, selectedBs.day);
  const selectedEvents = events.filter(event => {
    if (!event.event_date) return false;
    const evDate = new Date(event.event_date);
    return (
      evDate.getFullYear() === selectedAdDate.getFullYear() &&
      evDate.getMonth() === selectedAdDate.getMonth() &&
      evDate.getDate() === selectedAdDate.getDate()
    );
  });

  // Holidays on selected BS date
  const selectedHolidayKey = `${selectedBs.year}-${selectedBs.month}-${selectedBs.day}`;
  const selectedHolidayTitles = holidayMap.get(selectedHolidayKey) || [];

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const allUpcomingEvents = events
    .filter(e => {
      if (!e.event_date) return false;
      const eventDate = new Date(e.event_date);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate >= today;
    })
    .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

  const UPCOMING_LIMIT = 5; //can change limit heres
  const upcomingEvents = allUpcomingEvents.slice(0, UPCOMING_LIMIT);

  const hasSelectedContent = selectedEvents.length > 0 || selectedHolidayTitles.length > 0;
  const displayEvents = hasSelectedContent ? selectedEvents : upcomingEvents;
  const isShowingSelected = hasSelectedContent;

  const selectedBsLabel = `${nepaliDigits(selectedBs.day)} ${BS_MONTHS[selectedBs.month]} ${nepaliDigits(selectedBs.year)}`;
  const selectedAdLabel = selectedAdDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <section className="bg-emerald-50/70 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3">
            {/* Gradient icon container with pulse animation */}
            <div className="icon-pulse-container flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-emerald-900 text-white shadow-lg shadow-emerald-900/20">
              <CalendarRange className="h-[22px] w-[22px]" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-600">Community calendar</p>
              <h2 className="font-display text-2xl font-semibold text-emerald-950">Event Calendar</h2>
            </div>
          </div>

          {/* Conditional "View All" — only when events exist */}
          {!loading && events.length > 0 && (
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900"
            >
              View All <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* BS Calendar */}
          <BSCalendar
            selectedBs={selectedBs}
            onSelect={setSelectedBs}
            eventDates={eventDates}
            holidayMap={holidayMap}
          />

          {/* Events & Holidays panel */}
          <div className="rounded-[2rem] border border-emerald-100 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                {isShowingSelected && (
                  <>
                    <h3 className="font-display text-lg font-semibold leading-tight text-emerald-950">
                      Event on {selectedBsLabel}
                    </h3>
                    <div className="mt-0.5 text-xs text-slate-400">{selectedAdLabel}</div>
                  </>
                )}
                {!isShowingSelected && (
                  <h3 className="font-display font-semibold text-primary-900 text-lg leading-tight">
                    Upcoming Events
                  </h3>
                )}
              </div>
              {isShowingSelected && (selectedEvents.length + selectedHolidayTitles.length) > 2 && (
                <Link to="/events" className="flex items-center gap-1 text-xs font-semibold text-emerald-700 transition hover:text-emerald-900">
                  +{(selectedEvents.length + selectedHolidayTitles.length) - 2} more <ArrowRight className="h-2.5 w-2.5" />
                </Link>
              )}
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-shimmer flex gap-3 rounded-xl p-3"
                    style={{ animationDelay: `${i * 200}ms` }}
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-emerald-200/50" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 w-3/4 rounded-full bg-emerald-200/50" />
                      <div className="h-3 w-1/2 rounded-full bg-emerald-200/40" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <>
                {/* Holidays Section */}
                {selectedHolidayTitles.length > 0 && (
                  <div className="mb-4">
                    <div className="space-y-2">
                      {selectedHolidayTitles.map((title, idx) => (
                        <div
                          key={`holiday-${idx}`}
                          className="flex items-center gap-3 rounded-2xl border border-red-200 bg-red-50 p-3"
                        >
                        
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
                            <Gift className="h-4 w-4 text-red-600" strokeWidth={1.8} />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-red-800">{title}</div>
                            <div className="text-xs text-red-600">Holiday</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Events Section */}
                {displayEvents.length > 0 && (
                  <div>
                    {selectedHolidayTitles.length > 0 && (
                      <div className="mb-2 mt-2 flex items-center gap-2 text-sm font-semibold text-emerald-700">
                        <CalendarDays className="h-4 w-4 text-accent" strokeWidth={1.8} />
                        <span>Events</span>
                      </div>
                    )}
                    <div className="space-y-3">
                      {displayEvents.map((event, i) => {
                        const evBs = event.event_date ? adToBs(new Date(event.event_date)) : null;
                        return (
                          <Link
                            key={event.id || i}
                            to={`/events/${event.id}`}
                            className="group flex gap-3 rounded-2xl border border-emerald-100 p-3 transition hover:border-emerald-200 hover:bg-emerald-50/70"
                          >
                            {evBs && (
                              <div className="flex-shrink-0 w-12 rounded-2xl bg-emerald-800 py-2 text-center text-white">
                                <div className="text-base font-bold leading-none">{nepaliDigits(evBs.day)}</div>
                                <div className="text-[10px] opacity-80 mt-0.5">{BS_MONTHS_EN[evBs.month].slice(0, 4)}</div>
                                <div className="text-[9px] opacity-60 mt-0.5">
                                  {new Date(event.event_date).getDate()}{" "}
                                  {new Date(event.event_date).toLocaleString("en", { month: "short" })}
                                </div>
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="line-clamp-2 text-sm font-semibold leading-snug text-emerald-950 transition group-hover:text-emerald-700">
                                {event.title}
                              </div>
                              {event.content && (
                                <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                                  {event.content.replace(/<[^>]*>/g, "")}
                                </div>
                              )}
                              {event.location && (
                                <div className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                                  <MapPin className="h-2.5 w-2.5 text-accent" strokeWidth={1.8} />
                                  {event.location}
                                </div>
                              )}
                              {!event.content && !event.location && event.event_date && (
                                <div className="mt-1 text-xs text-slate-400">{formatDate(event.event_date)}</div>
                              )}
                            </div>
                            <ArrowRight className="flex-shrink-0 self-center h-3.5 w-3.5 text-emerald-400 transition group-hover:text-emerald-600" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Empty states */}
                {isShowingSelected && selectedHolidayTitles.length === 0 && displayEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                      <CalendarRange className="h-7 w-7 text-emerald-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium">No events or holidays on this date.</p>
                  </div>
                )}

                {!isShowingSelected && displayEvents.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50">
                      <CalendarRange className="h-7 w-7 text-emerald-300" strokeWidth={1.5} />
                    </div>
                    <p className="text-sm font-medium">No upcoming events at this time.</p>
                  </div>
                )}
              </>
            )}

            {/* "View All" footer – only for upcoming events and only if more exist */}
            {!loading && !isShowingSelected && allUpcomingEvents.length > UPCOMING_LIMIT && (
              <div className="mt-4 pt-3 border-t border-gray-100">
                <Link
                  to="/events"
                  className="flex items-center justify-center gap-1.5 text-primary-700 hover:text-accent font-semibold text-sm transition-colors"
                >
                  View All Events <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Conditional Mobile View All — only when events exist */}
        {!loading && events.length > 0 && (
          <div className="mt-6 md:hidden text-center">
            <Link
              to="/events"
              className="inline-flex items-center gap-2 bg-primary-700 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-primary-800 transition-colors"
            >
              View All Events <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}