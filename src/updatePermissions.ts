import { watch } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { Octokit } from "@octokit/rest";
import type { OctokitPermission, Permission } from "./types";
import "dotenv/config";

const GITHUB_TOKEN = process.env.API_GITHUB_TOKEN;
console.log('GITHUB_TOKEN', GITHUB_TOKEN);
const octokit = new Octokit({ auth: GITHUB_TOKEN });

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const permissionsFile = resolve(__dirname, "./members-permissions.js");

async function addUserToTeam(org: string, teamSlug: string, user: string) {
  try {
    await octokit.rest.teams.addOrUpdateMembershipForUserInOrg({
      org,
      team_slug: teamSlug,
      username: user,
    });
    console.log(`✅ Added ${user} to team ${teamSlug}`);
  } catch (error: any) {
    console.error(
      `❌ Failed to add ${user} to team ${teamSlug}: ${error.response?.data?.message}`
    );
  }
}

async function setTeamRepoPermissions(
  org: string,
  teamSlug: string,
  repo: string,
  permission: "pull" | "push" | "admin"
) {
  try {
    await octokit.rest.teams.addOrUpdateRepoPermissionsInOrg({
      org,
      team_slug: teamSlug,
      owner: org,
      repo,
      permission,
    });
    console.log(
      `✅ Set ${permission} permission for team ${teamSlug} on repo ${repo}`
    );
  } catch (error: any) {
    console.error(
      `❌ Failed to set ${permission} permission on ${repo}: ${error.response?.data?.message}`
    );
  }
}
const octokitPermissionMap: Record<Permission, OctokitPermission> = {
  read: "pull",
  write: "push",
  admin: "admin",
};
async function updatePermissions() {
  try {
    const config = await import(permissionsFile);
    const membersPermissions = config.default;

    for (const org of membersPermissions.organizations) {
      for (const team of org.teams) {
        for (const user of team.members) {
          await addUserToTeam(org.name, team.name, user);
        }

        for (const repo of team.repositories) {
          for (const permission of repo.permissions) {
            const octokitPermission = octokitPermissionMap[permission as Permission];

            await setTeamRepoPermissions(
              org.name,
              team.name,
              repo.name,
              octokitPermission
            );
          }
        }
      }
    }
  } catch (error) {
    console.error(`❌ Failed to import config: ${error}`);
  }
}

export async function startWatching() {
  await updatePermissions();
  
  watch(permissionsFile, async (eventType) => {
    if (eventType === "change") {
      console.log(
        `🔄 Detected change in ${permissionsFile}. Updating permissions...`
      );
      await updatePermissions();
    }
  });

  console.log(`👀 Watching for changes in ${permissionsFile}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const runOnce = process.argv.includes('--run-once');
  
  if (runOnce) {
    console.log('🚀 Running permissions update once...');
    updatePermissions().then(() => {
      console.log('✅ Permissions update completed');
    });
  } else {
    startWatching();
  }
}
