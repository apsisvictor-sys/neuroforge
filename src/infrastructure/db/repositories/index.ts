import { PrismaAuthRepository } from "./prisma-auth-repository.ts";
import { PrismaConversationRepository } from "./prisma-conversation-repository.ts";
import { PrismaProtocolRepository } from "./prisma-protocol-repository.ts";
import { PrismaTrackingRepository } from "./prisma-tracking-repository.ts";
import { PrismaUserRepository } from "./prisma-user-repository.ts";

export const repositories = {
  auth: new PrismaAuthRepository(),
  conversation: new PrismaConversationRepository(),
  protocol: new PrismaProtocolRepository(),
  tracking: new PrismaTrackingRepository(),
  user: new PrismaUserRepository()
};
