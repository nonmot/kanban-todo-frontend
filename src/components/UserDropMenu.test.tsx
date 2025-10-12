import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { User } from "next-auth";
import UserDropMenu from "./UserDropMenu";

describe("UserDropMenu (Client Component)", () => {
	const baseUser: User = {
		id: "user-1",
		name: "Tester",
		email: "tester@example.com",
	};

	test("初期表示でメニューが表示されない", () => {
		render(<UserDropMenu user={baseUser} />);

		expect(screen.getByRole("button")).toBeInTheDocument();
		expect(screen.queryByText("Tester")).not.toBeInTheDocument();
		expect(
			screen.queryByRole("link", { name: "Logout" }),
		).not.toBeInTheDocument();
	});

	test("ボタンをクリックするとユーザー名とログアウトリンクが表示される", async () => {
		render(<UserDropMenu user={baseUser} />);

		await userEvent.click(screen.getByRole("button"));

		expect(screen.getByText("Tester")).toBeInTheDocument();
		const logoutLink = screen.getByRole("link", { name: "Logout" });
		expect(logoutLink).toHaveAttribute("href", "/api/auth/signout");
	});

	test("二度クリックするとメニューが閉じる", async () => {
		render(<UserDropMenu user={baseUser} />);

		const trigger = screen.getByRole("button");
		await userEvent.click(trigger);
		await userEvent.click(trigger);

		expect(screen.queryByText("Tester")).not.toBeInTheDocument();
	});
});
