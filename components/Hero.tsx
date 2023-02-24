import Image from 'next/image'
import portrait from 'images/portrait.png'
import { css } from '@emotion/react'

type Props = {
	title: string,
	subtitle: string,
	imageOn?: boolean
}

const Hero = ({ title, subtitle, imageOn = false }: Props) => {
	return (
		<>
			<div css={wrapperStyle}>
				{imageOn &&
					(
						<figure css={imageStyle}>
							<Image
								src={portrait}
								alt=""
								style={{
									width: '100%',
									height: 'auto',
								}}
								priority
							/>
						</figure>
					)
				}
				<div css={textStyle}>
					<h1 css={titleStyle}>{title}</h1>
					<p css={subtitleStyle}>{subtitle}</p>
				</div>
			</div>
		</>
	)
}

export default Hero

const wrapperStyle = css`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 3em;
	text-align: center;

 	@media (min-width: 768px) {
		flex-direction: row;
		justify-content: space-between;
		text-align: left;
	}
`

const imageStyle = css`
	width: 100%;

	 @media (min-width: 768px) {
		width: 50%;
	}
`

const textStyle = css`
	padding-top: calc(var(--display) * 0.5);
	padding-bottom: calc(var(--display) * 0.7);
`

const titleStyle = css`
	font-size: var(--display);
	font-weight: 900;
	letter-spacing: 0.15em;
`

const subtitleStyle = css`
	font-size: var(--small-heading2);
`
