export function ab2str(buf: ArrayBuffer) {
	const enc = new TextDecoder('utf-8');
	return enc.decode(buf);
}

export function str2ab(str: string) {
	const enc = new TextEncoder();
	return enc.encode(str).buffer;
}

export function ab2base64(buf: ArrayBuffer) {
	return btoa(new Uint8Array(buf).reduce((data, byte) => data + String.fromCharCode(byte), ''));
}
