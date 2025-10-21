import TimetableElement from "@/components/timetable-element";
import TimetableSubject from "@/components/timetable-subject";
import { createFileRoute } from "@tanstack/react-router";
import { CalendarRange } from "lucide-react";
import { useEffect, useState } from "react";

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

function Day({ date, subjects }: { date: Date; subjects?: React.ReactNode }) {
  return (
    <div className="flex-1">
      <p className="text-muted-foreground text-center mb-1">
        {date.toLocaleDateString("sl-SI")}
      </p>
      <div className="grid grid-cols-1 relative grid-rows-[repeat(14,100px)]">
        {Array.from({ length: 14 }).map(() => (
          <div className="border w-full h-full"></div>
        ))}
        {subjects}
      </div>
    </div>
  );
}

function TimeScale() {
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

function CurrentTimeSlider() {
  const [offset, setOffset] = useState<number>(0);

  const currentTime = new Date();
  const currentTotalMinutes =
    currentTime.getHours() * 60 + currentTime.getMinutes();
  const minMinutes = 7 * 60;
  const maxMinutes = 21 * 60;

  useEffect(() => {
    let pixelOffset =
      (currentTotalMinutes - minMinutes) / (maxMinutes - minMinutes);
    if (pixelOffset > 1) {
      pixelOffset = 1;
    }
    setOffset(pixelOffset);
    const interval = setInterval(() => {
      if (pixelOffset > 1) {
        pixelOffset = 1;
      }
      setOffset(pixelOffset);
    }, 1000 * 60);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      style={{ top: `calc(${offset * 1400}px + 15px)` }}
      className="-left-12 absolute w-[103.2%] flex flex-row items-center gap-8"
    >
      <span className="text-lg font-semibold">
        {currentTime.getHours()}:
        {currentTime.getMinutes().toString().padStart(2, "0")}
      </span>
      <div className="ml-5.5 h-0.5 w-full bg-primary"></div>
    </div>
  );
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
        <p className="text-muted-foreground">Time managment simplified</p>
      </div>
      <div className="mb-8 pb-8">
        <div className="flex flex-row h-screen relative">
          <TimeScale />
          {week.map((day, idx) => (
            <Day
              key={idx}
              subjects={
                idx == 0 && (
                  <>
                    <TimetableElement offset={300} height={300}>
                      <TimetableSubject
                        subject={{
                          name: "Osnove Statistike",
                          carrier: "Aleksandra Tepeh",
                          location: "G2-N0.P1 Alfa",
                          starts: new Date("Mon Oct 20 2025 10:00:00 GMT+0200"),
                          ends: new Date("Mon Oct 20 2025 13:00:00 GMT+0200"),
                          type: "Lecture",
                        }}
                      />
                    </TimetableElement>
                    <TimetableElement offset={700} height={200}>
                      <TimetableSubject
                        subject={{
                          name: "Racunalniska Omrezja",
                          carrier: "Borko Boskovic",
                          location: "G2-N0.P01",
                          starts: new Date("Mon Oct 20 2025 14:00:00 GMT+0200"),
                          ends: new Date("Mon Oct 20 2025 16:00:00 GMT+0200"),
                          type: "Computer Labs",
                        }}
                      />
                    </TimetableElement>
                    <TimetableElement offset={600} height={100}>
                      <TimetableSubject
                        subject={{
                          name: "Uvod v Platformno Odvisen Razvoj Aplikacij",
                          carrier: "Borko Boskovic",
                          location: "G2-N0.P01",
                          starts: new Date("Mon Oct 20 2025 13:00:00 GMT+0200"),
                          ends: new Date("Mon Oct 20 2025 14:00:00 GMT+0200"),
                          type: "Computer Labs",
                        }}
                      />
                    </TimetableElement>
                  </>
                )
              }
              date={day}
            />
          ))}
          <CurrentTimeSlider />
        </div>
      </div>
    </div>
  );
}
