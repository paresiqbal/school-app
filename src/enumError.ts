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

export enum ClassErrors {
  CLASS_ALREADY_EXISTS = "Class already exists",
  SERVER_ERROR = "Server error",
  CLASS_NOT_FOUND = "Class not found",
  INVALID_LEVEL_OR_MAJOR = "Invalid level or major",
}
