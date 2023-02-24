import { AnimatePresence } from 'framer-motion'
import Layout from 'components/Layout'
import 'styles/globals.css'

export default function App({ Component, pageProps, router }) {
	return (
		<AnimatePresence mode="wait">
			<Layout>
				<Component {...pageProps} key={router.route} />
			</Layout>
		</AnimatePresence>
	)
}
