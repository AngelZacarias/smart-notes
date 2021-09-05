
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

class AuthenticationService {
    user = null;
    ORIGINAL_URL_COOKIE = "originalUrl";

    constructor() {
        dotenv.config();
        this.initializeUser();
    }

    async initializeUser() {
        const token = localStorage.getItem("JWT_TOKEN");
        if (token) {
            try {
                dotenv.config();
                this.user = jwt.verify(token, process.env.REACT_APP_JWT_KEY);
            } catch (err) {
                console.log(`Invalid/Expired token due to ${err}`);
            }
        }
    }

    /**
     * Get the previously authenticated user's info. 
     * @returns {Object} An object object with user's info.
     */
    getUser() {
        return this.user;
    }

    /**
      * Validates if the user has been previously authenticated succesfully.
      * 
      * @returns {boolean} true, if the user has been authenticated successfully  and if the user's session hasn't exipred yet,
      * otherwise false.
      */
    isLoggedIn() {
        return this.user != null && !this.user.expired;
    }

   
    /**
     * Begins the authentication process, this method redirects to w3id login page.
     */
    startAuthentication() {
        return this.userManager.signinRedirect();
    }

    /**
     * Finishes the authentication process, this method must be called once w3id redirects to the registered callback url, in order to save the user data.
     */
    async completeAuthentication() {
        this.user = await this.userManager.signinRedirectCallback();
    }

    /**
     * This method is used to store the original url that the user requested before being redirected to w3id login page, and 
     * navigate to it once authentication finishes.
     * 
     * @param originalUrl The original endpoint that the user requested before being redirected to w3id login page.
     */
    setOriginalUrl(originalUrl) {
        localStorage.setItem(this.ORIGINAL_URL_COOKIE, originalUrl);
    }

    /**
     * This method is useful after {@link this.completeAuthentication} method is called, in order to get the 
     * url that the user requested before being redirected to w3id login page, and then, get the user redirected to
     * it.
     */
    getOriginalUrl() {
        return localStorage.getItem(this.ORIGINAL_URL_COOKIE);
    }
}

export default AuthenticationService;