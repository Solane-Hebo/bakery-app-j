"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import OrderModal from "@/components/layout/OrderModal";

type Product = {
  _id: string;
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
  isBestSeller?: boolean;
};

export default function BestSellers() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);


  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [qty, setQty] = useState(1);
  const [pickup, setPickup] = useState("ASAP");

  useEffect(() => {
    async function fetchBestSellers() {
      try {
        const res = await fetch("/api/products?bestSeller=true");
        const data = await res.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load best sellers");
      } finally {
        setLoading(false);
      }
    }

    fetchBestSellers();
  }, []);

  function handleOrder(product: Product) {
    setSelectedProduct(product);
    setQty(1);
    setPickup("ASAP");
    setModalOpen(true);
  }

  if (loading) {
    return <div className="text-center py-10">Loading best sellers...</div>;
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h2 className="mb-12 text-center text-3xl font-bold text-[#553030]">
        Our Best Sellers
      </h2>

      <div className="grid gap-6 md:grid-cols-4">
        {products.map((product) => (
          <div
            key={product._id}
            className="relative rounded-xl bg-white shadow hover:shadow-lg transition"
          >
            {/* Bestseller Badge */}
            {product.isBestSeller && (
              <span className="absolute top-3 left-3 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-white">
                BESTSELLER
              </span>
            )}

            {/* Image */}
            <div className="relative h-56 w-full overflow-hidden rounded-t-xl">
              {product.imageUrl ? (
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-400">
                  No Image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-[#0F172A]">
                {product.name}
              </h3>

              <p className="mt-1 text-[#553030] font-bold">
                {product.price.toFixed(2)} kr
              </p>

              <button
                onClick={() => handleOrder(product)}
                className="mt-4 w-full rounded-xl bg-[#553030] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
              >
                Order
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 🔥 Reused OrderModal */}
      {modalOpen && selectedProduct && (
        <OrderModal
          product={selectedProduct}
          qty={qty}
          setQty={setQty}
          pickup={pickup}
          setPickup={setPickup}
          pickupOptions={[
            { label: "ASAP", value: "ASAP" },
            { label: "In 30 minutes", value: "30min" },
            { label: "In 1 hour", value: "1h" },
          ]}
          whatsappHref={`https://wa.me/46701234567?text=Hi! I want to order ${selectedProduct.name} x${qty}`}
          telegramHref={`https://t.me/yourbakery?text=Hi! I want to order ${selectedProduct.name} x${qty}`}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
