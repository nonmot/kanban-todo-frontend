"use client";
import { SessionProvider } from "next-auth/react";
import TodoList from "@/components/TodoList";

export default function Page() {
	return (
		<SessionProvider>
			<div className="container mx-auto">
				<TodoList />
			</div>
		</SessionProvider>
	);
}
