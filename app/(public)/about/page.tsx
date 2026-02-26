export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* <section className="relative h-[48vh] min-h-[360px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/hero-bakery 2.jpg')] bg-cover bg-center"
          aria-hidden
        />
        <div className="absolute inset-0  bg-[#978282]" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col justify-center px-6">
          <p className="text-sm font-semibold tracking-widest text-white/80">
            ABOUT US
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-white md:text-5xl">
            Baked with care, served with love.
          </h1>
          <p className="mt-4 max-w-2xl text-base text-white/90 md:text-lg">
            We craft fresh bread, pastries, and cakes every day — using quality
            ingredients, simple recipes, and a lot of heart.
          </p>
        </div>
      </section> */}

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6 py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-2 md:items-start">
          {/* Story */}
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-extrabold text-[#553030]">
              Our story
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Our bakery started with a simple idea: make everyday baking feel
              special. From warm sourdough in the morning to pastries in the
              afternoon, we focus on consistent quality and friendly service.
            </p>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              We bake in small batches, keep our menu seasonal, and always aim
              for the perfect balance of flavor, texture, and freshness.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Stat label="Daily baked" value="Fresh batches" />
              <Stat label="Ingredients" value="Quality first" />
              <Stat label="Made for" value="Your moments" />
            </div>
          </div>

          {/* Values */}
          <div className="rounded-2xl bg-[#F9F9F9] p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-extrabold text-[#553030]">
              What we believe in
            </h2>

            <div className="mt-6 space-y-4">
              <ValueCard
                title="Fresh every day"
                desc="We prepare dough and bake daily, so you always get the best taste and texture."
                icon="🥐"
              />
              <ValueCard
                title="Simple, honest recipes"
                desc="We keep it real: clean ingredients, traditional methods, and attention to detail."
                icon="🌾"
              />
              <ValueCard
                title="Warm service"
                desc="A bakery should feel like home — we love welcoming you in."
                icon="🤍"
              />
            </div>
          </div>
        </div>

        {/* Team + Image */}
        <div className="mt-10 grid gap-8 md:mt-14 md:grid-cols-2 md:items-center">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5 md:p-8">
            <h2 className="text-2xl font-extrabold text-[#553030]">Our team</h2>
            <p className="mt-3 text-sm leading-6 text-gray-700">
              Behind every loaf is a team that cares. Bakers, pastry chefs, and
              front-of-house staff work together to keep everything fresh,
              beautiful, and ready on time.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <TeamChip name="Bakers" role="Bread & dough" />
              <TeamChip name="Pastry" role="Desserts & cakes" />
              <TeamChip name="Service" role="Coffee & counter" />
              <TeamChip name="Kitchen" role="Prep & quality" />
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
            <div
              className="aspect-[4/3] w-full bg-[url('/hero-bakery.jpg')] bg-cover bg-center"
              aria-hidden
            />
            <div className="absolute inset-0  bg-[#978282] from-black/35 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/85 p-4 backdrop-blur">
              <p className="text-sm font-semibold text-[#553030]">
                “Serious about baking. Soft about everything else.”
              </p>
              <p className="mt-1 text-xs text-gray-600">
                Visit us for fresh bread, pastries, and seasonal specials.
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 rounded-2xl bg-[#553030] px-6 py-8 text-white shadow-sm md:px-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-extrabold">Ready to explore the menu?</h3>
              <p className="mt-1 text-sm text-white/90">
                Discover our best sellers and seasonal favorites.
              </p>
            </div>
            <a
              href="/menu"
              className="inline-flex w-fit items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#553030] hover:opacity-90"
            >
              See menu
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[#F9F9F9] p-4 ring-1 ring-black/5">
      <div className="text-xs font-semibold text-gray-600">{label}</div>
      <div className="mt-1 text-sm font-extrabold text-[#0F172A]">{value}</div>
    </div>
  )
}

function ValueCard({
  title,
  desc,
  icon,
}: {
  title: string;
  desc: string;
  icon: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#553030]/10 text-lg">
        {icon}
      </div>
      <div>
        <div className="text-sm font-extrabold text-[#0F172A]">{title}</div>
        <div className="mt-1 text-sm leading-6 text-gray-700">{desc}</div>
      </div>
    </div>
  )
}

function TeamChip({ name, role }: { name: string; role: string }) {
  return (
    <div className="rounded-xl bg-[#F9F9F9] p-4 ring-1 ring-black/5">
      <div className="text-sm font-extrabold text-[#0F172A]">{name}</div>
      <div className="mt-1 text-xs text-gray-600">{role}</div>
    </div>
  )
}
