export function ab2str(buf: ArrayBuffer) {
	const enc = new TextDecoder('utf-8');
	return enc.decode(buf);
}

export function str2ab(str: string) {
	const enc = new TextEncoder();
	return enc.encode(str).buffer;
}
