import { Navbar } from "./navbar";

export default async function MainLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="sticky top-0 z-50">
        <Navbar />
      </div>
      
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
