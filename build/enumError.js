"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassErrors = exports.MajorErrors = exports.UserErrors = void 0;
// error handling
var UserErrors;
(function (UserErrors) {
    UserErrors["USER_NOT_FOUND"] = "No user was found";
    UserErrors["WRONG_CREDENTIAL"] = "Wrong username or password";
    UserErrors["USERNAME_ALREADY_EXISTS"] = "Username already exist";
    UserErrors["SERVER_ERROR"] = "Server error";
    UserErrors["INVALID_ROLE"] = "Invalid role specified";
    UserErrors["INVALID_CREDENTIALS"] = "Invalid credentials";
    UserErrors["CLASS_NOT_FOUND"] = "Class not found";
})(UserErrors || (exports.UserErrors = UserErrors = {}));
var MajorErrors;
(function (MajorErrors) {
    MajorErrors["MAJOR_ALREADY_EXISTS"] = "Major already exists";
    MajorErrors["MAJOR_NOT_FOUND"] = "Major not found";
})(MajorErrors || (exports.MajorErrors = MajorErrors = {}));
var ClassErrors;
(function (ClassErrors) {
    ClassErrors["SERVER_ERROR"] = "Server error";
    ClassErrors["CLASS_NOT_FOUND"] = "Class not found";
    ClassErrors["INVALID_LEVEL_OR_MAJOR"] = "Invalid level or major";
    ClassErrors["CLASS_VALIDITY"] = "Invalid level. Must be X, XI, or XII.";
    ClassErrors["CLASS_ALREADY_EXISTS"] = "Class with the same level and major already exists";
})(ClassErrors || (exports.ClassErrors = ClassErrors = {}));
