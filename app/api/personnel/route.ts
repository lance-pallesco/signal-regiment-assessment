import { NextRequest, NextResponse } from "next/server";
import { PersonnelService } from "@/lib/services/personnelService";
import { personnelSchema } from "@/lib/validations/personnel";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const search = searchParams.get("search") || undefined;
    const unit = searchParams.get("unit") || undefined;
    const rank = searchParams.get("rank") || undefined;
    const status = searchParams.get("status") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const sortBy = (searchParams.get("sortBy") as any) || "id";
    const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || "asc";

    const result = await PersonnelService.getPersonnelList({
      search,
      unit,
      rank,
      status,
      page,
      limit,
      sortBy,
      sortOrder,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/personnel Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve personnel records." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = personnelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: validation.error.format(),
        },
        { status: 400 }
      );
    }

    // Check duplicate Serial Number if provided
    if (validation.data.serialNumber) {
      const existing = await PersonnelService.getPersonnelBySerialNumber(validation.data.serialNumber);
      if (existing) {
        return NextResponse.json(
          { error: `Personnel with Serial Number '${validation.data.serialNumber}' already exists.` },
          { status: 409 }
        );
      }
    }

    const created = await PersonnelService.createPersonnel(validation.data);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/personnel Error:", error);
    return NextResponse.json(
      { error: "Failed to create personnel record." },
      { status: 500 }
    );
  }
}
