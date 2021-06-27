function saveTokenToLocalStorage(data) {
  if (data.normalLogin)
    localStorage.setItem("JWT_TOKEN", data.normalLogin.token);
  else
    localStorage.setItem("JWT_TOKEN", data.createUserFromGoogleAuth.token);
}

module.exports = { saveTokenToLocalStorage };