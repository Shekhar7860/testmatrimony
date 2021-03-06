import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-native";
import { Dispatch } from "redux";
import {
  View,
  ViewStyle,
  StyleSheet,
  Alert,
  TextStyle,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageStyle,
  ImageBackground,
  Platform,
  PermissionsAndroid,
  Button,
} from "react-native";
import { AppConstants, AppTheme } from "../../config/DefaultConfig";
import ThemedText from "../../components/UI/ThemedText";
import useConstants from "../../hooks/useConstants";
import RoundButton from "../../components/Base/RoundButton";
import Icon from "react-native-vector-icons/FontAwesome";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import useTheme from "../../hooks/useTheme";
import microValidator from "micro-validator";
import { ValidationError } from "../../config/validation";
import Input from "../../components/Base/Input";
import database from "@react-native-firebase/database";
import ImagePicker from "react-native-image-picker";
import storage from "@react-native-firebase/storage";
import RNFetchBlob from "react-native-fetch-blob";
import auth from "@react-native-firebase/auth";
import Spinner from "react-native-loading-spinner-overlay";
import { InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize, AdEventType  } from '@react-native-firebase/admob';
interface LoginField {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPass?: string;
}

const isIOS = (): Boolean => Platform.OS == "ios";

// @ts-ignore
const ImagePath = require("../../images/gender.png");

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const girl = require("../../images/new-profile.jpg");
const interstitial = InterstitialAd.createForAdRequest('ca-app-pub-3671018146205481/5043637990', {
  requestNonPersonalizedAdsOnly: true,
});
const Signup: React.FunctionComponent<Props> = ({ history }: Props) => {
  useEffect(() => {
    interstitial.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        interstitial.show();
      }
    });
    
    interstitial.load();
  }, [])
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();
  const [selected, setSelected] = useState<Boolean>(false);

  const validate = (data: LoginField): ValidationError => {
    const errors = microValidator.validate(
      {
        username: {
          required: {
            errorMsg: constants.signupValidation.username,
          },
        },
        email: {
          required: {
            errorMsg: constants.signupValidation.email,
          },
          email: {
            errorMsg: constants.signupValidation.validEmail,
          },
        },
        phone: {
          required: {
            errorMsg: constants.signupValidation.phone,
          },
          regex: {
            pattern: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
            errorMsg: constants.signupValidation.validPhone,
          },
        },
        password: {
          required: {
            errorMsg: constants.signupValidation.password,
          },
          length: {
            min: 6,
            max: 12,
            errorMsg: constants.signupValidation.passwordLength,
          },
        },
        confirmPass: {
          required: {
            errorMsg: constants.signupValidation.confirmPassword,
          },
          equals: {
            to: password, // you can pass anything here for e.g. variables
            errorMsg: constants.signupValidation.checkPassword,
          },
        },
      },
      data
    );

    return errors;
  };

  const [username, onChangeUsername] = useState<string>("");
  const [age, onChangeAge] = useState<string>("");
  const [email, onChangeEmail] = useState<string>("");
  const [phone, onChangePhone] = useState<string>("");
  const [password, onChangePassword] = useState<string>("");
  const [confirmPass, onChangeConfirm] = useState<string>(password);
  const [errors, setErrors] = useState<ValidationError>({});
  const [image, setImage] = useState(girl);
  const [imageRef, setImageRef] = useState("");
  const [gender, setGender] = useState("male");
  const [color, setColor] = useState("#7f8c8d");
  const [visible, setLoader] = useState(false);

  const backButton = () => {
    history.push("/");
  };

  const openImagePicker = async () => {
    const options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        console.group("ui", response);
        const source = { uri: response.uri };
        setImage(source);
        console.group("sss", source);
        if (
          response.uri.includes("myprovider") ||
          response.uri.includes("provider")
        ) {
          uploadImage(source);
        } else {
          getPathForFirebaseStorage(response.uri);
        }
      }
    });
  };

  const uriToBlob = (uri) => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.onload = function() {
        // return the blob
        resolve(xhr.response);
      };

      xhr.onerror = function() {
        // something went wrong
        reject(new Error("uriToBlob failed"));
      };

      // this helps us get a blob
      xhr.responseType = "blob";

      xhr.open("GET", uri, true);
      xhr.send(null);
    });
  };

  const uploadToFirebase = (blob) => {
    console.log("blob", blob);
    return new Promise((resolve, reject) => {
      var storageRef = storage().ref();

      storageRef
        .child("uploads/photo.jpg")
        .put(blob, {
          contentType: "image/jpeg",
        })
        .then((snapshot) => {
          blob.close();
          resolve(snapshot);
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  const Blob = RNFetchBlob.polyfill.Blob;
  const fs = RNFetchBlob.fs;
  window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
  window.Blob = Blob;
  const Fetch = RNFetchBlob.polyfill.Fetch;
  // replace built-in fetch
  window.fetch = new Fetch({
    // enable this option so that the response data conversion handled automatically
    auto: true,
    // when receiving response data, the module will match its Content-Type header
    // with strings in this array. If it contains any one of string in this array,
    // the response body will be considered as binary data and the data will be stored
    // in file system instead of in memory.
    // By default, it only store response data to file system when Content-Type
    // contains string `application/octet`.
    binaryContentTypes: ["image/", "video/", "audio/", "foo/"],
  }).build();

  const requestExternalStoreageRead = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Cool App ...",
          message: "App needs access to external storage",
        }
      );

      return granted == PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      //Handle this error
      return false;
    }
  };
  const uploadImage = async (image) => {
    requestExternalStoreageRead();
    const { uri } = image;
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
    //setUploading(true);
    //  setTransferred(0);

    console.group("ess");
    const task = storage()
      .ref(filename)
      .putFile(uploadUri);

    task.on("state_changed", (snapshot) => {});

    try {
      await task;
    } catch (e) {
      console.group(e, "error");
    }

    // setTimeout(() => {

    //  }, 1000);

    // setUploading(false);

    const url = await storage()
      .ref(filename)
      .getDownloadURL();
    console.group("this is url", url);
    setImageRef(url);
    // Alert.alert(
    //   "Photo uploaded!",
    //   "Your photo has been uploaded to Firebase Cloud Storage!"
    // );
    setImage(null);
  };

  const getPathForFirebaseStorage = async (uri) => {
    if (Platform.OS === "ios") return uri;
    const stat = await RNFetchBlob.fs.stat(uri);
    // return stat.path;
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const storageref = storage().ref(filename);

    const uploadTask = storageref
      .putFile(stat.path)

      .then((snapshot) => {
        // blob.close();

        storageref.getDownloadURL().then((url) => {
          console.group("uriImg", url);
          setImageRef(url);
        });
      })
      .catch((error) => {
        // reject(error);
      });
  };

  const profilePicApi = (image, props) => {};
  const goToHome = () => {
    if(imageRef != "")
    {
    setLoader(true);
    const errors: ValidationError = validate({
      username: username,
      email: email,
      phone: phone,
      password: password,
      confirmPass: confirmPass,
    });
    if (!Object.keys(errors).length) {
      try {
        auth()
          .createUserWithEmailAndPassword(email, password)
          .then((res) => {
            console.group("res", res.user._user.uid);
            setLoader(false);
            history.push("/gender/");
            database()
              .ref("/user")
              .child(res.user._user.uid)
              .set({
                username: username,
                email: email,
                phone: phone,
                image: imageRef,
                gender: gender,
                id: res.user._user.uid,
                premium: false,
                age: age,
              });

            database()
              .ref("/users")
              .push({
                username: username,
                email: email,
                phone: phone,
                image: imageRef,
                gender: gender,
                id: res.user._user.uid,
                premium: false,
                age: age,
              });
            setLoader(false);
            // history.push("/gender/");
            // this.props.navigation.navigate('Home')
          })
          .catch((error) => {
            Alert.alert(error.toString());
          });
      } catch (error) {
        Alert.alert(error.toString(error));
      }
      // history.push('/gender/')
    } else {
      setErrors(errors);
    }
  }
  else{
    Alert.alert("Please upload image")
  }

    // history.push('/gender/')
  };

  return (
    <>
      <Spinner
        visible={visible}
        color="#f39c12"
        tintColor="#f39c12"
        animation={"fade"}
        cancelable={false}
        textStyle={{ color: "#FFF" }}
      />
      <View style={style.mainContainer}>
        <ScrollView>
          <ImageBackground source={ImagePath} style={style.imageStyle}>
            <TouchableOpacity style={style.backContainer} onPress={backButton}>
              <View style={style.leftContainer}>
                <MaterialIcon
                  name="chevron-left-circle-outline"
                  size={30}
                  color={theme.highlightTextColor}
                  style={style.backIcon}
                />
              </View>
              <View style={style.rightContainer}>
                <ThemedText
                  styleKey="highlightTextColor"
                  style={style.textStyle}
                >
                  {constants.backText}
                </ThemedText>
              </View>
            </TouchableOpacity>
            <View style={[style.topContainer, style.imageContainer]}>
              <Image source={constants.recraftLogo} style={style.logoImage} />
            </View>
            <View style={[style.topContainer, style.titleContainer]}>
              <ThemedText
                styleKey="highlightTextColor"
                style={[style.textStyle, style.titleStyle]}
              >
                {constants.title}
              </ThemedText>
            </View>
          </ImageBackground>
          <View style={{ flex: 1, backgroundColor: theme.backgroundColor }}>
            <View
              style={[
                style.container,
                style.extraStyle,
                {
                  backgroundColor: theme.backgroundColor,
                  position: "relative",
                  bottom: 80,
                },
              ]}
            >
              <View style={[style.topContainer, { marginTop: 20 }]}>
                <ThemedText styleKey="textColor" style={style.textStyle}>
                  {constants.labelSign}
                </ThemedText>
              </View>
              <TouchableOpacity
                style={style.childContainer}
                onPress={() => openImagePicker()}
              >
                <Image
                  source={image}
                  style={[
                    style.logoImage2,
                    { borderColor: theme.backgroundColor },
                  ]}
                />
              </TouchableOpacity>
              <Input
                placeholder={constants.userPlaceholder}
                onChangeText={onChangeUsername}
                value={username}
                errors={errors.username}
                icon="user"
                choose={true}
              />
              <Input
                placeholder={constants.emailPlaceholder}
                onChangeText={onChangeEmail}
                value={email}
                errors={errors.email}
                icon="email"
                choose={false}
              />
              <Input
                placeholder={constants.phonePlaceholder}
                onChangeText={onChangePhone}
                value={phone}
                errors={errors.phone}
                icon="mobile1"
                choose={true}
              />
              <Input
                placeholder={"age"}
                onChangeText={onChangeAge}
                icon="user"
                choose={false}
              />
              <ThemedText
                styleKey="textColor"
                style={{ alignSelf: "flex-start", margin: 10 }}
              >
                Gender
              </ThemedText>
              <View style={{ flexDirection: "row", marginTop: 5 }}>
                <Button
                  onPress={() => {
                    setGender("male");
                    setColor("#8e44ad");
                  }}
                  title="Male"
                  color={gender == "male" ? "#8e44ad" : "#7f8c8d"}
                />
                <View style={{ width: "10%" }} />
                <Button
                  onPress={() => {
                    setGender("female");
                    setColor("#8e44ad");
                  }}
                  title="Female"
                  color={gender == "female" ? "#8e44ad" : "#7f8c8d"}
                />
              </View>
              <Input
                placeholder={constants.passPlaceholder}
                onChangeText={onChangePassword}
                value={password}
                errors={errors.password}
                secureTextEntry={true}
                icon="key"
                choose={true}
                iconStyle={{ transform: [{ rotate: "80deg" }] }}
              />
              <Input
                placeholder={constants.confirmPlaceholder}
                onChangeText={onChangeConfirm}
                value={confirmPass}
                errors={errors.confirmPass}
                secureTextEntry={true}
                icon="key"
                confirmIcon={true}
              />
              <View style={[style.searchContainer, style.checkContainer]}>
                <View style={style.iconStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(!selected);
                    }}
                  >
                    <MaterialIcon
                      name={
                        selected ? "checkbox-marked" : "checkbox-blank-outline"
                      }
                      size={15}
                      color={selected ? theme.appColor : theme.textColor}
                      style={{ paddingTop: isIOS() ? 2 : 0 }}
                    />
                  </TouchableOpacity>
                </View>
                <View style={style.textContainer}>
                  <ThemedText style={style.checkText} styleKey="textColor">
                    {constants.checkText}
                  </ThemedText>
                </View>
              </View>
              <RoundButton
                buttonStyle={style.signButton}
                label={constants.labelSignup}
                buttonColor={theme.appColor}
                labelStyle={theme.highlightTextColor}
                onPress={goToHome}
              />
              <View style={style.childContainer}>
                <ThemedText style={style.forgotPassword} styleKey="textColor" />
              </View>
            </View>
            <View style={{ position: "relative", bottom: 40 }} />
          </View>
        </ScrollView>
      </View>
      <BannerAd unitId={'ca-app-pub-3671018146205481/8982883008'} size={BannerAdSize.FULL_BANNER}/>
    </>
  );
};

export default Signup;

interface Style {
  container: ViewStyle;
  mainContainer: ViewStyle;
  topContainer: ViewStyle;
  childContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  forgotPassword: TextStyle;
  title: TextStyle;
  Icon: TextStyle;
  iconContainer: ViewStyle;
  backIcon: ViewStyle;
  logoImage: ImageStyle;
  logoImage2: ImageStyle;
  imageStyle: ImageStyle;
  textStyle: TextStyle;
  searchContainer: ViewStyle;
  iconStyle: ViewStyle;
  textContainer: ViewStyle;
  backContainer: ViewStyle;
  imageContainer: ViewStyle;
  titleContainer: ViewStyle;
  titleStyle: TextStyle;
  extraStyle: ViewStyle;
  checkContainer: ViewStyle;
  checkText: TextStyle;
  signButton: ViewStyle;
}

const style: Style = StyleSheet.create<Style>({
  container: {
    flex: 1,
    paddingLeft: 35,
    paddingRight: 35,
    fontSize: 16,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  topContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 80,
    marginBottom: 20,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  leftContainer: {
    flex: 0,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 3,
    justifyContent: "center",
    paddingTop: 17,
    paddingLeft: 5,
  },
  forgotPassword: {
    marginTop: 10,
    marginBottom: 15,
    fontSize: 12,
    alignSelf: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
  iconContainer: {
    margin: 12,
    minWidth: 50,
    height: 50,
    borderRadius: 50,
  },
  Icon: {
    fontSize: 25,
    padding: 15,
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  },
  logoImage: {
    justifyContent: "center",
    width: 120,
    height: 120,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textContainer: {
    flex: 9,
  },
  searchContainer: {
    borderBottomWidth: 0.5,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: isIOS() ? 20 : 10,
    paddingBottom: isIOS() ? 10 : 0,
  },
  iconStyle: {
    flex: 1,
    alignItems: "flex-start",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 20,
  },
  imageContainer: {
    marginTop: 40,
    marginBottom: 10,
  },
  titleContainer: {
    marginTop: 0,
    marginBottom: 30,
  },
  titleStyle: {
    fontSize: 32,
    textTransform: "capitalize",
  },
  extraStyle: {
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    elevation: 6,
    marginLeft: 50,
    marginRight: 50,
    borderRadius: 40,
    paddingBottom: 50,
  },
  checkContainer: {
    borderBottomWidth: 0,
    paddingTop: 10,
  },
  checkText: {
    fontSize: 10,
  },
  signButton: {
    minWidth: 230,
    marginTop: 40,
  },
  imageStyle: {
    width: "100%",
    height: 370,
  },
  logoImage2: {
    justifyContent: "center",
    width: 200,
    height: 200,
    borderWidth: 5,
    borderRadius: 150,
    marginTop: 0,
  },
});
