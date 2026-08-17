import { NextRequest, NextResponse } from "next/server";
import { PersonnelService } from "@/lib/services/personnelService";
import { personnelSchema } from "@/lib/validations/personnel";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const personnelId = parseInt(id, 10);

    if (isNaN(personnelId)) {
      return NextResponse.json({ error: "Invalid personnel ID" }, { status: 400 });
    }

    const record = await PersonnelService.getPersonnelById(personnelId);
    if (!record) {
      return NextResponse.json({ error: "Personnel record not found" }, { status: 404 });
    }

    return NextResponse.json(record);
  } catch (error) {
    console.error("GET /api/personnel/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve personnel record." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const personnelId = parseInt(id, 10);

    if (isNaN(personnelId)) {
      return NextResponse.json({ error: "Invalid personnel ID" }, { status: 400 });
    }

    const existing = await PersonnelService.getPersonnelById(personnelId);
    if (!existing) {
      return NextResponse.json({ error: "Personnel record not found" }, { status: 404 });
    }

    const body = await req.json();
    const validation = personnelSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validation.error.format() },
        { status: 400 }
      );
    }

    // If Serial Number was changed, check if new Serial Number is already taken by another person
    if (validation.data.serialNumber !== existing.serialNumber) {
      const duplicate = await PersonnelService.getPersonnelBySerialNumber(validation.data.serialNumber);
      if (duplicate && duplicate.id !== personnelId) {
        return NextResponse.json(
          { error: `Personnel with Serial Number '${validation.data.serialNumber}' already exists.` },
          { status: 409 }
        );
      }
    }

    const updated = await PersonnelService.updatePersonnel(personnelId, validation.data);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/personnel/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to update personnel record." },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const personnelId = parseInt(id, 10);

    if (isNaN(personnelId)) {
      return NextResponse.json({ error: "Invalid personnel ID" }, { status: 400 });
    }

    const existing = await PersonnelService.getPersonnelById(personnelId);
    if (!existing) {
      return NextResponse.json({ error: "Personnel record not found" }, { status: 404 });
    }

    await PersonnelService.deletePersonnel(personnelId);
    return NextResponse.json({ success: true, message: "Personnel record deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/personnel/[id] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete personnel record." },
      { status: 500 }
    );
  }
}
