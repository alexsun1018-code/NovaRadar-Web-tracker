import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ComingSoonPage from "@/components/sections/ComingSoonPage";

export default function EsgPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ComingSoonPage titleKey="esg" variant="esg" />
      </main>
      <Footer />
    </>
  );
}
