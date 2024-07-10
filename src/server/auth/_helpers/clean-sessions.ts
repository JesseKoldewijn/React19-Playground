import { db } from "@/server/db";
import { sessionTable } from "@/server/schema";
import { eq } from "drizzle-orm";

export const cleanExpiredSessions = async (userId: string) => {
  try {
    const existSessions = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.userId, userId))
      .execute();

    if (existSessions.length > 0) {
      const expiredSessions = existSessions.filter((session) => {
        const now = new Date();
        const expiredAt = new Date(session.expiresAt);
        const unixDiff = now.getTime() - expiredAt.getTime();
        const diffToHours = Math.floor(unixDiff / 1000 / 60 / 60);

        return diffToHours > 0;
      });

      if (expiredSessions.length > 0) {
        const ops = new Set();
        for (const session of expiredSessions) {
          ops.add(
            db
              .delete(sessionTable)
              .where(eq(sessionTable.id, session.id))
              .execute(),
          );
        }
        const opsArray = Array.from(ops);
        await Promise.allSettled(opsArray);
      }
    }
    return {
      success: true,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      error: error as Error,
    };
  }
};
