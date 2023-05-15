import { User } from "../user";

export type Workspace = {
  name: string;
  id: string;
};

export type PageOf<T> = {
  cursor: string;
  data: T[];
};

export abstract class WorkspaceService {
  abstract createWorkspace(name: string): Promise<Workspace>;
  abstract getWorkspacesByUser(
    userId: string,
    cursor?: string
  ): PageOf<Workspace>;
  abstract getWorkspaceUsers(workspaceId: string): Promise<PageOf<User>>;
}
