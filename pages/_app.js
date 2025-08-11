import '../styles/globals.css'
import { AnimatePresence } from 'framer-motion'

function MyApp({ Component, pageProps }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <Component {...pageProps} />
    </AnimatePresence>
  )
}

export default MyApp