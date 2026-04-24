"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const jwt_1 = require("@nestjs/jwt");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const auth_entity_1 = require("./entities/auth.entity");
let AuthService = class AuthService {
    constructor(authRepo, jwtService) {
        this.authRepo = authRepo;
        this.jwtService = jwtService;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.APP_KEY,
            },
        });
    }
    async register(createAuthDto) {
        const { username, email, password } = createAuthDto;
        const foundedUser = await this.authRepo.findOne({ where: { email } });
        if (foundedUser)
            throw new common_1.BadRequestException('User already exists');
        const hashPassword = await bcrypt.hash(password, 10);
        const otp = Array.from({ length: 6 }, () => Math.floor(Math.random() * 9)).join('');
        const otpTime = Date.now() + 120000;
        await this.transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Email Verification OTP',
            html: `<h2>Tasdiqlash kodi: <b>${otp}</b></h2><p>Kod 2 daqiqada eskiradi.</p>`,
        });
        const user = this.authRepo.create({
            username,
            email,
            password: hashPassword,
            otp,
            otpTime,
        });
        await this.authRepo.save(user);
        return { message: 'Registered successfully. Please check your email for OTP.' };
    }
    async verify(dto) {
        const { email, otp } = dto;
        const foundedUser = await this.authRepo.findOne({ where: { email } });
        if (!foundedUser)
            throw new common_1.UnauthorizedException('Email not found');
        const otpValidation = /^\d{6}$/.test(otp);
        if (!otpValidation)
            throw new common_1.BadRequestException('Invalid OTP format');
        if (foundedUser.otp !== otp)
            throw new common_1.BadRequestException('Wrong OTP');
        const now = Date.now();
        if (foundedUser.otpTime && foundedUser.otpTime < now)
            throw new common_1.BadRequestException('OTP expired');
        await this.authRepo.update(foundedUser.id, { otp: '', otpTime: 0 });
        const payload = { id: foundedUser.id, username: foundedUser.username, role: foundedUser.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
    async login(dto) {
        const { email, password } = dto;
        const foundedUser = await this.authRepo.findOne({ where: { email } });
        if (!foundedUser)
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        const isMatch = await bcrypt.compare(password, foundedUser.password);
        if (!isMatch)
            throw new common_1.UnauthorizedException('Email yoki parol noto\'g\'ri');
        const payload = { id: foundedUser.id, username: foundedUser.username, role: foundedUser.role };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_entity_1.Auth)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map