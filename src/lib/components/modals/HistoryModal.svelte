<script lang="ts">
	import { PUBLIC_INSCRIPTION_LINK_URL, PUBLIC_TRANSACTION_LINK_URL } from '$env/static/public';
	import { orderHistoryStore } from '$lib/stores/history';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	function onClose() {
		modalStore.close();
	}
</script>

<div class="card px-10 py-6 w-modal-wide">
	<div class="flex flex-col gap-6">
		<header class="text-3xl">Order History ({$orderHistoryStore.length})</header>

		<div class="flex gap-6 flex-wrap">
			{#each $orderHistoryStore as orderStatus}
				<div class="table-container outline outline-1 outline-primary-500">
					<table class="table">
						<tbody>
							<tr>
								<td><strong>Order ID:</strong></td>
								<td>{orderStatus.id}</td>
							</tr>
							<tr>
								<td><strong>Created:</strong></td>
								<td>{new Date(orderStatus.createdAt).toLocaleString()}</td>
							</tr>
							<tr>
								<td><strong>Status:</strong></td>
								<td>{orderStatus.state}</td>
							</tr>
							<tr>
								<td><strong>Files inscribed:</strong></td>
								<td>
									<div>
										(Count: {orderStatus.files.length})
									</div>
									<ul class="list-disc ml-5">
										{#each orderStatus.files as file}
											<li>
												<div class="flex gap-2">
													<span>
														{file.name}
													</span>
													{#if file.tx?.reveal}
														<a
															class="anchor"
															href={`${PUBLIC_TRANSACTION_LINK_URL}/${file.tx.reveal}`}
															target="_blank"
														>
															txn
														</a>
														<a
															class="anchor"
															href={`${PUBLIC_INSCRIPTION_LINK_URL}/${file.inscriptionId}`}
															target="_blank"
														>
															link
														</a>
													{/if}
												</div>
											</li>
										{/each}
									</ul>
								</td>
							</tr>
							<tr>
								<td><strong>Receive address:</strong></td>
								<td>{orderStatus.receiveAddress}</td>
							</tr>
							<tr>
								<td><strong>Payment:</strong></td>
								<td>{!!orderStatus.paid}</td>
							</tr>
						</tbody>
					</table>
				</div>
			{:else}
				<div class="grid place-items-center w-full h-40 opacity-50 font-semibold text-xl">
					No Orders Found
				</div>
			{/each}
		</div>

		<div class="flex justify-end gap-3">
			<button class="btn variant-filled" on:click={onClose} type="button">Back</button>
		</div>
	</div>
</div>
