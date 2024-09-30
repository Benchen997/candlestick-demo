import CandleStick from "@/components/CandleStick";

export default function Home() {
  return (
    <main className="flex justify-center items-center min-h-screen flex-col">
      <div className="w-4/5 h-ful border-t border-green-600 py-4">
        <CandleStick />
      </div>
    </main>
  );
}
