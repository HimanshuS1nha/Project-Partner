import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const GET = async () => {
  try {
    cookies().delete("token");
    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: "Some error occured. Please try again later!" },
      { status: 500 }
    );
  }
};
