import { ThemeKey } from "./themes";
import { LanguageKey } from "./languages";

export interface AppTheme {
  backgroundColor: string;
  highlightColor: string;
  highlightTextColor: string;
  cardTextColor: string;
  textColor: string;
  lightTextColor: string;
  lightBottomColor: string;
  profileColor: string;
  profileTextColor: string;
  profilePlaceholder: string;
  alternateMessageBackgroundColor: string;
  appColor: string;
  facebookColor: string;
  googleColor: string;
  twitterColor: string;
  inputColor: string;
  inputBorderColor: string;
  errorColor: string;
  forgetColor: string;
  premiumColor: string;
  notifyColor: string;
  successColor: string;
}

export interface AppConstants {
  selectedTheme: ThemeKey;
  selectedLanguage: LanguageKey;
  defaultTheme: string;
  defaultLanguage: string;
  title: string;
  matching: string;
  forgetText: string;
  profileName: string;
  matched: string;
  profile: string;
  premium: string;
  GenderText: string;
  matchText: string;
  message: string;
  gifts: string;
  welcome: string;
  slogan: string;
  recraftLogo: any;
  backText: string;
  labelLogin: string;
  labelSign: string;
  labelCheckAcc: string;
  labelChoice: string;
  labelSignin: string;
  labelSignup: string;
  labelConfirm: string;
  labelReject: string;
  labelMessage: string;
  labelContact: string;
  phonePlaceholder: string;
  emailPlaceholder: string;
  userPlaceholder: string;
  passPlaceholder: string;
  namePlaceholder: string;
  confirmPlaceholder: string;
  labelForget: string;
  labelSignupOr: string;
  labelSignupWith: string;
  checkText: string;
  activatePremium: string;
  activateYearly: string;
  save: string;
  choiceOne: string;
  resetPass: string;
  newAccount: string;
  selectGender: string;
  editProfile: string;
  searching: string;
  nearby: string;
  discover: string;
  calling: string;
  perMonth: string;
  perYear: string;
  payment: string;
  newCard: string;
  saveCard: string;
  paymentDone: string;
  messageText: string;
  loginValidation: loginValidation;
  signupValidation: signupValidation;
  cardValidation: cardValidation;
}

export interface loginValidation {
  username: string;
  password: string;
  passwordLength: string;
}

export interface cardValidation {
  cardNumber: string;
  cardLength: string;
  expiry: string;
  expiryValid: string;
  cvv: string;
  cvvLength: string;
  name: string;
}

export interface signupValidation {
  username: string;
  email: string;
  validEmail: string;
  phone: string;
  validPhone: string;
  password: string;
  passwordLength: string;
  confirmPassword: string;
  checkPassword: string;
}

export interface ApplicationConfig {
  constants?: AppConstants;
}

// @ts-ignore
const Logo = require("../images/logo.png");

export const defaultConfig: ApplicationConfig = {
  constants: {
    selectedTheme: ThemeKey.light,
    selectedLanguage: LanguageKey.en,
    defaultTheme: "Dark Theme",
    defaultLanguage: "Default language",
    title: "SHUBH VIVAH",
    matching: "Matching",
    forgetText: "Forget Password",
    profileName: "@john manson",
    matched: "IT'S MATCH!",
    profile: "Profile",
    premium: "Go Premium",
    activatePremium: "Activate Premium",
    activateYearly: "Activate Yearly",
    editProfile: "Edit Profile",
    save: "SAVE CHANGES",
    matchText: "You and Jessica have liked each other",
    message: "Send Message",
    gifts: "Send Gifts",
    GenderText: "Gender",
    welcome: "Welcome Back",
    slogan: "Meet and share every moments",
    recraftLogo: Logo,
    backText: "Back",
    labelLogin: "Login Account",
    labelSign: "Signup Account",
    labelCheckAcc: "Don't have an account?",
    labelChoice: "Or Login With",
    labelSignupWith: "Sign up with",
    labelSignupOr: "or Sign Up with",
    labelSignin: "Sign in",
    labelSignup: "Sign Up",
    labelConfirm: "Confirm",
    labelReject: "Reject",
    labelMessage: "Message",
    labelContact: "Contact",
    phonePlaceholder: "Phone",
    namePlaceholder: "Name",
    emailPlaceholder: "Email",
    userPlaceholder: "Username",
    passPlaceholder: "Password",
    confirmPlaceholder: "Confirm Password",
    labelForget: "Forget password?",
    checkText: "I agree Terms of use & Privacy Policy",
    choiceOne: "Email or Phone",
    resetPass: "Reset Password",
    newAccount: "or Create New Account",
    selectGender: "Select your gender",
    searching: "Searching",
    nearby: "Near by",
    discover: "Discover",
    calling: "Calling..........",
    perMonth: "$4.99/month",
    perYear: "$55/12 month",
    messageText: "Message",
    newCard: "New Card",
    saveCard: "Save Card Details",
    payment: "Payment",
    paymentDone: "Payment Done",
    loginValidation: {
      username: `Email is required`,
      password: `Password is required`,
      passwordLength: "Password length between 6 and 12",
    },
    cardValidation: {
      cardNumber: `Card Number is required`,
      cardLength: "Card Number length should be 12 digit",
      expiry: `Expiry Date is required`,
      expiryValid: `Please enter a valid expiry date`,
      cvv: `CVV is required`,
      cvvLength: "CVV length should be 3 digit",
      name: `Card Holder Name is required`,
    },
    signupValidation: {
      username: `Username is required`,
      email: `Email is required`,
      validEmail: "Please enter a valid email",
      phone: `Phone No. is required`,
      validPhone: "Please enter a valid phone no.",
      password: `Password is required`,
      passwordLength: "Password length between 6 and 12",
      confirmPassword: "Confirm Password is required",
      checkPassword: "Confirm password should be same",
    },
  },
};
