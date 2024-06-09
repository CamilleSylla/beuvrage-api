import { registerEnumType } from "@nestjs/graphql";

export enum RoleList {
  VIEWER = "user.viewer",
  WRITER = "user.admin.writer",
  COMMERCIAL = "user.admin.commercial",
  TEAMMANAGER = "user.admin.team.manager",
  SUPERADMIN = "user.admin.superAdmin",
}

registerEnumType(RoleList, {
  name: "RoleList",
});
