// src/app/(public)/components/Testimonials.tsx
const testimonials = [
    {
        name: "John",
        text: "From the moment you walk in, you’re welcomed with amazing smells and friendly service. The pastries are incredible, and the cakes are honestly some of the best I’ve had in years.",
        image: "/john.png"
    },
    {
      
      name: "Sara",
      text: "Absolutely the best bakery I’ve ever visited. Everything is always fresh, beautifully presented, and full of flavor. You can really taste the care and quality that goes into every single item.",
      image: "/sara.png"
    },
    {
      name: "Ali",
      text: "This bakery has become our family’s go-to place for every celebration. Whether it’s birthdays or weekends, we always find something everyone loves. Highly recommended!",
      image: "avatar-placeholder.png"
    },
  ];
  
  export function Testimonials() {
    return (
      <section className="bg-[#f5f2f0] py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-[#553030] text-3xl font-bold">
            They Said About Us
          </h2>
  
          <div className="grid gap-6 md:grid-cols-3 items-center">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className=" flex flex-col rounded-lg text-center items-center bg-white p-6 shadow"
              >
                 <div className="mb-4 h-20 w-20 overflow-hidden  rounded-full">
                    <img 
                        src={t.image}
                        alt={t.name} 
                        width={80}
                        height={80}
                        className="w-full h-full object-cover items-center t"
                    />
                </div>
               
                <p className="mb-4 text-gray-700">“{t.text}”</p>
                <span className="font-semibold text-[#553030]">{t.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }
  