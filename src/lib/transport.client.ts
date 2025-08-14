import axios from "xior";

const client = axios.create({
	baseURL: "/api",
	credentials: "include",
	headers: {
		Accept: "application/json",
	},
});

export type ClientRequestOptions<TBody = unknown> = {
	method?: "get" | "post" | "put" | "patch" | "delete";
	headers?: Record<string, string>;
	params?: Record<string, string | number | boolean>;
	body?: TBody | FormData;
};

export async function clientFetchJson<TResponse, TBody = unknown>(
	path: string,
	options: ClientRequestOptions<TBody> = {},
): Promise<TResponse> {
	const { method = "get", headers, params, body } = options;
	const requestInit: {
		url: string;
		method: string;
		headers?: Record<string, string>;
		params?: Record<string, string | number | boolean>;
		data?: unknown;
	} = {
		url: path,
		method,
		headers,
		params,
		data: body as unknown,
	};
	const { data } = await client.request<TResponse>(requestInit as never);
	return data;
}