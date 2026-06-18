package main

import (
	"strings"
	"testing"
)

func TestHandler(t *testing.T) {
	got := Handler()
	if !strings.HasPrefix(got, "current UTC time is ") {
		t.Errorf("Handler() = %q, want UTC time prefix", got)
	}
}
