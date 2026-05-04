import { State } from "../types";

export async function FinalizeNode(state: State): Promise<Partial<State>> {
  const { status: currentStaus } = state;
  const steps = state.steps ?? [];
  const approved = state.approved ?? false;
  const results = state.results ?? [];

  let status: State["status"];

  if (currentStaus === "cancelled" || !approved) {
    status = "cancelled";
  } else {
    status = "done";
  }

  let message: string;

  if (currentStaus === "cancelled") {
    message =
      state.message ??
      (steps.length
        ? "User rejected plan. Nothing executed"
        : "Cancelled before starting.");
  } else {
    message =
      state.message ??
      (results.length
        ? `Completed ${results.length} steps`
        : steps.length
          ? "Plan is approved. No execution notes were generated."
          : "Finished.");
  }

  return {
    status,
    message,
    steps,
    results,
  };
}
