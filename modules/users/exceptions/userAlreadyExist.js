export default class UserAlreadyExist extends Error {
  constructor(statusCode, message) {
    super();
    this.message = message;
    this.statusCode = statusCode;
  }
}
