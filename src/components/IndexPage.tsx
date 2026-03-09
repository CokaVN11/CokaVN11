import { Footer } from "./Footer.tsx";
import { HeroTitle } from "./HeroTitle.tsx";
import { InsertCoin } from "./InsertCoin.tsx";

export default function IndexPage() {
  return (
    <div className="crt-canvas crt-flicker flex flex-col items-center justify-center min-h-screen">
      <div className="flex-1 my-auto flex flex-col items-center justify-around text-center gap-16">
        <HeroTitle title="BREAKOUT PORTFOLIO" />
        <InsertCoin />
      </div>
      <Footer className="w-full" type="PLAY" />
    </div>
  );
}
