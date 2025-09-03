import React, { useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import useAuth from "../../hooks/useAuth";

const CalendarView = () => {
  const axiosSecure = useAxios();
  const { user } = useAuth();
  const email = user?.email || user?.providerData?.[0]?.email;

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks", email],
    queryFn: async () => {
      if (!email) return [];
      const res = await axiosSecure.get(`/tasks?email=${email}`);
      return res.data;
    },
  });

  const events = useMemo(
    () =>
      tasks
        .filter((t) => t.scheduledAt || t.deadline)
        .map((t) => ({
          id: t._id,
          title: `${t.title} (${t.subject})`,
          start: new Date(t.scheduledAt || t.deadline),
          end: new Date(
            new Date(t.scheduledAt || t.deadline).getTime() +
              (t.durationMinutes || 60) * 60000
          ),
          backgroundColor:
            t.status === "done"
              ? "green"
              : t.status === "inprogress"
              ? "blue"
              : "orange",
        })),
    [tasks]
  );

  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
        Study Calendar
      </h2>
      <div className="w-full overflow-x-auto">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          events={events}
          height="auto"
          aspectRatio={1.8} // adjusts for mobile vs desktop
          eventDisplay="block"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          dayMaxEvents={true} // shows "+n more" for many events
          nowIndicator={true}
          allDaySlot={false}
        />
      </div>
    </div>
  );
};

export default CalendarView;
