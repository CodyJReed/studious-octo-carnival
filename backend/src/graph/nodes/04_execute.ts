import { z } from "zod";
import { makeModel } from "../../utils";
import { State } from "../types";

const NotesSchema = z.object({
  notes: z.array(z.string().min(1).max(500)).min(1).max(20),
});

// This type works with openai model(s)...
// but thorws a type error with ollama?
type Notes = z.infer<typeof NotesSchema>;

function createHumanPromptContent(steps: string[]) {
  const list = JSON.stringify(steps, null, 0);

  return [
    "You are a concise assistant.",
    'Given a list of steps, return a JSON object {"notes": string[]}',
    "Rules:",
    "notes.length must be equal as steps.length",
    "each note <= 300 characters",
    "Plain text, no markdown",
    "",
    `Steps = ${list}`,
  ].join("\n");
}

export async function ExecuteNode(state: State): Promise<Partial<State>> {
  const { approved, steps } = state;

  if (!approved) {
    return {};
  }

  if (!steps || steps.length === 0) {
    return {};
  }

  const model = makeModel();
  const structured = model.withStructuredOutput(NotesSchema);

  const out: Notes = (await structured.invoke([
    {
      role: "system",
      content: "Return only valid JSON matching the schema.",
    },
    {
      role: "human",
      content: createHumanPromptContent(steps),
    },
  ])) as Notes;

  const count = Math.min(steps.length, out.notes.length);
  const results = Array.from({ length: count }, (_, i) => ({
    step: steps[i],
    note: out.notes[i],
  }));

  return {
    results,
    status: "done",
    message: `Executed ${results.length} step(s).`,
  };
}
