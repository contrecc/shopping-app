export const SIGNUP = "SIGNUP";

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
      throw new Error("An error occurred during signup");
    }

    const data = await response.json();
    console.log(data);

    dispatch({ type: SIGNUP });
  };
};
