import MenuClient from "./menu-client"

type Product = {
  _id: string
  name: string
  description?: string
  price: number
  unit?: string
  imageUrl?: string
  category?: "bread" | "cakes" | "other"
}

async function getProducts(): Promise<Product[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")

  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" })
  if (!res.ok) return []

  const data = await res.json()
  return data.products ?? []
}

export default async function MenuPage() {
  const products = await getProducts()
  return <MenuClient products={products} />
}
