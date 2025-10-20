import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";

export const Route = createFileRoute("/_main/timetable")({
  component: RouteComponent,
});

function thisWeek(): Date[] {
  const week: Date[] = [
    new Date(),
    new Date(),
    new Date(),
    new Date(),
    new Date(),
  ];

  const today = new Date();

  week[today.getDay()] = new Date();

  for (let index = today.getDay(); index < 5; index++) {
    const someDay = new Date();
    someDay.setDate(today.getDate() + index);
    week[index] = someDay;
  }

  for (let index = today.getDay(); index > 0; index--) {
    const someDay = new Date();
    someDay.setDate(today.getDate() - index);
    week[index] = someDay;
  }

  return week;
}

function Day({ date }: { date: Date }) {
  return (
    <div className="flex-1">
      <p className="text-muted-foreground text-center mb-1">
        {date.toLocaleDateString("sl-SI")}
      </p>
      <div className="grid grid-cols-1 grid-rows-[repeat(14,100px)]">
        {Array.from({ length: 14 }).map(() => (
          <div className="border w-full h-full"></div>
        ))}
      </div>
    </div>
  );
}

function Time() {
  const times: number[] = [];
  for (let index = 7; index < 22; index++) {
    times.push(index);
  }

  return (
    <div className="h-[1400px] relative w-12">
      {times.map((time, idx) => (
        <div
          className="absolute text-muted-foreground"
          style={{ top: `calc(${time - 7}00px + 18px)` }}
          key={idx}
        >
          {time}.00
        </div>
      ))}
    </div>
  );
}

function CurrentTime() {
  const currentHour = new Date().getHours();
  const currentMinute = new Date().getMinutes();

  return <div className="absolute"></div>;
}

function RouteComponent() {
  const week = thisWeek();
  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-row items-center gap-2 mb-2">
          <CalendarRange size={22} />{" "}
          <h1 className=" text-2xl font-semibold">Timetable</h1>
        </div>
        <p className="text-muted-foreground">
          Time managment simplified
        </p>
      </div>
      <div className="flex flex-row h-screen relative">
        <Time />
        {week.map((day, idx) => <Day key={idx} date={day} />)}
        <CurrentTime />
      </div>
    </div>
  );
}
