import { ExecutionContext, Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const canActivate = await super.canActivate(context);
    await super.logIn(request);
    return !!canActivate;
  }
}
