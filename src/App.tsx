import {Hero, Stats, Services, Process, Projects, Quote} from './sections/Pavera/Sections';
import DuneSixteen from './sections/DuneSixteen/DuneSixteen';

export default function App() {
  return (
    <>
      <Hero />
      <main>
        <Stats />
        <Services />
        <Process />
        <Projects />
        <Quote />
      </main>
      <DuneSixteen />
    </>
  );
}
