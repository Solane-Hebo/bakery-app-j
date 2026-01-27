"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

/* ===================== TYPES ===================== */

interface Material {
  _id: string;
  name: string;
}

interface Ingredient {
  _id?: string;
  material: Material | null;
  quantity: number;
  unit: string;
}

interface Product {
  _id: string;
  name: string;
}

interface RecipeForm {
  _id: string;
  product: Product | null;
  ingredients: Ingredient[];
}

/* ===================== PAGE ===================== */

export default function EditRecipePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [form, setForm] = useState<RecipeForm>({
    _id: "",
    product: null,
    ingredients: [],
  });

  const [loading, setLoading] = useState(true);

  /* ===================== LOAD DATA ===================== */

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then(r => r.json()),
      fetch("/api/materials").then(r => r.json()),
      fetch(`/api/recipes/${id}`).then(r => r.json()),
    ])
      .then(([productsData, materialsData, recipeData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setMaterials(Array.isArray(materialsData) ? materialsData : []);

        setForm({
          _id: recipeData._id,
          product: recipeData.product || null,
          ingredients: Array.isArray(recipeData.ingredients)
            ? recipeData.ingredients
            : [],
        });

        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  /* ===================== INGREDIENT HANDLERS ===================== */

  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        {
          _id: Date.now().toString(),
          material: null,
          quantity: 1,
          unit: "kg",
        },
      ],
    }));
  };

  const handleIngredientChange = (
    index: number,
    field: "material" | "quantity" | "unit",
    value: any
  ) => {
    const copy = [...form.ingredients];
    copy[index] = { ...copy[index], [field]: value };
    setForm({ ...form, ingredients: copy });
  };

  const removeIngredient = (index: number) => {
    const copy = [...form.ingredients];
    copy.splice(index, 1);
    setForm({ ...form, ingredients: copy });
  };

  /* ===================== SUBMIT ===================== */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      product: form.product?._id,
      ingredients: form.ingredients.map(ing => ({
        material: ing.material?._id,
        quantity: ing.quantity,
        unit: ing.unit,
      })),
    };

    const res = await fetch(`/api/recipes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/recipes");
    } else {
      alert("Failed to update recipe");
    }
  };

  /* ===================== RENDER ===================== */

  if (loading) return <p className="p-6">Loading...</p>;

  return (

    <div className="min-h-[50] flex items-center justify-center px-4">
        <form onSubmit={handleSubmit} className="p-6 max-w-xl w-full rounded-xl shadow-xl  text-[#553030]">
        <div className="flex justify-center items-center gap-1 mb-10">
            <img
              src="/cupcake-logo.png"
              alt="Bakery logo"
              className="h-7 w-16 object-contain"
            />
            <h1 className="text-2xl font-extrabold text-[#553030] text-center">
               Edit Recipe
            </h1>
        </div>

        {/* Product (read-only) */}
        <div>
            <label className="block font-semibold mb-1">Product</label>
            <input
            type="text"
            value={form.product?.name || ""}
            disabled
            className="w-full border p-2 rounded-md bg-gray-100"
            />
        </div>

        {/* Ingredients */}
        <div className="space-y-3">
            <h2 className="font-semibold">Ingredients</h2>

            {form.ingredients.map((ing, i) => (
            <div key={ing._id || i} className="flex gap-2 items-center">
                {/* Material */}
                <select
                className="w-full border p-2 rounded-md flex-1"
                value={ing.material?._id || ""}
                onChange={e => {
                    const selected =
                    materials.find(m => m._id === e.target.value) || null;
                    handleIngredientChange(i, "material", selected);
                }}
                >
                <option value="">Select material</option>
                {materials.map(m => (
                    <option key={m._id} value={m._id}>
                    {m.name}
                    </option>
                ))}
                </select>

                {/* Quantity */}
                <input
                type="number"
                min="0"
                step="0.01"
                className="border p-2 rounded-md  w-24"
                value={ing.quantity}
                onChange={e =>
                    handleIngredientChange(i, "quantity", Number(e.target.value))
                }
                />

                {/* Unit */}
                <select
                className="bw-full border p-2 rounded-md w-24"
                value={ing.unit}
                onChange={e =>
                    handleIngredientChange(i, "unit", e.target.value)
                }
                >
                <option value="kg">kg</option>
                <option value="g">g</option>
                <option value="l">l</option>
                <option value="ml">ml</option>
                <option value="pcs">pcs</option>
                </select>

                <button
                type="button"
                onClick={() => removeIngredient(i)}
                className="text-red-600 text-sm"
                >
                Remove
                </button>
            </div>
            ))}

            <button
            type="button"
            onClick={addIngredient}
            className="text-blue-600 text-sm"
            >
            + Add Ingredient
            </button>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
            <button
            type="submit"
            className="bg-[#553030] text-white px-5 py-2 rounded"
            >
            Save Recipe
            </button>

            <button
            type="button"
            onClick={() => router.push("/admin/recipes")}
            className="bg-gray-200 px-5 py-2 rounded"
            >
            Cancel
            </button>
        </div>
        </form>
</div>
  );
}
