export default function Header() {
  return (
    <section className="py-24 px-6 md:px-12 lg:px-24 border-b border relative overflow-hidden shadow-2xl">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/20 via-transparent to-transparent opacity-50"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-serif italic text-neutral-400 tracking-tighter mb-6">
          Gallery{" "}
        </h1>
        <p className="text-neutral-400 max-w-2xl text-lg font-light leading-relaxed">
          Experience fine art in a new dimension. Preview masterpieces in 3D,
          customize frames to match your aesthetic, and visualize them in your
          space with Augmented Reality.
        </p>
      </div>
    </section>
  );
}
