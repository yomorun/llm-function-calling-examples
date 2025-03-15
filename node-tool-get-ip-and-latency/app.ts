import * as dns from 'dns';
import * as ping from 'ping';
import { promisify } from 'util';

// Description outlines the functionality for the LLM Function Calling feature
export const description = `if user asks ip or network latency of a domain, you should return the result of the giving domain. try your best to dissect user expressions to infer the right domain names`;

// Parameter defines the arguments for the LLM Function Calling
export type Argument = {
  domain: string;
};

const lookup = promisify(dns.lookup);

async function getDomainInfo(domain: string): Promise<string> {
  try {
    // Get IP address
    const { address: ip } = await lookup(domain);

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