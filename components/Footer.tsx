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
	background-color: var(--gray-10);
	margin-top: auto;
	padding: var(--space-xl) 0;
	border-top: 1px solid var(--color-border);
`

const innerStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 2em;
`
