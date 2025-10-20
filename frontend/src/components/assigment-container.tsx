import { Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface AssigmentsContainerProps {
  title?: string;
  children?: React.ReactNode[];
}

const AssignmentsContainer: React.FC<AssigmentsContainerProps> = ({
  title,
  children,
}) => {
  return (
    <div className="border rounded-md w-full">
      <div className="p-4 border-b flex flex-row items-center justify-between">
        <div className="flex flex-row items-center gap-2 ">
          <p className="text-lg font-semibold">{title}</p>
          <Badge variant={"secondary"}> {children?.length ?? 0}</Badge>
        </div>
        <Button size={"icon"} variant={"ghost"}>
          <Plus />
        </Button>
      </div>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
};

export default AssignmentsContainer;
