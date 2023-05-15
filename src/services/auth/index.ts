import { User } from "../user";

export type Authentication<T> = {
  token?: string;
  actor?: T;
};

export abstract class AuthService {
  abstract didAuthStateChange(): Generator<Authentication<User>>;
  abstract authenticateAnonymously(): Authentication<User>;
  abstract hasPermissionOverWorkspace(
    workspaceId: string,
    authorization: string
  ): Promise<boolean>;
}

export class MockAuthService extends AuthService {
  *didAuthStateChange(): Generator<Authentication<User>, any, unknown> {
    yield {
      token: "Bearer 1234",
      actor: {
        id: "123",
        name: "Lorem",
      },
    };
  }
  authenticateAnonymously(): Authentication<User> {
    return {
      actor: {
        id: "123",
        name: "Loren",
      },
    };
  }
  async hasPermissionOverWorkspace(
    workspaceId: string,
    authorization: string
  ): Promise<boolean> {
    return false;
  }
}

export function useAuthService() {}
