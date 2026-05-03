// START Node

import { State } from "../types";

export async function ValidateNode(state: State): Promise<Partial<State>> {
  const raw = state.input ?? "";
  const trimmed = raw.trim();

  if (trimmed.length === 0) {
    return {
      status: "cancelled",
      message: "Input is empty. Please provide a proper task to start",
    };
  }

  const MAX = 300;
  const safeInput =
    trimmed.length > MAX ? trimmed.slice(0, MAX) + "..." : trimmed;

  return {
    input: safeInput,
  };
}
