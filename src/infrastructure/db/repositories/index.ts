import { PrismaAuthRepository } from "./prisma-auth-repository.ts";
import { PrismaConversationRepository } from "./prisma-conversation-repository.ts";
import { PrismaProtocolRepository } from "./prisma-protocol-repository.ts";
import { PrismaTrackingRepository } from "./prisma-tracking-repository.ts";
import { PrismaUserRepository } from "./prisma-user-repository.ts";
import { PrismaUserStateRepository } from "./prisma-user-state-repository.ts";
import { PrismaAdaptationRepository } from "./prisma-adaptation-repository.ts";
import { PrismaGiftRepository } from "./prisma-gift-repository.ts";

export const repositories = {
  auth: new PrismaAuthRepository(),
  conversation: new PrismaConversationRepository(),
  protocol: new PrismaProtocolRepository(),
  tracking: new PrismaTrackingRepository(),
  user: new PrismaUserRepository(),
  userState: new PrismaUserStateRepository(),
  adaptation: new PrismaAdaptationRepository(),
  gift: new PrismaGiftRepository(),
};
