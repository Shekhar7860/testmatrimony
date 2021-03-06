import React, { useState, useEffect } from "react";
import { RouteComponentProps } from "react-router-native";
import {
  View,
  ViewStyle,
  StyleSheet,
  ImageBackground,
  Image,
  ImageStyle,
  TextStyle,
  TouchableOpacity,
  ScrollView,
  Platform,
  Alert,
} from "react-native";
import { Dispatch } from "redux";
import { AppTheme, AppConstants } from "../../config/DefaultConfig";
import useConstants from "../../hooks/useConstants";
import useTheme from "../../hooks/useTheme";
import ThemedText from "../../components/UI/ThemedText";
import FooterNavigation from "../Footer/Index";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import Swiper from "react-native-deck-swiper";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import RNUpiPayment from "react-native-upi-payment";
import { InterstitialAd, RewardedAd, BannerAd, TestIds, BannerAdSize, AdEventType, RewardedAdEventType  } from '@react-native-firebase/admob';
const interstitial = InterstitialAd.createForAdRequest('ca-app-pub-3671018146205481/6402975214', {
  requestNonPersonalizedAdsOnly: true,
});
// @ts-ignore
const ImagePath = require("../../images/dual-tone.png");
const cross = require("../../images/cross.png");
const chat = require("../../images/chat.png");
const heart = require("../../images/heart.png");
const cardImage = require("../../images/new-card.jpg");
const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";

interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const Matching: React.FunctionComponent<Props> = ({ history }: Props) => {
  const [items, setItems] = useState([]);
  const [user, setUser] = useState({});
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");

  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();

  const backButton = () => {
    history.push("/gender");
  };

  const goToMatched = () => {
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
          history.push("/message");
        }
      });
  };

  useEffect(() => {
    interstitial.onAdEvent((type) => {
      if (type === AdEventType.LOADED) {
        interstitial.show();
      }
    });
    
    interstitial.load();
    database()
      .ref("user")
      .child(auth().currentUser.uid)
      .once("value")
      .then((dataSnapshot) => {
        console.group("snap", dataSnapshot.val());
        setUser(dataSnapshot.val());
        setImage(dataSnapshot.val().image);
        setName(dataSnapshot.val().name);
        if (dataSnapshot.val().gender == "male") {
          database()
            .ref("/users")
            .orderByChild("gender")
            .equalTo("female")
            .once("value")
            .then((dataSnapshot) => {
              let newdata = dataSnapshot.val();
              if (dataSnapshot.val()) {
                let imagesArray = Object.values(newdata);
                // this.arrayholder = imagesArray;
                console.log("imagesRaay", imagesArray);
                setItems(imagesArray);
              }
            });
        } else {
          database()
            .ref("/users")
            .orderByChild("gender")
            .equalTo("male")
            .once("value")
            .then((dataSnapshot) => {
              let newdata = dataSnapshot.val();
              if (dataSnapshot.val()) {
                let imagesArray = Object.values(newdata);
                // this.arrayholder = imagesArray;
                console.log("imagesRaay", imagesArray);
                setItems(imagesArray);
              }
            });
        }
      });
  }, []);

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

  const connect = (item) => {
    let acceptedArray = [];
    database()
      .ref("requests")
      .once("value")
      .then((dataSnapshot) => {
        var arr = [];
        dataSnapshot.forEach((child) => {
          //  console.group("child", child.val());
          if (
            auth().currentUser.uid == child.val().receiverId ||
            auth().currentUser.uid == child.val().senderId
          ) {
            arr.push(1);
          }
        });

        // console.group("length", arr.length);
        if (arr.length == 0) {
          database()
            .ref("/requests")
            .push({
              senderId: user.id,
              receiverId: item.id,
              senderName: user.username,
              receiverName: item.username,
              senderImage: user.image,
              receiverImage: item.image,
              senderEmail: user.email,
              receiverEmail: item.email,
              isAccepted: 0,
            });
          Alert.alert("Request Send Successfully");
        } else {
          Alert.alert("Already Sent Request");
        }
      });
  };
  // console.log("item", items);
  return (
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
              <ThemedText styleKey="highlightTextColor" style={style.textStyle}>
                {constants.backText}
              </ThemedText>
            </View>
          </TouchableOpacity>
          <View style={[style.topContainer, style.titleContainer]}>
            <ThemedText
              styleKey="highlightTextColor"
              style={[style.textStyle, style.titleStyle]}
            >
              {constants.matching}
            </ThemedText>
          </View>
          <Swiper
            cards={items}
            renderCard={(card) => {
              // console.log("card", items);
              return (
                <View style={style.card}>
                  <Image
                    source={{
                      uri: image !== card.image ? card.image : girlImageUri,
                    }}
                    style={style.imageCard}
                  />
                  <ThemedText styleKey="cardTextColor" style={style.text}>
                    {card ? card.username : null}
                  </ThemedText>
                  <View style={style.childContainer}>
                    <TouchableOpacity>
                      <TouchableOpacity
                        style={style.cardContent}
                        onPress={() => contact(card)}
                      >
                        <ThemedText
                          styleKey="highlightTextColor"
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          View Contact
                        </ThemedText>
                      </TouchableOpacity>
                    </TouchableOpacity>

                    <TouchableOpacity>
                      <TouchableOpacity
                        style={style.cardContent}
                        onPress={() => connect(card)}
                      >
                        <ThemedText
                          styleKey="highlightTextColor"
                          style={{ fontWeight: "bold", textAlign: "center" }}
                        >
                          Send Interest
                        </ThemedText>
                      </TouchableOpacity>
                    </TouchableOpacity>
                  </View>
                  <ThemedText styleKey="cardTextColor" style={style.text}>
                    {"age"}
                  </ThemedText>
                </View>
              );
            }}
            onSwiped={(cardIndex) => {
              // console.log(cardIndex);
            }}
            onSwipedAll={() => {
              console.log("onSwipedAll");
            }}
            cardIndex={0}
            useViewOverflow={Platform.OS === "ios"}
            backgroundColor={"transparent"}
            stackSize={4}
            // infinite
            cardStyle={{ paddingTop: 70 }}
          />
          <View style={style.bottomContainer}>
            <View style={style.bottomContent}>
              <View style={style.childContainer}>
                <View style={style.iconContainer}>
                  <TouchableOpacity>
                    <Image source={cross} style={style.logoImage} />
                  </TouchableOpacity>
                </View>
                <View style={style.iconContainer}>
                  <TouchableOpacity onPress={goToMatched}>
                    <Image source={chat} style={style.specialStyle} />
                  </TouchableOpacity>
                </View>
                <View style={style.iconContainer}>
                  <TouchableOpacity onPress={() => contact(card)}>
                    <Image source={heart} style={style.logoImage} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ImageBackground>
      </ScrollView>
      <FooterNavigation history={history} />
      <BannerAd unitId={'ca-app-pub-3671018146205481/6356719663'} size={BannerAdSize.FULL_BANNER}/>
    </View>
  );
};

export default Matching;

interface Style {
  mainContainer: ViewStyle;
  imageStyle: ImageStyle;
  topContainer: ViewStyle;
  leftContainer: ViewStyle;
  rightContainer: ViewStyle;
  backContainer: ViewStyle;
  titleContainer: ViewStyle;
  bottomContainer: ViewStyle;
  bottomContent: ViewStyle;
  childContainer: ViewStyle;
  iconContainer: ViewStyle;
  backIcon: ViewStyle;
  textStyle: TextStyle;
  titleStyle: TextStyle;
  logoImage: ImageStyle;
  specialStyle: ImageStyle;
  imageCard: ImageStyle;
  card: ViewStyle;
  text: ViewStyle;
  cardIcon: ViewStyle;
  cardContent: ViewStyle;
  Icon: TextStyle;
}

const style: Style = StyleSheet.create<Style>({
  mainContainer: {
    flex: 1,
    padding: 0,
    margin: 0,
    fontSize: 16,
    justifyContent: "center",
    flexDirection: "column",
  },
  imageStyle: {
    width: "100%",
    height: 830,
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
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 25,
  },
  textStyle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 10,
    zIndex: 9999,
  },
  titleStyle: {
    fontSize: 32,
    textTransform: "capitalize",
  },
  titleContainer: {
    marginTop: 0,
    marginBottom: 30,
  },
  card: {
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "flex-start",
    backgroundColor: "white",
    width: "100%",
    height: 470,
  },
  text: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    marginTop: 20,
    backgroundColor: "transparent",
  },
  logoImage: {
    justifyContent: "center",
    width: 90,
    height: 90,
  },
  specialStyle: {
    width: 60,
    height: 60,
    marginTop: 20,
  },
  bottomContent: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iconContainer: {
    margin: 12,
    minWidth: 50,
    height: 50,
    borderRadius: 50,
  },
  bottomContainer: {
    alignItems: "flex-end",
    flexDirection: "row",
    justifyContent: "flex-end",
    position: "absolute",
    bottom: 125,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imageCard: {
    width: "100%",
    height: 300,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  Icon: {
    justifyContent: "center",
  },
  cardIcon: {
    backgroundColor: "#fc5660",
    width: 37,
    height: 23,
    borderRadius: 20,
    marginTop: 5,
    paddingTop: 3,
    paddingLeft: 10,
  },
  cardContent: {
    justifyContent: "center",
    backgroundColor: "#fc5660",
    width: 107,
    height: 43,
    borderRadius: 20,
    marginTop: 5,
    paddingTop: Platform.OS === "ios" ? 3 : 1,
    marginLeft: 10,
  },
});
