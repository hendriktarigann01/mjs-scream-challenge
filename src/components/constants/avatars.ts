import type { AvatarId } from "@/types/game";

export const AVATAR_IDS: AvatarId[] = [
  "profile-1",
  "profile-2",
  "profile-3",
  "profile-4",
  "profile-5",
  "profile-6",
];

export function getAvatarSrc(id: AvatarId): string {
  return `/avatars/${id}.png`;
}
