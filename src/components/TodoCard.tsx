import { Todo } from "@/app/types/todo"
import apiClient from "@/lib/apiClient";
import { useSession } from "next-auth/react";

type Props = {
  todo: Todo;
  onDelete: (id: string) => void;
}

export default function TodoCard(props: Props) {

  const { data: session, status } = useSession();

  const { todo, onDelete } = props;

  const statuses = ["TODO", "IN_PROGRESS", "COMPLETED"] as Todo["status"][];

  const onStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {

    const res = apiClient<Todo>(`api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${session?.accessToken}`
      },
      body: JSON.stringify({
        status: e.target.value
      }),
    });
  }

  return (
    <li
      className="py-5"
    >
      <div className="flex items-start">
        <div>
          <h2 className="text-3xl font-bold">{todo.title}</h2>
          <span className="text-sm text-gray-500 mr-3">{todo.status}</span>
          <select defaultValue={todo.status} onChange={onStatusChange}>
            {statuses.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          <span className="text-sm text-gray-500 mr-3">{todo.deadline}</span>
          <button
            className="bg-red-500 text-white"
            onClick={() => onDelete(todo.id)}
          >削除</button>
        </div>
      </div>
    </li>
  )
}
