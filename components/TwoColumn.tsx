import { css } from '@emotion/react'

type Props = {
	children: React.ReactNode,
}

const TwoColumn = ({ children }: Props) => {
	return (
		<>
			<div css={columnStyle}>
				{children}
			</div>
		</>
	)
}

const TwoColumnMain = ({ children }: Props) => {
	return (
		<>
			<div css={mainStyle}>
				{children}
			</div>
		</>
	)
}

const TwoColumnSidebar = ({ children }: Props) => {
	return (
		<>
			<div css={sidebarStyle}>
				{children}
			</div>
		</>
	)
}

export { TwoColumn, TwoColumnMain, TwoColumnSidebar }

const columnStyle = css`
	display: flex;
	flex-direction: column;
	gap: var(--space-md);
	margin: var(--space-md) 0 var(--space-lg);

	@media (min-width: 768px) {
		flex-direction: row;
		justify-content: space-between;
	}
`

const mainStyle = css`
	@media (min-width: 768px) {
		width: 768px;
	}
`

const sidebarStyle = css`
	@media (min-width: 768px) {
		width: 240px;
		position: sticky;
		top: 40px;
		align-self: flex-start;

		* {
			text-align: right;
		}

		&:is(div, ul) {
			width: fit-content;
			margin-left: auto;
			place-items: flex-end;
			place-content: flex-end;
		}
	}
`
