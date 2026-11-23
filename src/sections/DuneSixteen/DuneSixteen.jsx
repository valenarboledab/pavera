import SectionFrame from "../../components/SectionFrame";
import {
  DrayvoMark,
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "./art";
import "./DuneSixteen.css";

/* ---------------------------------------------------------------
   The site's single footer: the white card floating over the dune
   field with the road. It carries the closing line from the contact
   section ("Hablemos de tu vía."), the blurb, links and socials from
   the old desert footer, and the copyright.
--------------------------------------------------------------- */

const BASE = import.meta.env.BASE_URL;
const EMAIL = "hola@arangolands.com"; // placeholder: replace with the real address

const BLURB =
  "Pavimentos bien hechos desde la base, para vías, patios y espacios que se usan todos los días.";

const COLUMNS = [
  {
    title: "Arango Lands",
    links: [["Inicio", "#inicio"], ["Servicios", "#servicios"], ["Cómo trabajamos", "#proceso"], ["Proyectos", "#proyectos"], ["Cotizar", "#cotizar"]],
  },
  {
    title: "Servicios",
    links: [["Asfalto", "#servicios"], ["Concreto rígido", "#servicios"], ["Adoquín", "#servicios"], ["Concreto estampado", "#servicios"], ["Mantenimiento", "#servicios"]],
  },
  {
    title: "Legal",
    links: [["Privacidad", "#"], ["Términos", "#"], ["Garantía", "#"]],
  },
];

const SOCIALS = [
  { icon: FacebookIcon, label: "Facebook" },
  { icon: TwitterIcon, label: "X" },
  { icon: InstagramIcon, label: "Instagram" },
  { icon: LinkedInIcon, label: "LinkedIn" },
];

function Pitch() {
  return (
    <div className="d16f__pitch">
      <div className="d16__brand">
        <DrayvoMark />
        <span>ARANGO LANDS</span>
      </div>
      <p className="d16f__title">Hablemos de tu vía.</p>
      <p className="d16f__blurb">{BLURB}</p>
      <div className="d16f__cta">
        <a className="d16f__btn" href="#cotizar">
          Pedir visita técnica
          <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M4.5 11.5 11.5 4.5M6 4.5h5.5V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a className="d16f__email" href={`mailto:${EMAIL}`}>{EMAIL}</a>
      </div>
    </div>
  );
}

function Columns({ className }) {
  return (
    <div className={className}>
      {COLUMNS.map(({ title, links }) => (
        <nav className="d16__col" key={title} aria-label={title}>
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
  );
}

function Bottom({ className }) {
  return (
    <div className={className}>
      <span className="d16__copy">&copy; 2026 Arango Lands · Pavimentos y vías</span>
      <div className="d16__socials">
        {SOCIALS.map(({ icon: Icon, label }) => (
          <a className="d16__social" href="#" key={label} aria-label={label}>
            <Icon />
          </a>
        ))}
      </div>
    </div>
  );
}

export default function DuneSixteen() {
  return (
    <footer id="contacto">
      {/* Wide screens: the authored 1600x900 canvas. */}
      <div className="d16-wide">
        <SectionFrame id="dune-sixteen" background="#fafafa">
          <div className="d16">
            {/* back plane */}
            <div className="d16__scene">
              <img className="d16__photo d16__photo--back" src={`${BASE}images/dunes.jpg`} alt="" aria-hidden="true" />
            </div>

            <div className="d16__card d16f__card">
              <div className="d16f__top">
                <Pitch />
                <Columns className="d16f__cols" />
              </div>
              <span className="d16__rule" />
              <Bottom className="d16__bottom" />
            </div>

            {/* front plane: the dune cutout overlaps the card's lower edge */}
            <div className="d16__front" aria-hidden="true">
              <img className="d16__frontImg" src={`${BASE}images/dunes-front.webp`} alt="" />
            </div>
          </div>
        </SectionFrame>
      </div>

      {/* Narrow screens: the same card at real size, the road photo below it. */}
      <div className="d16m">
        <img className="d16m__photo" src={`${BASE}images/dunes.jpg`} alt="" aria-hidden="true" />
        <div className="d16m__card">
          <Pitch />
          <Columns className="d16m__cols" />
          <span className="d16__rule" />
          <Bottom className="d16m__bottom" />
        </div>
      </div>
    </footer>
  );
}
