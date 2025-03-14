export type Permission = 'read' | 'write' | 'admin';
export type OctokitPermission = 'pull' | 'push' | 'admin';

interface Repository {
  name: string;
  permissions: Permission[];
}

interface Team {
  name: string;
  members: string[]; 
  repositories: Repository[];
}

interface Organization {
  name: string;
  teams: Team[];
  repositories: string[];
}

export interface PermissionsConfig {
  users: string[];
  organizations: Organization[];
}

export interface UserAccess {
    user: string;
    team: string;
    repo: string;
    permission: Permission;
  };