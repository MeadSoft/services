CREATE SCHEMA IF NOT EXISTS "auth";
--> statement-breakpoint
CREATE TABLE "auth"."user_login_methods" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"provider" varchar(64) NOT NULL,
	"providerUserId" varchar(255),
	"providerEmail" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"linkedAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"email" varchar(255),
	"displayName" varchar(255),
	"firebaseUid" varchar(128),
	"iamRoles" text[] NOT NULL,
	"passwordHash" varchar(255),
	"isActive" boolean DEFAULT true NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "users_firebaseUid_unique" UNIQUE("firebaseUid")
);
--> statement-breakpoint
ALTER TABLE "auth"."user_login_methods" ADD CONSTRAINT "user_login_methods_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE no action;