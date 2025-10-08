"use client"
import apiClient from "@/lib/apiClient"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Todo } from "@/app/types/todo";

export default function TodoList() {

  const router = useRouter();

  const [todos, setTodos] = useState<Todo[]>([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    const fetchTodos = async () => {
      try {
        const res = await apiClient<Todo[]>(`api/todos/all/${session.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          }
        });
        if (!res.ok && (res.status === 401 || res.status === 403)) router.push("/api/auth/signin");
        if (!res.ok) return;
        const data = res.data;
        setTodos(data);
        console.log(todos);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTodos();
  }, [status, session?.user]);

  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return null;

  return (
    <div>
      <h2>TODOs</h2>
      <ul>
        {todos && todos.map((todo) => {
          return <li key={todo.id}>
            {todo.title}
            <span>{todo.status}</span>
            <span>{todo.deadline}</span>
            <span>{todo.content}</span>
          </li>
        })}
      </ul>
    </div>
  )
}
