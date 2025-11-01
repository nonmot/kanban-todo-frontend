import { render, screen } from "@testing-library/react";
import LP from "./LP";

describe("LP (Client Component)", () => {
	test("TODOという文字が含まれる", async () => {
		render(await LP());
		expect(await screen.findByText(/TODO管理/i)).toBeInTheDocument();
	});
});
