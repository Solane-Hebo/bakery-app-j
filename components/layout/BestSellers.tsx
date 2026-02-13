// src/app/(public)/components/BestSellers.tsx
const items = [
    { name: "Chocolate Cake", price: "$12", image: "/chocolatecakes.jpg" },
    { name: "Bread", price: "$4", image: "/bread.jpg" },
    { name: "Cupcakes", price: "$8", image: "/cupcakes 2.jpg" },
    { name: "Cheesecake", price: "$8", image: "/cheesecake.jpg" },
  ];
  
  export function BestSellers() {
    return (
      <section className="mx-auto max-w-6xl px-4 py-16 ">
        <h2 className="mb-20 mt-10 text-center text-3xl font-bold text-[#553030]">
          Our Best Sellers
        </h2>
  
        <div className="grid gap-6 md:grid-cols-4">
          {items.map((item) => (
            <div
              key={item.name}
              className=" relative rounded-lg bg-white shadow text-hover:shadow-lg transition"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full rounded-t-lg object-cover"
              />
              <div className="absolute flex flex-col inset-0 justify-between  text-white">
                <h3 className="text-lg p-4 font-semibold">{item.name}</h3>
                <p className=" font-bold text-xl px-4 py-1 border w-20 border-transparent bg-white rounded-xl text-[#553030]">{item.price}</p>
    
              </div>
              <div>
                    <button className="absolute bottom-0 right-0 border flex-row rounded-2xl px-5 py-1.5 bg-[#553030] border-transparent font-bold">
                        order
                    </button>
                </div>
            </div>
          ))}
        </div>
      </section>
    );
  }
  