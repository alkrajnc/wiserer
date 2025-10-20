import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import axios from "axios";
import { queryOptions } from "@tanstack/react-query";
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
}

export const fetchAssigments = async () => {
  return axios
    .get<Array<Assigment>>(`${import.meta.env.VITE_API_URL}/api/assigments`)
    .then((r) => r.data);
};

export const assigmentsQueryOptions = queryOptions({
  queryKey: ["assigments"],
  queryFn: () => fetchAssigments(),
});

export const Route = createFileRoute("/_main/assigments")({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData(assigmentsQueryOptions),
  component: RouteComponent,
});

function RouteComponent() {
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
          {[
            <Assignment
              title="Vaja 1 - CML2"
              description="Naredi od 1.1 do 1.5"
              createdAt={new Date()}
              deadline={new Date()}
              subject={{
                subjectCarrier: "Janez Novak",
                id: "1243-sdfnjvnsd-2e3sdf",
                name: "Racunalniska omrezja",
              }}
            />,
            <Assignment
              title="Vaja 3 - Data Binding"
              description="Naredi od 1.1 do 1.5"
              createdAt={new Date()}
              deadline={new Date()}
              subject={{
                subjectCarrier: "Mirko Mirkovic",
                id: "00923-vsdnvs-acascascasc",
                name: "Uporabniski vmesniki",
              }}
            />,
          ]}
        </AssignmentsContainer>
        <AssignmentsContainer title={"In Progress"}>
          {[
            <Assignment
              title="Vaja 2 - WPF"
              description="Naredi od 1.1 do 1.5"
              createdAt={new Date()}
              deadline={new Date()}
              subject={{
                subjectCarrier: "Mirko Mirkovic",
                id: "98123lvd-asiudasda-cascascas",
                name: "Uporabniski vmesniki",
              }}
            />,
          ]}
        </AssignmentsContainer>
        <AssignmentsContainer title={"Finished"}>
          {[
            <Assignment
              title="Vaja 4 - Android Views"
              description="Naredi od 1.1 do 1.5"
              createdAt={new Date()}
              deadline={new Date()}
              subject={{
                subjectCarrier: "Mirko Mirkovic",
                id: "sdfsdaj-nsd-2e3sdf",
                name: "Uvod v platformno odvisen razvoj aplikacij",
              }}
            />,
          ]}
        </AssignmentsContainer>
      </div>
    </div>
  );
}
