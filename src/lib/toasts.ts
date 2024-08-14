import { getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';

type ToastSettingsSubset = Pick<ToastSettings, 'action' | 'autohide' | 'hoverable' | 'timeout'>;

export function successToast(message: string, options?: ToastSettingsSubset) {
	const toastStore = getToastStore();
	toastStore.trigger({
		message: message,
		background: 'variant-filled-success',
		...options
	});
}

export function errorToast(message: string, options?: ToastSettingsSubset) {
	const toastStore = getToastStore();
	toastStore.trigger({
		message: message,
		background: 'variant-filled-error',
		...options
	});
}
