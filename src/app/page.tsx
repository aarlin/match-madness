import Image from 'next/image'
import logo from '../../public/logo.svg';
import { MatchMadnessGame } from '../components/MatchMadnessGame';
import { GameModeSelection } from '@/components/GameModeSelection';
import { CustomGameModal } from '@/components/CustomGameModal';

export default function Home() {


  return (
    <main className="flex flex-col items-center justify-between p-12">
      <div className="z-10 w-full max-w-5l items-center justify-between font-mono text-sm lg:flex mb-25">
        <Image
          priority
          src={logo}
          alt="Match Madness"
        />
        <div
          className="gap-2 p-8 lg:p-0 fixed bottom-0 left-0 flex h-48 w-full place-items-center justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <GameModeSelection/>
        </div>
      </div>

      <div className="relative max-h-screen flex place-items-center">
        <MatchMadnessGame />
      </div>

      <CustomGameModal/>
    </main>
  )
}
