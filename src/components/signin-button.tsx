import { signIn } from "../lib/auth";

export function SignInButton() {
	return (
		<form
			action={async () => {
				"use server";
				await signIn("github", { redirectTo: "/todos" });
			}}
		>
			<button
				type="submit"
				className="bg-indigo-500 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-600"
			>
				Sign in
			</button>
		</form>
	);
}
