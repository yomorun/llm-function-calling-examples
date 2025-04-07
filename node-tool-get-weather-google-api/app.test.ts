import test from 'ava';

import { getWeatherByGoogleAPI } from './app';

test('foo', t => {
	t.pass();
});

test('bar', async t => {
	const bar = Promise.resolve('bar');
	t.is(await bar, 'bar');
});

test('getWeatherByGoogleAPI', async t => {
	const lat = 37.7749;
	const lng = -122.4194;
	const result = await getWeatherByGoogleAPI(lat, lng);
	t.truthy(result);
});