type ApiSuccess<T> = {
  ok: true;
  data: T;
}

type ApiError = {
  ok: false;
  status?: number;
  message: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiError;

const apiClient = async <T> (
  url: string,
  options?: RequestInit
) : Promise<ApiResponse<T>> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_API_URL}/${url}`, options);
    if (!res.ok) return { ok: false, status: res.status, message: await res.text().catch(() => "") };
    const json = await res.json();
    return { ok: true, data: json };
  } catch (error: any) {
    return { ok: false, message: error?.message ?? "unknown error" };
  }
}

export default apiClient;
