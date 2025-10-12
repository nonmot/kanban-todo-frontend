import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { Dispatch, SetStateAction } from "react";
import type { Todo } from "@/app/types/todo";
import TodoForm from "./TodoForm";

describe("TodoForm (Client Component)", () => {
	const baseProps = () => ({
		todos: [] as Todo[],
		setTodos: jest.fn() as Dispatch<SetStateAction<Todo[]>>,
		onCreate: jest.fn(),
	});

	test("初期表示では送信ボタンが無効", () => {
		const props = baseProps();
		render(<TodoForm {...props} />);

		const button = screen.getByRole("button", { name: "作成" });
		expect(button).toBeDisabled();
		expect(screen.getByRole("textbox")).toHaveValue("");
		expect(props.onCreate).not.toHaveBeenCalled();
	});

	test("タイトル入力後にフォーム送信すると onCreate が呼ばれ、生成された Todo が渡される", async () => {
		const props = baseProps();
		const { container } = render(<TodoForm {...props} />);

		const input = screen.getByRole("textbox");
		await userEvent.type(input, "Write tests");

		const form = container.querySelector("form");
		expect(form).not.toBeNull();
		if (!form) {
			throw new Error("form element not found");
		}

		fireEvent.submit(form);

		await waitFor(() => expect(props.onCreate).toHaveBeenCalledTimes(1));
		expect(props.onCreate).toHaveBeenCalledWith({
			title: "Write tests",
			id: "test-id",
			status: "TODO",
			authorId: "test-author-id",
			deadline: "2025-01-01",
			createdAt: "2025-01-01T00:00:00Z",
			updatedAt: "2025-01-01T00:00:00Z",
			content: "",
		});
	});

	test("空のタイトルで送信しても onCreate は呼ばれない", () => {
		const props = baseProps();
		const { container } = render(<TodoForm {...props} />);

		const form = container.querySelector("form");
		expect(form).not.toBeNull();
		if (!form) {
			throw new Error("form element not found");
		}

		fireEvent.submit(form);

		expect(props.onCreate).not.toHaveBeenCalled();
	});
});
