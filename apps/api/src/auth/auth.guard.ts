import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const req = ctx.getContext().req;
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }

        const token = authHeader.split(' ')[1];
        if (!token) {
            throw new UnauthorizedException('Invalid authorization header format');
        }

        try {
            const secret = process.env.NEXTAUTH_SECRET;
            if (!secret) {
                throw new UnauthorizedException('Server configuration error');
            }
            const payload = jwt.verify(token, secret);
            req.user = payload;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired token');
        }
    }
}
