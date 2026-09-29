import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { Contact } from "@/models/Contact"
import { createContactSchema } from "@/lib/validators/contact"
import { Resend } from "resend"


const resend = new Resend(process.env.RESEND_API_KEY)

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

    const { error: emailError } = await resend.emails.send({
      from: "Bakery J <onboarding@resend.dev>",
      to: [process.env.CONTACT_EMAIL!],
      subject: `New message from ${parsed.data.name}`,
      replyTo: parsed.data.email,
          text: `
    New contact message from Bakery J website

    Name: ${parsed.data.name}
    Email: ${parsed.data.email}

    Message:
    ${parsed.data.message}
      `,
    })

    if (emailError) {
      console.error("Email sending error:", emailError)

      return NextResponse.json(
        {
          error: "Message was saved, but email could not be sent.",
        },
        { status: 500 }
      )
    }

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
