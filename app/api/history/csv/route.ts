import { connectDB } from "@/lib/db";
import { Sale } from "@/models/Sale";
import { requireAuth } from "@/lib/requireAuth";
import { historyQuerySchema } from "@/lib/validators/history";
import { getRange } from "@/lib/dateRanges";

export const runtime = "nodejs"

function toCsvRow(values: (string | number)[]) {
  // basic CSV escaping
  return values
    .map((v) => {
      const s = String(v ?? "")
      const escaped = s.replaceAll('"', '""')
      return `"${escaped}"`
    })
    .join(",")
}

export async function GET(req: Request) {
  const auth = await requireAuth();
  if (!auth.ok) {
    return new Response(JSON.stringify({ status: "error", message: auth.message }), {
      status: auth.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  await connectDB();

  const url = new URL(req.url);
  const parsed = historyQuerySchema.safeParse({
    range: url.searchParams.get("range") ?? "day",
  });

  if (!parsed.success) {
    return new Response(JSON.stringify({ status: "error", message: "Invalid query" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    })
  }

  const { range } = parsed.data;
  const { from, to } = getRange(range);

  const sales = await Sale.find({ createdAt: { $gte: from, $lte: to } }).sort({ createdAt: -1 });

  const header = toCsvRow(["Date", "Product", "Quantity", "Unit price", "Total"]);
  const rows = sales.map((s) =>
    toCsvRow([
      new Date(s.createdAt).toISOString(),
      s.productNameSnapshot,
      s.quantity,
      s.unitPriceSnapshot.toFixed(2),
      s.total.toFixed(2),
    ])
  );

  const csv = [header, ...rows].join("\n")

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="history_${range}.csv"`,
    }
  })
}
