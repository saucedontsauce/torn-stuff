import type {
  FactionChainReport,
  FactionChainsResponse,
  FactionRankedWarReportResponse,
  UserId,
  FactionId,
} from "tornapi-typescript";

import type {
  WarReport,
  WarReportSettings,
  MemberReport,
} from "./types";

import RateLimiter from "@shared/calls.ts";


type RankedWar =
  FactionRankedWarReportResponse["rankedwarreport"];



/**
 * Wrapper around RateLimiter so all Torn requests
 * behave consistently.
 */
async function apiRequest<T>(
  url: string,
): Promise<T> {

  return new Promise((resolve, reject) => {

    try {

      RateLimiter.enqueue(
        url,
        async (res) => {

          if (res.status!==200) {
            reject(
              new Error(
                `Torn API error ${res.status}`,
              ),
            );
            return;
          }

          const data =res.data;

          resolve(data as T);
        },
      );

    } catch (err) {

      reject(err);

    }

  });
}



/**
 * Fetch ranked war report.
 */
export async function fetchWar(
  warId: number,
  key: string,
): Promise<RankedWar> {

  const response =
    await apiRequest<{
      rankedwarreport: RankedWar;
    }>(
      `https://api.torn.com/v2/faction/${warId}/rankedwarreport?key=${key}`,
    );


  return response.rankedwarreport;
}



/**
 * Fetch chain list.
 */
async function fetchChains(
  key: string,
) {

  const response =
    await apiRequest<FactionChainsResponse>(
      `https://api.torn.com/v2/faction/chains?key=${key}`,
    );


  return response.chains;
}



/**
 * Fetch a single chain report.
 */
async function fetchChainReport(
  chainId: number,
  key: string,
) {

  return apiRequest<FactionChainReport>(
    `https://api.torn.com/v2/faction/${chainId}/chainreport?key=${key}`,
  );

}



/**
 * Creates the initial member rows.
 */
function createMembers(
  war: RankedWar,
  factionId: FactionId,
): MemberReport[] {


  const faction =
    war.factions.find(
      (f) => f.id === factionId,
    );


  if (!faction) {
    return [];
  }


  return faction.members.map(
    (member) => ({

      id: member.id as UserId,

      name: member.name,

      level: member.level,



      warHits: member.attacks,


      insideHits:  member.attacks,


      outsideHits: 0,


      sanctions: 0,


      payout: 0,


      contributionScore: 0,

    }),
  );
}



/**
 * Adds outside chain hits into member rows.
 */
async function processOutsideHits(
  members: MemberReport[],
  war: RankedWar,
  key: string,
) {

  const chains =
    await fetchChains(key);


  const warChains =
    chains.filter(
      (chain) =>
        chain.start >= war.start &&
        chain.end <= war.end,
    );


  if (warChains.length === 0) {
    return members;
  }


  const hitMap =
    new Map<UserId, number>();


  const reports =
    await Promise.all(
      warChains.map(
        (chain) =>
          fetchChainReport(
            chain.id,
            key,
          ),
      ),
    );


  reports.forEach(
    (report) => {

      report.attackers.forEach(
        (attacker) => {

          const current =
            hitMap.get(
              attacker.id as UserId,
            ) ?? 0;


          hitMap.set(
            attacker.id as UserId,
            current +
              attacker.attacks.leave,
          );

        },
      );

    },
  );



  return members.map(
    (member) => ({

      ...member,

      outsideHits:
        hitMap.get(member.id) ?? 0,

    }),
  );

}



/**
 * Main loader used by the page.
 */
export async function loadWarReport(
  warId: number,
  factionId: FactionId,
  key: string,
  settings: WarReportSettings,
): Promise<WarReport> {


  const war =
    await fetchWar(
      warId,
      key,
    );


  let members =
    createMembers(
      war,
      factionId,
    );



  /**
   * Chain API is expensive.
   *
   * If outside hits are disabled,
   * we skip all chain work.
   */
  if (
    settings.includeOutsideHits
  ) {

    members =
      await processOutsideHits(
        members,
        war,
        key,
      );

  }



  const enemyFaction =
    war.factions.find(
      (f) =>
        f.id !== factionId,
    );



  return {

    war,

    factionId,

    enemyFactionId:
      enemyFaction?.id ??
      factionId,


    members,


    chains: [],


    calculated: false,

  };

}



/**
 * localStorage helpers
 */

const CACHE_VERSION = 1;


export function saveWarReport(
  report: WarReport,
) {

  localStorage.setItem(
    `warReport:${report.war.id}`,
    JSON.stringify({
      version: CACHE_VERSION,
      report,
    }),
  );

}



export function getCachedWarReport(
  warId: number,
): WarReport | null {


  const stored =
    localStorage.getItem(
      `warReport:${warId}`,
    );


  if (!stored) {
    return null;
  }


  try {

    const parsed =
      JSON.parse(stored);


    if (
      parsed.version !== CACHE_VERSION
    ) {
      return null;
    }


    return parsed.report as WarReport;

  } catch {

    return null;

  }

}