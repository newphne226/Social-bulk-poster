// GET /api/health — liveness probe.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "smtools-api",
    version: "1.0.0",
  });
}
