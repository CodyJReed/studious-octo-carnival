import { z } from "zod";
import { State } from "../types";
import { makeModel } from "../../utils";

const PlanSchema = z.object({
  steps: z
    .array(
      z
        .string()
        .min(3, "Keep each step a short sentence")
        .max(150, "Keep each step concise."),
    )
    .min(1)
    .max(10),
});

type Plan = z.infer<typeof PlanSchema>;

const SYSTEM = [
  "You are a helpful planner.",
  "Return only JSON that matches the schema.",
  "Keep steps concrete, actionable, and beginner friendly.",
].join("\n");

function userPrompt(input: string) {
  return [
    `User goal: ${input}`,
    "Draft a small plan with 3-5 steps",
    "- Each step is a short sentence",
  ].join("\n");
}

function takeFirstN(arr: string[], n = 5): string[] {
  return Array.isArray(arr) ? arr.slice(0, Math.max(0, n)) : [];
}

export async function PlanNode(state: State): Promise<Partial<State>> {
  const { input, status } = state;

  if (status === "cancelled") {
    return {};
  }

  const model = makeModel();

  const structured = model.withStructuredOutput(PlanSchema);

  const plan: Plan = (await structured.invoke([
    {
      role: "system",
      content: SYSTEM,
    },
    {
      role: "human",
      content: userPrompt(input),
    },
  ])) as Plan;

  const steps = takeFirstN(plan.steps, 5);

  return {
    steps,
    status: "planned",
  };
}
