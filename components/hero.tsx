export function Hero() {
  return (
    <section className="w-full">
      <div className="max-w-4xl mx-auto px-4 pt-8 pb-6 space-y-3">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Your calories, calculated.
          <span className="block font-medium text-muted-foreground">Know exactly how much your body burns in a day.</span>
        </h1>
        <p className="text-base text-muted-foreground leading-relaxed max-w-2xl">
          Use the TDEE calculator to learn your Total Daily Energy Expenditure — how many calories you burn each day. Get your BMR, maintenance calories, and cut and bulk targets instantly.
        </p>
      </div>
    </section>
  );
}
