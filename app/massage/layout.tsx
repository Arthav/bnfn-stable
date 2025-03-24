export default function MassageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-2 md:py-10">
      <main className="container mx-auto max-w-7xl flex-grow">
        {children}
      </main>
    </section>
  );
}
