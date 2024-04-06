import React, { useEffect, useState } from 'react';
import Navbar from '../../common_component/navbar/Navbar';
import Skills from '../skills/Skills';
import { StyleProvider } from "../../contexts/StyleContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { splashScreen } from '../../portfolio';
import "./Main.scss";
import Greeting from '../greeting/Greeting';
import StartupProject from "../StartupProjects/StartupProject"
import Profile from "../profile/Profile"
import Top from "../topbutton/Top";
import loadingHand from "../../assets/lottie/loadingHand.json";
import DisplayLottie from '../../common_component/displayLottie/DisplayLottie';

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
            <div className='loading-hand-outer'>
              <div className='loading-hand-inner'>
                <DisplayLottie animationData={loadingHand} />
              </div>
            </div>
            :
            <>
              <Navbar />
              <Greeting />
              <Skills />
              <StartupProject />
              <Profile />
              <Top />
            </>

        }
      </StyleProvider>
    </div>
  )
}
