import teamData from "@/data/team-members.json";
import type { TeamMember } from "./types";

export async function getTeamMembers(): Promise<TeamMember[]> {
  return (teamData.items as TeamMember[])
    .filter((member) => member.status !== "archived")
    .sort((a, b) => a.order - b.order);
}

export async function getTeamMemberBySlug(
  slug: string
): Promise<TeamMember | undefined> {
  const members = await getTeamMembers();
  return members.find((member) => member.slug === slug);
}
