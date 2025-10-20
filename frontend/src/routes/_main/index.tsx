import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_main/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="">
      <h1 className="text-center text-4xl font-bold mb-2">
        Hello, {"Vojko Stojko"}
      </h1>
      <p className="text-center text-muted-foreground">See what you missed.</p>
    </div>
  );
}
