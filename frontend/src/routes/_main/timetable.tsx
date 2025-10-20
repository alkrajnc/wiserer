import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";

export const Route = createFileRoute("/_main/timetable")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <div className="">
        <div className="flex flex-row items-center gap-2">
          <CalendarRange size={18} />{" "}
          <h1 className=" text-lg font-semibold">Timetable</h1>
        </div>
      </div>
    </div>
  );
}
