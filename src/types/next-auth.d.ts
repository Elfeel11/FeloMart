import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    token?: string;
    user: {
      name: string;
      email: string;
      role?: string;
    };
  }

  interface User {
    name: string;
    email: string;
    role?: string;
    token?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    token?: string;
    role?: string;
  }
}
