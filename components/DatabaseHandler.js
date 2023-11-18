import firestore from '@react-native-firebase/firestore';
import DataHandler from './DataHandler';
let username = "";

function setUsername(userParam) {
    username = userParam;
}

function getUsername() {
  return username;
}

function addUser(userParam) {
    firestore()
        .collection('Users')
        .add({
            username: userParam,
            families: [userParam]
        })
        .then(() => {
            username = userParam
        })
}

function updateUser(dispParam) {
  firestore()
    .collection('Users')
    .where('username','==', DataHandler.getUsername())
    .get()
    .then((querySnapshot) => {
      if(!querySnapshot.empty) {
        firestore
          .collection('Users')
          .doc(querySnapshot[0])
          .get()
          .update({
            dispFam: dispParam,
          })
          .then(() => {
            
          })
      }
    })
}

function joinFamily(code, retFun, codeError) {
  firestore()
    .collection('Families')
    .where('joinCode','==', code)
    .get()
    .then(querySnapshot => {
      if (querySnapshot.empty) {
        codeError()
      } else {
        firestore()
          .collection('Families')
          .doc(querySnapshot.docs[0].id)
          .update({
            members: firestore.FieldValue.arrayUnion(username)
          }).then((docSnap) => { 
            retFun(querySnapshot.docs[0]);
          })
        }
    });
}

function createFamily(name, retFun) {
  const existingCodes = [];

  firestore()
    .collection('Families')
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        existingCodes.push(doc.data().joinCode)
      })
      
      /* create code */
      var code = existingCodes[0];
      while (existingCodes.includes(code)) {
        var result = ''
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        while (result.length < 6) {
          result += characters.charAt(Math.random() * characters.length)
        }
        code = result;
      }
  
      /* create family */
      firestore()
        .collection('Families')
        .add({
          joinCode: code,
          name: name,
          members: [username],
        })
        .then((docSnap) => {
          retFun(docSnap);
        })  
    })
}

function leaveFamily(family, retFun) {
  console.log(family)
  firestore()
    .collection('Items')
    .where('requestUser','==',username)
    .where('family','==',family.key)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete()
      })
      if (family.members.length > 1) {
        firestore()
          .collection('Families')
          .doc(family.key)
          .update({
            members: firestore.FieldValue.arrayRemove(username)
          })
          .then(() => {
            retFun()
          })
      } else {
        firestore()
          .collection('Families')
          .doc(family.key)
          .delete()
          .then(() => {
            retFun()
          })
      }
    })
}

function updateItem(props, name, count, measurment, notes, checkBox) {
  firestore()
    .collection('Items')
    .doc(props.id)
    .update({
      name: name,
      count: +count,
      measurment: measurment,
      notes: notes,
      isNote: checkBox,
    })
    .then(() => {
      props.onSubmit();
    })
}

function updatePurchase(id, checkBox, retFun) {
  firestore()
    .collection('Items')
    .doc(id)
    .update({
      isPurchased: !checkBox,
    })
    .then(() => {
      retFun();
    })
}

function addItem(props, name, count, measurment, notes, checkBox, returnFunction) {
  firestore()
    .collection('Items')
    .add({
      name: name,
      count: +count,
      measurment: measurment,
      notes: notes,
      isNote: checkBox,
      requestUser: username,
      isPurchased: false,
      family: props.family ? props.family : username
    })
    .then(() => {
      returnFunction()
    })
}

function deleteItem(id, retFun) {
  firestore()
    .collection('Items')
    .doc(id)
    .delete()
    .then(() => {
      retFun()
    });
}

function getFamilies(returnFunction) {
  firestore()
    .collection('Families')
    .where('members','array-contains',username)
    .get()
    .then((querySnapshot) => {
      const families = [username];

      if (querySnapshot.empty) {
        returnFunction(families);
      } else {
        querySnapshot.forEach((item) => {
          families.push({
            ...item.data(),
            key: item.id
          })
        })

        returnFunction(families)
      }
    })
}

export default {
    addUser,
    createFamily,
    joinFamily,
    leaveFamily,
    getFamilies,
    updateItem,
    addItem,
    setUsername,
    deleteItem,
    updatePurchase,
    getUsername,
    updateUser,
}