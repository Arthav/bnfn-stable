export default function LotteryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center">
      <div className="inline-block max-w-lg text-center justify-start">
        {children}
      </div>
    </section>
  );
}
