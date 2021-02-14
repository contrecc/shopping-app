export const ADD_ORDER = "ADD_ORDER";

export const addOrder = (cartItems, totalAmount) => {
  return async (dispatch) => {
    const date = new Date();
    const response = await fetch(
      "https://react-native-project-3773e-default-rtdb.firebaseio.com/orders/u1.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartItems,
          totalAmount,
          date: date.toISOString(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred when adding an order.");
    }

    const data = await response.json();

    dispatch({
      type: ADD_ORDER,
      orderData: { id: data.name, items: cartItems, amount: totalAmount, date },
    });
  };
};
