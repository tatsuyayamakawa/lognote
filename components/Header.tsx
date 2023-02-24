import Container from 'components/Container'
import Logo from 'components/Logo'
import Nav from 'components/Nav'
import ToggleDarkMode from 'components/ToggleDarkMode'
import { css } from '@emotion/react'

const Header = () => {
	return (
		<>
			<header css={wrapperStyle}>
				<Container large>
					<div css={innerStyle}>
						<Logo />
						<div css={navStyle}>
							<Nav />
							<ToggleDarkMode />
						</div>
					</div>
				</Container>
			</header>
		</>
	)
}

export default Header

const wrapperStyle = css`
	background-color: var(--color-header);
`

const innerStyle = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const navStyle = css`
	${innerStyle}
	justify-content: normal;
	gap: 2em;
`
