import { render, screen } from "@testing-library/react";
import TodosLayout from "./layout";

jest.mock("@/components/Header", () => ({
	__esModule: true,
	default: () => <div data-testid="mock-header">Header</div>,
}));

describe("TodosLayout (Server Component)", () => {
	test("Header と children を描画する", async () => {
		render(
			await TodosLayout({ children: <div data-testid="child">Child</div> }),
		);

		expect(screen.getByTestId("mock-header")).toBeInTheDocument();
		expect(screen.getByTestId("child")).toBeInTheDocument();

		const container = screen.getByTestId("child").parentElement;
		expect(container).not.toBeNull();
		expect(container).toHaveClass("container", "mx-auto");
	});
});
