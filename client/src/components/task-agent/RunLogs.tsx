"use client";

import {
  AlertCircle,
  CheckCircle,
  Loader2,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { FinalView, InterruptView } from "@/lib/types";
import { Button } from "../ui/button";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";

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
  if (interrupt) {
    return (
      <Card className="mt-5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2 text-2xl">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            Approval Required
          </CardTitle>
        </CardHeader>
        <CardDescription className="text-base pt-3 mx-auto">
          {interrupt?.prompt}
        </CardDescription>
        <CardContent className="space-y-5">
          <div className="space-y-3 mt-5">
            <h4 className="font-semibold text-muted-foreground uppercase tracking-wide text-sm underline">
              Planned Steps
            </h4>
            <ol className="space-y-1">
              {interrupt?.steps.map((step, i) => (
                <li
                  key={`${step}-${i}`}
                  className="text-foreground leading-relaxed"
                >
                  <span className="font-bold">{i + 1}.</span> {step}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex justify-center gap-3">
              <Button
                className="flex flex-col h-14 w-1/4 bg-green-500 cursor-pointer hover:bg-green-600 transition-colors ease-in-out duration-500 group gap-1"
                onClick={onApprove}
              >
                <ThumbsUp className="h-4 w-4 group-hover:animate-bounce" />
                Approve & Continue
              </Button>
              <Button
                onClick={onReject}
                className="flex flex-col h-14 w-1/4 bg-red-500 cursor-pointer hover:bg-red-600 transition-colors ease-in-out duration-500 group gap-1"
              >
                <ThumbsDown className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                Reject & Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (final) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <div className="flex items-center justify-center">
            <CardTitle className="flex items-center gap-2 text-xl flex-0">
              <CheckCircle className="h-5 w-5 text-green-500" />
              Execution Result
            </CardTitle>
            <CardContent className="flex-1">
              {final.message && (
                <Alert>
                  <AlertTitle>Status Message</AlertTitle>
                  <AlertDescription>{final.message}</AlertDescription>
                </Alert>
              )}
              {final?.steps && final.steps.length > 0 && (
                <div className="space-y-3 mt-6">
                  <h4 className="text-2xl text-muted-foreground font-bold">
                    Execution Steps
                  </h4>
                  <ol className="space-y-1">
                    {final.steps.map((step, i) => (
                      <li
                        key={`${step}-${i}`}
                        className="text-foreground leading-relaxed"
                      >
                        <span className="font-bold">{i + 1}.</span> {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
              {final?.results && final.results.length > 0 && (
                <div className="space-y-3">
                  <h4 className="mt-7 text-3xl text-muted-foreground font-bold">
                    Results
                  </h4>
                  <hr/>
                  <ul className="space-y-1">
                    {final.results.map((result, i) => (
                      <li
                        key={`${result.step}-${i}`}
                        className="bg-accent/30 rounded-lg p-4 pl-0 border-border/50"
                      >
                        <p className="font-semibold text-foreground mb-1">
                          {result?.step}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {result?.note}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </div>
        </CardHeader>
      </Card>
    );
  }

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
