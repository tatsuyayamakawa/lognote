import { css } from '@emotion/react'

/* 両端揃え */
export const spaceBetween = css`
	display: flex;
	justify-content: space-between;
	align-items: center;
`

/* 横並び（基本形） */
export const sideBySide = css`
	display: flex;
	flex-direction: column;

	@media (min-width: 768px) {
		flex-direction: row;
		justify-content: space-between;
	}
`

/* 横並び（中央揃え） */
export const sideBySideCenter = css`
	${sideBySide}
	align-items: center;
	text-align: center;

@media (min-width: 768px) {
		text-align: left;
	}
`
