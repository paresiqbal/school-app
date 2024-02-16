// error handling
export enum UserErrors {
  USER_NOT_FOUND = "No user was found",
  WRONG_CREDENTIAL = "Wrong username or password",
  USERNAME_ALREADY_EXISTS = "Username already exist",
  SERVER_ERROR = "Server error",
  INVALID_ROLE = "Invalid role specified",
  INVALID_CREDENTIALS = "Invalid credentials",
}

export enum ProductErrors {
  PRODUCT_NOT_FOUND = "Product not found",
  NOT_ENOUGH_STOCK = "Not enough stock",
  NOT_ENOUGH_MONEY = "Not enough money",
}
