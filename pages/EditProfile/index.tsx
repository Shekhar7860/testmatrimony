import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-native";
import { Dispatch } from "redux";
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  Image,
  ImageStyle,
  ImageBackground,
  ScrollView,
  TextInput,
  Platform,
  Alert,
} from "react-native";
import { AppTheme } from "../../config/DefaultConfig";
import ThemedText from "../../components/UI/ThemedText";
import RoundButton from "../../components/Base/RoundButton";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import useTheme from "../../hooks/useTheme";
import FooterNavigation from "../Footer/Index";
import ThemeToggle from "../../components/Base/ThemeToggle";
import LanguageSelector from "../../components/Base/languageSelector";
import { AppLanguage, LanguageKey } from "../../config/languages";
import { ThemeKey } from "../../config/themes";
import useLanguage from "../../hooks/useLanguage";
import { setThemeAction, setLanguageAction } from "../../store/reducers/config";
import { connect } from "react-redux";
import PhotoUpload from "../../components/Base/PhotoUpload";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
const isIOS = (): Boolean => Platform.OS == "ios";

// @ts-ignore
const ImagePath = require("../../images/profile.png");
const girl = require("../../images/new-profile.jpg");
const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const EditProfile: React.FunctionComponent<Props> = ({
  dispatch,
  history,
}: Props) => {
  const theme: AppTheme = useTheme();
  const language: AppLanguage = useLanguage();
  const [image, setImage] = useState(girlImageUri);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [username, setUserName] = useState("");

  useEffect(() => {
    if (auth().currentUser !== null) {
      console.log(
        "logged In User" +
          JSON.stringify(auth().currentUser.providerData[0].email)
      );
      database()
        .ref("user")
        .child(auth().currentUser.uid)
        .once("value")
        .then((dataSnapshot) => {
          console.log("snap", dataSnapshot.val().email);
          setImage(dataSnapshot.val().image);
          setName(dataSnapshot.val().username);
          setEmail(dataSnapshot.val().email);
          setPhone(dataSnapshot.val().phone);
          setGender(dataSnapshot.val().gender);
          setUserName(dataSnapshot.val().username);
        });
    }
  }, []);

  const updateTheme = (theme: ThemeKey) => dispatch(setThemeAction(theme));
  const updateLanguage = (language: LanguageKey) =>
    dispatch(setLanguageAction(language));

  const backButton = () => {
    history.push("/matching");
  };

  const save = () => {
    database()
      .ref("/user")
      .child(auth().currentUser.uid)
      .update({
        username: name,
        phone: phone,
        gender: gender,
      });
    Alert.alert("Profile Updated Successfully");
  };

  return (
    <>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <View style={style.mainContainer}>
          <ImageBackground source={ImagePath} style={style.imageStyle}>
            <View style={style.backContainer}>
              <TouchableOpacity onPress={backButton}>
                <View style={style.leftContainer}>
                  <MaterialIcon
                    name="chevron-left-circle-outline"
                    size={30}
                    color={theme.highlightTextColor}
                    style={style.backIcon}
                  />
                </View>
              </TouchableOpacity>
              <View style={style.centerContainer}>
                <View style={style.childContainer}>
                  <ThemedText
                    style={style.specialText}
                    styleKey="highlightTextColor"
                  >
                    {language.editProfile}
                  </ThemedText>
                </View>
              </View>
            </View>
            <View style={style.childContainer}>
              <Image
                source={{ uri: image ? image : girlImageUri }}
                style={[
                  style.logoImage,
                  { borderColor: theme.backgroundColor },
                ]}
              />
            </View>
          </ImageBackground>
          <View style={[style.childContainer, style.nexStyle]}>
            <ThemedText styleKey="textColor" style={style.textStyle}>
              {name}
            </ThemedText>
          </View>
          <ScrollView>
            <View
              style={[
                style.backContainer,
                style.layoutContainer,
                { marginTop: 40, backgroundColor: theme.profileColor },
              ]}
            >
              <View style={[style.leftContainer, style.addContainer]}>
                <ThemedText
                  styleKey="profileTextColor"
                  style={style.labelStyle}
                >
                  {language.namePlaceholder}
                </ThemedText>
              </View>
              <View style={[style.centerContainer, style.inputStyle]}>
                <TextInput
                  placeholder="John manson"
                  placeholderTextColor={theme.profileTextColor}
                  style={[
                    style.textContainer,
                    { color: theme.profileTextColor },
                  ]}
                  value={name}
                  onChangeText={(text) => setName(text)}
                />
              </View>
            </View>
            <View
              style={[
                style.backContainer,
                style.layoutContainer,
                { backgroundColor: theme.profileColor },
              ]}
            >
              <View style={[style.leftContainer, style.addContainer]}>
                <ThemedText
                  styleKey="profileTextColor"
                  style={style.labelStyle}
                >
                  {language.userPlaceholder}
                </ThemedText>
              </View>
              <View style={[style.centerContainer, style.inputStyle]}>
                <TextInput
                  placeholder="Add username"
                  placeholderTextColor={theme.profilePlaceholder}
                  style={[
                    style.textContainer,
                    { color: theme.profileTextColor },
                  ]}
                  value={username}
                  onChangeText={(text) => setUserName(text)}
                />
              </View>
            </View>
            <View
              style={[
                style.backContainer,
                style.layoutContainer,
                { backgroundColor: theme.profileColor },
              ]}
            >
              <View style={[style.leftContainer, style.addContainer]}>
                <ThemedText
                  styleKey="profileTextColor"
                  style={style.labelStyle}
                >
                  {language.GenderText}
                </ThemedText>
              </View>
              <View style={[style.centerContainer, style.inputStyle]}>
                <TextInput
                  placeholder="Male/Female"
                  placeholderTextColor={theme.profilePlaceholder}
                  style={[
                    style.textContainer,
                    { color: theme.profileTextColor },
                  ]}
                  value={gender}
                  onChangeText={(text) => setGender(text)}
                />
              </View>
            </View>
            <View
              style={[
                style.backContainer,
                style.layoutContainer,
                { backgroundColor: theme.profileColor },
              ]}
            >
              <View style={[style.leftContainer, style.addContainer]}>
                <ThemedText
                  styleKey="profileTextColor"
                  style={style.labelStyle}
                >
                  {language.emailPlaceholder}
                </ThemedText>
              </View>
              <View style={[style.centerContainer, style.inputStyle]}>
                <TextInput
                  placeholder="Johnmanson@gmail.com"
                  placeholderTextColor={theme.profilePlaceholder}
                  style={[
                    style.textContainer2,
                    { color: theme.profileTextColor },
                  ]}
                  value={email}
                  editable={false}
                />
              </View>
            </View>
            <View
              style={[
                style.backContainer,
                style.layoutContainer,
                { backgroundColor: theme.profileColor },
              ]}
            >
              <View style={[style.leftContainer, style.addContainer]}>
                <ThemedText
                  styleKey="profileTextColor"
                  style={style.labelStyle}
                >
                  {language.phonePlaceholder}
                </ThemedText>
              </View>
              <View style={[style.centerContainer, style.inputStyle]}>
                <TextInput
                  placeholder="6358789523"
                  placeholderTextColor={theme.profilePlaceholder}
                  style={[
                    style.textContainer,
                    { color: theme.profileTextColor },
                  ]}
                  value={phone}
                  onChangeText={(text) => setPhone(text)}
                />
              </View>
            </View>
            <ThemeToggle updateTheme={updateTheme} />
            <LanguageSelector updateLanguage={updateLanguage} />
            <View style={[style.childContainer, style.extraContainer]}>
              <RoundButton
                buttonStyle={style.inputLabel}
                label={language.save}
                buttonColor={theme.appColor}
                labelStyle={theme.highlightTextColor}
                onPress={() => save()}
              />
            </View>
          </ScrollView>
          <FooterNavigation history={history} />
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default connect(({ dispatch }) => ({ dispatch }))(EditProfile);

interface Style {
  mainContainer: ViewStyle;
  childContainer: ViewStyle;
  centerContainer: ViewStyle;
  extraContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  backContainer: ViewStyle;
  addContainer: ViewStyle;
  inputLabel: ViewStyle;
  specialContainer: ViewStyle;
  layoutContainer: ViewStyle;
  title: ViewStyle;
  Icon: TextStyle;
  inputStyle: TextStyle;
  labelStyle: TextStyle;
  backIcon: ViewStyle;
  logoImage: ImageStyle;
  specialStyle: ImageStyle;
  textStyle: TextStyle;
  extraStyle: ViewStyle;
  nexStyle: ViewStyle;
  textContainer: ViewStyle;
  specialText: TextStyle;
  imageStyle: ImageStyle;
  iconImage: ImageStyle;
  textContainer2: ViewStyle;
}

const style: Style = StyleSheet.create<Style>({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
    paddingRight: 50,
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  specialContainer: {
    position: "absolute",
    alignSelf: "center",
  },
  addContainer: {
    flex: 2,
  },
  textContainer: {
    height: isIOS() ? 15 : 45,
    paddingLeft: isIOS() ? 7 : 10,
    fontSize: 18,
  },
  textContainer2: {
    height: isIOS() ? 15 : 45,
    paddingLeft: isIOS() ? 7 : 10,
    fontSize: 10,
  },
  layoutContainer: {
    marginLeft: 40,
    marginRight: 40,
    marginTop: 25,
    padding: 10,
    paddingLeft: 20,
    borderRadius: 50,
  },
  extraContainer: {
    marginTop: 25,
    marginBottom: 50,
  },
  inputLabel: {
    minWidth: 200,
    paddingTop: 20,
    minHeight: 60,
    marginTop: 0,
    borderRadius: 50,
    marginBottom: 30,
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
  title: {
    marginLeft: 30,
    marginRight: 50,
    paddingBottom: 10,
  },
  inputStyle: {
    paddingTop: 0,
    flex: 3,
    paddingLeft: 5,
  },
  labelStyle: {
    paddingTop: 10,
    paddingBottom: 10,
    fontSize: 18,
  },
  Icon: {
    paddingLeft: 30,
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  },
  logoImage: {
    justifyContent: "center",
    width: 200,
    height: 200,
    borderWidth: 5,
    borderRadius: 150,
    marginTop: 70,
  },
  specialStyle: {
    marginLeft: 180,
  },
  textStyle: {
    fontSize: 22,
    fontWeight: "bold",
    paddingLeft: 10,
  },
  extraStyle: {
    paddingBottom: 70,
  },
  nexStyle: {
    marginTop: 100,
  },
  specialText: {
    fontSize: 22,
    fontWeight: "bold",
    textTransform: "capitalize",
  },
  imageStyle: {
    width: "100%",
    height: 230,
  },
  iconImage: {
    width: 20,
    height: 20,
    marginLeft: 30,
    marginTop: 20,
  },
});
