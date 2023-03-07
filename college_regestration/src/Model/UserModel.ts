import { Name, Role } from "../lib/types/types";
import UUID from "../lib/types/uuid";

export class UserM {
  public id: UUID;
  public name: Name;
  public email: string;
  public role: Role;

  constructor(id: string, name: Name, email: string, role: Role) {
    this.id = new UUID(id);
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
