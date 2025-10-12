import apiClient from "./apiClient";

const ORIGINAL_BASE_URL = process.env.NEXT_PUBLIC_BASE_API_URL;
const ORIGINAL_FETCH = global.fetch;

type FetchMock = jest.MockedFunction<typeof fetch>;

const createFetchResponse = (overrides: Partial<Response>): Response =>
	({
		ok: false,
		status: 200,
		json: async () => undefined,
		text: async () => "",
		...overrides,
	}) as Response;

beforeEach(() => {
	process.env.NEXT_PUBLIC_BASE_API_URL = "https://example.com";
	global.fetch = jest.fn() as FetchMock;
});

afterEach(() => {
	process.env.NEXT_PUBLIC_BASE_API_URL = ORIGINAL_BASE_URL;
	global.fetch = ORIGINAL_FETCH;
	jest.restoreAllMocks();
});

describe("apiClient", () => {
	test("成功レスポンスをパースし ok: true を返す", async () => {
		const jsonMock = jest.fn(async () => ({ message: "ok" }));
		(global.fetch as FetchMock).mockResolvedValue(
			createFetchResponse({
				ok: true,
				json: jsonMock,
			}),
		);

		const result = await apiClient<{ message: string }>("endpoint", {
			method: "GET",
		});

		expect(global.fetch).toHaveBeenCalledWith("https://example.com/endpoint", {
			method: "GET",
		});
		expect(jsonMock).toHaveBeenCalledTimes(1);
		expect(result).toEqual({ ok: true, data: { message: "ok" } });
	});

	test("失敗レスポンスで status と message を返す", async () => {
		const textMock = jest.fn(async () => "Not Found");
		(global.fetch as FetchMock).mockResolvedValue(
			createFetchResponse({
				ok: false,
				status: 404,
				text: textMock,
			}),
		);

		const result = await apiClient("missing");

		expect(result).toEqual({ ok: false, status: 404, message: "Not Found" });
	});

	test("text が失敗した場合は空文字を返す", async () => {
		const textMock = jest.fn(() => Promise.reject(new Error("fail")));
		(global.fetch as FetchMock).mockResolvedValue(
			createFetchResponse({
				ok: false,
				status: 500,
				text: textMock,
			}),
		);

		const result = await apiClient("error");

		expect(result).toEqual({ ok: false, status: 500, message: "" });
	});

	test("fetch が投げたエラーをハンドリングする", async () => {
		(global.fetch as FetchMock).mockRejectedValue(new Error("network down"));

		const result = await apiClient("boom");

		expect(result).toEqual({ ok: false, message: "network down" });
	});

	test("未知のエラーオブジェクトでも unknown error を返す", async () => {
		(global.fetch as FetchMock).mockRejectedValue({ any: "value" });

		const result = await apiClient("boom");

		expect(result).toEqual({ ok: false, message: "unknown error" });
	});
});
