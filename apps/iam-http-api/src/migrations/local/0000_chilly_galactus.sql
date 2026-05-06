CREATE SCHEMA "iam";
--> statement-breakpoint
CREATE TABLE "iam"."OrganizationalResources" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "OrganizationalResources_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "iam"."Permissions" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "Permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "iam"."Policies" (
	"type" varchar(16) NOT NULL,
	"organizationalResourceId" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
CREATE TABLE "iam"."PolicyBindings" (
	"policyId" uuid NOT NULL,
	"roleId" uuid NOT NULL,
	"principleIds" uuid[] NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
CREATE TABLE "iam"."PrincipleLoginMethods" (
	"principleId" uuid NOT NULL,
	"provider" varchar(64) NOT NULL,
	"providerPrincipleId" varchar(255),
	"providerEmail" varchar(255),
	"passwordHash" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"linkedAt" timestamp with time zone NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
CREATE TABLE "iam"."Principles" (
	"email" varchar(255),
	"displayName" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "Principles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "iam"."RolesHierarchy" (
	"parentRoleId" uuid NOT NULL,
	"childRoleId" uuid NOT NULL,
	CONSTRAINT "RolesHierarchy_parentRoleId_childRoleId_pk" PRIMARY KEY("parentRoleId","childRoleId")
);
--> statement-breakpoint
CREATE TABLE "iam"."RolePermissions" (
	"roleId" uuid NOT NULL,
	"permissionId" uuid NOT NULL,
	CONSTRAINT "RolePermissions_roleId_permissionId_pk" PRIMARY KEY("roleId","permissionId")
);
--> statement-breakpoint
CREATE TABLE "iam"."Roles" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "Roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "iam"."Policies" ADD CONSTRAINT "Policies_organizationalResourceId_OrganizationalResources_id_fk" FOREIGN KEY ("organizationalResourceId") REFERENCES "iam"."OrganizationalResources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."PolicyBindings" ADD CONSTRAINT "PolicyBindings_policyId_Policies_id_fk" FOREIGN KEY ("policyId") REFERENCES "iam"."Policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."PolicyBindings" ADD CONSTRAINT "PolicyBindings_roleId_Roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "iam"."Roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."PrincipleLoginMethods" ADD CONSTRAINT "PrincipleLoginMethods_principleId_Principles_id_fk" FOREIGN KEY ("principleId") REFERENCES "iam"."Principles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."RolesHierarchy" ADD CONSTRAINT "RolesHierarchy_parentRoleId_Roles_id_fk" FOREIGN KEY ("parentRoleId") REFERENCES "iam"."Roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."RolesHierarchy" ADD CONSTRAINT "RolesHierarchy_childRoleId_Roles_id_fk" FOREIGN KEY ("childRoleId") REFERENCES "iam"."Roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."RolePermissions" ADD CONSTRAINT "RolePermissions_roleId_Roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "iam"."Roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."RolePermissions" ADD CONSTRAINT "RolePermissions_permissionId_Permissions_id_fk" FOREIGN KEY ("permissionId") REFERENCES "iam"."Permissions"("id") ON DELETE cascade ON UPDATE no action;