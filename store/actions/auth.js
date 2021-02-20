export const SIGNUP = "SIGNUP";
export const LOGIN = "LOGIN";

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

    dispatch({ type: SIGNUP, token: data.idToken, userId: data.localId });
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

    dispatch({ type: LOGIN, token: data.idToken, userId: data.localId });
  };
};
