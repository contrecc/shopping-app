import Product from "../../models/product";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";

export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";
export const SET_PRODUCTS = "SET_PRODUCTS";

export const deleteProduct = (productId) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://react-native-project-3773e-default-rtdb.firebaseio.com/products/${productId}.json?auth=${token}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred when deleting a product.");
    }
    dispatch({ type: DELETE_PRODUCT, pid: productId });
  };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    // Can write any asynchronous code here that will complete before sending the action to the store.
    let pushToken;
    const statusObject = await Permissions.getAsync(Permissions.NOTIFICATIONS);
    if (statusObject.status !== "granted") {
      const updatedStatusObject = await Permissions.askAsync(
        Permissions.NOTIFICATIONS
      );
      if (updatedStatusObject !== "granted") {
        pushToken = null;
      } else {
        const updatedResponse = await Notifications.getExpoPushTokenAsync();
        pushToken = updatedResponse.data;
      }
    } else {
      const response = await Notifications.getExpoPushTokenAsync();
      pushToken = response.data;
    }

    const response = await fetch(
      `https://react-native-project-3773e-default-rtdb.firebaseio.com/products.json?auth=${token}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          price,
          ownerId: userId,
          ownerPushToken: pushToken,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred when creating a new product.");
    }

    const data = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: data.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
        ownerId: userId,
        pushToken: pushToken,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://react-native-project-3773e-default-rtdb.firebaseio.com/products/${id}.json?auth=${token}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          imageUrl,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("An error occurred when updating the product.");
    }

    dispatch({
      type: UPDATE_PRODUCT,
      pid: id,
      productData: {
        title: title,
        description: description,
        imageUrl: imageUrl,
      },
    });
  };
};

export const fetchProducts = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        "https://react-native-project-3773e-default-rtdb.firebaseio.com/products.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const loadedProducts = [];

      for (const key in data) {
        loadedProducts.push(
          new Product(
            key,
            data[key].ownerId,
            data[key].ownerPushToken,
            data[key].title,
            data[key].imageUrl,
            data[key].description,
            data[key].price
          )
        );
      }

      dispatch({
        type: SET_PRODUCTS,
        products: loadedProducts,
        userProducts: loadedProducts.filter((prod) => prod.ownerId === userId),
      });
    } catch (error) {
      throw error;
    }
  };
};
