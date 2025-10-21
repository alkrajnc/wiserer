import { stringToColor } from "@/lib/utils";
import {
  Clock,
  Computer,
  FlaskConical,
  GraduationCap,
  Laptop,
  MapPinned,
  Presentation,
} from "lucide-react";
import { Badge } from "./ui/badge";

interface TimetableSubject {
  name: string;
  location: string;
  carrier: string;
  starts: Date;
  ends: Date;
  type: "Lecture" | "Seminar" | "Labs" | "Computer Labs";
}

const subjectTypes = {
  Lecture: { color: "#22c55e", icon: <Presentation /> },
  Seminar: { color: "#eab308", icon: <Laptop /> },
  Labs: { color: "#d946ef", icon: <FlaskConical /> },
  "Computer Labs": { color: "#14b8a6", icon: <Computer /> },
};

interface TimetableSubjectProps {
  subject: TimetableSubject;
}

export default function TimetableSubject({ subject }: TimetableSubjectProps) {
  return (
    <div
      className="flex flex-col gap-2 rounded-md p-4 h-full m-1"
      style={{ backgroundColor: stringToColor(subject.name, 0.7) }}
    >
      <div className="mb-2">
        <span className="text-xl font-semibold">{subject.name}</span>
      </div>
      <div>
        <Badge style={{ backgroundColor: subjectTypes[subject.type].color }}>
          {subjectTypes[subject.type].icon} {subject.type}
        </Badge>
      </div>
      <div className="flex flex-row gap-2 items-center">
        <Clock size={17} className="text-muted-foreground" />{" "}
        {subject.starts.getHours()}:
        {subject.starts.getMinutes().toString().padStart(2, "0")}
        {" - "} {subject.ends.getHours()}:
        {subject.ends.getMinutes().toString().padStart(2, "0")}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <MapPinned size={17} className="text-muted-foreground" />{" "}
        {subject.location}
      </div>
      <div className="flex flex-row gap-2 items-center">
        <GraduationCap size={17} className="text-muted-foreground" />{" "}
        {subject.carrier}
      </div>
      <div className="flex flex-row gap-2 items-center"></div>
    </div>
  );
}
