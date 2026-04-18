const SEGMENTS = [
  { label: "BMR", pct: 70, fill: "bg-sky-400" },
  { label: "Physical activity", pct: 20, fill: "bg-sky-400/60" },
  { label: "Thermic effect of food", pct: 10, fill: "bg-sky-400/30" },
];

export function HowTdeeIsCalculated() {
  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto px-4 py-10 grid gap-8 md:grid-cols-[1fr_360px] items-start">
        <div className="space-y-3 min-w-0">
          <h2 className="text-lg font-semibold tracking-tight">How TDEE is calculated</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your <strong className="text-foreground font-medium">Total Daily Energy Expenditure (TDEE)</strong> is how many calories your body burns in a day — including exercise, digestion, and everything in between. It starts with your <strong className="text-foreground font-medium">Basal Metabolic Rate (BMR)</strong>: the calories you'd burn at complete rest. We multiply that by an activity factor to account for movement, workouts, and the energy cost of digesting food (the thermic effect).
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Even with a sedentary lifestyle you burn meaningfully more than your BMR — which is why we never show BMR alone as your daily target.
          </p>
        </div>

        <div className="space-y-3 min-w-0 md:mt-10">
          <div
            className="flex h-2.5 w-full overflow-hidden rounded-full"
            role="img"
            aria-label="Typical TDEE composition: 70% BMR, 20% physical activity, 10% thermic effect of food"
          >
            {SEGMENTS.map((s) => (
              <div key={s.label} className={s.fill} style={{ width: `${s.pct}%` }} />
            ))}
          </div>

          <ul className="space-y-1.5 text-sm">
            {SEGMENTS.map((s) => (
              <li key={s.label} className="flex items-center gap-3">
                <span className={`inline-block w-2.5 h-2.5 rounded-full ${s.fill}`} aria-hidden />
                <span className="flex-1 text-muted-foreground">{s.label}</span>
                <span className="font-mono tabular-nums text-foreground">{s.pct}%</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Typical adult breakdown. Very active people can see physical activity climb to 30–40% of total burn.
          </p>
        </div>
      </div>
    </section>
  );
}
