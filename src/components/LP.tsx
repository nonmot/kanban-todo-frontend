export default async function LP() {
	return (
		<div>
			{/* Hero */}
			<section className="relative overflow-hidden border-b">
				<div className="mx-auto max-w-6xl px-4 py-20 grid gap-12 md:grid-cols-2 items-center">
					<div>
						<h1 className="text-4xl md:text-5xl font-semibold leading-tight">
							シンプルさ最優先の
							<span className="block">TODO管理</span>
						</h1>
						<p className="mt-5 text-gray-600 text-lg">
							入力・整理・完了の3ステップ。余計な機能は排除し、チームでも個人でも使える最小限の体験を提供します。
						</p>
						<form className="mt-8 flex w-full max-w-lg items-center gap-2">
							<input
								type="email"
								required
								placeholder="メールアドレス"
								className="w-full rounded-xl border px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gray-900"
							/>
							<button
								type="button"
								className="shrink-0 rounded-xl bg-gray-900 px-5 py-3 text-white hover:bg-black"
							>
								無料で開始
							</button>
						</form>
						<p className="mt-3 text-xs text-gray-500">
							クレジットカード不要・30秒で完了
						</p>
					</div>

					{/* Mock UI */}
					<div className="relative">
						<div className="rounded-2xl border shadow-sm overflow-hidden">
							<div className="flex items-center gap-2 bg-gray-50 px-4 py-3 border-b">
								<span className="h-3 w-3 rounded-full bg-red-400"></span>
								<span className="h-3 w-3 rounded-full bg-yellow-400"></span>
								<span className="h-3 w-3 rounded-full bg-green-400"></span>
								<span className="ml-3 text-sm text-gray-500">TodoLite</span>
							</div>
							<div className="p-4 md:p-6">
								<div className="flex items-center gap-3">
									<input
										type="text"
										placeholder="タスクを追加"
										className="w-full rounded-lg border px-3 py-2 text-sm"
									/>
									<button
										type="button"
										className="rounded-lg bg-gray-900 px-3 py-2 text-sm text-white"
									>
										追加
									</button>
								</div>
								<ul className="mt-4 space-y-3">
									{[
										"要件定義を確定",
										"UIのワイヤー作成",
										"バックエンドAPIのエンドポイント設計",
										"E2Eテスト計画",
									].map((t: string) => (
										<li
											key={t}
											className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
										>
											<label className="flex items-center gap-2">
												<input
													type="checkbox"
													className="size-4 rounded border-gray-300"
												/>
												<span>{t}</span>
											</label>
											<span className="text-xs text-gray-500">今日</span>
										</li>
									))}
								</ul>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}
