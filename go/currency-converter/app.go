package main

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
const Description = `if user asks currency exchange rate related questions, you should call this function. But if the source currency is other than USD (US Dollar), you should ignore calling tools.`

// Arguments defines the arguments for the LLM Function Calling.
type Arguments struct {
	SourceCurrency string  `json:"source" jsonschema:"description=The source currency to be queried in 3-letter ISO 4217 format"`
	TargetCurrency string  `json:"target" jsonschema:"description=The target currency to be queried in 3-letter ISO 4217 format"`
	Amount         float64 `json:"amount" jsonschema:"description=The amount of the currency to be converted to the target currency"`
}

type Result struct {
	SourceCurrency  string  `json:"sourceCurrency"`
	TargetCurrency  string  `json:"targetCurrency"`
	Amount          float64 `json:"amount"`
	Rate            float64 `json:"rate"`
	ConvertedAmount float64 `json:"convertedAmount"`
}

// Handler orchestrates the core processing logic of this function.
func Handler(args Arguments) (Result, error) {
	// debug info
	slog.Info("[sfn] << receive", "data", fmt.Sprintf("%+v", args))

	// if the source currency is not USD, ignore calling tools.
	// openexchangerates.org free tier only supports USD as the base currency.
	rate, err := fetchRate(args.SourceCurrency, args.TargetCurrency, args.Amount)
	if err != nil {
		slog.Error("[sfn] >> fetchRate error", "err", err)
		return Result{}, err
	}

	result := Result{
		SourceCurrency:  args.SourceCurrency,
		TargetCurrency:  args.TargetCurrency,
		Amount:          args.Amount,
		Rate:            rate,
		ConvertedAmount: args.Amount * rate,
	}
	slog.Info("[sfn] >> result", "result", result)

	return result, nil
}

type Rates struct {
	Rates map[string]float64 `json:"rates"`
}

// fetchRate fetches the exchange rate from openexchangerates.org
func fetchRate(sourceCurrency string, targetCurrency string, _ float64) (float64, error) {
	resp, err := http.Get(fmt.Sprintf("https://openexchangerates.org/api/latest.json?app_id=%s&base=%s&symbols=%s", os.Getenv("API_KEY"), sourceCurrency, targetCurrency))
	if err != nil {
		return 0, err
	}

	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return 0, err
	}

	var rt *Rates
	err = json.Unmarshal(body, &rt)
	if err != nil {
		return 0, err
	}

	return getRates(targetCurrency, rt)
}

func getRates(targetCurrency string, rates *Rates) (float64, error) {
	if rates == nil {
		return 0, fmt.Errorf("can not get the target currency, target currency is %s", targetCurrency)
	}

	if rate, ok := rates.Rates[targetCurrency]; ok {
		return rate, nil
	}

	return 0, fmt.Errorf("can not get the target currency, target currency is %s", targetCurrency)
}
