import SectionFrame from "../../components/SectionFrame";
import {
  DuneScene,
  DrayvoMark,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./art";
import "./DuneSixteen.css";

// Copy adapted to Arango Lands; each link points at a section of this page.
const COLUMNS = [
  { title: "Empresa", links: [["Servicios", "#servicios"], ["Cómo trabajamos", "#proceso"], ["Proyectos", "#proyectos"]] },
  { title: "Cotiza", links: [["Calculadora", "#cotizar"], ["Visita técnica", "#cotizar"]] },
  { title: "Legal", links: [["Privacidad", "#"], ["Términos", "#"]] },
];

const BASE = import.meta.env.BASE_URL;

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: TwitterIcon, label: "Twitter" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedInIcon, label: "LinkedIn" },
];

export default function DuneSixteen() {
  return (
    <>
    {/* Wide screens: the authored 1600x900 canvas, unchanged. */}
    <div className="d16-wide">
    <SectionFrame id="dune-sixteen" background="#fafafa">
      <div className="d16">
        {/* back plane — the same frame pushed in, so the land behind the
            card reads as distance rather than empty sky */}
        <div className="d16__scene">
          <DuneScene />
          <img className="d16__photo d16__photo--back" src={`${BASE}images/dunes.jpg`} alt="" aria-hidden="true" />
        </div>

        <div className="d16__card">
          <div className="d16__top">
            <div className="d16__brand">
              <DrayvoMark />
              <span>ARANGO LANDS</span>
            </div>

            <div className="d16__cols">
              {COLUMNS.map(({ title, links }) => (
                <nav className="d16__col" key={title}>
                  <h4>{title}</h4>
                  <ul>
                    {links.map(([link, href]) => (
                      <li key={link}>
                        <a href={href}>{link}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          </div>

          <span className="d16__rule" />

          <div className="d16__bottom">
            <span className="d16__copy">&copy; 2026 Arango Lands. Pavimentos y vías.</span>

            <div className="d16__socials">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <a className="d16__social" href="#" key={label} aria-label={label}>
                  <Icon />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* front plane — a background-removed cutout, so the dune silhouette
            itself overlaps the card rather than a rectangle of image */}
        <div className="d16__front" aria-hidden="true">
          <img className="d16__frontImg" src={`${BASE}images/dunes-front.webp`} alt="" />
        </div>
      </div>
    </SectionFrame>
    </div>

    {/* Narrow screens: the canvas would shrink the card to unreadable 3px text,
        so the same photo and card are laid out at real size instead. */}
    <section className="d16m" aria-label="Arango Lands">
      <img className="d16m__photo" src={`${BASE}images/dunes.jpg`} alt="" aria-hidden="true" />
      <div className="d16m__card">
        <div className="d16__brand">
          <DrayvoMark />
          <span>ARANGO LANDS</span>
        </div>
        <div className="d16m__cols">
          {COLUMNS.map(({ title, links }) => (
            <nav className="d16__col" key={title}>
              <h4>{title}</h4>
              <ul>
                {links.map(([link, href]) => (
                  <li key={link}>
                    <a href={href}>{link}</a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <span className="d16__rule" />
        <div className="d16m__bottom">
          <span className="d16__copy">&copy; 2026 Arango Lands. Pavimentos y vías.</span>
          <div className="d16__socials">
            {SOCIALS.map(({ icon: Icon, label }) => (
              <a className="d16__social" href="#" key={label} aria-label={label}>
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
    </>
  );
}
