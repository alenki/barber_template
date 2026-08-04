import { Hero } from "@/components/sections/Hero";
import { Manifesto } from "@/components/sections/Manifesto";
import { Services } from "@/components/sections/Services";
import { Ritual } from "@/components/sections/Ritual";
import { Chairs } from "@/components/sections/Chairs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Locations } from "@/components/sections/Locations";
import { JournalStrip } from "@/components/sections/JournalStrip";
import { BookFaq } from "@/components/sections/BookFaq";

/**
 * The long scroll. Slabs alternate espresso → paper → espresso → paper → ink,
 * so the page reads as a sequence of posters rather than a stack of cards.
 */
export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <Services />
      <Ritual />
      <Chairs />
      <Testimonials />
      <Locations />
      <JournalStrip />
      <BookFaq />
    </>
  );
}
