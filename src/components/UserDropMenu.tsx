"use client";
import Image from "next/image";
import Link from "next/link";
import type { User } from "next-auth";
import { useState } from "react";

type Props = {
	user: User;
};

export default function UserDropMenu(props: Props) {
	const { user } = props;

	const [isOpen, setIsOpen] = useState(false);

	const onClick = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div>
			<button
				className="relative h-9 w-9 rounded-full ring-offset-4 ring-2 ring-gray-300 transition focus-visible:ring-gray-500 inline-flex items-center justify-center"
				onClick={onClick}
				type="button"
			>
				<Image
					src="/user.svg"
					alt="user"
					width={30}
					height={30}
					className="object-cover rounded-full"
				/>
			</button>
			{isOpen ? (
				<div className="absolute overflow-hidden right-16 border border-gray-200 shadow-lg px-3 py-2 rounded-lg">
					<p className="font-medium my-1">{user.name}</p>
					<div className="border-t border-gray-300" />
					<Link
						href="/api/auth/signout"
						className="cursor-pointer block text-red-500 my-1"
					>
						Logout
					</Link>
				</div>
			) : undefined}
		</div>
	);
}
