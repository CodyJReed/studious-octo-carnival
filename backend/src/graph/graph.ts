// Define and compile LangGraph workflow

import {
  Annotation,
  Command,
  END,
  MemorySaver,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { ValidateNode } from "./nodes/01_validate";
import { PlanNode } from "./nodes/02_plan";
import { ApproveNode } from "./nodes/03_approve";
import { ExecuteNode } from "./nodes/04_execute";
import { FinalizeNode } from "./nodes/05_finalize";
import { makeInitialState, State } from "./types";

const StateAnnotation = Annotation.Root({
  input: Annotation<string>,
  steps: Annotation<string[] | undefined>,
  approved: Annotation<boolean | undefined>,
  results: Annotation<Array<{ step: string; note: string }>>,
  status: Annotation<"planned" | "done" | "cancelled" | undefined>,
  message: Annotation<string | undefined>,
});

// Linear path: start > validate > plan > approve > execute > finalize > end
const builder = new StateGraph(StateAnnotation)
  .addNode("validate", ValidateNode)
  .addNode("plan", PlanNode)
  .addNode("approve", ApproveNode)
  .addNode("execute", ExecuteNode)
  .addNode("finalize", FinalizeNode);
// Add edges
builder
  .addEdge(START, "validate")
  .addEdge("validate", "plan")
  .addEdge("plan", "approve");
// Porvide conditional
builder
  .addConditionalEdges("approve", (s: typeof StateAnnotation.State) => {
    return s.approved ? "execute" : "finalize";
  })
  .addEdge("execute", "finalize")
  .addEdge("finalize", END);

const checkPointer = new MemorySaver();
const graph = builder.compile({
  checkpointer: checkPointer,
});
// Helper for generating random id
function createThreadId() {
  return `t_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

// Function to start Graph run
export async function startAgentRun(
  input: string,
): Promise<
  { interrupt: { threadId: string; steps: string[] } } | { final: State }
> {
  const threadId = createThreadId();
  // Create run placeholder using threadId against __interrupt__
  const config = {
    configurable: {
      thread_id: threadId,
    },
  };
  // Start Run with provided initial state and configuration
  const result: any = await graph.invoke(makeInitialState(input), config);

  // Handle interruption
  if (result && result.__interrupt__) {
    const first = Array.isArray(result.__interrupt__)
      ? result.__interrupt__[0]
      : result.__interrupt__;

    const steps = (first?.value?.steps as string[]) ?? [];

    return {
      interrupt: {
        threadId,
        steps,
      },
    };
  }

  return {
    final: result as State,
  };
}
// Resume Run with threadId and approval state...
export async function resumeAgentRun(args: {
  threadId: string;
  approvalState: boolean;
}): Promise<State> {
  const { threadId, approvalState } = args;
  const config = {
    configurable: {
      thread_id: threadId,
    },
  };

  const finalState = (await graph.invoke(
    new Command({
      resume: { approve: approvalState },
    }),
    config,
  )) as State;

  return finalState;
}
