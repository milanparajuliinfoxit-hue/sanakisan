import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowRight,
  Clock,
  MapPin,
  CalendarRange,
  CalendarDays,
} from "lucide-react";

import { fetchEvents } from "../api/config";
import {
  BS_MONTHS,
  BS_MONTHS_EN,
  adToBs,
  bsToAd,
  nepaliDigits,
} from "../utils/bsCalendarUtils";
import { BSCalendar } from "../components/BSCalander";
import SectionHeader from "../components/SectionHeader";

export default function Events() {
  const API = import.meta.env.VITE_API_URL;
  const todayBs = adToBs(new Date());
  const [selectedBs, setSelectedBs] = useState(todayBs);
  const [events, setEvents] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents(50)
      .then((data) => {
        const eventList = Array.isArray(data) ? data : [];

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const upcoming = eventList
          .filter((event) => {
            if (!event.event_date) return false;
            const date = new Date(event.event_date);
            date.setHours(0, 0, 0, 0);
            return date >= today;
          })
          .sort((a, b) => new Date(a.event_date) - new Date(b.event_date));

        setEvents(upcoming);
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

  // Same shape BSCalendar expects: Map keyed by "year-month-day" (BS)
  const holidayMap = useMemo(() => {
    const map = new Map();
    holidays.forEach((holiday) => {
      if (!holiday.holiday_date) return;
      const adDate = new Date(holiday.holiday_date);
      if (isNaN(adDate)) return;
      const bs = adToBs(adDate);
      const key = `${bs.year}-${bs.month}-${bs.day}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(holiday.title);
    });
    return map;
  }, [holidays]);

  const eventDates = useMemo(
    () =>
      events
        .filter((e) => e.event_date)
        .map((e) => adToBs(new Date(e.event_date))),
    [events],
  );

  const selectedAdDate = bsToAd(
    selectedBs.year,
    selectedBs.month,
    selectedBs.day,
  );

  const selectedEvents = events.filter((event) => {
    if (!event.event_date) return false;

    const date = new Date(event.event_date);

    return (
      date.getFullYear() === selectedAdDate.getFullYear() &&
      date.getMonth() === selectedAdDate.getMonth() &&
      date.getDate() === selectedAdDate.getDate()
    );
  });

  const displayEvents = selectedEvents.length > 0 ? selectedEvents : events;

  return (
    <section className="bg-white py-20 px-4 sm:px-6 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* LEFT: sticky calendar */}
          <div className="lg:sticky lg:top-24 self-start">
            <BSCalendar
              selectedBs={selectedBs}
              onSelect={setSelectedBs}
              eventDates={eventDates}
              holidayMap={holidayMap}
            />
          </div>

          {/* RIGHT: header fixed, list scrolls */}
          <div className="flex flex-col lg:h-[calc(100vh-6rem)]">
            <SectionHeader
              icon={CalendarRange}
              label="Community Events"
              title={
                selectedEvents.length > 0
                  ? `Events on ${nepaliDigits(selectedBs.day)} ${
                      BS_MONTHS[selectedBs.month]
                    } ${nepaliDigits(selectedBs.year)}`
                  : "Upcoming Events"
              }
            />

            <div className="mt-3 h-[750px] overflow-y-auto pr-2 space-y-4">
              {loading ? (
                [1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-xl border p-5"
                  >
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-lg bg-slate-200"></div>

                      <div className="flex-1">
                        <div className="h-4 w-2/3 rounded bg-slate-200 mb-3"></div>
                        <div className="h-3 w-1/2 rounded bg-slate-200"></div>
                      </div>
                    </div>
                  </div>
                ))
              ) : displayEvents.length > 0 ? (
                displayEvents.map((event) => {
                  const bs = event.event_date
                    ? adToBs(new Date(event.event_date))
                    : null;

                  const eventDate = new Date(event.event_date);

                  const eventTime = eventDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  return (
                    <Link
                      key={event.id}
                      to={`/events/${event.id}`}
                      className="group flex items-start gap-4 rounded-xl border border-emerald-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-500 hover:shadow-xl"
                    >
                      {bs && (
                        <div className="flex h-14 w-14 flex-col items-center justify-center rounded-lg bg-emerald-600 text-white">
                          <span className="text-sm font-bold">
                            {nepaliDigits(bs.day)}
                          </span>

                          <span className="text-[10px] uppercase">
                            {BS_MONTHS_EN[bs.month]?.slice(0, 3)}
                          </span>
                        </div>
                      )}

                      <div className="flex-1">
                        <h3 className="font-semibold text-emerald-950 group-hover:text-emerald-700">
                          {event.title}
                        </h3>

                        <div className="mt-3 space-y-2">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            {event.author}
                          </div>

                          {event.location && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <MapPin className="h-4 w-4 text-emerald-600" />
                              {event.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <ArrowRight className="h-5 w-5 text-emerald-400 transition-transform group-hover:translate-x-1" />
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-xl border-2 border-dashed border-emerald-200 py-16 text-center">
                  <CalendarDays className="mx-auto mb-3 h-10 w-10 text-emerald-300" />

                  <p className="font-medium text-emerald-700">
                    No upcoming events found.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
