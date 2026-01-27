"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface Ingredient {
  _id: string;
  material: { _id: string; name: string } | null;
  quantity: number;
  unit: string;
}

interface Recipe {
  _id: string;
  product: { _id: string; name: string } | null;
  ingredients: Ingredient[];
}

export default function RecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    fetch("/api/recipes")
      .then(res => res.json())
      .then(data => Array.isArray(data) ? setRecipes(data) : setRecipes([]))
      .catch(() => setRecipes([]));
  }, []);

  const handleDelete = async (id: string) => {
    const ok = confirm("Are you sure you want to delete this recipe?");
    if (!ok) return;

    const res = await fetch(`/api/recipes/${id}`, { method: "DELETE" });

    if (res.ok) {
      setRecipes(prev => prev.filter(r => r._id !== id));
    } else {
      alert("Failed to delete recipe");
    }
  };

  return (
    <div className="p-6 text-[#553030]">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Recipes</h1>
        <Link
          href="/admin/recipes/new"
          className="bg-[#553030] text-white px-4 py-2 rounded"
        >
          + New Recipe
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes found.</p>
      ) : (
        <div className="grid gap-4">
          {recipes.map(recipe => (
            <div
              key={recipe._id}
              className="relative border border-transparent rounded-xl p-4 bg-white shadow-sm"
            >
              {/* Product Name */}
              <h2 className="text-lg font-semibold mb-3">
                {recipe.product?.name || "Product deleted"}
              </h2>

              {/* Ingredients */}
              <div className="space-y-2">
                {recipe.ingredients.map(ing => (
                  <div
                    key={ing._id}
                    className="flex justify-between items-center text-sm bg-gray-50 px-3 py-2 rounded"
                  >
                    <span className="font-medium">
                      {ing.material?.name || "Material deleted"}
                    </span>
                    <span className="text-gray-600">
                      {ing.quantity} {ing.unit}
                    </span>
                  </div>
                ))}
              </div>

  
              <div className="flex justify-end gap-2 pt-3 border-t border-transparent">
                <Link
                  href={`/admin/recipes/${recipe._id}`}
                  className="px-3 py-1 text-sm rounded border border-[#553030] text-[#553030] hover:bg-[#553030] hover:text-white transition"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(recipe._id)}
                  className="bg-[#553030] text-white px-3 py-1 rounded-md hover:bg-red-500 hover:text-white transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
