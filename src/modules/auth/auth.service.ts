import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import * as nodemailer from 'nodemailer';
import { Auth } from './entities/auth.entity';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private transporter: nodemailer.Transporter;

  constructor(
    @InjectRepository(Auth) private authRepo: Repository<Auth>,
    private jwtService: JwtService,
  ) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.APP_KEY,
      },
    });
  }

  async register(createAuthDto: CreateAuthDto) {
    const { username, email, password } = createAuthDto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });
    if (foundedUser) throw new BadRequestException('User already exists');

    const hashPassword = await bcrypt.hash(password, 10);

    const otp = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 9),
    ).join('');

    const otpTime = Date.now() + 120000; // 2 daqiqa

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

  async verify(dto: VerifyDto) {
    const { email, otp } = dto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });
    if (!foundedUser) throw new UnauthorizedException('Email not found');

    const otpValidation = /^\d{6}$/.test(otp);
    if (!otpValidation) throw new BadRequestException('Invalid OTP format');

    if (foundedUser.otp !== otp) throw new BadRequestException('Wrong OTP');

    const now = Date.now();
    if (foundedUser.otpTime && foundedUser.otpTime < now)
      throw new BadRequestException('OTP expired');

    await this.authRepo.update(foundedUser.id, { otp: '', otpTime: 0 });

    const payload = { id: foundedUser.id, username: foundedUser.username, role: foundedUser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async login(dto: LoginDto) {
    const { email, password } = dto;

    const foundedUser = await this.authRepo.findOne({ where: { email } });
    if (!foundedUser) throw new UnauthorizedException('Email yoki parol noto\'g\'ri');

    const isMatch = await bcrypt.compare(password, foundedUser.password);
    if (!isMatch) throw new UnauthorizedException('Email yoki parol noto\'g\'ri');

    const payload = { id: foundedUser.id, username: foundedUser.username, role: foundedUser.role };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
