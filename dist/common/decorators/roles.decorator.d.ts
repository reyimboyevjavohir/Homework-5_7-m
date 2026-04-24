import { RoleUser } from 'src/shared/enums/roles.enum';
export declare const ROLES_KEY = "roles";
export declare const Roles: (...roles: RoleUser[]) => import("@nestjs/common").CustomDecorator<string>;
