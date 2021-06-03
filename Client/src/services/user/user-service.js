function saveTokenToLocalStorage(data) {
  localStorage.setItem("JWT_TOKEN", data.normalLogin.token);
}

function saveGoogleTokenToLocalStorage(data) {
  localStorage.setItem("GOOGLE_TOKEN", data.createUserFromGoogleAuth.token);
}

module.exports = { saveTokenToLocalStorage, saveGoogleTokenToLocalStorage };