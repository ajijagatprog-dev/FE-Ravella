export default function Newsletter() {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-16">
      <div className="max-w-[1280px] mx-auto bg-primary rounded-[2rem] p-10 md:p-20 text-center relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Join the Collective
          </h2>
          <p className="text-blue-100 mb-10 max-w-lg mx-auto">
            Be the first to receive early access to new collections and
            exclusive invitations.
          </p>

          <form className="flex flex-col md:flex-row gap-4 max-w-md mx-auto">
            <input
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder:text-blue-100/70 rounded-xl px-6 py-4 focus:ring-1 focus:ring-white/50"
              placeholder="Enter your email"
              type="email"
            />
            <button className="bg-white text-primary px-8 py-4 rounded-xl font-bold hover:bg-gray-100 transition">
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
