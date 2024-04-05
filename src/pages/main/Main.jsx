import React, { useEffect, useState } from 'react';
import Loading from '../../common_component/loading/Loading';
import Navbar from '../../common_component/navbar/Navbar';
import { StyleProvider } from "../../contexts/StyleContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { splashScreen } from '../../portfolio';
import "./Main.scss";
import Greeting from './greeting/Greeting';

export default function Main() {
  const darkPref = window.matchMedia("(prefers-color-scheme: dark)");
  const [isDark, setIsDark] = useLocalStorage("isDark", darkPref.matches);
  const [isShowingSplashAnimation, setIsShowingSplashAnimation] = useState(true);

  useEffect(() => {
    if (splashScreen.enabled) {
      const splashTimer = setTimeout(
        () => setIsShowingSplashAnimation(false),
        splashScreen.duration
      );
      return () => {
        clearTimeout(splashTimer);
      };
    }
  }, []);
  const changeTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <div className={isDark ? "dark-mode" : null}>
      <StyleProvider value={{ isDark: isDark, changeTheme: changeTheme }}>
        {
          isShowingSplashAnimation && splashScreen.enabled
            ?
              <Loading />
            :
            <>
              <Navbar />
              <Greeting/>
            </>

        }
      </StyleProvider>
    </div>
  )
}