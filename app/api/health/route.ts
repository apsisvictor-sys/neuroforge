import { NextResponse } from "next/server";
import { withApiLogging } from "@/lib/api";

export const GET = withApiLogging("/api/health", "GET", async () => {
  return NextResponse.json(
    {
      status: "ok",
      service: "neuroforge",
      time: new Date().toISOString()
    },
    { status: 200 }
  );
});
