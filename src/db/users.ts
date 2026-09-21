import { db } from './index.ts';
import { users } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, displayName?: string, photoUrl?: string) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          displayName: displayName || null,
          photoUrl: photoUrl || null,
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Failed to synchronize user account.", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const results = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return results[0] || null;
  } catch (error) {
    console.error("Failed to query user by UID:", error);
    throw new Error("Database query failed.", { cause: error });
  }
}
