import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate mime type
    const validMimes = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
    if (!validMimes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid image format. Supported formats: JPG, PNG, WEBP." },
        { status: 400 }
      );
    }

    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image file size exceeds the 5MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create target directory if not exists
    const uploadDir = path.join(process.cwd(), "public", "uploads", "personnel");
    await mkdir(uploadDir, { recursive: true });

    // Generate safe filename
    const ext = path.extname(file.name) || ".jpg";
    const safeBase = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const fileName = `${Date.now()}-${safeBase || "photo"}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    await writeFile(filePath, buffer);

    // Return the relative public path
    const relativePath = `/uploads/personnel/${fileName}`;

    return NextResponse.json({
      success: true,
      url: relativePath,
      message: "Photo uploaded successfully",
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload personnel photo." },
      { status: 500 }
    );
  }
}
