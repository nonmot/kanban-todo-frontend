"use client"
import apiClient from "@/lib/apiClient"
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function TodoList() {

  const router = useRouter();

  const [todos, setTodos] = useState([]);

  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/api/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated" || !session?.user) return;

    let mounted = true;
    const fetchTodos = async () => {
      try {
        const res = await apiClient(`api/todos/all/${session.user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.accessToken}`,
          }
        });
        if (res.status === 401 || res.status === 403) router.push("/api/auth/signin");
        const data = await res.data;
        if (mounted) setTodos(data);
      } catch (error) {
        console.error(error);
      }
    }

    fetchTodos();
    return () => {
      mounted = false;
    }
  }, [status, session?.user]);

  if (status === "loading") return <p>Loading...</p>
  if (status === "unauthenticated") return null;

  return (
    <div>
      <h2>TODOs</h2>
      <ul>
        {todos && todos.map((todo: any) => {
          return <li key={todo.id}>{todo.title}</li>
        })}
      </ul>
    </div>
  )
}
