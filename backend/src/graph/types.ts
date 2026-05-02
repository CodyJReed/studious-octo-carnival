// Construct and define state that flows through the LangGraph
// GRAPH = STATE + NODES + EDGES
// In React.js this can be thought a the context/provider relatioship
import { z } from "zod";

// Status: Planned, Done, Cancelled
export const ExecutionStatus = z.enum(["planned", "done", "cancelled"]);
export type ExecutionStatus = z.infer<typeof ExecutionStatus>;

export const StepResult = z.object({
  step: z.string(),
  note: z.string(),
});
// State using Zod Schema
export const StateSchema = z.object({
  input: z.string().min(5, "Input is required."),
  steps: z.array(z.string()).optional(),
  approved: z.boolean().optional(),
  results: z.array(StepResult).optional(),
  status: ExecutionStatus.optional(),
  message: z.string().optional(),
});

export type State = z.infer<typeof StateSchema>;

// Initial state helper
export function makeInitialState(input: string): State {
  return {
    input,
    status: "planned",
  };
}
