// Role -> suspends sequence execution, requiring human interaction
import { State } from "../types";

type Decision = {
  approve?: boolean;
};

export async function ApproveNode(
  state: State,
  context: any,
): Promise<Partial<State>> {
  const { steps, status } = state;
  if (status === "cancelled") {
    return {};
  }

  // Handle lack of steps...
  if (!steps || steps.length === 0) {
    return {
      approved: true,
      message: "No steps to approve; proceeding.",
    };
  }
  // Utilize inheritted 'interrupt' to return...
  // approval_request to the user
  const interrupt = context?.interrupt as (payload: {
    type: string;
    steps: string[];
  }) => Promise<
    | {
        approve?: boolean;
      }
    | undefined
  >;
  const decision = await interrupt({
    type: "approval_request",
    steps,
  });

  // If a decision exists and is made...
  if (!decision || typeof decision !== "object") {
    return {
      approved: false,
    };
  }
  // Return approved state based on decision 'approval'?
  return {
    approved: !!(decision as Decision)?.approve,
  };
}
