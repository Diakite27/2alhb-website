import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import Events from "@/components/Events";
import Partners from "@/components/Partners";
import RegisterForm from "@/components/RegisterForm";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import PageLoader from "@/components/PageLoader";
import WaveSeparator from "@/components/WaveSeparator";
import StickyCTA from "@/components/StickyCTA";

export default function Home() {
  return (
    <>
      <PageLoader />
      <Navbar />
      <main>
        <Hero />
        <About />
        <WaveSeparator from="#f9fafb" to="#ffffff" />
        <Testimonials />
        <WaveSeparator from="#ffffff" to="#f9fafb" />
        <Events />
        <WaveSeparator from="#f9fafb" to="#ffffff" />
        <Partners />
        <RegisterForm />
        <WaveSeparator from="#366042" to="#ffffff" flip />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <StickyCTA />
    </>
  );
}
