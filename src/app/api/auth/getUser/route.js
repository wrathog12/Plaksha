// pages/api/getUser.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectDB from "../../../../lib/mongoDb";
import User from "../../../../models/userModel";

export async function GET(request) {
  try {
    await connectDB();

    // Extract token from cookies
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Send user data
    return NextResponse.json({ user: { email: user.email, firstName: user.firstName } }, { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error);
    return NextResponse.json({ error: "Error fetching user data" }, { status: 500 });
  }
}
