import teamData from "@/data/team-members.json";
import { withAutoZhCN } from "./localize";
import type { TeamMember } from "./types";

const LOCALIZE_FIELDS = ["name", "title", "bio"];

export async function getTeamMembers(): Promise<TeamMember[]> {
  return (teamData.items as TeamMember[])
    .filter((member) => member.status !== "archived")
    .map((member) => withAutoZhCN(member, LOCALIZE_FIELDS))
    .sort((a, b) => a.order - b.order);
}
