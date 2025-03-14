import type { PermissionsConfig } from "./types";

const membersPermissions: PermissionsConfig = {
  users: ['promo656','espostnov', 'user1', 'user2', 'user3'],

  organizations: [
    {
      name: 'web3-test-organisation-3',
      repositories: ['test3-repo-1', 'test3-repo-2', ],
      teams: [
        {
          name: 'team1',
          members: ['espostnov'],
          repositories: [
            { name: 'test3-repo-1', permissions: ['admin'] },
            { name: 'test3-repo-2', permissions: ['write'] }
          ]
        }
      ]
    },
    {
      name: 'web3-test-organisation-2',
      repositories: ['test2-repo-1', 'test2-repo-2', ],
      teams: [
        {
          name: 'team1',
          members: ['espostnov'],
          repositories: [
            { name: 'test2-repo-1', permissions: [ 'write' ] },
            { name: 'test2-repo-2', permissions: [ 'read' ] }
          ]
        }
      ]
    }
  ]
};

export default membersPermissions;