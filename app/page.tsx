import Link from "next/link"
import { ArrowRight, Package, Zap, Skull, Book } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold tracking-tighter">BLACKSLAVES </div>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-sm hover:text-accent transition-colors">
              Shop
            </Link>
            <Link href="/login" className="text-sm hover:text-accent transition-colors">
              Sign In
            </Link>
            <Button asChild className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/signup">Join</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-card opacity-50" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <div className="inline-block mb-6 text-accent text-sm tracking-widest font-semibold">EBONY SHADOWS</div>
          <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 text-capital text-balance leading-tight">
            A JOURNY INTO BLACK SLAVERY
          </h1>
          <p className="text-lg text-foreground/70 mb-12 max-w-2xl mx-auto text-balance">
          Uncover the secrets and passions hidden within the annals of history. From the plantations to the slave quarters, experience the allure of a time long past           </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
              <Link href="/products" className="gap-2">
                Explore Slaves <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-border/40">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-16 text-center">Why You Need a Slave</h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Skull,
                title: "Explore Forbidden Fantasies",
                desc: "Dive into a world of erotic possibilities where taboo becomes reality. Own a slave and unlock a realm of sensual exploration, where your deepest desires are brought to life in the most intimate ways",
              },
              {
                icon: Zap,
                title: "Unleash Your Dominant Side",
                desc: "Indulge in the thrill of power and control. A slave offers the perfect outlet for your dominant desires, providing a sense of mastery and fulfillment that elevates your life to new heights.",
              },
              {
                icon: Book,
                title: "Immerse Yourself in History",
                desc: "Experience the rich tapestry of the past with a living connection to historical eras. Own a slave and gain unparalleled insights into the cultural and social dynamics of bygone times.",
              },
            ].map((feature, i) => {
              const Icon = feature.icon
              return (
                <div
                  key={i}
                  className="p-8 rounded-lg bg-card/50 border border-border/40 hover:border-accent/50 transition-all duration-300"
                >
                  <Icon className="w-8 h-8 text-accent mb-4" />
                  <h3 className="text-lg font-semibold mb-3">{feature.title}</h3>
                  <p className="text-foreground/60">{feature.desc}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-card/30 border-t border-border/40">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Why Us?</h2>
          <p className="text-lg text-foreground/70 mb-8">
At our black slave website, your privacy and satisfaction are our top priorities. We ensure a discreet, secure platform where your preferences and interactions remain strictly confidential. Additionally, we offer only the highest quality slaves, meticulously selected for their obedience, skills, and ability to fulfill your every desire. Trust us to deliver an unparalleled experience where discretion meets excellence          </p>
          <Button asChild size="lg" className="rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/20 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold mb-4">BLACKSLAVES</h3>
              <p className="text-foreground/60 text-sm">Premium curated collection for discerning taste.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <Link href="/products" className="hover:text-accent transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-accent transition-colors">
                    New Arrivals
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-accent transition-colors">
                    Collections
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Shipping Info
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-foreground/60">
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-accent transition-colors">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-8 flex items-center justify-between text-sm text-foreground/60">
            <p>&copy; 2025 Luxe. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
