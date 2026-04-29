CREATE SCHEMA "restaurant-catalog";
--> statement-breakpoint
CREATE TABLE "restaurant-catalog"."menu_items" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	"name" varchar(255) NOT NULL,
	"description" text,
	"imageUrl" varchar(512),
	"price" numeric(10, 2),
	"isFavorite" boolean DEFAULT false NOT NULL,
	"isActive" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant-catalog"."sizes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant-catalog"."tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid,
	"name" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "restaurant-catalog"."menu_items_to_tags" (
	"id" uuid PRIMARY KEY NOT NULL,
	"menuItemId" uuid NOT NULL,
	"tagId" uuid NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
CREATE TABLE "restaurant-catalog"."menu_items_to_sizes" (
	"id" uuid PRIMARY KEY NOT NULL,
	"menuItemId" uuid NOT NULL,
	"sizeId" uuid NOT NULL,
	"createdDate" timestamp,
	"updatedDate" timestamp,
	"createdById" uuid,
	"updatedById" uuid
);
--> statement-breakpoint
ALTER TABLE "restaurant-catalog"."menu_items_to_tags" ADD CONSTRAINT "menu_items_to_tags_menuItemId_menu_items_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "restaurant-catalog"."menu_items"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant-catalog"."menu_items_to_tags" ADD CONSTRAINT "menu_items_to_tags_tagId_tags_id_fk" FOREIGN KEY ("tagId") REFERENCES "restaurant-catalog"."tags"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "restaurant-catalog"."menu_items_to_sizes" ADD CONSTRAINT "menu_items_to_sizes_menuItemId_menu_items_id_fk" FOREIGN KEY ("menuItemId") REFERENCES "restaurant-catalog"."menu_items"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "restaurant-catalog"."menu_items_to_sizes" ADD CONSTRAINT "menu_items_to_sizes_sizeId_sizes_id_fk" FOREIGN KEY ("sizeId") REFERENCES "restaurant-catalog"."sizes"("id") ON DELETE cascade ON UPDATE cascade;