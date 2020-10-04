import React, { useState, useCallback, useEffect } from "react";

import { GiftedChat } from "react-native-gifted-chat";
import auth from "@react-native-firebase/auth";
import database from "@react-native-firebase/database";

export default function Chat(props) {
  const girlImageUri =
    "https://i.picsum.photos/id/1027/200/300.jpg?hmac=WCxdERZ7sgk4jhwpfIZT0M48pctaaDcidOi3dKSHJYY";
  const [messages, setMessages] = useState([]);
  // const location = useLocation();
  const [receiverId, setReceiverId] = useState("");
  const [receiverName, setReceiverName] = useState("");
  const [receiverImage, setReceiverImage] = useState("");
  const [image, setImage] = useState(girlImageUri);
  const [name, setName] = useState("");

  useEffect(() => {
    // alert("hiiiii");
    console.log("data", props.location.state.detail);
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

    if (props.location.state.detail.key !== undefined) {
      if (
        props.location.state.detail.key.receiverId !== auth().currentUser.uid
      ) {
        // alert("m working");
        setReceiverId(props.location.state.detail.key.receiverId);
        setReceiverName(props.location.state.detail.key.receiverName);
        setReceiverImage(props.location.state.detail.key.receiverImage);
      } else {
        // alert(props.location.state.detail.key.senderId);
        setReceiverId(props.location.state.detail.key.senderId);
        setReceiverName(props.location.state.detail.key.senderName);
        setReceiverImage(props.location.state.detail.key.senderImage);
      }
    } else {
      if (props.location.state.detail.receiverId !== auth().currentUser.uid) {
        // alert("m working");
        setReceiverId(props.location.state.detail.receiverId);
        setReceiverName(props.location.state.detail.receiverName);
        setReceiverImage(props.location.state.detail.receiverImage);
      } else {
        alert(props.location.state.detail.senderId);
        setReceiverId(props.location.state.detail.senderId);
        setReceiverName(props.location.state.detail.senderName);
        setReceiverImage(props.location.state.detail.senderImage);
      }
    }

    // alert()
    checkFirebaseMessages(receiverId);
  }, []);

  useEffect(() => {
    console.log("receiverId2", receiverId);

    database()
      .ref("/messages")
      .child(chatID(auth().currentUser.uid, receiverId))
      .once("value")
      .then((dataSnapshot) => {
        setMessages(Object.values(dataSnapshot.val()));
      });
  }, [receiverId]);

  useEffect(() => {
    console.log("receiverId2", receiverId);

    database()
      .ref("/messages")
      .child(chatID(auth().currentUser.uid, receiverId))
      .once("value")
      .then((dataSnapshot) => {
        setMessages(Object.values(dataSnapshot.val()));
      });
  }, [messages]);

  const checkFirebaseMessages = (receiverId) => {};
  const chatID = (senderId, receiverId) => {
    const chatterID = senderId;
    const chateeID = receiverId;
    const chatIDpre = [];
    chatIDpre.push(chatterID);
    chatIDpre.push(chateeID);
    chatIDpre.sort();
    return chatIDpre.join("_");
  };

  const onSend = (messages) => {
    console.log(
      "senderId",
      auth().currentUser.uid,
      "receiverId",
      receiverId,
      messages
    );
    database()
      .ref("/messages")
      .child(chatID(auth().currentUser.uid, receiverId))
      .push({
        _id : auth().currentUser.uid,
        senderId: auth().currentUser.uid,
        receiverId: receiverId,
        senderName: name,
        receiverName: receiverName,
        text: messages[0].text,
        receiverImage: receiverImage,
        senderImage: image,
        user: {
          _id: auth().currentUser.uid,
          name:  name,
          avatar: image,
        },
      });
    database()
      .ref("/lastmessages")
      .child(chatID(auth().currentUser.uid, receiverId))
      .update({
        _id : auth().currentUser.uid,
        senderId: auth().currentUser.uid,
        receiverId: receiverId,
        senderName: name,
        receiverName: receiverName,
        message: messages[0].text,
        receiverImage: receiverImage,
        senderImage: image,
        user: {
          _id: auth().currentUser.uid,
          name:  name,
          avatar: image,
        },
      });

    database()
      .ref("/messages")
      .child(chatID(auth().currentUser.uid, receiverId))
      .once("value")
      .then((dataSnapshot) => {
        console.group("this is message", dataSnapshot.val());
        setMessages(Object.values(dataSnapshot.val()));
      });
  };
  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: auth().currentUser.uid,
      }}
    />
  );
}
