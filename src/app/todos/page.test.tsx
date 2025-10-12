import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import Page from "./page";

jest.mock("next-auth/react", () => ({
	__esModule: true,
	SessionProvider: ({ children }: { children: ReactNode }) => (
		<div data-testid="session-provider">{children}</div>
	),
}));

jest.mock("@/components/TodoList", () => ({
	__esModule: true,
	default: () => <div data-testid="todo-list">TodoList</div>,
}));

describe("Todos Page (Client Component)", () => {
	test("SessionProvider 配下で TodoList を描画する", () => {
		render(<Page />);

		const wrapper = screen.getByTestId("session-provider");
		expect(wrapper).toBeInTheDocument();
		expect(screen.getByTestId("todo-list")).toBeInTheDocument();

		const container = screen.getByTestId("todo-list").parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveClass("container", "mx-auto");
	});
});
