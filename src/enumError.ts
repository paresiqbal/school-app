// error handling
export enum UserErrors {
  NO_USER_FOUND = "No user was found",
  WRONG_CREDENTIAL = "Wrong username or password",
  USERNAME_ALREADY_EXISTS = "Username already exist",
  SERVER_ERROR = "Server error",
}

export enum ProductErrors {
  PRODUCT_NOT_FOUND = "Product not found",
  NOT_ENOUGH_STOCK = "Not enough stock",
  NOT_ENOUGH_MONEY = "Not enough money",
}
