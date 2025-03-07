import NumberCounter from "../NumberCounter";

const CommunityNumbersSection = ({sectionRef}) => {
  return (
    <section className="px-8 py-20" ref={sectionRef} id="community">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="mb-12 text-5xl md:text-6xl font-bold">Our Community in Numbers</h2>
        <div className="mb-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <p className="text-6xl font-bold text-primary">
              <NumberCounter endNumber={1000} triggerRef={sectionRef} />
            </p>
            <p className="text-textMuted">Active Developers</p>
          </div>
          <div>
            <p className="text-6xl font-bold text-secondary">
              <NumberCounter endNumber={5000} triggerRef={sectionRef} />
            </p>
            <p className="text-textMuted">Projects Created</p>
          </div>
          <div>
            <p className="text-6xl font-bold text-accent1">
              <NumberCounter endNumber={50000} triggerRef={sectionRef} />
            </p>
            <p className="text-textMuted">Discussions Happening</p>
          </div>
        </div>
        <div className="rounded-lg bg-cardBg p-8 shadow-lg">
          <p className="text-xl italic text-textMuted">
            DevRoot has completely transformed how I collaborate with other
            developers. Highly recommended!
          </p>
          <p className="mt-4 font-bold">- Vishesh, Full-Stack Developer</p>
        </div>
      </div>
    </section>
  );
};

export default CommunityNumbersSection;
