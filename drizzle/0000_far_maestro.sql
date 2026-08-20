CREATE TABLE `tenants` (
	`id` text PRIMARY KEY NOT NULL,
	`company_name` text NOT NULL,
	`subdomain` text NOT NULL,
	`logo_url` text,
	`primary_color` text DEFAULT '#3b82f6' NOT NULL,
	`assigned_modules` text,
	`plant_sites` text,
	`created_at` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `tenants_subdomain_unique` ON `tenants` (`subdomain`);