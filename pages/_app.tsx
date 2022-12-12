import '../styles/globals.css'
import type { AppProps } from 'next/app'
import PidContext from '../src/context/processContext'
import { useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [pid, setPid] = useState(null)
  console.log("pid: ", pid)
  return <PidContext.Provider value={{pid, setPid}}><Component {...pageProps} /></PidContext.Provider>
}
