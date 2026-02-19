import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Contact } from "@/models/Contact"
import { createContactSchema } from "@/lib/validators/contact"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const parsed = createContactSchema.safeParse(body)

    if (!parsed.success) {
        console.log("Validation errors:", parsed.error.flatten())
      
        return NextResponse.json(
          {
            error: "Validation failed",
            issues: parsed.error.flatten(),
          },
          { status: 400 }
        )
      }

    await connectDB()

    const contact = await Contact.create(parsed.data)

    return NextResponse.json(
      {
        success: "Message sent successfully!",
        contact,
      },
      { status: 201 }
    )

  } catch (error) {
    console.error("Contact API error:", error)

    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    )
  }
}
