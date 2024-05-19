import { getInscription } from './hiro';

export async function getSiteData(id: string | number, path: string) {
	const inscription = await getInscription(id);
	const inscriptionId = inscription.id;
	console.log(inscriptionId, path);

	// TODO:
	// If inscription is an Binternet index, then parse the contents and obtain the routes.
	// Then send response with the expected inscription from the index router.
	// If the inscription is just a normal file, return the file.
}
