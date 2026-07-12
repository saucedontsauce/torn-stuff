import type {
  MemberReport,
  WarReport,
  WarReportSettings,
} from "./types.ts";


/**
 * Calculates player contribution scores and payouts.
 *
 * Outside hits can be toggled:
 * - true  = inside + outside hits count
 * - false = only inside hits count
 */
export function calculatePayouts(
  report: WarReport,
  settings: WarReportSettings,
): WarReport {
  const factionCut =
    settings.factionCut / 100;

  const payoutPool =
    settings.totalValue * (1 - factionCut);


  const members = report.members.map((member) => {

    const contribution =
      member.insideHits +
      (settings.includeOutsideHits
        ? member.outsideHits
        : 0) +
      member.sanctions;


    return {
      ...member,
      contributionScore: contribution,
    };
  });


  const totalContribution =
    members.reduce(
      (total, member) =>
        total + member.contributionScore,
      0,
    );


  const calculatedMembers =
    members.map((member) => {

      const payout =
        totalContribution === 0
          ? 0
          :
            payoutPool *
            (
              member.contributionScore /
              totalContribution
            );


      return {
        ...member,
        payout: Math.floor(payout),
      };
    });


  return {
    ...report,
    members: calculatedMembers,
  };
}


/**
 * Generic member sorting.
 *
 * Keeps the original array untouched.
 */
export function sortMembers(
  members: MemberReport[],
  sortBy: WarReportSettings["sortBy"],
  descending = true,
): MemberReport[] {

  const sorted = [...members];


  sorted.sort((a, b) => {

    let first: string | number;
    let second: string | number;


    switch (sortBy) {

      case "name":
        first = a.name.toLowerCase();
        second = b.name.toLowerCase();
        break;


      case "hits":
        first = a.warHits;
        second = b.warHits;
        break;


      case "inside":
        first = a.insideHits;
        second = b.insideHits;
        break;


      case "outside":
        first = a.outsideHits;
        second = b.outsideHits;
        break;


      case "payout":
        first = a.payout;
        second = b.payout;
        break;


      case "score":
      default:
        first = a.contributionScore;
        second = b.contributionScore;
        break;
    }


    if (first < second) {
      return descending ? 1 : -1;
    }


    if (first > second) {
      return descending ? -1 : 1;
    }


    return 0;
  });


  return sorted;
}


/**
 * Returns basic totals for summary cards.
 */
export function getReportTotals(
  report: WarReport,
) {

  return report.members.reduce(
    (totals, member) => {

      totals.hits += member.warHits;
      totals.inside += member.insideHits;
      totals.outside += member.outsideHits;
      totals.sanctions += member.sanctions;
      totals.payout += member.payout;

      return totals;

    },
    {
      hits: 0,
      inside: 0,
      outside: 0,
      sanctions: 0,
      payout: 0,
    },
  );
}


/**
 * Creates a blank settings object.
 */
export function defaultWarReportSettings(): WarReportSettings {
  return {
    totalValue: 0,
    factionCut: 20,

    includeOutsideHits: true,
    includeSanctions: true,

    sortBy: "score",
    descending: true,
  };
}