import { cookies } from "next/headers";
import { jwtVerify } from "jose/jwt/verify";
import { JWTPayload } from "jose";

// Get secret key for JWT signing
export const getSecretKey = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET not set");
  return new TextEncoder().encode(secret);
};

export async function getPayloadFromToken() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("tinyform_token")?.value;

  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

// Verify JWT token from cookie
export async function verifyAuth(payload: JWTPayload, formSlug: string) {
  if (!payload || payload.slug !== formSlug) {
    return false;
  }

  return true;
}
