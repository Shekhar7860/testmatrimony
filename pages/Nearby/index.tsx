import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-native";
import { Dispatch } from "redux";
import {
  View,
  ViewStyle,
  StyleSheet,
  TextStyle,
  Image,
  Text,
  ImageStyle,
  ImageBackground,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { AppConstants, AppTheme } from "../../config/DefaultConfig";
import ThemedText from "../../components/UI/ThemedText";
import useConstants from "../../hooks/useConstants";
import useTheme from "../../hooks/useTheme";
import MaterialIcon from "react-native-vector-icons/MaterialCommunityIcons";
import FooterNavigation from "../Footer/Index";
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import RoundButton from "../../components/Base/RoundButton";

// @ts-ignore
const ImagePath = require("../../images/dual-tone.png");
const search = require("../../images/search.png");
const profile1 = require("../../images/new-boy.jpg");
const profile2 = require("../../images/new-profile.jpg");
const girlImageUri =
  "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";
interface Props extends RouteComponentProps {
  dispatch: Dispatch;
  history: any;
}

const Nearby: React.FunctionComponent<Props> = ({ history }: Props) => {
  const constants: AppConstants = useConstants();
  const theme: AppTheme = useTheme();
  const [requests, setRequests] = useState([]);

  const backButton = () => {
    history.push("/matching");
  };
  useEffect(() => {
    let requestsArray = [];
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
                loggedIn.val().id == child.val().receiverId &&
                child.val().isAccepted == 0
              ) {
                let obj = {};
                //  console.group("key", child.key);
                //  child.val().requestKey = "test";
                obj.key = child.val();
                obj.requestKey = child.key;
                // console.group("obj", obj);
                requestsArray.push(obj);
              }
            });

            // console.log("requests", requestsArray);
            setRequests(requestsArray);

            // setImage(dataSnapshot.val().image);
          });
      });
  }, []);

  const accept = (selected) => {
    console.log("sel", selected);

    database()
      .ref("/requests")
      .child(selected.requestKey)
      .update({
        isAccepted: 1,
      });
  };

  const reject = (selected) => {
    database()
      .ref("/requests")
      .child(selected.requestKey)
      .remove();
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
        <Text style={style.toolbarTitle}>Received Requests</Text>
        <Text style={style.toolbarButton} />
      </View>
      <View style={style.mainContainer}>
        {requests.length !== 0 ? (
          <FlatList
            data={requests}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity style={style.row}>
                  <View style={{ width: "5%" }} />
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={{
                        uri: item ? item.key.senderImage : girlImageUri,
                      }}
                      style={style.imageStyle}
                    />
                  </View>
                  <View style={{ width: "5%" }} />
                  <View style={{ justifyContent: "center" }}>
                    <Text>{item.key.senderName}</Text>
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
                      label={constants.labelConfirm}
                      buttonColor={theme.appColor}
                      labelStyle={theme.highlightTextColor}
                      onPress={() => accept(item)}
                    />
                  </View>

                  <View style={{ width: "40%" }}>
                    <RoundButton
                      buttonStyle={style.signButton}
                      label={constants.labelReject}
                      buttonColor={theme.appColor}
                      labelStyle={theme.highlightTextColor}
                      onPress={() => reject(item)}
                      //onPress={goToHome}
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
      {/* <ImageBackground source={ImagePath} style={style.imageStyle}>
          <View style={style.backContainer}>
            <TouchableOpacity  onPress={backButton}>
              <View style={style.leftContainer}>
                <MaterialIcon name="chevron-left-circle-outline" size={30} color={theme.highlightTextColor} style={style.backIcon}/>
              </View>
            </TouchableOpacity>
            <View style={style.centerContainer}>
              <View style={style.childContainer}>
                <View style={style.leftContainer}>
                  <ThemedText style={style.leftStyle} styleKey="lightBottomColor">{constants.discover}</ThemedText>
                </View>
                <View style={[style.rightContainer, {paddingRight: 0,}]}>
                  <ThemedText style={style.rightStyle} styleKey="highlightTextColor">{constants.nearby}</ThemedText>
                </View>
              </View>
            </View>
            <View style={style.rightContainer}>
              <Image source={search} style={style.searchStyle}/>
            </View>
          </View>
          <View style={style.childContainer}>
            <View style={[style.leftContainer, {paddingRight: 10, }]}>
              <View style={[style.container, {backgroundColor: theme.backgroundColor}]}>
                <Image source={profile1} style={style.profileStyle}/>
                <ThemedText style={style.textStyle} styleKey="textColor">Aaron</ThemedText>
                <ThemedText style={style.smallStyle} styleKey="textColor">26, los angles</ThemedText>
              </View>
            </View>
            <View style={[style.rightContainer, {paddingRight: 0, paddingLeft: 10}]}>
              <View style={[style.container, {backgroundColor: theme.backgroundColor}]}>
                <Image source={profile2} style={style.profileStyle}/>
                <ThemedText style={style.textStyle} styleKey="textColor">Jennifer</ThemedText>
                <ThemedText style={style.smallStyle} styleKey="textColor">2.1 Washington (88)</ThemedText>
              </View>
            </View>
          </View>
          <View style={style.childContainer}>
            <View style={[style.leftContainer, {paddingRight: 10, }]}>
              <View style={[style.container, {backgroundColor: theme.backgroundColor}]}>
                <Image source={profile1} style={style.profileStyle}/>
                <ThemedText style={style.textStyle} styleKey="textColor">Aaron</ThemedText>
                <ThemedText style={style.smallStyle} styleKey="textColor">26, los angles</ThemedText>
              </View>
            </View>
            <View style={[style.rightContainer, {paddingRight: 0, paddingLeft: 10}]}>
              <View style={[style.container, {backgroundColor: theme.backgroundColor}]}>
                <Image source={profile2} style={style.profileStyle}/>
                <ThemedText style={style.textStyle} styleKey="textColor">Jennifer</ThemedText>
                <ThemedText style={style.smallStyle} styleKey="textColor">2.1 Washington (88)</ThemedText>
              </View>
            </View>
          </View>
        </ImageBackground>
        <FooterNavigation history={history} />     */}
    </>
  );
};

export default Nearby;

interface Style {
  toolbar: ViewStyle;
  toolbarButton: ViewStyle;
  toolbarTitle: ViewStyle;
  container: ViewStyle;
  mainContainer: ViewStyle;
  childContainer: ViewStyle;
  leftContainer: ViewStyle;
  centerContainer: ViewStyle;
  rightContainer: ViewStyle;
  backContainer: ViewStyle;
  backIcon: ViewStyle;
  textStyle: TextStyle;
  smallStyle: TextStyle;
  leftStyle: TextStyle;
  rightStyle: TextStyle;
  imageStyle: ImageStyle;
  searchStyle: ImageStyle;
  extraStyle: ViewStyle;
  profileStyle: ImageStyle;
  signButton: ViewStyle;
  row: ViewStyle;
}

const style: Style = StyleSheet.create<Style>({
  container: {
    fontSize: 16,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    borderRadius: 20,
    marginTop: 40,
  },
  mainContainer: {
    flex: 1,
    flexDirection: "column",
  },
  leftContainer: {
    flex: 0,
    justifyContent: "flex-start",
  },
  rightContainer: {
    flex: 0,
    justifyContent: "flex-end",
    paddingRight: 20,
  },
  centerContainer: {
    flex: 3,
    justifyContent: "center",
    paddingTop: 20,
  },
  backContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  backIcon: {
    fontSize: 25,
    paddingTop: 20,
    paddingLeft: 20,
  },
  childContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  imageStyle: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchStyle: {
    justifyContent: "center",
    width: 20,
    height: 20,
  },
  textStyle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    alignSelf: "center",
    paddingTop: 10,
  },
  smallStyle: {
    fontSize: 14,
    textAlign: "center",
    alignSelf: "center",
    paddingBottom: 15,
  },
  leftStyle: {
    fontSize: 20,
    textAlign: "left",
    paddingRight: 10,
    fontWeight: "bold",
  },
  rightStyle: {
    fontSize: 20,
    textAlign: "right",
    textDecorationLine: "underline",
    fontWeight: "bold",
    paddingLeft: 10,
  },
  extraStyle: {
    marginLeft: 30,
    marginRight: 30,
    borderRadius: 40,
    paddingBottom: 40,
    height: 200,
  },
  profileStyle: {
    width: 180,
    height: 220,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  signButton: {
    minWidth: 100,
    marginTop: 30,
  },
  row: {
    flexDirection: "row",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#bdc3c7",
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
