import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Bot, BarChart2, ShieldCheck } from 'lucide-react';
import Logo from '@/components/common/Logo';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const features = [
  {
    icon: <ShieldCheck className="h-8 w-8 text-primary" />,
    title: 'Secure Authentication',
    description: 'User registration and login with password encryption and secure session management.',
  },
  {
    icon: <CheckCircle className="h-8 w-8 text-primary" />,
    title: 'AI-Powered Verification',
    description: 'Utilize Google Cloud Document AI for validation and authenticity scoring.',
  },
  {
    icon: <BarChart2 className="h-8 w-8 text-primary" />,
    title: 'Verification History',
    description: 'Display verification results, authenticity scores, and a detailed verification history.',
  },
  {
    icon: <Bot className="h-8 w-8 text-primary" />,
    title: 'AI Chatbot Assistance',
    description: 'An AI-powered chatbot provides users with real-time support and guidance.',
  },
];

const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <Logo />
            </Link>
          </div>
          <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
            {/* Future nav links can go here */}
          </nav>
          <div className="flex items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tighter md:text-5xl lg:text-6xl">
                Secure, Free, AI-Powered Identity Verification
              </h1>
              <p className="max-w-[700px] text-lg text-muted-foreground">
                AI-NaMo offers a robust platform to verify government-issued ID documents with confidence, powered by cutting-edge AI.
              </p>
              <div className="flex gap-4">
                <Button size="lg" asChild>
                  <Link href="/signup">Get Started for Free</Link>
                </Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="relative h-full min-h-[300px] w-full overflow-hidden rounded-lg">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  fill
                  className="object-cover"
                  data-ai-hint={heroImage.imageHint}
                />
              )}
               <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
            </div>
          </div>
        </section>

        <section id="features" className="container space-y-6 bg-secondary py-12 md:py-24 lg:py-32 rounded-lg">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
            <h2 className="font-headline text-3xl font-bold leading-[1.1] sm:text-3xl md:text-5xl">
              Features
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Everything you need to build trust and ensure compliance.
            </p>
          </div>
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <Card key={feature.title} className="text-center">
                <CardHeader>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <footer className="container py-8">
        <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Logo />
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} AI-NaMo. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
