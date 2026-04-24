import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private authRepo;
    private jwtService;
    private transporter;
    constructor(authRepo: Repository<Auth>, jwtService: JwtService);
    register(createAuthDto: CreateAuthDto): Promise<{
        message: string;
    }>;
    verify(dto: VerifyDto): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
    }>;
}
