import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Todo } from "@/app/types/todo";
import apiClient from "@/lib/apiClient";

type Props = {
	todo: Todo;
	onDelete: (id: string) => void;
};

export default function TodoCard(props: Props) {
	const { data: session } = useSession();
	const { todo, onDelete } = props;

	const [error, setError] = useState<string | null>(null);

	const statuses = ["TODO", "IN_PROGRESS", "COMPLETED"] as Todo["status"][];

	const onStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
		setError(null);

		const token = session?.accessToken;
		if (!token) {
			setError("認証が必要です。サインインしてください。");
			return;
		}

		try {
			const _res = await apiClient<Todo>(`api/todos/${todo.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({
					status: e.target.value,
				}),
			});
			if (!_res?.ok) {
				setError("更新に失敗しました。");
			}
		} catch (_error) {
			setError("更新に失敗しました。");
		}
	};

	return (
		<li className="py-5">
			<div className="flex items-start">
				<div>
					<h2 className="text-3xl font-bold">{todo.title}</h2>
					<span className="text-sm text-gray-500 mr-3">{todo.status}</span>
					<select defaultValue={todo.status} onChange={onStatusChange}>
						{statuses.map((status) => (
							<option key={status} value={status}>
								{status}
							</option>
						))}
					</select>
					<span className="text-sm text-gray-500 mr-3">{todo.deadline}</span>
					<button
						className="bg-red-500 text-white"
						onClick={() => onDelete(todo.id)}
						type="button"
					>
						削除
					</button>

					{error && (
						<p role="alert" className="text-sm text-red-600">
							{error}
						</p>
					)}
				</div>
			</div>
		</li>
	);
}
