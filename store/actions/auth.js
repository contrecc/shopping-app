import AsyncStorage from "@react-native-async-storage/async-storage";

export const AUTHENTICATE = "AUTHENTICATE";
export const LOGOUT = "LOGOUT";

let timer;

export const authenticate = (token, userId, expiryTime) => {
  return (dispatch) => {
    dispatch(setLogoutTimer(expiryTime));
    dispatch({ type: AUTHENTICATE, token, userId });
  };
};

export const signup = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAjPm5dWe2LbVUaaoWbHmqJtX_EMrIHSG0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error.message;
      let message = "Something went wrong while signing up.";

      if (errorMessage === "EMAIL_EXISTS") {
        message = "This email is already taken.";
      }
      throw new Error(message);
    }

    const data = await response.json();
    console.log(data);

    dispatch(
      authenticate(data.idToken, data.localId, parseInt(data.expiresIn) * 1000)
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn) * 1000
    );
    saveDataToStorage(data.idToken, data.localId, expirationDate);
  };
};

export const login = (email, password) => {
  return async (dispatch) => {
    const response = await fetch(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAjPm5dWe2LbVUaaoWbHmqJtX_EMrIHSG0",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
          returnSecureToken: true,
        }),
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.error.message;
      let message = "Something went wrong while logging in";

      if (errorMessage === "EMAIL_NOT_FOUND") {
        message = "This email could not be found.";
      } else if (errorMessage === "INVALID_PASSWORD") {
        message = "You have entered an invalid password.";
      }
      throw new Error(message);
    }

    const data = await response.json();
    console.log(data);

    dispatch(
      authenticate(data.idToken, data.localId, parseInt(data.expiresIn) * 1000)
    );
    const expirationDate = new Date(
      new Date().getTime() + parseInt(data.expiresIn) * 1000
    );
    saveDataToStorage(data.idToken, data.localId, expirationDate);
  };
};

export const logout = () => {
  clearLogoutTimer();
  AsyncStorage.removeItem("userData");
  return { type: LOGOUT };
};

export const clearLogoutTimer = () => {
  if (timer) {
    clearTimeout(timer);
  }
};

export const setLogoutTimer = (expirationTime) => {
  return (dispatch) => {
    timer = setTimeout(() => {
      dispatch(logout());
    }, expirationTime);
  };
};

const saveDataToStorage = (token, userId, expirationDate) => {
  AsyncStorage.setItem(
    "userData",
    JSON.stringify({
      token,
      userId,
      expiryDate: expirationDate.toISOString(),
    })
  );
};
