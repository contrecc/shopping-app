export const ADD_ORDER = "ADD_ORDER";
export const SET_ORDERS = "SET_ORDERS";

import Order from "../../models/order";

export const fetchOrders = () => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        "https://react-native-project-3773e-default-rtdb.firebaseio.com/orders/u1.json"
      );

      if (!response.ok) {
        throw new Error(
          "An error occurred fetching the orders from the database."
        );
      }

      const data = await response.json();

      const loadedOrders = [];

      for (const key in data) {
        loadedOrders.push(
          new Order(
            key,
            data[key].cartItems,
            data[key].totalAmount,
            new Date(data[key].date)
          )
        );
      }

      dispatch({ type: SET_ORDERS, orders: loadedOrders });
    } catch (error) {
      throw error;
    }
  };
};

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
