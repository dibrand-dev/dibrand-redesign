import Header from "./_components/Header";
import Hero from "./_components/Hero";
import TopTasks from "./_components/TopTasks";
import Discover from "./_components/Discover";
import News from "./_components/News";
import Footer from "./_components/Footer";
import FloatingAssistant from "./_components/FloatingAssistant";

export default function EscobarPage() {
  return (
    <>
      <Header />
      <main className="w-full pt-[120px] flex-1">
        <Hero />
        <TopTasks />
        <Discover />
        <News />
      </main>
      <FloatingAssistant />
      <Footer />
    </>
  );
}
