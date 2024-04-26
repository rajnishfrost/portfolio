import React, { useContext, useEffect, useState } from "react";
import "./Contact.scss";
import SocialMedia from "../../common_component/socialMedia/SocialMedia";
import { illustration, contactInfo } from "../../portfolio";
import { Fade } from "react-reveal";
import darkPointer from "../../assets/lottie/darkPointer.json";
import lightPointer from "../../assets/lottie/lightPointer.json";
import DisplayLottie from "../../common_component/displayLottie/DisplayLottie";
import StyleContext from "../../contexts/StyleContext";

export default function Contact() {
  const { isDark } = useContext(StyleContext);
  const [lottie, setLottie] = useState();

  useEffect(() => {
    if (isDark)
      setLottie(lightPointer)
    setLottie(darkPointer)
  }, [isDark])

  return (
    <Fade bottom duration={1000} distance="20px">
      <div className="main contact-margin-top" id="contact">
        <div className="contact-div-main">
          <div className="contact-image-div" style={{marginTop : "-150px"}}>
            {illustration.animated ? (
              <DisplayLottie animationData={lottie} />
            ) : (
              <img
                alt="Man working"
                src={require("../../assets/images/contactMailDark.svg")}
              ></img>
            )}
          </div>
          <div className="contact-header">
            <h1 className="heading contact-title">{contactInfo.title}</h1>
            <p
              className={
                isDark
                  ? "dark-mode contact-subtitle"
                  : "subTitle contact-subtitle"
              }
            >
              {contactInfo.subtitle}
            </p>
            <div
              className={
                isDark ? "dark-mode contact-text-div" : "contact-text-div"
              }
            >
              {contactInfo.number && (
                <>
                  <a
                    className="contact-detail"
                    href={"tel:" + contactInfo.number}
                  >
                    {contactInfo.number}
                  </a>
                  <br />
                  <br />
                </>
              )}
              <a
                className="contact-detail-email"
                href={"mailto:" + contactInfo.email_address}
              >
                {contactInfo.email_address}
              </a>
              <br />
              <br />
              <SocialMedia />
            </div>
          </div>
        </div>
      </div>
    </Fade>
  );
}
