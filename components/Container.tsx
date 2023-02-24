import { motion } from 'framer-motion'
import { css } from '@emotion/react'

type Props = {
	children: React.ReactNode,
	large?: boolean
}

const Container = ({ children, large = false }: Props) => {
	return (
		<>
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
			>
				<div css={large ? largeStyle : defaultStyle}>
					{children}
				</div >
			</motion.div>
		</>
	)
}

export default Container

const defaultStyle = css`
	width: 92%;
	max-width: 1152px;
	margin: 0 auto;
`

const largeStyle = css`
	${defaultStyle}
	max-width: 1280px;
`
