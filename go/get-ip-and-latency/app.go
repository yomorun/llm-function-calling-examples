package main

import (
	"fmt"
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

// Handler orchestrates the core processing logic of this function.
func Handler(args Arguments) string {
	if args.Domain == "" {
		slog.Warn("[sfn] domain is empty")
		return "can not get the domain name right now, please try again later"
	}

	// get ip of the domain
	ips, err := net.LookupIP(args.Domain)
	if err != nil {
		slog.Error("[sfn] could not get IPs", "err", err)
		return "can not get the domain name right now, please try again later"
	}

	for _, ip := range ips {
		slog.Info("[sfn] get ip", "domain", args.Domain, "ip", ip)
	}

	// get ip[0] ping latency
	pinger, err := ping.NewPinger(ips[0].String())
	if err != nil {
		slog.Error("[sfn] could not create pinger", "err", err)
		return "can not get the domain name right now, please try again later"
	}

	pinger.Count = 3
	pinger.Timeout = time.Second * 3 // 3 seconds timeout
	pinger.Run()                     // blocks until finished
	stats := pinger.Statistics()     // get send/receive/rtt stats

	slog.Info("[sfn] get ping latency", "domain", args.Domain, "ip", ips[0], "latency", stats.AvgRtt, "PacketLoss", fmt.Sprintf("%f%%", stats.PacketLoss))

	var res string

	if stats.AvgRtt == 0 {
		res = fmt.Sprintf("domain %s has ip %s, but it does not support ICMP protocol or network is unavailable now, so I can not get the latency data", args.Domain, ips[0])
	} else {
		res = fmt.Sprintf("domain %s has ip %s with average latency %s, make sure answer with the IP address and Latency", args.Domain, ips[0], stats.AvgRtt)
	}

	return res
}
