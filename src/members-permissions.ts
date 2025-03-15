import type { PermissionsConfig } from "./types";

const membersPermissions: PermissionsConfig = {
  users: ['espostnov', 'user1', 'user2', 'user3'],

  organizations: [
    {
      name: 'promo656test',
      repositories: ['test'],
      teams: [
        {
          name: 'team1',
          members: ['espostnov'],
          repositories: [
            { name: 'test3-repo-1', permissions: ['write'] },

          ]
        }
      ]
    },
  ]
};

export default membersPermissions;