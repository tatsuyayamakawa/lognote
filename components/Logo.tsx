import Link from 'next/link'
import { siteMeta } from 'lib/constants'
const { siteTitle } = siteMeta
import { css } from '@emotion/react'

const Logo = () => {
	return (
		<>
			<Link href='/' css={logoStyle}>
				{siteTitle}
			</Link>
		</>
	)
}

export default Logo

const logoStyle = css`
	font-size: var(--heading2);
	font-weight: 700;
	letter-spacing: 0.15em;
	padding: 1em 0;
`
