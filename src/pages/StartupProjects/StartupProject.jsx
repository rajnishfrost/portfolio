import React, { useContext, useRef, useState } from "react";
import "./StartupProjects.scss";
import { bigProjects } from "../../portfolio";
import { Fade } from "react-reveal";
import StyleContext from "../../contexts/StyleContext";

export default function StartupProject() {
  const containerRef = useRef(null);
  const [projectFilter, setProjectFilter] = useState(bigProjects?.projects);

  function openUrlInNewTab(url) {
    if (!url) {
      return;
    }
    var win = window.open(url, "_blank");
    win.focus();
  }

  const { isDark } = useContext(StyleContext);
  if (!bigProjects.display) {
    return null;
  }

  const scrollLeft = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft -= 300; // Adjust scroll amount as needed
    }
  };

  const scrollRight = () => {
    if (containerRef.current) {
      containerRef.current.scrollLeft += 300; // Adjust scroll amount as needed
    }
  };

  const selectHandle = (e) => {
    if (e.target.value === "All")
      return setProjectFilter(bigProjects?.projects)
      setProjectFilter(bigProjects?.projects?.filter((data) =>{ return data.category === e.target.value}));
  }

  return (
    <Fade left duration={1000}>
      <div className="main" id="projects">
        <div>
          <h1 className="skills-heading">{bigProjects.title}</h1>
          <p
            className={
              isDark
                ? "dark-mode project-subtitle"
                : "subTitle project-subtitle"
            }
          >
            {bigProjects.subtitle}
          </p>
          <select  name="" id="" onChange={(e) => selectHandle(e)}>
            <option value="All" >All</option>
            {
              bigProjects?.projects?.filter((obj, index, self) => index === self.findIndex((t) => (t.category === obj.category)))?.map((d) => {
                return (
                  <option value={d?.category}>{d?.category}</option>
                )
              })
            }
          </select>
          <div className="d-flex justify-between angleContainer">
            <i className="fas fa-angle-left " style={{ fontSize: "40px" }} onClick={scrollLeft}></i>
            <i className="fas fa-angle-right " style={{ fontSize: "40px" }} onClick={scrollRight}></i>
          </div>
          <div className="projects-container" ref={containerRef}>
            {projectFilter.map((project, i) => {
              return (
                <div
                  key={i}
                  className={
                    isDark
                      ? "dark-mode project-card project-card-dark"
                      : "project-card project-card-light"
                  }
                >
                  {project.image ? (
                    <div className="project-image">
                      <img
                        src={project.image}
                        alt={project.projectName}
                        className="card-image"
                      ></img>
                    </div>
                  ) : null}
                  <div className="project-detail">
                    <h5
                      className={isDark ? "dark-mode card-title" : "card-title"}
                    >
                      {project.projectName}
                    </h5>
                    <p
                      className={
                        isDark ? "dark-mode card-subtitle" : "card-subtitle"
                      }
                    >
                      {project.projectDesc}
                    </p>
                    {project.footerLink ? (
                      <div className="project-card-footer">
                        {project.footerLink.map((link, i) => {
                          return (
                            <span
                              key={i}
                              className={
                                isDark ? "dark-mode project-tag" : "project-tag"
                              }
                              onClick={() => openUrlInNewTab(link.url)}
                            >
                              {link.name}
                            </span>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Fade>
  );
}
