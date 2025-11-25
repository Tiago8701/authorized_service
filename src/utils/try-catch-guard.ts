export async function guard<T>(
	fn: () => Promise<T>,
	onError?: (error: unknown) => void,
): Promise<{ data?: T; error?: unknown }> {
	try {
		const data = await fn();
		return { data };
	} catch (error) {
		onError?.(error);
		return { error };
	}
}
