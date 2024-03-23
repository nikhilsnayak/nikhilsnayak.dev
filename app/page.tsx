import { Css, Html, Js, NodeJs } from "@/assets/icons";
import { IntroSection } from "@/components/intro-section";

export default function Home() {
  return (
    <div>
      <main>
        <IntroSection />
        <section className="about" id="about">
          <h2 className="section-title section-title-about">Get to Know Me</h2>
          <p className="about-content">
            As an ambitious and motivated graduate, I have developed a strong
            foundation in web development despite not having a computer science
            background. I have a deep understanding of both front-end and
            backend development, which allows me to create comprehensive web
            solutions. My ability to adapt to new technologies and my
            proficiency in debugging errors make me a quick learner. My passion
            for web development has led me to acquire the knowledge and skills
            that are essential in the field. I am eager to continue learning and
            expanding my skillset, and I believe that my adaptability and
            willingness to learn make me a valuable asset to any development
            team.
          </p>
          <div className="skills">
            <h3 className="subsection-title">Skills :</h3>
            <ul className="skills-list">
              <li className="skills-list-item">
                <Html />
              </li>
              <li className="skills-list-item">
                <Css />
              </li>
              <li className="skills-list-item">
                <Js />
              </li>
              <li className="skills-list-item">
                <NodeJs />
              </li>
            </ul>
          </div>
          <div className="education">
            <h3 className="subsection-title">Education :</h3>
            <ul className="education-list">
              <li className="education-list-item">
                UG -
                <strong>
                  Alva`&apos`s Institute of Engineering and Technology
                </strong>
                (2023)
              </li>
              <li className="education-list-item">
                PUC -<strong>BEML Composite PU College</strong>
                (2019)
              </li>
            </ul>
          </div>
        </section>

        <section className="projects" id="projects">
          <h2 className="section-title section-title-projects">
            The Work I Have Done
          </h2>
          <div className="projects-container"></div>
        </section>
      </main>
    </div>
  );
}
