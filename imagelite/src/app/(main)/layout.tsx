'use client';

import { ExitIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/resources";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto mt-8 px-4">{children}</main>
      <Footer />
    </div>
  );
}

function Header() {
  const auth = useAuth;
  const router = useRouter();

  const logout = () => {
    auth.clearSession();
    router.push("/auth");
  }
  
  return (
    <header className="bg-zinc-900 text-white py-3">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/">
          <h1 className="text-3xl font-bold">ImageLite</h1>
        </Link>

        <ExitIcon className="w-6 h-6 p-1 rounded cursor-pointer hover:bg-zinc-700" onClick={logout} />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="bg-zinc-900 text-white py-4 mt-5">
      <div className="container mx-auto text-center">
        <p>
          © {new Date().getFullYear()} ImageLite. All rights reserved.
          <br />
          <small className="text-zinc-600">
            Desenvolvido por José P. C. Homenhuck
          </small>
        </p>
      </div>
    </footer>
  );
}
