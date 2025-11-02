import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import UserDropMenu from "./UserDropMenu";
import { SignInButton } from "./signin-button";

export default async function Header() {
	const session = await auth();

	const linkToHome = session?.user ? "/todos" : "/";

	return (
		<header className="flex items-center py-3">
			<h1 className="text-2xl font-bold">
				<Link href={linkToHome}>
					<Image src="/logo.svg" alt="logo" width={100} height={100} />
				</Link>
			</h1>
			<div className="ml-auto">
				{session?.user ? (
					<UserDropMenu user={session.user} />
				) : (
					<div className="flex">
						<nav className="hidden md:flex items-center gap-6 text-sm">
							<Link href="#features" className="hover:text-gray-600">
								機能
							</Link>
							<Link href="#pricing" className="hover:text-gray-600">
								料金
							</Link>
							<Link href="#faq" className="hover:text-gray-600">
								FAQ
							</Link>
              <SignInButton />
						</nav>
					</div>
				)}
			</div>
		</header>
	);
}
