"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewRecipePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [usedProducts, setUsedProducts] = useState<string[]>([]);


  const [form, setForm] = useState({
    product: "",
    ingredients: [{ material: "", quantity: 1, unit: "kg" }],
  });

  useEffect(() => {
    fetch("/api/products")
      .then(r => r.json())
      .then(data => {
        console.log("PRODUCTS API RESPONSE", data);
        setProducts(data.products || []);
      });
  
    fetch("/api/materials")
      .then(r => r.json())
      .then(setMaterials);

    fetch("/api/recipes/used-products")
    .then(r => r.json())
    .then(setUsedProducts);
  }, []);

  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { material: "", quantity: 1, unit: "kg" },
      ],
    }));
  };
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    // 1️⃣ check if recipe exists
    const check = await fetch(`/api/recipes/by-product/${form.product}`);
  
    if (check.ok) {
      const existing = await check.json();
  
      // 2️⃣ update instead of create
      const res = await fetch(`/api/recipes/${existing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ingredients: [
            ...existing.ingredients,
            ...form.ingredients,
          ],
        }),
      });
  
      if (res.ok) router.push("/admin/recipes");
      else alert("Failed to update recipe");
  
      return;
    }
  
    // 3️⃣ create only if NOT exists
    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
  
    if (res.ok) router.push("/admin/recipes");
    else alert("Failed to create recipe");
  };
  
  return (
    <div className="min-h-[50] flex items-center justify-center px-4">
       <form onSubmit={handleSubmit} className="p-6 max-w-xl w-full rounded-xl shadow-xl space-y-4 text-[#553030]">
         <div className="flex justify-center items-center gap-1 mb-10">
              <img
                src="/cupcake-logo.png"
                alt="Bakery logo"
                className="h-7 w-16 object-contain"
              />
              <h1 className="text-2xl font-extrabold text-[#553030] text-center">
                New Recipe
              </h1>
         </div>

          {/* Product */}
          <select
            className="w-full border p-2 rounded-md"
            value={form.product}
            onChange={e => setForm({ ...form, product: e.target.value })}
          >
            <option value="">Select Product</option>

            {products.map((p: any) => {
              const isUsed = usedProducts.includes(p._id);

              return (
                <option key={p._id} value={p._id} disabled={isUsed}>
                  {p.name} {isUsed ? "— already has recipe" : ""}
                </option>
              );
            })}
          </select>
          <p className="text-sm text-gray-500">
             Products that already have a recipe are disabled.
          </p>
{/*  
          {form.product && ( */}
             <div className="pt-4 space-y-2">

             <h2 className="font-semibold text-lg">Ingredients</h2>
              <p className="text-sm text-gray-500">
                Add the ingredients required to produce <b>1 pcs</b> of this product
              </p>
          

          {/* Ingredients */}
          {form.ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                {/* Material */}
                <select
                  className="w-full border p-2 rounded-md flex-1"
                  value={ing.material}
                  onChange={e => {
                    const copy = [...form.ingredients];
                    copy[i].material = e.target.value;
                    setForm({ ...form, ingredients: copy });
                  }}
                >
                  <option value="">Material</option>
                  {materials.map((m: any) => (
                    <option key={m._id} value={m._id}>
                      {m.name}
                    </option>
                  ))}
                </select>

                {/* Quantity */}
                <input
                  type="number"
                  min="0.01"
                  className="border p-2 rounded-md w-24"
                  value={ing.quantity}
                  onChange={e => {
                    const copy = [...form.ingredients];
                    copy[i].quantity = Number(e.target.value);
                    setForm({ ...form, ingredients: copy });
                  }}
                />

                {/* Unit ✅ REQUIRED */}
                <select
                  className="border p-2 rounded-md w-24"
                  value={ing.unit}
                  onChange={e => {
                    const copy = [...form.ingredients];
                    copy[i].unit = e.target.value;
                    setForm({ ...form, ingredients: copy });
                  }}
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="l">l</option>
                  <option value="ml">ml</option>
                  <option value="pcs">pcs</option>
                </select>
              </div>
            ))}


          <button type="button" onClick={addIngredient} className="text-blue-600">
            + Add ingredient
          </button>
       </div>
      {/* )} */}
          <div className="flex gap-3  justify-centerpt-4">
          <button
            type="submit"
            className="bg-[#553030] text-white px-4 py-2 rounded"
          >
            Save Recipe
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="border px-4 py-2 rounded hover:bg-[#553030] hover:text-white transition"
          >
            Cancel
          </button>
        </div>
        </form>
  </div>
  );
}
