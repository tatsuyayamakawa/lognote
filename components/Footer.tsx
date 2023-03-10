import Container from 'components/Container'
import Logo from 'components/Logo'
import Social from "components/Social"
import { css } from '@emotion/react'

const Footer = () => {
	return (
		<footer css={wrapperStyle}>
			<Container>
				<div css={innerStyle}>
					<Logo />
					<Social />
				</div>
			</Container>
		</footer >
	)
}

export default Footer

const wrapperStyle = css`
	margin-top: auto;
	padding: var(--space-xl) 0;
`

const innerStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 2em;
`
