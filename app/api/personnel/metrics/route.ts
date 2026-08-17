import { NextResponse } from "next/server";
import { PersonnelService } from "@/lib/services/personnelService";

export async function GET() {
  try {
    const metrics = await PersonnelService.getDashboardMetrics();
    return NextResponse.json(metrics);
  } catch (error) {
    console.error("GET /api/personnel/metrics Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve dashboard metrics." },
      { status: 500 }
    );
  }
}
