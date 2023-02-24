import Container from 'components/Container'
import Meta from 'components/Meta'
import { TwoColumn, TwoColumnMain, TwoColumnSidebar } from 'components/TwoColumn'
import PostBody from 'components/PostBody'

const Home: React.FC = () => {
	return (
		<Container large>
			<Meta />
			<TwoColumn>
				<TwoColumnMain>
					<PostBody>
						<p>トップページです</p>
					</PostBody>
				</TwoColumnMain>
				<TwoColumnSidebar>
				</TwoColumnSidebar>
			</TwoColumn>
		</Container>
	)
}

export default Home
