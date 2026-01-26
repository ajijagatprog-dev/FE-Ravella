export default function NewArrivals() {
  return (
    <section className="px-4 md:px-10 lg:px-40 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10 px-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              New Arrivals
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Our latest pieces designed for modern versatility.
            </p>
          </div>
          <a
            href="#"
            className="text-primary font-bold flex items-center gap-1 group"
          >
            View All
            <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </a>
        </div>

        <div className="flex overflow-x-auto gap-6 pb-8 snap-x">
          {[
            {
              title: "Structured Wool Coat",
              category: "Outerwear",
              price: "$450.00",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCYfoG26txtyuM0aSfVQgLDylcaIyPPNBKxwziGsJTkc-Ms-c1U5KPHiuDUWUgnGte3bQ0TBz5936F38Et8clBbqDe0c35pYFKXh5hIFKTjKO0Cd-PqN2zSW1YD7IQBkO4P3BzmEyrCcVgU2BVOMJZ9d3WTvdIpoQlkp9mn4e_nppNofGDun_q3Gxvt5dLPR3NsVXKr91i-INSm8ACxCCEvqz93Ltrzjdi0mRNVy27RRyAsMNvGTiM0KWlfHLGBQPt1A0YmZ6pLdUnw)",
            },
            {
              title: "Silk Slip Dress",
              category: "Evening",
              price: "$280.00",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCgK-8tpsFSCD0zzl0gDsQfkMsddyhaRjI-H_wu_AkTZCsCoANZOmJ2kA4bHz3ZA0fq8ZhX4qG8N0KK_aXh59Mqwgcz3E1bilHYQczj-hjLQZXRcev_AZPLbGr82UX6CvtuecN3ApFlK6yRW6WySlWWpadgpSdxo63GdMRgsxAG-1IBjyoVk3v_EcHZY4p0IvRUMw0jsMgJKxj32DmtysKIvoxnzhzBx3DnMRbT21ZYbrc1Yo7XimNRluoKk6-gQ9CAN9-r6WpEocAY)",
            },
            {
              title: "Tailored Trousers",
              category: "Workwear",
              price: "$195.00",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCuH2Ok6674VX2et90rWFwzijJa1NrAZUqyLwC42I0SLOurnI2O6N-mytygYmXSUQrTiEoP0xH_qI8cbrk01-mvFMD2VS6u1wpjnDjoTuZ4cJFFfvQ64tH9Z8OQNpOPqFk1vS1TE5o2kRCucVkBqyTVCjmLjudRg3z0U6lUOWB2Qo4E1n2IN7j3VS8TF6bTtk3MnF1NrQ96LqBA4RWTe_IpFE9DHYWKPgUoiOO8AgfUWDkXoRzywHaVYIHbASQFc_UHAEccc7EVK8ZU)",
            },
            {
              title: "Cashmere Sweater",
              category: "Essentials",
              price: "$320.00",
              image:
                "https://lh3.googleusercontent.com/aida-public/AB6AXuAT1JEMlxhiMgfAOjD5hrZeryimuAog3k2iKfDwtN_y-CHP8j3SJv-xxx107K8QwCu7YLAxW4-cQeoYvr4bXrPx9EkwKdGMRlZsGQffSBHkd2vzHVLLSdHRcCjLQt-IX_AUgV5Jqc6E2xZd5EcUuYXZ8CmZjOi2NCa-XiZm06VwZr9_gF3SaOM9hXNwu0O63ItlqSPpD8DsFD9JLSKCyx248b-juO07MVRJeqlL7F0FeKKlUmDg4d-l1-piCKfsk4_L7-ODWmPfZlmM)",
            },
          ].map((item, i) => (
            <div key={i} className="min-w-70 md:min-w-[320px] snap-start group">
              <div className="relative aspect-3/4 rounded-2xl overflow-hidden mb-4 bg-gray-200">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${item.image})` }}
                />
                <button className="absolute bottom-4 left-4 right-4 bg-white/90 dark:bg-black/80 backdrop-blur py-3 rounded-xl font-bold translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                  Quick Add
                </button>
              </div>
              <h3 className="font-bold text-lg">{item.title}</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {item.category}
              </p>
              <p className="font-bold text-lg">{item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
