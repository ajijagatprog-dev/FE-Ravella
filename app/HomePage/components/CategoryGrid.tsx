export default function CategoryGrid() {
  const categories = [
    {
      title: "Accessories",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDZ8A0pcbXv73h_nCLC1bsbj6id6Fwd9v2k9r0a2jz3F_YM09uvnsOz8Pt9_yEbFpN96iBD3I0eFd9dAV8DxZBdW6J13mwkEW589SlgnDisM4I3AjyaT7dfV1S8PbK5Yw0kO-WXBCLEQTUBAsSFlmlFRpP1f4uV84htkO-ccbN7Hi7g3B2eObXES9Yi0peQ0Pwpd6mXWTiScQZuDRjz8HpGAB4GMQ7SzNAZHZ0lkwQIuXZkKpSoMYcESiYlNPcTQ9PFJbVXhQAgqBx_)",
    },
    {
      title: "Essentials",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuDPIaRdLfSVAOVNtKqIIQUfauALT-hBVaE3dZl4niePC_SBWT9xpzFh2x0gwNcLkjheRgqjWt8r8jXtFAnMZPji3TOaRGpHR7u_J1dtcXmYUF4TwTHjsa4Ad3ZTZFmfOTn8UdTInSyafMaQA3ADHrsNKZIZSSYHqpTkDxxKGv80eowPwzubsUe7kqNhVd3_5MXwlqIVHl1hAoAnjph1IufyzGyrPP1EDoxLfsgPqYT420MQwhGLi-HmzXsO5laO3vvgMefCLe6Ttw5V)",
    },
    {
      title: "Ready to Wear",
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCpVMY9XEZ-CMoGsMCH2Vdy5hkyt5-1YLPMf-gYQxRyWJ3WnWwudILHh4y7iSZfpmg5DKDUfW-JlD8mMZJN8_1nbqiAZ6nwII00dYKpi7lOF67hqbFCJS2oPD3cIGVy7jn5zeVIFvqFqoFy_-f4of_3z-4CIXVoFL0C2vYYvnbzemQRD2TAtGIhZ_-bbEQJNR4t1t8HN7EwsscP4yutPvITyJ1XnmM5Pbdk6wSOX16k-3gk1kzkgGU9zJxlcVcrwX0SKuvoTQpOi_PB)",
    },
  ];

  return (
    <section className="px-4 md:px-10 lg:px-40 py-16 bg-white dark:bg-background-dark/50">
      <div className="max-w-[1280px] mx-auto">
        <h2 className="text-3xl font-bold tracking-tight mb-10 text-center">
          Shop by Category
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <div
              key={i}
              className={`relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden group cursor-pointer ${
                i === 1 ? "md:mt-12" : ""
              }`}
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors" />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-center">
                <h3 className="text-white text-2xl font-bold mb-4">
                  {cat.title}
                </h3>
                <button className="bg-white text-black px-6 py-2 rounded-full text-sm font-bold opacity-0 group-hover:opacity-100 transition">
                  Explore
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
