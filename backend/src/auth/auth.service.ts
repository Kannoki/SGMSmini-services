import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';

const ACCESS_HOURS = 2;
const REFRESH_HOURS = 12;

type JwtPayload = {
  sub: string;
  username: string;
  type: 'ACCESS' | 'REFRESH';
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async login(username: string, password: string) {
    const user = await this.usersService.findByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new UnauthorizedException('Invalid username or password');
    }

    return this.issueTokens(user.id, user.username);
  }

  async refresh(refreshToken: string) {
    const payload = await this.verifyToken(refreshToken, 'REFRESH');
    const tokenRecord = await this.prisma.authToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenRecord || tokenRecord.type !== 'REFRESH' || tokenRecord.expiresAt <= new Date()) {
      throw new UnauthorizedException('Refresh token is invalid or expired');
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    await this.prisma.authToken.delete({ where: { id: tokenRecord.id } });
    return this.issueTokens(user.id, user.username);
  }

  async logout(accessToken?: string, refreshToken?: string) {
    const tokensToDelete = [accessToken, refreshToken].filter((value): value is string => Boolean(value));
    if (tokensToDelete.length === 0) {
      return { success: true };
    }

    await this.prisma.authToken.deleteMany({
      where: {
        token: {
          in: tokensToDelete,
        },
      },
    });

    return { success: true };
  }

  private async issueTokens(userId: string, username: string) {
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, username, type: 'ACCESS' },
      {
        secret: process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret',
        expiresIn: `${ACCESS_HOURS}h`,
      },
    );
    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, username, type: 'REFRESH' },
      {
        secret: process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret',
        expiresIn: `${REFRESH_HOURS}h`,
      },
    );

    const now = Date.now();
    await this.prisma.authToken.createMany({
      data: [
        {
          userId,
          token: accessToken,
          type: 'ACCESS',
          expiresAt: new Date(now + ACCESS_HOURS * 60 * 60 * 1000),
        },
        {
          userId,
          token: refreshToken,
          type: 'REFRESH',
          expiresAt: new Date(now + REFRESH_HOURS * 60 * 60 * 1000),
        },
      ],
    });

    return {
      auth_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in_seconds: ACCESS_HOURS * 60 * 60,
    };
  }

  private async verifyToken(token: string, expectedType: 'ACCESS' | 'REFRESH') {
    const secret =
      expectedType === 'ACCESS'
        ? process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'dev-access-secret'
        : process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'dev-refresh-secret';

    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, { secret });
      if (payload.type !== expectedType) {
        throw new UnauthorizedException('Token type mismatch');
      }
      return payload;
    } catch {
      throw new UnauthorizedException('Token is invalid or expired');
    }
  }

  @Cron('0 */30 * * * *')
  async cleanupExpiredTokens() {
    await this.prisma.authToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  }
}
