import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { NavigationActions } from "react-navigation";

import ShopNavigator from "./ShopNavigator";

const NavigationContainer = (props) => {
  const isAuth = useSelector((state) => !!state.auth.token);
  const navigationReference = useRef();

  useEffect(() => {
    if (!isAuth) {
      navigationReference.current.dispatch(
        NavigationActions.navigate({ routeName: "Auth" })
      );
    }
  }, [isAuth]);
  return <ShopNavigator ref={navigationReference} />;
};

export default NavigationContainer;
