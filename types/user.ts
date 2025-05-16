export enum SystemRole {
  USER = "USER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum CurrentRole {
  ATTENDEE = "ATTENDEE",
  VOLUNTEER = "VOLUNTEER",
}

export interface User {
  id: string
  email: string
  username?: string
  fullName: string
  gender?: string
  age?: number
  org?: string
  systemRole: SystemRole
  currentRole: CurrentRole
  createdAt?: string
  updatedAt?: string
}
