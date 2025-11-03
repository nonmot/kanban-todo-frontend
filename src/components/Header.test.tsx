import { render, screen } from "@testing-library/react";
import { auth } from "@/lib/auth";
import Header from "./Header";

jest.mock("@/lib/auth", () => ({
	auth: jest.fn(),
}));

interface MockUserDropMenuProps {
	user?: { name?: string | null } | null;
}

jest.mock("./UserDropMenu", () => ({
	__esModule: true,
	default: ({ user }: MockUserDropMenuProps) => (
		<div data-testid="user-menu">{user?.name ?? "user"}</div>
	),
}));

const mockAuth = auth as jest.MockedFunction<typeof auth>;

describe("Header (Server component)", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test("未ログイン時: ホームへのリンク、ナビゲーション、サインインボタンが表示される", async () => {
		mockAuth.mockResolvedValueOnce(null);
		render(await Header());

		const logoLink = screen.getByRole("link", { name: /logo/i });
		expect(logoLink).toHaveAttribute("href", "/");

		expect(screen.getByRole("link", { name: "機能" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "料金" })).toBeInTheDocument();
		expect(screen.getByRole("link", { name: "FAQ" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
	});

	test("ログイン時: /todosへのリンク、UserDropMenuが表示される", async () => {
		mockAuth.mockResolvedValueOnce({
			user: { id: "test", name: "Tester", email: "test@example.com" },
		});

		render(await Header());

		const logoLink = screen.getByRole("link", { name: /logo/i });
		expect(logoLink).toHaveAttribute("href", "/todos");

		expect(screen.getByTestId("user-menu")).toHaveTextContent("Tester");
		expect(
			screen.queryByRole("button", { name: "Sign in" }),
		).not.toBeInTheDocument();
	});
});
