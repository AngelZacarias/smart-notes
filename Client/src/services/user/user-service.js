function saveTokenToLocalStorage(data) {
  localStorage.setItem("JWT_TOKEN", data.normalLogin.token);
}

module.exports = { saveTokenToLocalStorage };