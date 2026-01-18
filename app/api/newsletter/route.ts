import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import NewsletterSubscriber from "../../../models/NewsletterSubscriber";


export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const exists = await NewsletterSubscriber.findOne({ email });
    if (exists) {
      return NextResponse.json(
        { message: "Email is already subscribed" },
        { status: 409 }
      );
    }

    await NewsletterSubscriber.create({ email });

    return NextResponse.json(
      { message: "Subscription successful" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

