export default function BrandStory() {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-24">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">
            Our Philosophy
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Crafted for the Modern Individual
          </h2>
          <p className="text-gray-600 dark:text-gray-400 text-lg mb-8">
            At Ravelle, we believe that true style is effortless. Our pieces are
            born from a commitment to quality, sustainability, and the pursuit
            of the perfect silhouette.
          </p>

          <div className="grid grid-cols-2 gap-8 mb-10">
            <div>
              <h4 className="text-2xl font-bold">100%</h4>
              <p className="text-sm text-gray-500">Organic Materials</p>
            </div>
            <div>
              <h4 className="text-2xl font-bold">Handmade</h4>
              <p className="text-sm text-gray-500">Ethical Production</p>
            </div>
          </div>

          <button className="border-b-2 border-primary pb-1 text-primary font-bold hover:text-blue-700 transition">
            Learn about our atelier
          </button>
        </div>

        <div className="relative">
          <div
            className="aspect-square rounded-3xl overflow-hidden shadow-2xl bg-cover bg-center"
            style={{
              backgroundImage:
                "url(https://lh3.googleusercontent.com/aida-public/AB6AXuCwMiOaIKaSXFRuejfIYx39Kd3Y8fNUCR2FAKzGL-q9TSCZzCZp_E87ASpN9PpKVgTMRNtJ_VTe4Cef6LjTbuhaAWlQZF1bVKK4z7NiM-vV7hnNJxQtu0i6NRr16xacLKKoS-fWfh_8ujlGm9InrIY1OvLJf9wQLiVadtR5FosWCYGCmbfjH9GmQWoKbgDZAKXAMZZ1T1GVzD1rHm6fjwYGNmKjtrJURIOdufDf5DAmGCmpcJtC_2Kqer7yXQpYyqe3YAGPHkJkQEtJ)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
