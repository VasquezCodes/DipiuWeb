import Hero from "./components/Hero";
import Products from "./components/Products";

export default function Home() {
  return (
    <main className="w-full bg-dipiu-beige min-h-screen">
      <Hero />

      <section id="intro-trigger" className="py-32 px-6 flex justify-center items-center bg-dipiu-beige">
        <div className="max-w-3xl text-center space-y-6">
          <p className="text-xl md:text-2xl font-serif text-dipiu-black leading-relaxed">
            "Brisbane City, Queensland 🇦🇺. <br />
            Handcrafted Tiramisu. Made with love."
          </p>
          <div className="h-px w-24 bg-dipiu-red mx-auto mt-8 opacity-50"></div>
        </div>
      </section>

      <Products />

      <footer className="py-8 bg-dipiu-red text-center text-dipiu-beige font-light text-sm uppercase tracking-widest">
        &copy; {new Date().getFullYear()} DiPiù. All Rights Reserved.
      </footer>
    </main>
  );
}
