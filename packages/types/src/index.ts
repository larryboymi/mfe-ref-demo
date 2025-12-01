export type InstitutionId = string;

export type Institution = {
  id: InstitutionId;
  name: string;
  // Optional display fields; add more as needed
  shortName?: string;
  logoUrl?: string;
  primaryColor?: string;
};

export type Account = {
  id: string;
  institutionId: InstitutionId;
  name: string;
  balance: number;
};

export type Position = {
  id: string;
  institutionId: InstitutionId;
  quantity: number;
  symbol: string;
  value: number;
};

// Optionally a reference bundle if you want a single payload:
export type ReferenceData = {
  institutions: Institution[];
  // later: currencies, countries, accountTypes, etc
};