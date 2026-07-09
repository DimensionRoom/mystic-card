import Header from "../components/Header";
import HeroBanner from "../components/HeroBanner";
import DeckShelf from "../components/DeckShelf";
import RecentReadings from "../components/RecentReadings";
import UniverseMessage from "../components/UniverseMessage";
import RandomCard from "../components/RandomCard";
import { useAppNavigate } from "../router/useAppNavigate";

export default function HomePage() {
  const navigate = useAppNavigate();

  return (
    <div className="flex flex-col gap-8">
      {/* keep header above the hero illustration's witch-hat overflow */}
      <div className="relative z-10">
        <Header onNavigate={navigate} />
      </div>
      <HeroBanner onNavigate={navigate} />
      <DeckShelf onNavigate={navigate} />

      <section
        aria-label="กิจกรรมและข้อความสำหรับคุณ"
        className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-[1.75fr_1.35fr_1fr]"
      >
        <RecentReadings onNavigate={navigate} />
        <UniverseMessage />
        <div className="md:col-span-2 xl:col-span-1">
          <RandomCard onNavigate={navigate} />
        </div>
      </section>
    </div>
  );
}
