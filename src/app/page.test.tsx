import { render, screen } from "@testing-library/react";
import Home from "./page";

jest.mock("@/components/Header", () => ({
	__esModule: true,
	default: () => <div data-testid="mock-header">Header Component</div>,
}));

jest.mock("@/components/LP", () => ({
	__esModule: true,
	default: () => <div data-testid="mock-lp">LP Component</div>,
}));

describe("Home ページ (Server Component)", () => {
	test("Header と LP を表示する", async () => {
		render(await Home());

		expect(screen.getByTestId("mock-header")).toBeInTheDocument();
		expect(screen.getByTestId("mock-lp")).toBeInTheDocument();
	});
});
