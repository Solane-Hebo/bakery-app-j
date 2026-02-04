import { connectDB } from "@/lib/db";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";
import { getAuthUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await connectDB();

  const authUser = await getAuthUser();
  if (!authUser) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

 try {
  const uploadResult = await new Promise<any>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder: "avatars",
          resource_type: "image",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }

      )
      .end(buffer);
  });

  await User.findByIdAndUpdate(authUser.sub, {
    avatar: uploadResult.secure_url,
  });

  return NextResponse.json({ avatar: uploadResult.secure_url });
} catch (err: any) {
  console.error("Upload failed:", err);
  return NextResponse.json(
    { message: err.message || "Upload failed" },
    { status: 500 }
  );
}
}