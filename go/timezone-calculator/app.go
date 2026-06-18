package main

import (
	"fmt"
	"log/slog"
	"strings"
	"time"

	_ "time/tzdata"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
const Description = `if user asks timezone converter related questions, extract the source time and timezone information to "timeString" and "sourceTimezone", extract the target timezone information to "targetTimezone". the desired "timeString" format is "YYYY-MM-DD HH:MM:SS". the "sourceTimezone" and "targetTimezone" are in IANA Time Zone Database identifier format. The function will convert the time from the source timezone to the target timezone and return the converted time as a string in the format "YYYY-MM-DD HH:MM:SS". If you are not sure about the date value of "timeString", you pretend date as today.`

// Arguments defines the arguments for the LLM Function Calling.
type Arguments struct {
	TimeString     string `json:"timeString" jsonschema:"description=The source time string to be converted, the desired format is 'YYYY-MM-DD HH:MM:SS'"`
	SourceTimezone string `json:"sourceTimezone" jsonschema:"description=The source timezone of the time string, in IANA Time Zone Database identifier format"`
	TargetTimezone string `json:"targetTimezone" jsonschema:"description=The target timezone to convert the timeString to, in IANA Time Zone Database identifier format"`
}

type Result struct {
	SourceTime     string `json:"sourceTime"`
	SourceTimezone string `json:"sourceTimezone"`
	TargetTime     string `json:"targetTime"`
	TargetTimezone string `json:"targetTimezone"`
	Format         string `json:"format"`
}

const timeFormat = "2006-01-02 15:04:05"

// Handler orchestrates the core processing logic of this function.
func Handler(args Arguments) (Result, error) {
	slog.Info("parse arguments", "source", args.SourceTimezone, "target", args.TargetTimezone, "time", args.TimeString)

	if args.TargetTimezone == "" {
		args.TargetTimezone = "UTC"
	}

	// should gurantee date will not be "YYYY-MM-DD"
	if strings.Contains(args.TimeString, "YYYY-MM-DD") {
		args.TimeString = strings.ReplaceAll(args.TimeString, "YYYY-MM-DD", time.Now().Format("2006-01-02"))
	}

	targetTime, err := ConvertTimezone(args.TimeString, args.SourceTimezone, args.TargetTimezone)
	if err != nil {
		slog.Error("[sfn] ConvertTimezone error", "err", err)
		return Result{}, err
	}

	return Result{
		SourceTime:     args.TimeString,
		SourceTimezone: args.SourceTimezone,
		TargetTime:     targetTime,
		TargetTimezone: args.TargetTimezone,
		Format:         timeFormat,
	}, nil
}

// ConvertTimezone converts the current time from the source timezone to the target timezone.
// It returns the converted time as a string in the format "2006-01-02 15:04:05".
func ConvertTimezone(timeString, sourceTimezone, targetTimezone string) (string, error) {
	slog.Info("<ConvertTimezone>", "timeString", timeString, "sourceTimezone", sourceTimezone, "targetTimezone", targetTimezone)
	// Get the location of the source timezone
	sourceLoc, err := time.LoadLocation(sourceTimezone)
	if err != nil {
		return "", fmt.Errorf("invalid source timezone: %v", err)
	}

	// Get the time in the source timezone
	sourceTime, err := time.ParseInLocation(timeFormat, timeString, sourceLoc)
	if err != nil {
		return "", fmt.Errorf("invalid time string: %v", err)
	}

	// Get the location of the target timezone
	targetLoc, err := time.LoadLocation(targetTimezone)
	if err != nil {
		return "", fmt.Errorf("invalid target timezone: %v", err)
	}

	// Convert the source time to the target timezone
	targetTime := sourceTime.In(targetLoc)

	// Return the target time as a string
	return targetTime.Format(timeFormat), nil
}
