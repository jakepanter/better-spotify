export type CountryCode =   'global' | 'EG' | 'AR' | 'AU' | 'BE' | 'BO' | 'BR' | 'BG' | 'CL' | 'CR' | 'DK' | 'DE' | 'DO'
  | 'EC' | 'SV' | 'EE' | 'FI' | 'FR' | 'GR' | 'GT' | 'HN' | 'IN' | 'ID' | 'IE' | 'IS' | 'IL' | 'IT' | 'JP' | 'CA' | 'CO'
  | 'LV' | 'LT' | 'LU' | 'MY' | 'MA' | 'MX' | 'NZ' | 'NI' | 'NL' | 'NO' | 'AT' | 'PA' | 'PY' | 'PE' | 'PH' | 'PL' | 'PT'
  | 'RO' | 'RU' | 'SA' | 'SE' | 'CH' | 'SG' | 'SK' | 'HK' | 'ES' | 'ZA' | 'KR' | 'TW' | 'TH' | 'CZ' | 'TR' | 'UA' | 'HU'
  | 'UY' | 'AE' | 'UK' | 'US' | 'VN';

export type ChartType = 'top' | 'viral';

export type ChartPeriod = 'daily' | 'weekly';

export type ChartCode = [CountryCode, ChartType, ChartPeriod, string];

export const CHART_CODES: ReadonlyArray<ChartCode> = [
  // Top daily charts
  ['global', 'top', 'daily', '37i9dQZEVXbMDoHDwVN2tF'],

  ['EG', 'top', 'daily', '37i9dQZEVXbLn7RQmT5Xv2'],
  ['AR', 'top', 'daily', '37i9dQZEVXbMMy2roB9myp'],
  ['AU', 'top', 'daily', '37i9dQZEVXbJPcfkRz0wJ0'],

  ['BE', 'top', 'daily', '37i9dQZEVXbJNSeeHswcKB'],
  ['BO', 'top', 'daily', '37i9dQZEVXbJqfMFK4d691'],
  ['BR', 'top', 'daily', '37i9dQZEVXbMXbN3EUUhlg'],
  ['BG', 'top', 'daily', '37i9dQZEVXbNfM2w2mq1B8'],

  ['CL', 'top', 'daily', '37i9dQZEVXbL0GavIqMTeb'],
  ['CR', 'top', 'daily', '37i9dQZEVXbMZAjGMynsQX'],
  ['DK', 'top', 'daily', '37i9dQZEVXbL3J0k32lWnN'],
  ['DE', 'top', 'daily', '37i9dQZEVXbJiZcmkrIHGU'],

  ['DO', 'top', 'daily', '37i9dQZEVXbKAbrMR8uuf7'],
  ['EC', 'top', 'daily', '37i9dQZEVXbJlM6nvL1nD1'],
  ['SV', 'top', 'daily', '37i9dQZEVXbLxoIml4MYkT'],
  ['EE', 'top', 'daily', '37i9dQZEVXbLesry2Qw2xS'],

  ['FI', 'top', 'daily', '37i9dQZEVXbMxcczTSoGwZ'],
  ['FR', 'top', 'daily', '37i9dQZEVXbIPWwFssbupI'],
  ['GR', 'top', 'daily', '37i9dQZEVXbJqdarpmTJDL'],
  ['GT', 'top', 'daily', '37i9dQZEVXbLy5tBFyQvd4'],

  ['HN', 'top', 'daily', '37i9dQZEVXbJp9wcIM9Eo5'],
  ['IN', 'top', 'daily', '37i9dQZEVXbLZ52XmnySJg'],
  ['ID', 'top', 'daily', '37i9dQZEVXbObFQZ3JLcXt'],
  ['IE', 'top', 'daily', '37i9dQZEVXbKM896FDX8L1'],

  ['IS', 'top', 'daily', '37i9dQZEVXbKMzVsSGQ49S'],
  ['IL', 'top', 'daily', '37i9dQZEVXbJ6IpvItkve3'],
  ['IT', 'top', 'daily', '37i9dQZEVXbIQnj7RRhdSX'],
  ['JP', 'top', 'daily', '37i9dQZEVXbKXQ4mDTEBXq'],

  ['CA', 'top', 'daily', '37i9dQZEVXbKj23U1GF4IR'],
  ['CO', 'top', 'daily', '37i9dQZEVXbOa2lmxNORXQ'],
  ['LV', 'top', 'daily', '37i9dQZEVXbJWuzDrTxbKS'],
  ['LT', 'top', 'daily', '37i9dQZEVXbMx56Rdq5lwc'],

  ['LU', 'top', 'daily', '37i9dQZEVXbKGcyg6TFGx6'],
  ['MY', 'top', 'daily', '37i9dQZEVXbJlfUljuZExa'],
  ['MA', 'top', 'daily', '37i9dQZEVXbJU9eQpX8gPT'],
  ['MX', 'top', 'daily', '37i9dQZEVXbO3qyFxbkOE1'],

  ['NZ', 'top', 'daily', '37i9dQZEVXbM8SIrkERIYl'],
  ['NI', 'top', 'daily', '37i9dQZEVXbISk8kxnzfCq'],
  ['NL', 'top', 'daily', '37i9dQZEVXbKCF6dqVpDkS'],
  ['NO', 'top', 'daily', '37i9dQZEVXbJvfa0Yxg7E7'],

  ['AT', 'top', 'daily', '37i9dQZEVXbKNHh6NIXu36'],
  ['PA', 'top', 'daily', '37i9dQZEVXbKypXHVwk1f0'],
  ['PY', 'top', 'daily', '37i9dQZEVXbNOUPGj7tW6T'],
  ['PE', 'top', 'daily', '37i9dQZEVXbJfdy5b0KP7W'],

  ['PH', 'top', 'daily', '37i9dQZEVXbNBz9cRCSFkY'],
  ['PL', 'top', 'daily', '37i9dQZEVXbN6itCcaL3Tt'],
  ['PT', 'top', 'daily', '37i9dQZEVXbKyJS56d1pgi'],
  ['RO', 'top', 'daily', '37i9dQZEVXbNZbJ6TZelCq'],

  ['RU', 'top', 'daily', '37i9dQZEVXbL8l7ra5vVdB'],
  ['SA', 'top', 'daily', '37i9dQZEVXbLrQBcXqUtaC'],
  ['SE', 'top', 'daily', '37i9dQZEVXbLoATJ81JYXz'],
  ['CH', 'top', 'daily', '37i9dQZEVXbJiyhoAPEfMK'],

  ['SG', 'top', 'daily', '37i9dQZEVXbK4gjvS1FjPY'],
  ['SK', 'top', 'daily', '37i9dQZEVXbKIVTPX9a2Sb'],
  ['HK', 'top', 'daily', '37i9dQZEVXbLwpL8TjsxOG'],
  ['ES', 'top', 'daily', '37i9dQZEVXbNFJfN1Vw8d9'],

  ['ZA', 'top', 'daily', '37i9dQZEVXbMH2jvi6jvjk'],
  ['KR', 'top', 'daily', '37i9dQZEVXbNxXF4SkHj9F'],
  ['TW', 'top', 'daily', '37i9dQZEVXbMnZEatlMSiu'],
  ['TH', 'top', 'daily', '37i9dQZEVXbMnz8KIWsvf9'],

  ['CZ', 'top', 'daily', '37i9dQZEVXbIP3c3fqVrJY'],
  ['TR', 'top', 'daily', '37i9dQZEVXbIVYVBNw9D5K'],
  ['UA', 'top', 'daily', '37i9dQZEVXbKkidEfWYRuD'],
  ['HU', 'top', 'daily', '37i9dQZEVXbNHwMxAkvmF8'],

  ['UY', 'top', 'daily', '37i9dQZEVXbMJJi3wgRbAy'],
  ['UA', 'top', 'daily', '37i9dQZEVXbM4UZuIrvHvA'],
  ['UK', 'top', 'daily', '37i9dQZEVXbLnolsZ8PSNw'],
  ['US', 'top', 'daily', '37i9dQZEVXbLRQDuF5jeBp'],

  ['VN', 'top', 'daily', '37i9dQZEVXbLdGSmz6xilI'],

  // Top weekly charts
  ['global', 'top', 'weekly', '37i9dQZEVXbNG2KDcFcKOF'],

  // Viral daily charts
  ['global', 'viral', 'daily', '37i9dQZEVXbLiRSasKsNU9'],
];

export function getChatCode(countryCode: CountryCode, type: ChartType, period: ChartPeriod) {
  return CHART_CODES.filter((chartCode) => chartCode[0] === countryCode && chartCode[1] === type && chartCode[2] === period)[0][3] ?? null;
}
