import Head from 'next/head'
import { useRouter } from 'next/router'

// サイトに関する情報
import { siteMeta } from 'lib/constants'
const { siteTitle, siteSubTitle, siteDesc, siteUrl, siteLocale, siteType, siteIcon } = siteMeta

// 汎用 OGP 画像
import siteImg from 'images/ogp.jpg'

type Props = {
	pageTitle?: string;
	pageDesc?: string;
	pageImg?: string;
	pageImgW?: number;
	pageImgH?: number;
}

const Meta = ({
	pageTitle,
	pageDesc,
	pageImg,
	pageImgW,
	pageImgH
}: Props) => {

	// ページのタイトル
	const title = pageTitle ? `${pageTitle} | ${siteTitle}` : `${siteTitle} - ${siteSubTitle}`

	// ページの説明
	const desc = pageDesc ?? siteDesc

	// ページのURL
	const router = useRouter()
	const url = `${siteUrl}${router.asPath}`

	// OGP 画像
	const img = pageImg || siteImg.src
	const imgW = pageImgW || siteImg.width
	const imgH = pageImgH || siteImg.height
	const imgUrl = img.startsWith('https') ? img : `${siteUrl}${img}`

	return (
		<>
			<Head>
				<title>{title}</title>
				<meta property="og:title" content={title} />
				<meta name="description" content={desc} />
				<meta property="og:description" content={desc} />
				<link rel="canonical" href={url} />
				<meta property="og:url" content={url} />
				<meta property="og:site_name" content={siteTitle} />
				<meta property="og:type" content={siteType} />
				<meta property="og:locale" content={siteLocale} />
				<link rel="icon" href={siteIcon} />
				<link rel="apple-touch-icon" href={siteIcon} />
				<meta property="og:image" content={imgUrl} />
				<meta property="og:image:width" content={String(imgW)} />
				<meta property="og:image:height" content={String(imgH)} />
				<meta name="twitter:card" content="summary_large_image" />
			</Head>
		</>
	)
}

export default Meta
