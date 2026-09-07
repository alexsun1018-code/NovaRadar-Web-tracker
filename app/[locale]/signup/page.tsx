import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ComingSoonPage from "@/components/sections/ComingSoonPage";

export default function SignupPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <ComingSoonPage titleKey="signup" variant="auth" />
      </main>
      <Footer />
    </>
  );
}
