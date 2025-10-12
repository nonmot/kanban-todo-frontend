import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useSession } from "next-auth/react";
import type { Todo } from "@/app/types/todo";
import apiClient from "@/lib/apiClient";
import TodoCard from "./TodoCard";

jest.mock("next-auth/react", () => ({
	__esModule: true,
	useSession: jest.fn(),
}));

jest.mock("@/lib/apiClient", () => ({
	__esModule: true,
	default: jest.fn(),
}));

const mockUseSession = useSession as jest.MockedFunction<typeof useSession>;
const mockApiClient = apiClient as jest.MockedFunction<typeof apiClient>;

const baseTodo: Todo = {
	id: "t1",
	title: "Write tests",
	content: "",
	status: "TODO",
	authorId: "Tester",
	deadline: "2025-12-31",
	createdAt: "2025-10-01",
	updatedAt: "2025-10-01",
};

describe("TodoCard (Client Component)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
		mockUseSession.mockReturnValue({
			data: {
				accessToken: "token",
				user: { id: "test", name: "Tester", email: "test@example.com" },
			},
			status: "authenticated",
		});
		mockApiClient.mockResolvedValue({ ok: true });
	});

	test("初期表示: タイトル/ステータス/期限とセレクトの規定値を表示", () => {
		render(<TodoCard todo={baseTodo} onDelete={jest.fn()} />);

		expect(screen.getByText("Write tests")).toBeInTheDocument();
		expect(screen.getByText("2025-12-31")).toBeInTheDocument();

		const select = screen.getByRole("combobox");
		expect(select).toHaveDisplayValue("TODO");

		const w = within(select);
		expect(w.getByRole("option", { name: "TODO" })).toBeInTheDocument();
		expect(w.getByRole("option", { name: "IN_PROGRESS" })).toBeInTheDocument();
		expect(w.getByRole("option", { name: "COMPLETED" })).toBeInTheDocument();
	});

	test("セレクト変更で apiClient をPUTで呼ぶ。Authorizationヘッダが付与されている", async () => {
		render(<TodoCard todo={baseTodo} onDelete={jest.fn()} />);

		const select = screen.getByRole("combobox");
		await userEvent.selectOptions(select, "IN_PROGRESS");

		expect(mockApiClient).toHaveBeenCalledTimes(1);
		expect(mockApiClient).toHaveBeenCalledWith(
			`api/todos/${baseTodo.id}`,
			expect.objectContaining({
				method: "PUT",
				headers: expect.objectContaining({
					"Content-Type": "application/json",
					Authorization: "Bearer token",
				}),
				body: JSON.stringify({ status: "IN_PROGRESS" }),
			}),
		);
	});

	test("削除ボタンで onDelete が呼ばれる", async () => {
		const onDelete = jest.fn();
		render(<TodoCard todo={baseTodo} onDelete={onDelete} />);

		await userEvent.click(screen.getByRole("button", { name: "削除" }));
		expect(onDelete).toHaveBeenCalledWith("t1");
		expect(onDelete).toHaveBeenCalledTimes(1);
	});

	test("未認証でセレクト変更すると API を呼ばずエラーメッセージを表示する", async () => {
		mockUseSession.mockReturnValue({
			data: null,
			status: "unauthenticated",
		});

		render(<TodoCard todo={baseTodo} onDelete={jest.fn()} />);

		const select = screen.getByRole("combobox");
		await userEvent.selectOptions(select, "IN_PROGRESS");

		expect(mockApiClient).not.toHaveBeenCalled();
		expect(await screen.findByRole("alert")).toBeInTheDocument();
	});
});
