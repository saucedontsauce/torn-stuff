import type {
    FactionRankedWarReportResponse,
    FactionChainReport,
    UserId,
    FactionId
} from "tornapi-typescript";

export type RankedWar =
    FactionRankedWarReportResponse["rankedwarreport"];

export interface WarReportSettings {
    totalValue: number;
    factionCut: number;

    includeOutsideHits: boolean;
    includeSanctions: boolean;

    sortBy:
        | "score"
        | "hits"
        | "outside"
        | "inside"
        | "payout"
        | "name";

    descending: boolean;
}

export interface MemberReport {

    id: UserId;

    name: string;

    level: number;

    warHits: number;

    insideHits: number;

    outsideHits: number;

    sanctions: number;

    payout: number;

    contributionScore: number;
}

export interface WarReport {

    war: RankedWar;

    factionId: FactionId;

    enemyFactionId: FactionId;

    members: MemberReport[];

    chains: FactionChainReport[];

    calculated: boolean;
}