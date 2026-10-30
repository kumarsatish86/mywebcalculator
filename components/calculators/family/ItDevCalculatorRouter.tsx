"use client";

import type { ItBinarySlug } from "@/lib/calculators/itBinary";
import type { ItStorageSlug } from "@/lib/calculators/itStorage";
import type { ItNetworkingSlug } from "@/lib/calculators/itNetworking";
import type { ItCryptoSlug } from "@/lib/calculators/itCrypto";
import type { ItLogicSlug } from "@/lib/calculators/itLogic";
import type { ItDatabaseSlug } from "@/lib/calculators/itDatabase";
import type { ItCloudSlug } from "@/lib/calculators/itCloud";
import type { ItPerfSlug } from "@/lib/calculators/itPerf";
import type { ItUiSlug } from "@/lib/calculators/itUi";
import type { ItApiSlug } from "@/lib/calculators/itApi";
import type { ItTimeSlug } from "@/lib/calculators/itTime";
import type { ItUtilsSlug } from "@/lib/calculators/itUtils";
import { ItBinaryCalculatorHost } from "./ItBinaryCalculatorHost";
import { ItStorageCalculatorHost } from "./ItStorageCalculatorHost";
import { ItNetworkingCalculatorHost } from "./ItNetworkingCalculatorHost";
import { ItCryptoCalculatorHost } from "./ItCryptoCalculatorHost";
import { ItLogicCalculatorHost } from "./ItLogicCalculatorHost";
import { ItDatabaseCalculatorHost } from "./ItDatabaseCalculatorHost";
import { ItCloudCalculatorHost } from "./ItCloudCalculatorHost";
import { ItPerfCalculatorHost } from "./ItPerfCalculatorHost";
import { ItUiCalculatorHost } from "./ItUiCalculatorHost";
import { ItApiCalculatorHost } from "./ItApiCalculatorHost";
import { ItTimeCalculatorHost } from "./ItTimeCalculatorHost";
import { ItUtilsCalculatorHost } from "./ItUtilsCalculatorHost";

const BINARY = new Set<string>([
  "it-binary-calculator",
  "it-decimal-to-binary-converter",
  "it-binary-to-decimal-converter",
  "it-hexadecimal-to-decimal-converter",
  "it-decimal-to-hex-converter",
  "it-octal-converter-all-formats",
  "it-binary-to-hex-converter",
  "it-bitwise-calculator-and-or-xor-not",
  "it-twos-complement-calculator",
  "it-signed-unsigned-number-converter",
  "it-binary-addition-subtraction-calculator",
] satisfies ItBinarySlug[]);

const STORAGE = new Set<string>([
  "it-data-storage-converter-kb-mb-gb-tb-pb",
  "it-file-size-calculator",
  "it-data-transfer-calculator",
  "it-bandwidth-calculator",
  "it-download-time-calculator",
  "it-upload-time-calculator",
  "it-storage-cost-calculator",
  "it-backup-size-estimator",
  "it-compression-ratio-calculator",
] satisfies ItStorageSlug[]);

const NETWORKING = new Set<string>([
  "it-subnet-calculator",
  "it-cidr-calculator",
  "it-ip-range-calculator",
  "it-ipv4-to-ipv6-converter",
  "it-mac-address-converter",
  "it-network-throughput-calculator",
  "it-latency-calculator",
  "it-packet-loss-calculator",
  "it-dns-lookup-tool",
  "it-port-number-reference-tool",
  "it-mtu-calculator",
  "it-broadcast-address-calculator",
] satisfies ItNetworkingSlug[]);

const CRYPTO = new Set<string>([
  "it-hash-generator-md5-sha256-sha512",
  "it-hash-compare-tool",
  "it-base64-encode-decode",
  "it-jwt-decoder",
  "it-encryption-decryption-tool",
  "it-password-strength-checker",
  "it-random-password-generator",
  "it-salt-generator",
  "it-hmac-generator",
  "it-ssl-certificate-decoder",
  "it-public-private-key-generator",
  "it-checksum-calculator",
] satisfies ItCryptoSlug[]);

const LOGIC = new Set<string>([
  "it-time-complexity-calculator",
  "it-algorithm-complexity-estimator",
  "it-loop-iteration-calculator",
  "it-recursion-depth-calculator",
  "it-code-execution-time-estimator",
  "it-big-o-calculator",
  "it-logic-gate-calculator",
  "it-boolean-algebra-calculator",
  "it-truth-table-generator",
] satisfies ItLogicSlug[]);

const DATABASE = new Set<string>([
  "it-query-cost-estimator",
  "it-database-size-calculator",
  "it-table-size-estimator",
  "it-index-size-calculator",
  "it-row-size-calculator",
  "it-data-growth-calculator",
  "it-backup-time-calculator-db",
  "it-replication-lag-estimator",
  "it-storage-iops-calculator",
] satisfies ItDatabaseSlug[]);

const CLOUD = new Set<string>([
  "it-cloud-cost-calculator-aws-azure-gcp-style",
  "it-ec2-instance-cost-calculator",
  "it-kubernetes-resource-calculator",
  "it-pod-resource-estimator",
  "it-docker-resource-calculator",
  "it-container-size-calculator",
  "it-cicd-pipeline-time-estimator",
  "it-server-cost-calculator",
  "it-uptime-calculator-sla-percent",
  "it-autoscaling-cost-estimator",
] satisfies ItCloudSlug[]);

const PERF = new Set<string>([
  "it-load-time-calculator",
  "it-requests-per-second-calculator",
  "it-concurrent-users-calculator",
  "it-throughput-calculator",
  "it-response-time-calculator",
  "it-cpu-usage-calculator",
  "it-memory-usage-calculator",
  "it-disk-io-calculator",
  "it-cache-hit-ratio-calculator",
] satisfies ItPerfSlug[]);

const UI = new Set<string>([
  "it-screen-resolution-calculator",
  "it-aspect-ratio-calculator",
  "it-pixel-density-ppi-calculator",
  "it-rem-to-px-converter",
  "it-css-unit-converter",
  "it-color-converter-hex-rgb-hsl",
  "it-contrast-ratio-checker",
  "it-font-size-calculator",
  "it-viewport-size-calculator",
] satisfies ItUiSlug[]);

const API = new Set<string>([
  "it-url-encoder-decoder",
  "it-json-formatter-validator",
  "it-xml-formatter",
  "it-csv-to-json-converter",
  "it-json-to-csv-converter",
  "it-html-encoder-decoder",
  "it-unicode-converter",
  "it-ascii-converter",
  "it-mime-type-finder",
] satisfies ItApiSlug[]);

const TIME = new Set<string>([
  "it-unix-timestamp-converter",
  "it-cron-expression-generator",
  "it-time-zone-converter",
  "it-working-hours-calculator",
  "it-sprint-velocity-calculator",
  "it-story-points-calculator",
  "it-deadline-calculator",
] satisfies ItTimeSlug[]);

const UTILS = new Set<string>([
  "it-uuid-generator",
  "it-random-number-generator",
  "it-random-string-generator",
  "it-slug-generator",
  "it-case-converter-upper-lower-snake-camel",
  "it-text-diff-checker",
  "it-line-count-tool",
  "it-character-count-tool",
  "it-regex-tester",
] satisfies ItUtilsSlug[]);

export function ItDevCalculatorRouter({ slug }: { slug: string }) {
  if (BINARY.has(slug)) return <ItBinaryCalculatorHost slug={slug} />;
  if (STORAGE.has(slug)) return <ItStorageCalculatorHost slug={slug} />;
  if (NETWORKING.has(slug)) return <ItNetworkingCalculatorHost slug={slug} />;
  if (CRYPTO.has(slug)) return <ItCryptoCalculatorHost slug={slug} />;
  if (LOGIC.has(slug)) return <ItLogicCalculatorHost slug={slug} />;
  if (DATABASE.has(slug)) return <ItDatabaseCalculatorHost slug={slug} />;
  if (CLOUD.has(slug)) return <ItCloudCalculatorHost slug={slug} />;
  if (PERF.has(slug)) return <ItPerfCalculatorHost slug={slug} />;
  if (UI.has(slug)) return <ItUiCalculatorHost slug={slug} />;
  if (API.has(slug)) return <ItApiCalculatorHost slug={slug} />;
  if (TIME.has(slug)) return <ItTimeCalculatorHost slug={slug} />;
  if (UTILS.has(slug)) return <ItUtilsCalculatorHost slug={slug} />;
  return <ItBinaryCalculatorHost slug={slug} />;
}
