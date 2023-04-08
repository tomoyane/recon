
export class Constant {
  public static VALIDATE_EMAIL = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  public static VALIDATE_PASS = 8;

  public static typeStartCountDown = 'start_countdown';
  public static typeStartRecord = 'start_recording';
  public static typeStopRecord = 'stop_recording';
  public static typeSignInSuccess = 'sign_in';
  public static typeForceStopRecord = 'force_stop_recording';
  public static typeRequestNotifications = 'request_notifications';
  public static typeResponseNotifications = 'response_notifications';
  public static typeShutdown = 'shutdown';
  public static typeUpdateCameraSize = 'update_camera_size';

  /**
   * Title data.
   */
  public static Title = class {
    public static signIn = 'SignIn';
    public static signUp = 'SignUp';
    public static email = 'Email';
    public static password = 'Password';
    public static screenWithCamera = 'Screen＆Camera';
    public static screen = 'Screen';
    public static camera = 'Camera';
    public static permission = 'Please change permission on your browser';
    public static countDown = 'Until recording';
    public static cancel = 'Cancel';
  };

  /**
   * Text data.
   */
  public static Text = class {
    public static recordAudio = 'Record audio';
    public static selectMicrophone = 'Select microphone';
    public static selectCamera = 'Select camera';
    public static select = 'Please select';
    public static startRecord = 'Start record';
    public static sentEmailConfirmation = 'Please check email confirmation';
    public static permissionDetail = 'Please allow to access camera & microphone by to click right side of address bar.';
    public static signUpGoogle = 'Google';
    public static signUpCenter = '---------------- SignUp with email ----------------';
    public static signIn = 'SignIn';
    public static signInGoogle = 'Google';
    public static signInCenter = '---------------- SignIn with email ----------------';
    public static alreadyHasAccount = 'Already you have account?';
    public static notHasAccount = 'You dont have account?';
    public static close = 'Close';
    public static noAccount = 'No account';
    public static noNotification = 'No notification';
    public static terms = 'Rule';
    public static privacy = 'Privacy policy';
    public static agree = 'Agree';
  };

  /**
   * Error message.
   */
  public static Error = class {
    public static failedGoogleAuthSignUp = 'Could not sign up with Google';
    public static failedGoogleAuthSignIn = 'Could not sign in with Google';
    public static requireEmail = 'Required email';
    public static invalidEmail = 'Invalid email format';
    public static requirePassword = 'Required password';
    public static invalidPassword = 'Please enter password over 8 character';
    public static requireCheck = 'Please agree rule';
    public static alreadyUseEmail = 'Already used this email';
    public static cannotCreateUser = 'Failed to sign up';
    public static cannotLoginUser = 'Failed to sign in';
    public static failedVerifyEmail = 'Failed to confirm email\nPlease try again';
    public static requireVerifyEmail = 'Please activate account';
    public static failedLogout = 'Could not logout';
    public static suggestEmail = '※ Email format is xxx@xxx.xxx';
    public static suggestPass = '※ Please enter password over 8 character';
    public static failedEmailVerify = 'Please check email confirmation';
  };
}
