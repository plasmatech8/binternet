import { error, json, type RequestHandler } from '@sveltejs/kit';

async function testKV(platform: Readonly<App.Platform>) {
	await platform.env.KV.put('KEY', Math.random().toString());
	const x = await platform.env.KV.get('KEY');
	console.log(x);
	return json({ x });
}

async function testDB(platform: Readonly<App.Platform>) {
	const dummyData = {
		number: Math.floor(Math.random() * 1000),
		id: Math.floor(Math.random() * 1000).toString(),
		content_type: 'text/json',
		inscribed_at: new Date().toISOString()
	};
	const insertStatement = `
		INSERT INTO inscriptions (number, id, content_type, inscribed_at)
		VALUES (?, ?, ?, ?)
	`;
	await platform.env.DB.prepare(insertStatement)
		.bind(dummyData.number, dummyData.id, dummyData.content_type, dummyData.inscribed_at)
		.run();

	const result = await platform.env.DB.prepare('SELECT * FROM inscriptions LIMIT 5').run();
	console.log(result);
	return new Response(JSON.stringify(result));
}

async function testBK(platform: Readonly<App.Platform>) {
	const randomNumber = Math.random();
	const key = `test/${randomNumber}`;
	const data = `DATA:${randomNumber}`;
	const res = await platform.env.BK.put(key, data, {
		httpMetadata: { contentType: 'text/plain' },
		customMetadata: { Foo: 'Bar' }
	});
	console.log(JSON.stringify(res, null, 4));
	const object = await platform.env.BK.get(key);
	if (object === null) {
		return new Response('Object Not Found', { status: 404 });
	}
	const headers = new Headers();
	console.log(JSON.stringify(object, null, 4));
	headers.set('etag', object.httpEtag);
	headers.set('Content-Type', 'application/json');
	return new Response(object.body, {
		headers
	});
}

export const GET: RequestHandler = async ({ platform }) => {
	if (!platform) error(500, 'Platform is not defined.');
	await testKV(platform);
	await testDB(platform);
	return await testBK(platform);
};
