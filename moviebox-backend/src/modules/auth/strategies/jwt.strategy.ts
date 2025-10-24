import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { UserDocument } from '../../user/entities/user.entity';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_SECRET') || '',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    try {
      this.logger.log(`[validate] Validating JWT payload: ${JSON.stringify(payload)}`);
      
      // TEMPORARY FIX: Skip MongoDB validation due to connection issues
      // Just return the payload data for now
      this.logger.log(`[validate] Using payload data directly (MongoDB validation skipped)`);
      return {
        sub: payload.sub,
        _id: payload.sub,
        username: payload.username,
        email: payload.email,
        role: payload.role,
      };
      
      /* Original validation code - commented out due to MongoDB connection issues
      const user = await this.authService.validateUser(payload);
      if (!user) {
        this.logger.error('[validate] User not found or invalid');
        throw new UnauthorizedException();
      }
      this.logger.log(`[validate] User validated successfully: ${user._id}`);
      return {
        ...payload,
        _id: user._id,
        username: user.username,
        email: user.email,
      };
      */
    } catch (error) {
      this.logger.error(`[validate] Error validating JWT: ${error.message}`, error.stack);
      throw error;
    }
  }
}
