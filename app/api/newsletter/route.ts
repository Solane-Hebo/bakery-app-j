import { NextResponse } from "next/server";
import { connectDB } from "../lib/db";
import NewsletterSubscriber from "../../models/NewsletterSubscriber";


export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "E-post krävs" },
        { status: 400 }
      );
    }

    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "E-post redan prenumererad" },
        { status: 409 }
      );
    }

    await NewsletterSubscriber.create({ email });

    return NextResponse.json(
      { message: "Prenumeration lyckades" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Något gick fel" },
      { status: 500 }
    );
  }
}

