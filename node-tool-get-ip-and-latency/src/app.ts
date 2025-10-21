import * as dns from 'dns';
import * as net from 'net';
import * as fs from "fs";
import * as path from "path";
import { promisify } from 'util';

// Description outlines the functionality for the LLM Function Calling feature
export const description = `if user asks ip or network latency of a domain, you should return the result of the giving domain. try your best to dissect user expressions to infer the right domain names`;

// Parameter defines the arguments for the LLM Function Calling
export type Argument = {
  domain: string;
};

/**
 * Measure TCP connection latency (works in Lambda)
 */
async function measureTcpLatency(ip: string, port: number = 443): Promise<number> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const socket = net.createConnection({ host: ip, port });
    
    socket.on('connect', () => {
      const latency = Date.now() - startTime;
      socket.destroy();
      resolve(latency);
    });
    
    socket.on('error', (error) => {
      socket.destroy();
      reject(error);
    });
    
    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('Connection timeout'));
    });
  });
}

/**
 * Measure TCP latency with a hard timeout limit
 */
async function measureTcpLatencyWithTimeout(ip: string, port: number = 443, timeoutMs: number = 3000): Promise<number> {
  const timeoutPromise = new Promise<number>((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs);
  });
  
  return Promise.race([
    measureTcpLatency(ip, port),
    timeoutPromise
  ]);
}

async function getDomainInfo(domain: string): Promise<string> {
  let dns_server = "1.1.1.1"; // Default DNS server
  // Also check environment variable as fallback
  if (process.env.DNS_SERVER) {
    dns_server = process.env.DNS_SERVER;
  }
  console.log(`[${domain}] DNS Server: ${dns_server}`);

  try {
    // Create a new Resolver instance
    const resolver = new dns.Resolver();
    
    // Set the DNS servers for this specific resolver instance
    resolver.setServers([dns_server]);
    
    const addresses = await promisify(resolver.resolve4.bind(resolver))(domain);
    console.log(`[${domain}] IP@${dns_server}: ${addresses}`);

    // use the first IP address
    const ip = addresses[0];

    // Measure latency using TCP connection (works in Lambda)
    try {
      const latencies: number[] = [];
      
      // Make 3 measurements to get average latency
      try {
        for (let i = 0; i < 3; i++) {
          const latency = await measureTcpLatencyWithTimeout(ip, 443, 3000); // Try HTTPS port with 3s timeout
          latencies.push(latency);
        }
      } catch (httpsError) {
        // If 443 fails, try port 80
        const errorMessage = httpsError instanceof Error ? httpsError.message : String(httpsError);
        console.log(`[${domain}] Port 443 failed, trying port 80: ${errorMessage}`);
        const latency = await measureTcpLatencyWithTimeout(ip, 80, 3000);
        latencies.push(latency);
      }

      const avgLatency = latencies.reduce((a, b) => a + b, 0) / latencies.length;
      
      return `domain ${domain} has ip ${ip} with average latency ${avgLatency.toFixed(2)}ms. latency was tested for 3 times, use DNS server ${dns_server}, make sure you answer this with the IP address, dns server and Latency`;
      
    } catch (latencyError) {
      const errorMessage = latencyError instanceof Error ? latencyError.message : String(latencyError);
      console.error(`[${domain}] Latency measurement error: ${errorMessage}`);
      return `domain ${domain} has ip ${ip}, but TCP connection failed, so I cannot get the latency data`;
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`[${domain}] Error: ${errorMessage}`);
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
    console.warn(`[${args.domain}] domain is empty`);
    return 'can not get the domain name right now, please try again later';
  }

  const result = await getDomainInfo(args.domain);
  console.log(`[${args.domain}] result: ${result}`);
  return result;
}