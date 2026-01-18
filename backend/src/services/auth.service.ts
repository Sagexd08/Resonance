/**
 * Auth Service - Updated to use Prisma instead of raw SQL.
 */
import prisma from "../db/prisma.js";
import { hashPassword, comparePassword } from "../utils/password.js";
import type { user } from "../types/auth.types.js";


export async function verifyUserCredentials(
  userId: string,
  userPass: string
): Promise<user | null> {
  try {
    
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

    
    const isPasswordValid = await comparePassword(userPass, dbUser.passwordHash);

    if (!isPasswordValid) {
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
    console.error("Error verifying user credentials:", error);
    return null;
  }
}


export async function registerUser(
  email: string,
  password: string,
  role: "EMPLOYEE" | "MANAGER" = "EMPLOYEE",
  teamId?: string
): Promise<user | null> {
  try {
    
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return null; 
    }

    
    const hashedPassword = await hashPassword(password);

    
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


export async function saveRefreshToken(
  token: string,
  userId: string,
  expiresAt: Date
): Promise<void> {
  try {
    
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


export async function invalidateRefreshToken(token: string): Promise<void> {
  try {
    await prisma.refreshToken.delete({
      where: { token },
    });
  } catch (error) {
    console.error("Error invalidating refresh token:", error);
  }
}


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
