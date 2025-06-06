import * as dns from 'dns';
import * as ping from 'ping';
import * as fs from "fs";
import * as path from "path";

import { promisify } from 'util';

// Description outlines the functionality for the LLM Function Calling feature
export const description = `if user asks ip or network latency of a domain, you should return the result of the giving domain. try your best to dissect user expressions to infer the right domain names`;

// Parameter defines the arguments for the LLM Function Calling
export type Argument = {
  domain: string;
};

async function getDomainInfo(domain: string): Promise<string> {
  try {

    // Create a new Resolver instance
    const resolver = new dns.Resolver();
    
    // Set the DNS servers for this specific resolver instance
    resolver.setServers([dns_server]); // You can provide multiple servers
    
    const addresses = await promisify(resolver.resolve4.bind(resolver))(domain);
    console.log(`IP Addresses (dns server: ${dns_server}): ${addresses}`);

    var ip = addresses[0]

    // Get latency using ping
    const pingResult = await ping.promise.probe(ip, {
      timeout: 3,
      extra: ['-c', '3'] // Send 3 packets
    });

    if (!pingResult.alive) {
      return `domain ${domain} has ip ${ip}, but it does not support ICMP protocol or network is unavailable now, so I can not get the latency data`;
    }

    return `domain ${domain} has ip ${ip} with average latency ${pingResult.avg}ms, make sure answer with the IP address and Latency`;

  } catch (error) {
    console.error('Error:', error);
    return 'can not get the domain name right now, please try again later';
  }
}

/**
 * Handler orchestrates the core processing logic of this function.
 * @param args - LLM Function Calling Arguments.
 * @returns The result of the retrieval is returned to the LLM for processing.
 */
export async function handler(args: Argument): Promise<string> {
  if (!args.domain) {
    console.warn('[sfn] domain is empty');
    return 'can not get the domain name right now, please try again later';
  }

  const result = await getDomainInfo(args.domain);
  console.log('[sfn] result:', result);
  return result;
}

// read `../assets/dns_server.json` file
let dns_server = "1.1.1.1"
const filePath = path.join(__dirname, "../assets/dns_server.config");
try {
  dns_server = fs.readFileSync(filePath, "utf-8").trim();
  console.log("Read DNS Server config from config:", dns_server);
} catch (error) {
  console.error("Error reading the config:", error);
}
