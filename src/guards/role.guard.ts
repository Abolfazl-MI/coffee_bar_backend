import { CanActivate, ExecutionContext, Inject, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "src/schemas/user.schema";
import { RolesKey } from "src/types/role.decorator";



@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private readonly reflect: Reflector) {}
    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const requiredRoles:Role[]=this.reflect.getAllAndOverride<Role[]>(RolesKey,[
            context.getHandler(),
            context.getClass(),
        ])
        console.log(requiredRoles)
        if(!requiredRoles){
            return true
        }
        const {user}=context.switchToHttp().getRequest()
        let res= requiredRoles.some((role)=>user.role===role.toString());
        return res
    }
}