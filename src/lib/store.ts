import { createContext, useContext } from 'react'
import { createStore, useStore as useZustandStore } from 'zustand'


enum GameMode {
  HIRAGANA = 'hiragana',
  KATAKANA = 'katakana'
}
interface StoreInterface {
  gameMode: GameMode,
  lastUpdate: number
  light: boolean
  count: number
  tick: (lastUpdate: number, light: boolean) => void
  increment: () => void
  decrement: () => void
  reset: () => void
}

const getDefaultInitialState = () => ({
  gameMode: GameMode.HIRAGANA,
  lastUpdate: Date.now(),
  light: false,
  count: 0,
})

export type StoreType = ReturnType<typeof initializeStore>

const zustandContext = createContext<StoreType | null>(null)

export const Provider = zustandContext.Provider

export const useStore = <T>(selector: (state: StoreInterface) => T) => {
  const store = useContext(zustandContext)

  if (!store) throw new Error('Store is missing the provider')

  return useZustandStore(store, selector)
}

export const initializeStore = (
  preloadedState: Partial<StoreInterface> = {}
) => {
  return createStore<StoreInterface>((set, get) => ({
    ...getDefaultInitialState(),
    ...preloadedState,
    increment: () => {
      set({
        count: get().count + 1,
      })
    },
    decrement: () => {
      set({
        count: get().count - 1,
      })
    },
    reset: () => {
      set({
        count: getDefaultInitialState().count,
      })
    },
  }))
}
