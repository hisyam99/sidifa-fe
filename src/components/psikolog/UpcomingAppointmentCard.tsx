import { component$ } from "@builder.io/qwik";
import type { AppointmentItem } from "~/data/psikolog-dashboard-data";

interface UpcomingAppointmentCardProps {
  appointment: AppointmentItem;
}

export const UpcomingAppointmentCard = component$(
  (props: UpcomingAppointmentCardProps) => {
    const { appointment } = props;
    return (
      <div class="p-4 bg-base-200 rounded-lg flex justify-between items-center shadow-sm hover:shadow-md transition-shadow duration-200">
        <div>
          <p class="font-bold text-base-content">{appointment.name}</p>
          <p class="text-sm text-base-content/70">{appointment.type}</p>
        </div>
        <div class="font-mono badge badge-outline badge-primary p-3 text-sm">
          {appointment.time}
        </div>
      </div>
    );
  },
);
