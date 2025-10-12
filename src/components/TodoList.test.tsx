import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Todo } from "@/app/types/todo";
import TodoList from "./TodoList";

const pushMock = jest.fn();
const mockUseSession = jest.fn();
const mockApiClient = jest.fn();

jest.mock("./TodoForm", () => ({
	__esModule: true,
	default: ({ onCreate }: { onCreate: (todo: Todo) => void }) => (
		<button
			type="submit"
			data-testid="todo-form-create"
			onClick={() =>
				onCreate({
					id: "new",
					title: "フォームで追加したタスク",
					content: "",
					status: "TODO",
					authorId: "user-1",
					deadline: "2025-12-31",
					createdAt: "2025-01-01",
					updatedAt: "2025-01-01",
				})
			}
		>
			モックフォーム
		</button>
	),
}));

jest.mock("./TodoCard", () => ({
	__esModule: true,
	default: ({
		todo,
		onDelete,
	}: {
		todo: Todo;
		onDelete: (id: string) => void;
	}) => (
		<li data-testid={`todo-card-${todo.id}`}>
			<span>{todo.title}</span>
			<button
				data-testid={`todo-delete-${todo.id}`}
				onClick={() => onDelete(todo.id)}
				type="submit"
			>
				削除
			</button>
		</li>
	),
}));

jest.mock("next-auth/react", () => ({
	useSession: (...args: unknown[]) => mockUseSession(...args),
}));

jest.mock("next/navigation", () => ({
	useRouter: () => ({ push: pushMock }),
}));

jest.mock("@/lib/apiClient", () => ({
	__esModule: true,
	default: (...args: unknown[]) => mockApiClient(...args),
}));

describe("TodoList (Client Component)", () => {
	const authenticatedSession = {
		data: {
			accessToken: "token",
			user: { id: "user-1", name: "Tester", email: "tester@example.com" },
		},
		status: "authenticated" as const,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("status=loading の場合にローディング表示のみ行う", () => {
		mockUseSession.mockReturnValue({ data: null, status: "loading" });

		render(<TodoList />);

		expect(screen.getByText("Loading...")).toBeInTheDocument();
		expect(mockApiClient).not.toHaveBeenCalled();
		expect(pushMock).not.toHaveBeenCalled();
	});

	test("未認証時にサインインへリダイレクトする", async () => {
		mockUseSession.mockReturnValue({ data: null, status: "unauthenticated" });

		render(<TodoList />);

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith("/api/auth/signin");
		});
		expect(mockApiClient).not.toHaveBeenCalled();
		expect(screen.queryByTestId(/todo-card-/)).not.toBeInTheDocument();
	});

	test("認証済みの場合に Todo を取得して表示する", async () => {
		const serverTodos: Todo[] = [
			{
				id: "todo-1",
				title: "初期タスク",
				content: "",
				status: "TODO",
				authorId: "user-1",
				deadline: "2025-12-01",
				createdAt: "2025-10-01",
				updatedAt: "2025-10-02",
			},
		];

		mockUseSession.mockReturnValue(authenticatedSession);
		mockApiClient.mockResolvedValueOnce({ ok: true, data: serverTodos });

		render(<TodoList />);

		await waitFor(() => {
			expect(mockApiClient).toHaveBeenCalledWith(
				"api/todos/all/user-1",
				expect.objectContaining({
					method: "GET",
					headers: expect.objectContaining({ Authorization: "Bearer token" }),
				}),
			);
		});

		await waitFor(() => {
			expect(screen.getByText("初期タスク")).toBeInTheDocument();
		});
		expect(pushMock).not.toHaveBeenCalled();
	});

	test("Todo 取得時に 401/403 を受け取った場合にサインインへリダイレクトする", async () => {
		mockUseSession.mockReturnValue(authenticatedSession);
		mockApiClient.mockResolvedValueOnce({
			ok: false,
			status: 401,
			message: "Unauthorized",
		});

		render(<TodoList />);

		await waitFor(() => {
			expect(mockApiClient).toHaveBeenCalled();
		});

		await waitFor(() => {
			expect(pushMock).toHaveBeenCalledWith("/api/auth/signin");
		});
	});

	test("TodoForm の onCreate から追加 API を呼び出しリストに反映する", async () => {
		const createdTodo: Todo = {
			id: "new",
			title: "フォームで追加したタスク",
			content: "",
			status: "TODO",
			authorId: "user-1",
			deadline: "2025-12-31",
			createdAt: "2025-01-01",
			updatedAt: "2025-01-01",
		};

		mockUseSession.mockReturnValue(authenticatedSession);
		mockApiClient
			.mockResolvedValueOnce({ ok: true, data: [] })
			.mockResolvedValueOnce({ ok: true, data: createdTodo });

		render(<TodoList />);

		await waitFor(() => {
			expect(mockApiClient).toHaveBeenCalledTimes(1);
		});

		await userEvent.click(screen.getByTestId("todo-form-create"));

		await waitFor(() => {
			expect(mockApiClient).toHaveBeenCalledTimes(2);
		});

		expect(mockApiClient).toHaveBeenNthCalledWith(
			2,
			"api/todos/",
			expect.objectContaining({
				method: "POST",
				headers: expect.objectContaining({
					"Content-Type": "application/json",
					Authorization: "Bearer token",
				}),
			}),
		);

		expect(screen.getByText("フォームで追加したタスク")).toBeInTheDocument();
	});

	test("TodoCard の onDelete で削除 API を呼び出しリストから除外する", async () => {
		const existing: Todo = {
			id: "todo-1",
			title: "削除対象タスク",
			content: "",
			status: "TODO",
			authorId: "user-1",
			deadline: "2025-12-01",
			createdAt: "2025-10-01",
			updatedAt: "2025-10-02",
		};

		mockUseSession.mockReturnValue(authenticatedSession);
		mockApiClient
			.mockResolvedValueOnce({ ok: true, data: [existing] })
			.mockResolvedValueOnce({ ok: true });

		render(<TodoList />);

		await waitFor(() => {
			expect(screen.getByText("削除対象タスク")).toBeInTheDocument();
		});

		await userEvent.click(screen.getByTestId("todo-delete-todo-1"));

		await waitFor(() => {
			expect(mockApiClient).toHaveBeenCalledTimes(2);
		});

		expect(mockApiClient).toHaveBeenNthCalledWith(
			2,
			"api/todos/todo-1",
			expect.objectContaining({
				method: "DELETE",
				headers: expect.objectContaining({ Authorization: "Bearer token" }),
			}),
		);

		await waitFor(() => {
			expect(screen.queryByText("削除対象タスク")).not.toBeInTheDocument();
		});
	});
});
