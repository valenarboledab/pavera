import {Hero, Stats, Services, Process, Projects, Quote} from './sections/Pavera/Sections';
import {ReyardFooter} from './sections/Reyard/ReyardFooter';

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
      <ReyardFooter />
    </>
  );
}
