CREATE SCHEMA "iam";
--> statement-breakpoint
CREATE TABLE "iam"."organizational_resources" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "organizational_resources_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "iam"."permissions" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "permissions_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "iam"."policies" (
	"type" varchar(16) NOT NULL,
	"organizationalResourceId" uuid NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
CREATE TABLE "iam"."policy_bindings" (
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
CREATE TABLE "iam"."principle_login_methods" (
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
CREATE TABLE "iam"."principles" (
	"email" varchar(255),
	"displayName" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "principles_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "iam"."roles_hierarchy" (
	"parentRoleId" uuid NOT NULL,
	"childRoleId" uuid NOT NULL,
	CONSTRAINT "roles_hierarchy_parentRoleId_childRoleId_pk" PRIMARY KEY("parentRoleId","childRoleId")
);
--> statement-breakpoint
CREATE TABLE "iam"."role_permissions" (
	"roleId" uuid NOT NULL,
	"permissionId" uuid NOT NULL,
	CONSTRAINT "role_permissions_roleId_permissionId_pk" PRIMARY KEY("roleId","permissionId")
);
--> statement-breakpoint
CREATE TABLE "iam"."roles" (
	"name" varchar(255) NOT NULL,
	"description" text,
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "roles_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "iam"."policies" ADD CONSTRAINT "policies_organizationalResourceId_organizational_resources_id_fk" FOREIGN KEY ("organizationalResourceId") REFERENCES "iam"."organizational_resources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."policy_bindings" ADD CONSTRAINT "policy_bindings_policyId_policies_id_fk" FOREIGN KEY ("policyId") REFERENCES "iam"."policies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."policy_bindings" ADD CONSTRAINT "policy_bindings_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "iam"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."principle_login_methods" ADD CONSTRAINT "principle_login_methods_principleId_principles_id_fk" FOREIGN KEY ("principleId") REFERENCES "iam"."principles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."roles_hierarchy" ADD CONSTRAINT "roles_hierarchy_parentRoleId_roles_id_fk" FOREIGN KEY ("parentRoleId") REFERENCES "iam"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."roles_hierarchy" ADD CONSTRAINT "roles_hierarchy_childRoleId_roles_id_fk" FOREIGN KEY ("childRoleId") REFERENCES "iam"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."role_permissions" ADD CONSTRAINT "role_permissions_roleId_roles_id_fk" FOREIGN KEY ("roleId") REFERENCES "iam"."roles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "iam"."role_permissions" ADD CONSTRAINT "role_permissions_permissionId_permissions_id_fk" FOREIGN KEY ("permissionId") REFERENCES "iam"."permissions"("id") ON DELETE cascade ON UPDATE no action;