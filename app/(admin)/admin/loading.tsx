export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6 animate-pulse">
        <div className="space-y-4">
          <div className="h-6 w-48 rounded-full bg-white/[0.04]" />
          <div className="h-4 w-96 rounded-full bg-white/[0.03]" />
        </div>
      </section>

      <section className="section-card rounded-[28px] px-5 py-5 sm:px-6 sm:py-6 animate-pulse">
        <div className="space-y-3">
          <div className="h-4 w-32 rounded-full bg-white/[0.03]" />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-[22px] border border-white/5 bg-white/[0.02]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}