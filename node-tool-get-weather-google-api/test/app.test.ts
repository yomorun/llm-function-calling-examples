import { expect, test } from "bun:test";
import { getGeocode, getWeather } from "../src/app";

test('getGeocode', async () => {
	const address = '1600 Amphitheatre Parkway, Mountain View, CA';
	const result = await getGeocode(address);
	expect(result.lat).toBeCloseTo(37.4193295);
	expect(result.lng).toBeCloseTo(-122.0816532);
})

test('getWeatherByGoogleAPI', async () => {
	const lat = 37.4193295;
	const lng = -122.0816532;
	const result = await getWeather(lat, lng);
	expect(result).toBeDefined();
	expect(result.timeZone.id).toBe('America/Los_Angeles');
	expect(result.temperature).toBeDefined();
});
