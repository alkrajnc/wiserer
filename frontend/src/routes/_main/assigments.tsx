import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import axios from "axios";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import AssignmentsContainer from "@/components/assigment-container";
import Assignment from "@/components/assigment";

interface Assigment {
  id: string;
  title: string;
  deadline: Date;
  subject: string;
  status: string;
  createdAt: Date;
  userId: string;
  description?: string;
}

export const fetchAssigments = async (userId: string) => {
  return axios
    .get<ApiResponse<Array<Assigment>>>(
      `${import.meta.env.VITE_API_URL}/api/assigments`,
      {
        headers: {
          "X-User": userId,
        },
      },
    )
    .then((r) => r.data);
};

export const assigmentsQueryOptions = queryOptions({
  queryKey: ["assigments"],
  queryFn: () => fetchAssigments("7bae10a4-8993-48ca-b41d-997917898031"),
});

export const Route = createFileRoute("/_main/assigments")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(assigmentsQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
  const postsQuery = useSuspenseQuery(assigmentsQueryOptions);
  const assigments = postsQuery.data.data;
  return (
    <div className="">
      <div className="mb-6">
        <div className="flex flex-row items-center gap-2 mb-2">
          <NotebookPen size={22} />{" "}
          <h1 className=" text-2xl font-semibold">Assigments</h1>
        </div>
        <p className="text-muted-foreground">
          Manage and view your assigments.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-16">
        <AssignmentsContainer title={"To Do"}>
          {assigments &&
            assigments
              .filter((val) => val.status === "To Do")
              .map((assigment) => (
                <Assignment
                  key={assigment.id}
                  title={assigment.title}
                  description={assigment.description}
                  createdAt={new Date(assigment.createdAt)}
                  deadline={new Date(assigment.deadline)}
                  subject={{
                    subjectCarrier: "",
                    name: assigment.subject,
                  }}
                />
              ))}
        </AssignmentsContainer>
        <AssignmentsContainer title={"In Progress"}>
          {assigments &&
            assigments
              .filter((val) => val.status === "In Progress")
              .map((assigment) => (
                <Assignment
                  key={assigment.id}
                  title={assigment.title}
                  description={assigment.description}
                  createdAt={new Date(assigment.createdAt)}
                  deadline={new Date(assigment.deadline)}
                  subject={{
                    subjectCarrier: "",
                    name: assigment.subject,
                  }}
                />
              ))}
        </AssignmentsContainer>
        <AssignmentsContainer title={"Finished"}>
          {assigments &&
            assigments
              .filter((val) => val.status === "Finished")
              .map((assigment) => (
                <Assignment
                  key={assigment.id}
                  title={assigment.title}
                  description={assigment.description}
                  createdAt={new Date(assigment.createdAt)}
                  deadline={new Date(assigment.deadline)}
                  subject={{
                    subjectCarrier: "",
                    name: assigment.subject,
                  }}
                />
              ))}
        </AssignmentsContainer>
      </div>
    </div>
  );
}
