import { ClipboardClock, MoreHorizontal } from "lucide-react";
import { Badge } from "./ui/badge";
import { stringToColor } from "@/lib/utils";
import { Button } from "./ui/button";

interface Assignment {
  title: string;
  description?: string;
  createdAt: Date;
  deadline: Date;
  subject: Subject;
}

const Assignment: React.FC<Assignment> = ({
  title,
  description,
  createdAt,
  subject,
  deadline,
}) => {
  return (
    <div className="border rounded-md w-full p-4 flex flex-col gap-4 bg-card">
      <div className="flex flex-row justify-between items-center">
        <Badge
          style={{ backgroundColor: stringToColor(subject.id) }}
          className="text-white font-medium"
        >
          {subject.name}
        </Badge>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal />
        </Button>
      </div>
      <p className="font-semibold text-lg">{title}</p>
      <p className="text-muted-foreground">{description}</p>
      <div className="flex flex-row justify-between items-center">
        <div className="flex flex-row gap-2 items-center">
          <ClipboardClock size={15} className="text-muted-foreground" />
          <span className="text-muted-foreground text-sm">
            {deadline.toLocaleDateString("sl-SI")}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Assignment;
