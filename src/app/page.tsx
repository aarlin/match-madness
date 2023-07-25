import { MatchMadnessGame } from '../components/MatchMadnessGame';
import { CustomGameModal } from '@/components/CustomGameModal';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-row">
        <main className="flex-1  p-4">
          <div className="relative max-h-screen flex justify-center place-items-center">
            <MatchMadnessGame />
          </div>
          <CustomGameModal />
        </main>
        <nav className="order-first w-32 p-4"></nav>
        <aside className="w-32  p-4"></aside>
      </div>
    </div>
  )
}
