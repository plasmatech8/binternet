import { extractNumberAndNetwork } from '$lib/utils/network';
import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ url }) => {
	return { ...extractNumberAndNetwork(url) };
};
