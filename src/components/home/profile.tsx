import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { FaInstagram, FaYoutube } from "react-icons/fa";

export function Profile() {
	return (
		<div className="rounded-lg border bg-card p-6">
			<h3 className="mb-4 text-lg font-bold">プロフィール</h3>
			<div className="space-y-4">
				<div className="flex items-center gap-4">
					<div className="h-16 w-16 rounded-full overflow-hidden shrink-0">
						<Image
							src="/profile.png"
							alt="Tatsuya Yamakawa"
							width={64}
							height={64}
							className="h-full w-full object-cover"
						/>
					</div>
					<div>
						<p className="font-semibold">Tatsuya Yamakawa</p>
						<p className="text-sm text-muted-foreground">
							ブログ運営者 / 整体師
						</p>
					</div>
				</div>

				<p className="text-sm leading-relaxed text-muted-foreground">
					身体を整え、思考を整え、コードを書く。日常の気づき、技術の学び、そして創造のプロセスを発信しています。
				</p>

				<p className="text-sm leading-relaxed text-muted-foreground">
					お問い合わせは当整体サロンのお問い合わせフォームからお願い致します。
				</p>

				<div className="flex flex-wrap items-center gap-3">
					<Link
						href="https://bodycare-yumin.com"
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors hover:bg-muted"
					>
						手もみ整体 癒眠
						<ExternalLink className="h-3 w-3" />
					</Link>
					<div className="flex items-center gap-2">
						<Link
							href="https://www.instagram.com/bodycare_yumin"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
							aria-label="Instagram"
						>
							<FaInstagram className="h-5 w-5" />
						</Link>
						<Link
							href="https://www.youtube.com/@bodycare-yumin"
							target="_blank"
							rel="noopener noreferrer"
							className="inline-flex items-center justify-center rounded-full p-2 transition-colors hover:bg-muted"
							aria-label="YouTube"
						>
							<FaYoutube className="h-5 w-5" />
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
