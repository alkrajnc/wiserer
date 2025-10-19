import { createFileRoute } from "@tanstack/react-router";
import { NotebookPen } from "lucide-react";
import axios from "axios";
import { queryOptions } from "@tanstack/react-query";

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
            <div className="flex flex-row items-center gap-2">
                <NotebookPen size={18} />{" "}
                <h1 className=" text-lg font-semibold">Assigments</h1>
            </div>
        </div>
    );
}
