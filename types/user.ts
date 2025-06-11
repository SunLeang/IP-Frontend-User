/**
 * User-related type definitions
 * Central location for all user and role interfaces
 */

/**
 * System roles enum
 */
export enum SystemRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

/**
 * Current active role enum
 */
export enum CurrentRole {
  ATTENDEE = "ATTENDEE",
  VOLUNTEER = "VOLUNTEER",
}

/**
 * User interface
 */
export interface User {
  id: string;
  email: string;
  username?: string;
  fullName: string;
  gender?: string;
  age?: number;
  org?: string;
  systemRole: SystemRole;
  currentRole: CurrentRole;
  profileImage?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * User profile update data
 */
export interface UserProfileUpdate {
  fullName?: string;
  username?: string;
  profileImage?: string;
}

/**
 * User account settings data
 */
export interface UserAccountSettings {
  email?: string;
  currentPassword?: string;
  newPassword?: string;
}