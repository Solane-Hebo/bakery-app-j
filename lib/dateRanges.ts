export function getRange(range: "day" | "week" | "month") {
  const now = new Date()

  const from = new Date(now)
  const to = new Date(now)

  if (range === "day") {
    from.setHours(0, 0, 0, 0)
    to.setHours(23, 59, 59, 999)
  }

  if (range === "week") {
    const day = (now.getDay() + 6) % 7// 0 = Monday
    from.setDate(now.getDate() - day)
    from.setHours(0, 0, 0, 0)
    to.setDate(from.getDate() + 6)
    to.setHours(23, 59, 59, 999)
  }

  if (range === "month") {
    from.setDate(1);
    from.setHours(0, 0, 0, 0)
    to.setMonth(from.getMonth() + 1, 0) // last day of month
    to.setHours(23, 59, 59, 999)
  }

  return { from, to }
}
