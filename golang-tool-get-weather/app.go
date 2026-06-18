package main

import (
	"log/slog"
	"os"

	owm "github.com/briandowns/openweathermap"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
const Description = `Get current weather for a given city. If no city is provided, you 
	should ask to clarify the city. If the city name is given, you should 
	convert the city name to Latitude and Longitude geo coordinates, keeping 
	Latitude and Longitude in decimal format.`

// Arguments defines the arguments for the LLM Function Calling. These
// arguments are combined to form a prompt automatically.
type Arguments struct {
	City      string  `json:"city" jsonschema:"description=The city name to get the weather for"`
	Latitude  float64 `json:"latitude" jsonschema:"description=The latitude of the city, in decimal format, range should be in (-90, 90)"`
	Longitude float64 `json:"longitude" jsonschema:"description=The longitude of the city, in decimal format, range should be in (-180, 180)"`
}

type Result *owm.CurrentWeatherData

// Handler orchestrates the core processing logic of this function.
func Handler(args Arguments) (Result, error) {
	// invoke the openweathermap api and return the result back to LLM
	apiKey := os.Getenv("OPENWEATHERMAP_API_KEY")
	w, err := owm.NewCurrent("C", "en", apiKey)
	if err != nil {
		return nil, err
	}

	w.CurrentByCoordinates(&owm.Coordinates{
		Longitude: args.Longitude,
		Latitude:  args.Latitude,
	})

	slog.Info("get-weather", "city", args.City, "result", w)

	return w, nil
}
