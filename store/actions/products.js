export const DELETE_PRODUCT = "DELETE_PRODUCT";
export const CREATE_PRODUCT = "CREATE_PRODUCT";
export const UPDATE_PRODUCT = "UPDATE_PRODUCT";

export const deleteProduct = (productId) => {
  return { type: DELETE_PRODUCT, pid: productId };
};

export const createProduct = (title, description, imageUrl, price) => {
  return async (dispatch) => {
    // Can write any asynchronous code here that will complete before sending the action to the store.
    const response = await fetch(
      "https://react-native-project-3773e-default-rtdb.firebaseio.com/products.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description, imageUrl, price }),
      }
    );

    const data = await response.json();

    dispatch({
      type: CREATE_PRODUCT,
      productData: {
        id: data.name,
        title: title,
        description: description,
        imageUrl: imageUrl,
        price: price,
      },
    });
  };
};

export const updateProduct = (id, title, description, imageUrl) => {
  return {
    type: UPDATE_PRODUCT,
    pid: id,
    productData: {
      title: title,
      description: description,
      imageUrl: imageUrl,
    },
  };
};
