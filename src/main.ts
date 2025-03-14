import  membersPermissions from './members-permissions';
import type { UserAccess } from './types';

const userAccessList: UserAccess[] = membersPermissions.organizations.flatMap((org) =>
  org.teams.flatMap((team) =>
    team.repositories.flatMap((repo) =>
      repo.permissions.flatMap((permission) =>
        team.members.map((user) => ({
          user,
          team: team.name,
          repo: repo.name,
          permission,
        }))
      )
    )
  )
);

const tableBody = document.querySelector('#permissions-table tbody') as HTMLElement;

userAccessList.forEach((access) => {
  const row = document.createElement('tr');

  row.innerHTML = `
    <td>${access.user}</td>
    <td>${access.team}</td>
    <td>${access.repo}</td>
    <td class="${access.permission}">${access.permission}</td>
  `;

  tableBody.appendChild(row);
});