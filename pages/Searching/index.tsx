import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-native";
import { Dispatch } from "redux";
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Image,
  ImageStyle,
  ImageBackground,
  FlatList,
  Text,
  TouchableOpacity,
} from "react-native";
import { AppConstants, AppTheme } from "../../config/DefaultConfig";
import ThemedText from "../../components/UI/ThemedText";
import useConstants from "../../hooks/useConstants";
import useTheme from "../../hooks/useTheme";
import FooterNavigation from "../Footer/Index";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import RoundButton from "../../components/Base/RoundButton";
import AddSubscriptionView from "../../components/AddSubscriptionView";
import RNUpiPayment from "react-native-upi-payment";

const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";

// @ts-ignore
const ImagePath = require("../../images/dual-tone.png");
const girl = require("../../images/searching.jpg");

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const Searching: React.FunctionComponent<Props> = ({ history }: Props) => {
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();
  const [requests, setAcceptedRequests] = useState([]);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    let acceptedArray = [];
    if (auth().currentUser !== null) {
      database()
        .ref("user")
        .child(auth().currentUser.uid)
        .once("value")
        .then((dataSnapshot) => {
          console.log("snap", dataSnapshot.val().email);
          setImage(dataSnapshot.val().image);
          setName(dataSnapshot.val().username);
        });
    }
    database()
      .ref("user")
      .child(auth().currentUser.uid)
      .once("value")
      .then((loggedIn) => {
        // console.log("snap", loggedIn.val());

        database()
          .ref("requests")
          .once("value")
          .then((dataSnapshot) => {
            // console.log("snap", dataSnapshot.val());
            dataSnapshot.forEach((child) => {
              //   console.log("child", Object.keys(dataSnapshot.val()));
              if (
                (loggedIn.val().id == child.val().receiverId &&
                  child.val().isAccepted == 1) ||
                (loggedIn.val().id == child.val().senderId &&
                  child.val().isAccepted == 1)
              ) {
                let obj = {};
                //  console.group("key", child.key);
                //  child.val().requestKey = "test";
                obj.key = child.val();
                obj.requestKey = child.key;
                // console.group("obj", obj);
                acceptedArray.push(obj);
              }
            });

            console.log("requests", acceptedArray);
            // setRequests(requestsArray);
            setAcceptedRequests(acceptedArray);

            // setImage(dataSnapshot.val().image);
          });
      });
  }, []);

  const message = (selected) => {
    console.group("message", selected);

    history.push({
      pathname: "/chat",
      state: { detail: selected },
    });
  };

  const successCallback = (res) => {
    console.log("res", res);
    database()
      .ref("/user")
      .child(auth().currentUser.uid)
      .update({
        premium: true,
      });
  };

  const failureCallback = (err) => {
    console.log("res", err);
  };

  const contact = (item) => {
    database()
      .ref("user")
      .child(auth().currentUser.uid)
      .once("value")
      .then((dataSnapshot) => {
        if (dataSnapshot.val().premium == false) {
          RNUpiPayment.initializePayment(
            {
              vpa: "9646407363@ybl", // or can be john@ybl or mobileNo@upi
              payeeName: "John Doe",
              amount: "101",
              transactionRef: "aasf-332-aoei-fn",
            },
            successCallback,
            failureCallback
          );
        } else {
          Alert.alert("contact is " + item.phone);
        }
      });
  };

  const contact2 = (selected) => {
    // RNUpiPayment.initializePayment(
    //  {
    //    vpa: "9646407363@ybl", // or can be john@ybl or mobileNo@upi
    //    payeeName: "John Doe",
    //   amount: "101",
    //    transactionRef: "aasf-332-aoei-fn",
    // },
    //    successCallback,
    //    failureCallback
    //   );

    history.push("/process/");
    // database()
    //   .ref("/requests")
    //   .child(selected.requestKey)
    //   .remove();
  };

  const goBack = () => {
    history.push("/matching");
  };

  return (
    <>
      <View style={style.toolbar}>
        <TouchableOpacity onPress={() => goBack()}>
          <Image
            style={{ width: 30, marginLeft: 5, height: 30 }}
            source={require("../../images/back.png")}
          />
        </TouchableOpacity>
        <Text style={style.toolbarTitle}>Accepted Interests</Text>
        <Text style={style.toolbarButton} />
      </View>
      <View style={style.mainContainer}>
        {requests.length !== 0 ? (
          <FlatList
            data={requests}
            renderItem={({ item }) => (
              <View
                style={{
                  marginTop: 20,
                  borderBottomWidth: 1,
                  borderColor: "#bdc3c7",
                }}
              >
                <TouchableOpacity style={style.row}>
                  <View style={{ width: "5%" }} />
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={{
                        uri:
                          item.key.senderImage == image
                            ? item.key.receiverImage
                            : item.key.senderImage,
                      }}
                      style={style.imageStyle}
                    />
                  </View>
                  <View style={{ width: "5%" }} />
                  <View style={{ justifyContent: "center" }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: "bold",
                        textTransform: "capitalize",
                      }}
                    >
                      {item.key.senderName == name
                        ? item.key.receiverName
                        : item.key.senderName}
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* <View style={{height: 1,backgroundColor:'gray'}}></View> */}
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  <View style={{ width: "40%" }}>
                    <RoundButton
                      buttonStyle={style.signButton}
                      label={constants.labelMessage}
                      buttonColor={theme.appColor}
                      labelStyle={theme.highlightTextColor}
                      onPress={() => message(item)}
                    />
                  </View>

                  <View style={{ width: "40%" }}>
                    <RoundButton
                      buttonStyle={style.signButton}
                      label={constants.labelContact}
                      buttonColor={theme.appColor}
                      labelStyle={theme.highlightTextColor}
                      onPress={() => contact(item)}
                      //   //onPress={goToHome}
                    />
                  </View>
                </View>
              </View>
            )}
          />
        ) : (
          <View style={{ marginTop: 20 }}>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              No Record Found{" "}
            </Text>
          </View>
        )}
      </View>
      {/*
        <ImageBackground source={ImagePath} style={style.imageStyle} >
          <View style={[style.topContainer, style.nexStyle]}>
            <ThemedText styleKey="highlightTextColor" style={[style.textStyle, style.specialText]}>{constants.searching}</ThemedText>
          </View>
          <View style={[style.childContainer]}>
            <ThemedText style={[style.forgotPassword, style.messageContent]} styleKey="highlightTextColor">{constants.nearby}</ThemedText>
          </View>
          <View style={style.bottomContainer}>
            <View style={style.bottomContent}>
                <View style={[style.childContainer, style.extraStyle]}>
                    <View style={style.outerContainer}>
                        <View style={style.iconContainer}>
                            <Image source={girl} style={style.logoImage}/>
                        </View>
                    </View>
                </View>
            </View>
          </View>
        </ImageBackground>
        <FooterNavigation history={history} />  
        */}
    </>
  );
};

export default Searching;

interface Style {
  container: ViewStyle;
  toolbar: ViewStyle;
  toolbarButton: ViewStyle;
  toolbarTitle: ViewStyle;
  mainContainer: ViewStyle;
  topContainer: ViewStyle;
  childContainer: ViewStyle;
  bottomContainer: ViewStyle;
  forgotPassword: TextStyle;
  iconContainer: ViewStyle;
  outerContainer: ViewStyle;
  logoImage: ImageStyle;
  textStyle: TextStyle;
  nexStyle: ViewStyle;
  specialText: TextStyle;
  messageContent: TextStyle;
  imageStyle: ImageStyle;
  bottomContent: ViewStyle;
  extraStyle: ViewStyle;
  row: ViewStyle;
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
  },
  bottomContainer: {
    flex: 1,
    alignItems: "flex-start",
    flexDirection: "row",
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  forgotPassword: {
    marginBottom: 15,
    fontSize: 22,
    alignSelf: "flex-start",
    alignContent: "flex-start",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 200,
    height: 200,
    borderRadius: 200,
    marginLeft: 35,
    backgroundColor: "#fc5660",
    justifyContent: "center",
  },
  outerContainer: {
    minWidth: 270,
    height: 270,
    borderRadius: 200,
    backgroundColor: "#fd9ca5",
    marginTop: 55,
    marginBottom: 55,
    justifyContent: "center",
  },
  logoImage: {
    justifyContent: "center",
    width: 150,
    height: 150,
    marginLeft: 25,
    borderRadius: 150,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  nexStyle: {
    marginTop: 80,
  },
  specialText: {
    fontSize: 40,
  },
  imageStyle: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-start",
  },
  messageContent: {
    textAlign: "center",
    paddingBottom: 20,
  },
  extraStyle: {
    backgroundColor: "#ffbcc3",
    borderRadius: 200,
    marginLeft: 10,
    marginRight: 10,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
  },
  toolbar: {
    backgroundColor: "#f39c12",
    paddingBottom: 10,
    flexDirection: "row",
    paddingTop: 20, //Step 1
  },
  toolbarButton: {
    //Step 2
    color: "#fff",
    textAlign: "center",
  },
  toolbarTitle: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
    flex: 1,
    fontSize: 20, //Step 3
  },
});
