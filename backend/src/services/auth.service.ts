/**
 * Auth Service - Updated to use Prisma instead of raw SQL.
 */
import prisma from "../db/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import type { user } from "../types/auth.types.js";

// 1) Verify User Credentials
export async function verifyUserCredentials(
  userId: string,
  userPass: string
): Promise<user | null> {
  try {
    // Try email first, then ID
    const dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userId },
          { id: userId },
        ],
      },
    });

    if (!dbUser) {
      return null;
    }

    // Compare password
    const isPasswordValid = await comparePassword(userPass, dbUser.passwordHash);

    if (!isPasswordValid) {
      return null;
    }

    // Map to user type
    const user: user = {
      uuid: dbUser.id,
      id: dbUser.email,
      userId: dbUser.email,
      password: dbUser.passwordHash,
      email: dbUser.email,
    };

    return user;
  } catch (error) {
    console.error("Error verifying user credentials:", error);
    return null;
  }
}

// 2) Register New User
export async function registerUser(
  email: string,
  password: string,
  role: "EMPLOYEE" | "MANAGER" = "EMPLOYEE",
  teamId?: string
): Promise<user | null> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return null; // User already exists
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create new user
    const newDbUser = await prisma.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        teamId: teamId || null,
      },
    });

    const newUser: user = {
      uuid: newDbUser.id,
      id: newDbUser.email,
      userId: newDbUser.email,
      password: newDbUser.passwordHash,
      email: newDbUser.email,
    };

    return newUser;
  } catch (error) {
    console.error("Error registering user:", error);
    return null;
  }
}

// 3) Save Refresh Token
export async function saveRefreshToken(
  token: string,
  userId: string,
  expiresAt: Date
): Promise<void> {
  try {
    // Find user by email or ID
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: userId },
          { id: userId },
        ],
      },
    });

    if (!user) {
      console.error("User not found for refresh token:", userId);
      return;
    }

    // Save refresh token
    await prisma.refreshToken.upsert({
      where: { token },
      update: {
        expiresAt,
      },
      create: {
        token,
        userId: user.id,
        expiresAt,
      },
    });
  } catch (error) {
    console.error("Error saving refresh token:", error);
  }
}

// 4) Invalidate Refresh Token
export async function invalidateRefreshToken(token: string): Promise<void> {
  try {
    await prisma.refreshToken.delete({
      where: { token },
    });
  } catch (error) {
    console.error("Error invalidating refresh token:", error);
  }
}

// 5) Find user by refresh token
export async function findUserByRefreshToken(token: string): Promise<user | null> {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.expiresAt < new Date()) {
      return null;
    }

    const dbUser = refreshToken.user;

    const user: user = {
      uuid: dbUser.id,
      id: dbUser.email,
      userId: dbUser.email,
      password: dbUser.passwordHash,
      email: dbUser.email,
    };

    return user;
  } catch (error) {
    console.error("Error finding user by refresh token:", error);
    return null;
  }
}

// 6) Get user by UUID
export async function getUserByUuid(uuid: string): Promise<user | null> {
  try {
    const dbUser = await prisma.user.findUnique({
      where: { id: uuid },
    });

    if (!dbUser) {
      return null;
    }

    const user: user = {
      uuid: dbUser.id,
      id: dbUser.email,
      userId: dbUser.email,
      password: dbUser.passwordHash,
      email: dbUser.email,
    };

    return user;
  } catch (error) {
    console.error("Error getting user by UUID:", error);
    return null;
  }
}

// 7) Get refresh token info
export async function getRefreshToken(token: string): Promise<{
  user_id: string;
  expires_at: Date;
} | null> {
  try {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) {
      return null;
    }

    return {
      user_id: refreshToken.userId,
      expires_at: refreshToken.expiresAt,
    };
  } catch (error) {
    console.error("Error getting refresh token:", error);
    return null;
  }
}
