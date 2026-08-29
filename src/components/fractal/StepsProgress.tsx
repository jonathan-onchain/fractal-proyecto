import { Check, Loader2 } from "lucide-react";

export function StepsProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ul className="space-y-3">
      {steps.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li
            key={step}
            className={`flex items-center gap-3 rounded-xl border p-3 text-sm transition-colors ${
              done
                ? "border-fleet/30 bg-fleet-soft text-foreground"
                : active
                  ? "border-border bg-muted text-foreground"
                  : "border-transparent bg-muted/50 text-muted-foreground"
            }`}
          >
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                done ? "bg-fleet text-card" : "bg-border text-muted-foreground"
              }`}
            >
              {done ? (
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              ) : active ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <span className="text-[10px] font-bold">{i + 1}</span>
              )}
            </span>
            <span className="font-medium">{step}</span>
          </li>
        );
      })}
    </ul>
  );
}
