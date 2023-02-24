import Meta from 'components/Meta'
import Container from 'components/Container'
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from 'components/TwoColumn'
import PostBody from 'components/PostBody'

const Blog = () => {
	return (
		<Container>
			<Meta pageTitle="ブログ" />
			<TwoColumn>
				<TwoColumnMain>
					<PostBody>
						<p>ブログ投稿一覧ページです</p>
					</PostBody>
				</TwoColumnMain>
				<TwoColumnSidebar>
				</TwoColumnSidebar>
			</TwoColumn>
		</Container >
	)
}

export default Blog
