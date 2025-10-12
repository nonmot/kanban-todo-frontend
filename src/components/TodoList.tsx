"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import type { Todo } from "@/app/types/todo";
import apiClient from "@/lib/apiClient";
import TodoCard from "./TodoCard";
import TodoForm from "./TodoForm";

export default function TodoList() {
	const router = useRouter();

	const [todos, setTodos] = useState<Todo[]>([]);

	const { data: session, status } = useSession();

	useEffect(() => {
		if (status === "unauthenticated") router.push("/api/auth/signin");
	}, [status, router]);

	// biome-ignore lint/correctness/useExhaustiveDependencies(session.accessToken): suppress dependency session.accessToken
	// biome-ignore lint/correctness/useExhaustiveDependencies(router.push): suppress dependency router.push
	useEffect(() => {
		if (status !== "authenticated" || !session?.user) return;

		const fetchTodos = async () => {
			try {
				const res = await apiClient<Todo[]>(
					`api/todos/all/${session.user.id}`,
					{
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${session.accessToken}`,
						},
					},
				);
				if (!res.ok && (res.status === 401 || res.status === 403))
					router.push("/api/auth/signin");
				if (!res.ok) return;
				const data = res.data;
				setTodos(data);
			} catch (error) {
				console.error(error);
			}
		};

		fetchTodos();
	}, [status, session?.user]);

	const removeTodo = (id: string) => {
		try {
			const _res = apiClient(`api/todos/${id}`, {
				method: "DELETE",
				headers: {
					Authorization: `Bearer ${session?.accessToken}`,
				},
			});
		} catch (error) {
			console.log(error);
			return;
		}
		setTodos((prev) => prev.filter((x) => x.id !== id));
	};

	const addTodo = async (todo: Todo) => {
		try {
			const res = await apiClient<Todo>(`api/todos/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${session?.accessToken}`,
				},
				body: JSON.stringify({
					title: todo.title,
					status: "TODO",
					authorId: session?.user.id,
					content: "",
					deadline: new Date(Date.now()),
				}),
			});
			if (!res.ok) {
				console.error(res.message);
			} else {
				const newTodo = res.data;
				setTodos([...todos, newTodo]);
			}
		} catch (error) {
			console.error(error);
		}
	};

	if (status === "loading") return <p>Loading...</p>;
	if (status === "unauthenticated") return null;

	return (
		<div>
			<TodoForm todos={todos} setTodos={setTodos} onCreate={addTodo} />
			<ul className="divide-y divide-gray-400">
				{todos?.map((todo) => (
					<TodoCard todo={todo} key={todo.id} onDelete={removeTodo} />
				))}
			</ul>
		</div>
	);
}
