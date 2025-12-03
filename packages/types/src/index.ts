// Institution / reference data

export type InstitutionId = string;

export type Institution = {
  id: InstitutionId;
  name: string;
  shortName?: string;
  logoUrl?: string;
  primaryColor?: string;
};

export type ReferenceData = {
  institutions: Institution[];
  // later: currencies, accountTypes, etc
};

// Domain types

export type Account = {
  id: string;
  name: string;
  balance: number;
  institutionId: InstitutionId;
};

export type Position = {
  id: string;
  symbol: string;
  quantity: number;
  value: number;
  institutionId: InstitutionId;
};