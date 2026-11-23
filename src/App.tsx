import {Hero, Stats, Services, Process, Projects, Quote} from './sections/Pavera/Sections';
import {ReyardFooter} from './sections/Reyard/ReyardFooter';
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
        <DuneSixteen />
        <Quote />
      </main>
      <ReyardFooter />
    </>
  );
}
