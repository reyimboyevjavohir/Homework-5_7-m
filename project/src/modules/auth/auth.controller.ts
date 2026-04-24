import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { VerifyDto } from './dto/verify.dto';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from 'src/common/guards/auth-guards';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleUser } from 'src/shared/enums/roles.enum';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Yangi foydalanuvchi ro\'yxatdan o\'tkazish' })
  @ApiResponse({ status: 201, description: 'Muvaffaqiyatli ro\'yxatdan o\'tildi' })
  @ApiResponse({ status: 400, description: 'Foydalanuvchi allaqachon mavjud' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('verify')
  @ApiOperation({ summary: 'OTP orqali emailni tasdiqlash' })
  @ApiResponse({ status: 200, description: 'Token qaytarildi' })
  verify(@Body() dto: VerifyDto) {
    return this.authService.verify(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({ status: 200, description: 'Access token qaytarildi' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'O\'z profilini ko\'rish' })
  getProfile(@Request() req: any) {
    return req.user;
  }

  @Get('admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.ADMIN, RoleUser.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faqat admin va superadmin uchun' })
  adminPanel() {
    return { message: 'Admin panel - siz admin yoki superadminsiz!' };
  }

  @Get('superadmin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleUser.SUPERADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Faqat superadmin uchun' })
  superAdminPanel() {
    return { message: 'SuperAdmin panel - siz superadminsiz!' };
  }
}
