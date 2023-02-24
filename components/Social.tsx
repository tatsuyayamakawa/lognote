import { snsId } from 'lib/constants'
import { FaInstagram, FaGithub } from 'react-icons/fa'
import { css } from '@emotion/react'

const Social = () => {
	return (
		<>
			<ul css={socialStyle}>
				<li>
					<a href={`https://www.instagram.com/${snsId.instagramId}`} target="_blank" rel="noopener noreferrer">
						<FaInstagram />
					</a>
				</li>
				<li>
					<a href={`https://github.com/${snsId.githubId}`} target="_blank" rel="noopener noreferrer">
						<FaGithub />
					</a>
				</li>
			</ul>
		</>
	)
}

export default Social

const socialStyle = css`
	display: flex;
	gap: 1.5em;
	font-size: 27px;
`
