// error handling
export enum UserErrors {
  USER_NOT_FOUND = "No user was found",
  WRONG_CREDENTIAL = "Wrong username or password",
  USERNAME_ALREADY_EXISTS = "Username already exist",
  SERVER_ERROR = "Server error",
  INVALID_ROLE = "Invalid role specified",
  INVALID_CREDENTIALS = "Invalid credentials",
  CLASS_NOT_FOUND = "Class not found",
}

export enum MajorErrors {
  MAJOR_ALREADY_EXISTS = "Major already exists",
  MAJOR_NOT_FOUND = "Major not found",
}

export enum ClassErrors {
  SERVER_ERROR = "Server error",
  CLASS_NOT_FOUND = "Class not found",
  INVALID_LEVEL_OR_MAJOR = "Invalid level or major",
  CLASS_VALIDITY = "Invalid level. Must be X, XI, or XII.",
  CLASS_ALREADY_EXISTS = "Class with the same level and major already exists",
}
