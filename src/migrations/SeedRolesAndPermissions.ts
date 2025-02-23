import { PermissionEnum } from "@/lib/constant";
import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedRolesAndPermissions implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert Permissions
    await queryRunner.query(`
      INSERT INTO "permission" ("id", "name") VALUES
      ('1', '${PermissionEnum.READ_USERS}'),
      ('2', '${PermissionEnum.WRITE_USERS}'),
      ('3', '${PermissionEnum.DELETE_USERS}'),
      ('4', '${PermissionEnum.MANAGE_ROLES}'),
      ('5', '${PermissionEnum.VIEW_DASHBOARD}'),
      ('6', '${PermissionEnum.EDIT_PROFILE}')
    `);

    // Insert Roles
    await queryRunner.query(`
      INSERT INTO "roles" ("id", "name") VALUES
      ('100', 'Super_Admin'),
      ('100', 'Super_Admin'),
      ('101', 'User')
    `);

    // Assign Permissions to Admin
    await queryRunner.query(`
      INSERT INTO "role_permissions_permission" ("roleId", "permissionId") VALUES
      ('100', '1'), -- READ_USERS
      ('100', '2'), -- WRITE_USERS
      ('100', '3'), -- DELETE_USERS
      ('100', '4'), -- MANAGE_ROLES
      ('100', '5'), -- VIEW_DASHBOARD
      ('100', '6')  -- EDIT_PROFILE
    `);

    // Assign Permissions to User
    await queryRunner.query(`
      INSERT INTO "role_permissions_permission" ("roleId", "permissionId") VALUES
      ('101', '5'), -- VIEW_DASHBOARD
      ('101', '6')  -- EDIT_PROFILE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "role_permissions_permission"`);
    await queryRunner.query(`DELETE FROM "role" WHERE "id" IN ('100', '101')`);
    await queryRunner.query(`DELETE FROM "permission"`);
  }
}
