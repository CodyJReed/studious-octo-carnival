"use client";

import { Loader2, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { FinalView, InterruptView } from "@/lib/types";

export default function RunLogs({
  interrupt,
  final,
  loading,
  onApprove,
  onReject,
}: {
  interrupt?: InterruptView | null;
  final?: FinalView | null;
  loading?: boolean;
  onApprove: () => void;
  onReject: () => void;
}) {
  if (loading) {
    return (
      <Card className="mt-5 border-primary/20">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
            <p className="text-2xl font-bold text-muted-foreground">
              Agent is processing your request.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
  return (
    <Card className="mt-6 border-dashed">
      <CardContent className="flex items-center justify-center py-12">
        <div className="text-center space-y-2">
          <Sparkles className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-2xl font-bold text-muted-foreground">
            No active run, start the agent above to begin.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
