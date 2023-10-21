import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faGithub,
  faLinkedin,
  faTwitter,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import "./footer.css";
library.add(faGithub, faLinkedin, faTwitter, faInstagram);

function Footer() {
  return (
    <footer className="footer-bar">
      <ul className="footer-list">
        <li>
          <a
            href="https://www.github.com/fullstackin"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon icon={["fab", "github"]} className="footer-icon" />
          </a>
        </li>

        <li>
          <a
            href="https://www.linkedin.com/in/omarelsahlah"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "linkedin"]}
              className="footer-icon"
              style={{ color: "#ffffff" }}
            />
          </a>
        </li>
        <li>
          <a
            href="https://twitter.com/TallTechTitan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "twitter"]}
              className="footer-icon"
              style={{ color: "#ffffff" }}
            />
          </a>
        </li>

        <li>
          <a
            href="https://www.instagram.com/TallTechTitan"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={["fab", "instagram"]}
              className="footer-icon"
              style={{ color: "#ffffff" }}
            />
          </a>
        </li>
      </ul>
      <p className="footer-disclaimer">
        &copy; 2023 Omar El Sahlah. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
