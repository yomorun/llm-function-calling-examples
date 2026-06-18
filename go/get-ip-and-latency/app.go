package main

import (
	"errors"
	"log/slog"
	"net"
	"time"

	"github.com/go-ping/ping"
)

// Description outlines the functionality for the LLM Function Calling feature.
// It provides a detailed description of the function's purpose, essential for
// integration with LLM Function Calling. The presence of this function and its
// return value make the function discoverable and callable within the LLM
// ecosystem. For more information on Function Calling, refer to the OpenAI
// documentation at: https://platform.openai.com/docs/guides/function-calling
const Description = `if user asks ip or network latency of a domain, you should return the result of the giving domain. try your best to dissect user expressions to infer the right domain names`

// Arguments defines the arguments for the LLM Function Calling. These
// arguments are combined to form a prompt automatically.
type Arguments struct {
	Domain string `json:"domain" jsonschema:"description=Domain of the website,example=example.com"`
}

type Result struct {
	Domain        string   `json:"domain"`
	IPs           []string `json:"ips"`
	SelectedIP    string   `json:"selectedIP"`
	AvgLatencyMS  float64  `json:"avgLatencyMs"`
	AvgLatency    string   `json:"avgLatency"`
	PacketLoss    float64  `json:"packetLoss"`
	PacketsSent   int      `json:"packetsSent"`
	PacketsRecv   int      `json:"packetsRecv"`
	ICMPAvailable bool     `json:"icmpAvailable"`
}

// Handler orchestrates the core processing logic of this function.
func Handler(args Arguments) (Result, error) {
	if args.Domain == "" {
		slog.Warn("[sfn] domain is empty")
		return Result{}, errors.New("domain is empty")
	}

	// get ip of the domain
	ips, err := net.LookupIP(args.Domain)
	if err != nil {
		slog.Error("[sfn] could not get IPs", "err", err)
		return Result{}, err
	}

	ipStrings := make([]string, 0, len(ips))
	for _, ip := range ips {
		slog.Info("[sfn] get ip", "domain", args.Domain, "ip", ip)
		ipStrings = append(ipStrings, ip.String())
	}

	// get ip[0] ping latency
	pinger, err := ping.NewPinger(ips[0].String())
	if err != nil {
		slog.Error("[sfn] could not create pinger", "err", err)
		return Result{}, err
	}

	pinger.Count = 3
	pinger.Timeout = time.Second * 3 // 3 seconds timeout
	pinger.Run()                     // blocks until finished
	stats := pinger.Statistics()     // get send/receive/rtt stats

	slog.Info("[sfn] get ping latency", "domain", args.Domain, "ip", ips[0], "latency", stats.AvgRtt, "PacketLoss", stats.PacketLoss)

	return Result{
		Domain:        args.Domain,
		IPs:           ipStrings,
		SelectedIP:    ips[0].String(),
		AvgLatencyMS:  float64(stats.AvgRtt) / float64(time.Millisecond),
		AvgLatency:    stats.AvgRtt.String(),
		PacketLoss:    stats.PacketLoss,
		PacketsSent:   stats.PacketsSent,
		PacketsRecv:   stats.PacketsRecv,
		ICMPAvailable: stats.AvgRtt > 0,
	}, nil
}
