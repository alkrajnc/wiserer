import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CalendarRange, NotebookPen, Settings } from "lucide-react";
import Sidebar, { SidebarCategory, SidebarItem } from "@/components/sidebar";

export const Route = createFileRoute("/_main")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="w-screen h-screen overflow-hidden flex flex-row">
      <Sidebar>
        <SidebarCategory name="General">
          <SidebarItem>
            <CalendarRange size={17} /> Timetable
          </SidebarItem>
          <SidebarItem>
            <NotebookPen size={17} /> Assigments
          </SidebarItem>
        </SidebarCategory>
        <SidebarCategory name="Options">
          <SidebarItem>
            <Settings size={17} /> General
          </SidebarItem>
        </SidebarCategory>
      </Sidebar>
      <div className="p-4">
        <Outlet />
      </div>
    </div>
  );
}
