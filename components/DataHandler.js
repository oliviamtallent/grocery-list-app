let family = {}
let username = ""
let uID = ""
let dispFam = ""

function setUsername(userParam) {
  username = userParam;
}

function getUsername() {
  return username;
}

function getUID() {
  return uID;
}

function setUID(uidParam) {
  uID = uidParam;
}

function setFamily(familyParam) {
  family = familyParam;
}

function getFamily() {
  return family;
}

export default {
  getUsername,
  setUsername,
  getUID,
  setUID,
  setFamily,
  getFamily,
};