import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ComingSoonPage from "@/components/sections/ComingSoonPage";

export default function InvestorsPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ComingSoonPage titleKey="investors" variant="investors" />
      </main>
      <Footer />
    </>
  );
}
