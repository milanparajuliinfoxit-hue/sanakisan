import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { CalendarRange, ArrowRight, MapPin, Gift, CalendarDays, Clock } from "lucide-react";
import { fetchEvents } from "../api/config";

import {
  BS_MONTHS,
  BS_MONTHS_EN,
  adToBs,
  bsToAd,
  nepaliDigits
} from '../utils/bsCalendarUtils';

import { BSCalendar } from '../components/BSCalander';

export default function CalendarModule() {
  const API = import.meta.env.VITE_API_URL;
  const sectionRef = useRef(null);
  const todayBs = adToBs(new Date());
  const [selectedBs, setSelectedBs] = useState(todayBs);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-section');
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    fetchEvents(50)
      .then(data => {
        setEvents(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await axios.get(`${API}/get-holidays`);
        if (response.data.status) setHolidays(response.data.data);
      } catch (error) {
        console.error("Error fetching holidays:", error);
      }
    };
    fetchHolidays();
    const interval = setInterval(fetchHolidays, 30000);
    return () => clearInterval(interval);
  }, [API]);

  const holidayMap = new Map();
  holidays.forEach(holiday => {
    if (!holiday.holiday_date) return;
    const adDate = new Date(holiday.holiday_date);
    if (isNaN(adDate)) return;
    const bs = adToBs(adDate);
    const key = `${bs.year}-${bs.month}-${bs.day}`;
    if (!holidayMap.has(key)) holidayMap.set(key, []);
    holidayMap.get(key).push(holiday.title);
  });

  const eventDates = events
    .filter(e => e.event_date)
    .map(e => adToBs(new Date(e.event_date)));

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

  const UPCOMING_LIMIT = 4;
  const upcomingEvents = allUpcomingEvents.slice(0, UPCOMING_LIMIT);

  const hasSelectedContent = selectedEvents.length > 0 || selectedHolidayTitles.length > 0;
  const displayEvents = hasSelectedContent ? selectedEvents : upcomingEvents;
  const isShowingSelected = hasSelectedContent;

  const selectedBsLabel = `${nepaliDigits(selectedBs.day)} ${BS_MONTHS[selectedBs.month]} ${nepaliDigits(selectedBs.year)}`;
  const selectedAdLabel = selectedAdDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

  return (
    <section
      ref={sectionRef}
      className="relative px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-emerald-50/30"
    >
      <style>{`
        @keyframes fadeUpStagger {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-section {
          animation: fadeUpStagger 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        .event-card {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .event-card:hover {
          background-color: #F0F9F6;
          transform: translateY(-2px);
        }
        .event-card:hover .event-arrow {
          transform: translateX(4px);
        }
      `}</style>

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 text-white shadow-lg">
              <CalendarRange className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.24em] text-emerald-600">Community Calendar</p>
              <h2 className="font-display text-3xl font-bold text-emerald-950">Event Calendar</h2>
            </div>
          </div>

          {!loading && events.length > 0 && (
            <Link
              to="/events"
              className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition-all duration-300 hover:gap-3 hover:text-emerald-900 group"
            >
              View All Events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          )}
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2">
          {/* BS Calendar */}
          <div>
            <BSCalendar
              selectedBs={selectedBs}
              onSelect={setSelectedBs}
              eventDates={eventDates}
              holidayMap={holidayMap}
            />
          </div>

          {/* Events Panel */}
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl font-bold text-emerald-950">
                  {isShowingSelected ? `Events on ${selectedBsLabel}` : "Upcoming Events"}
                </h3>
                {isShowingSelected && <p className="text-xs text-slate-500 mt-1">{selectedAdLabel}</p>}
              </div>
              {isShowingSelected && (selectedEvents.length + selectedHolidayTitles.length) > 2 && (
                <Link
                  to="/events"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-900 group"
                >
                  +{(selectedEvents.length + selectedHolidayTitles.length) - 2} more
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                </Link>
              )}
            </div>

            {/* Skeleton Loaders */}
            {loading && (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="event-card flex items-start gap-4 rounded-xl border border-emerald-100 bg-white p-4 animate-pulse"
                    style={{ animationDelay: `${i * 150}ms` }}
                  >
                    <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-slate-200" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 rounded bg-slate-200" />
                      <div className="h-3 w-1/2 rounded bg-slate-200" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && (
              <div className="space-y-3">
                {/* Holidays */}
                {selectedHolidayTitles.map((title, idx) => (
                  <div
                    key={`holiday-${idx}`}
                    className="event-card flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/80 p-4"
                    style={{ animation: `fadeUpStagger 0.6s ease-out ${100 + idx * 100}ms both` }}
                  >
                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-amber-200">
                      <Gift className="h-5 w-5 text-amber-700" strokeWidth={2} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-950">{title}</p>
                      <p className="text-xs text-amber-700">Holiday</p>
                    </div>
                  </div>
                ))}

                {/* Events */}
                {displayEvents.map((event, i) => {
                  const evBs = event.event_date ? adToBs(new Date(event.event_date)) : null;
                  const evDate = new Date(event.event_date);
                  const eventTime = evDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

                  return (
                    <Link
                      key={event.id || i}
                      to={`/events/${event.id}`}
                      className="event-card flex items-start gap-3 rounded-xl border border-emerald-200 bg-white p-4"
                      style={{ animation: `fadeUpStagger 0.6s ease-out ${200 + i * 100}ms both` }}
                    >
                      {evBs && (
                        <div className="mt-0.5 flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-700 flex flex-col items-center justify-center text-white shadow-md">
                          <div className="text-xs font-bold leading-none">{nepaliDigits(evBs.day)}</div>
                          <div className="text-[9px] opacity-90 uppercase mt-0.5 font-semibold">{BS_MONTHS_EN[evBs.month]?.slice(0, 3)}</div>
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-emerald-950 group-hover:text-emerald-700 line-clamp-2">
                          {event.title}
                        </h4>
                        <div className="mt-2 space-y-1">
                          {eventTime && (
                            <div className="flex items-center gap-2 text-xs text-slate-600">
                              <Clock className="h-3 w-3 flex-shrink-0 text-emerald-600" />
                              <span>{eventTime}</span>
                            </div>
                          )}
                          {event.location && (
                            <div className="flex items-center gap-2 text-xs text-slate-600 line-clamp-1">
                              <MapPin className="h-3 w-3 flex-shrink-0 text-emerald-600" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <ArrowRight className="event-arrow mt-1 h-4 w-4 flex-shrink-0 text-emerald-400 transition-transform" />
                    </Link>
                  );
                })}

                {/* Empty State */}
                {displayEvents.length === 0 && selectedHolidayTitles.length === 0 && (
                  <div className="rounded-xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-8 text-center">
                    <CalendarDays className="mx-auto h-8 w-8 text-emerald-300 mb-2" />
                    <p className="text-sm text-emerald-700 font-medium">No events scheduled</p>
                  </div>
                )}
              </div>
            )}

            {/* Mobile View All */}
            {!loading && events.length > 0 && (
              <div className="mt-6 text-center lg:hidden">
                <Link
                  to="/events"
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                >
                  View All Events
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
