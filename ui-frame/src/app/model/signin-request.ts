import {Constant} from '../common/const/constant';

export class SignInRequest {
  email: string;
  password: string;

  /**
   * Validate email expression.
   */
  public emailPattern(): string {
    return Constant.VALIDATE_EMAIL;
  }

  /**
   * Validate min password.
   */
  public passwordMin(): number {
    return Constant.VALIDATE_PASS;
  }

  /**
   * Validation.
   */
  public validate(): string {
    if (this.email == null || this.email === '') {
      return Constant.Error.requireEmail;
    }
    if (!this.emailPattern()) {
      return Constant.Error.invalidEmail;
    }
    if (this.password == null || this.password === '') {
      return Constant.Error.requirePassword;
    }
    if (this.passwordMin() > this.password.length) {
      return Constant.Error.invalidPassword;
    }
    return '';
  }
}
