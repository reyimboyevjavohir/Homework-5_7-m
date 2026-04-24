import { BaseEntity } from 'src/database/entities/base.entiy';
import { RoleUser } from 'src/shared/enums/roles.enum';
export declare class Auth extends BaseEntity {
    username: string;
    email: string;
    password: string;
    role: RoleUser;
    otp?: string;
    otpTime?: number;
}
