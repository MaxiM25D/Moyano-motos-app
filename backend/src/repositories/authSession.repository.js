import { prisma } from "../config/db/prisma.client.js";

const sessionInclude = {
  user: true
};

export class AuthSessionRepository {
  create(data) {
    return prisma.authSession.create({
      data,
      include: sessionInclude
    });
  }

  getByTokenHash(tokenHash) {
    return prisma.authSession.findUnique({
      where: { tokenHash },
      include: sessionInclude
    });
  }

  rotate(id, tokenHash, expiresAt) {
    return prisma.authSession.update({
      where: { id: Number(id) },
      data: {
        tokenHash,
        expiresAt,
        lastUsedAt: new Date()
      },
      include: sessionInclude
    });
  }

  revokeByTokenHash(tokenHash) {
    return prisma.authSession.updateMany({
      where: {
        tokenHash,
        revokedAt: null
      },
      data: { revokedAt: new Date() }
    });
  }

  deleteExpired() {
    return prisma.authSession.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { revokedAt: { not: null } }
        ]
      }
    });
  }
}
