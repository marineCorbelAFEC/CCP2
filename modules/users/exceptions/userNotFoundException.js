export default class UserNotFoundException extends Error {
  constructor(statusCode, message) {
    this.message = message;
    super();
    this.statusCode = statusCode;
  }
}
