import React from "react";
import "./SoftwareSkill.scss";
import { skillsSection } from "../../portfolio";

export default function SoftwareSkill() {
  return (
    <div>
      <div className="software-skills-main-div">
        <div className="d-flex">
          <div className="">
            <ul className="dev-icons">
            <h6>Frontend</h6>
              {skillsSection?.frontend?.map((skills, i) => {
                return (
                    <li
                      key={i}
                      className="software-skill-inline"
                      name={skills.skillName}
                    >
                      <i className={skills.fontAwesomeClassname}></i>
                      <p>{skills.skillName}</p>
                    </li>
                );
              })}
            </ul>
          </div>
          <div className="box-outer">
            <ul className="dev-icons">
            <h6>Blockchain</h6>
              {skillsSection?.blockchain?.map((skills, i) => {
                return (
                  <li
                    key={i}
                    className="software-skill-inline"
                    name={skills.skillName}
                  >
                    <i className={skills.fontAwesomeClassname}></i>
                    <p>{skills.skillName}</p>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="r">
            <ul className="dev-icons">
            <h6>Backend</h6>
              {skillsSection?.backend?.map((skills, i) => {
                return (
                  <li
                    key={i}
                    className="software-skill-inline"
                    name={skills.skillName}
                  >
                    <i className={skills.fontAwesomeClassname}></i>
                    <p>{skills.skillName}</p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
