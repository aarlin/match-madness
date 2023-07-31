import { UnderConstruction } from "@/components/UnderConstruction";
import supabase from '@/utils/supabase'


export default async function Community() {
  // const { data: posts } = await supabase.from('posts').select()
  // return <pre>{JSON.stringify(posts, null, 2)}</pre>

  return (
    <div className="relative max-h-screen flex justify-center place-items-center">
      <UnderConstruction/>
    </div>
  )
}
