package main

import (
	"strings"
	"testing"
)

func TestHandler(t *testing.T) {
	got, err := Handler()
	if err != nil {
		t.Fatalf("Handler() error = %v", err)
	}
	if got.CurrentUTC == "" || strings.HasPrefix(got.CurrentUTC, "current UTC time is ") {
		t.Errorf("Handler() = %q, want raw UTC timestamp", got.CurrentUTC)
	}
}
