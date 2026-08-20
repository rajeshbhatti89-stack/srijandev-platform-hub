CREATE TABLE `attendance_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`date` text NOT NULL,
	`shift` text NOT NULL,
	`status` text NOT NULL,
	`logged_at` text NOT NULL,
	`logged_by` text NOT NULL,
	`photo_url` text,
	`lat` real,
	`lng` real
);
--> statement-breakpoint
CREATE TABLE `gate_passes` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`pass_type` text NOT NULL,
	`direction` text NOT NULL,
	`vehicle_no` text,
	`transporter_name` text,
	`gross_weight` real,
	`net_weight` real,
	`driver_name` text,
	`driver_phone` text,
	`material_description` text,
	`visitor_name` text,
	`visitor_phone` text,
	`visitor_company` text,
	`host_name` text,
	`purpose` text,
	`entry_at` text NOT NULL,
	`exit_at` text,
	`status` text NOT NULL,
	`created_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `geofence_check_ins` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`post_id` text NOT NULL,
	`post_name` text NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`site_id` text NOT NULL,
	`timestamp` text NOT NULL,
	`status` text NOT NULL,
	`simulated_distance` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `geofence_posts` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`post_name` text NOT NULL,
	`radius_meters` integer NOT NULL,
	`center_lat` real NOT NULL,
	`center_lng` real NOT NULL
);
--> statement-breakpoint
CREATE TABLE `guards` (
	`id` text PRIMARY KEY NOT NULL,
	`guard_code` text NOT NULL,
	`personnel_id` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`department` text,
	`company` text,
	`designation` text NOT NULL,
	`tenant_id` text NOT NULL,
	`assigned_site_id` text NOT NULL,
	`assigned_post` text NOT NULL,
	`shift` text NOT NULL,
	`status` text NOT NULL,
	`last_check_in` text
);
--> statement-breakpoint
CREATE TABLE `incidents` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`type` text NOT NULL,
	`direction` text,
	`vehicle_no` text,
	`severity` text NOT NULL,
	`description` text NOT NULL,
	`reported_by` text NOT NULL,
	`timestamp` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `leave_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`leave_type` text NOT NULL,
	`from_date` text NOT NULL,
	`to_date` text NOT NULL,
	`reason` text NOT NULL,
	`substitute_guard_id` text,
	`substitute_guard_name` text,
	`status` text NOT NULL,
	`applied_at` text NOT NULL,
	`decided_by` text,
	`decided_at` text
);
--> statement-breakpoint
CREATE TABLE `patrol_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`route_id` text NOT NULL,
	`route_name` text NOT NULL,
	`site_id` text NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`checkpoint_scans` text,
	`status` text NOT NULL,
	`started_at` text NOT NULL,
	`completed_at` text,
	`breach_checkpoint_id` text
);
--> statement-breakpoint
CREATE TABLE `patrol_routes` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`checkpoints` text,
	`estimated_minutes` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `roster_slots` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`date` text NOT NULL,
	`post` text NOT NULL,
	`shift` text NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`site_id` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sites` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sos_alerts` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`guard_id` text NOT NULL,
	`guard_name` text NOT NULL,
	`site_id` text NOT NULL,
	`post` text NOT NULL,
	`coordinates` text NOT NULL,
	`timestamp` text NOT NULL,
	`status` text NOT NULL,
	`acknowledged_by` text,
	`acknowledged_at` text
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`tenant_id` text NOT NULL,
	`site_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`creator_role` text NOT NULL,
	`assigned_to` text NOT NULL,
	`assigned_to_name` text NOT NULL,
	`post` text NOT NULL,
	`task_type` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text NOT NULL,
	`started_at` text,
	`completed_at` text,
	`verified_at` text,
	`completion_note` text,
	`created_by` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text,
	`role` text NOT NULL,
	`tenant_id` text NOT NULL,
	`assigned_site_id` text NOT NULL,
	`contact_no` text NOT NULL,
	`is_active` integer DEFAULT true NOT NULL
);
