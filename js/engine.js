/**
 * TrueRPM - Revenue Engine & Algorithmic Calculator
 * Translates geographic traffic distributions, niche CPMs, video length, and format into true creator take-home.
 */

import { COUNTRY_DATA, NICHES, DURATION_MODIFIERS } from './data.js';

export class RevenueEngine {
  constructor() {
    this.countryMap = new Map();
    COUNTRY_DATA.forEach(c => this.countryMap.set(c.code, c));
  }

  /**
   * Get country by code or fallback to generic Tier 3
   */
  getCountry(code) {
    return this.countryMap.get(code) || {
      code,
      name: 'Other / Global',
      flag: '🌐',
      tier: 'Tier 3',
      baseRpm: 0.50,
      minRpm: 0.25,
      maxRpm: 1.20,
      fillRate: 0.60,
      shortsRpm: 0.012,
      region: 'Global',
      sponsorCpm: 2.00
    };
  }

  /**
   * Calculate full realistic revenue breakdown
   * @param {Object} params
   * @param {number} params.monthlyViews - Total views per month
   * @param {number} params.shortsPercent - % of views that are Shorts (0 - 100)
   * @param {string} params.nicheId - content niche ID
   * @param {string} params.durationId - video duration ID
   * @param {number} params.monthlyViews - Total views per month
   * @param {number} params.shortsPercent - % of views that are Shorts (0 - 100)
   * @param {string} params.nicheId - content niche ID
   * @param {string} params.durationId - video duration ID
   * @param {Array<{code: string, share: number}>} params.traffic - country distribution (sum should be 100)
   * @param {boolean} params.isMonetized - whether channel is approved for YPP
   * @param {number} params.adblockPercent - % of views with adblock or unpaid zero-ad sessions (0 - 80)
   */
  calculate({
    monthlyViews = 1000000,
    shortsPercent = 20,
    nicheId = 'entertainment',
    durationId = 'mid_video',
    traffic = [{ code: 'US', share: 100 }],
    isMonetized = true,
    adblockPercent = 25
  }) {
    // 1. Normalize traffic shares so they sum to 100
    const rawTotalShare = traffic.reduce((acc, t) => acc + (Number(t.share) || 0), 0) || 100;
    const normalizedTraffic = traffic.map(t => ({
      ...t,
      normalizedShare: (Number(t.share) || 0) / rawTotalShare
    }));

    // 2. Fetch Niche & Duration Modifiers
    const niche = NICHES.find(n => n.id === nicheId) || NICHES.find(n => n.id === 'entertainment');
    const duration = DURATION_MODIFIERS.find(d => d.id === durationId) || DURATION_MODIFIERS[1];

    // 3. Separate Views (Format & AdBlock / Unpaid Deduction)
    const effectiveAdblockRate = Math.max(0, Math.min(80, Number(adblockPercent) || 0));
    const shortsViews = monthlyViews * (shortsPercent / 100);
    const longViews = monthlyViews - shortsViews;

    // Shorts on mobile app have lower adblock penetration (~40% of desktop adblock rate)
    const longMonetizedRatio = (100 - effectiveAdblockRate) / 100;
    const shortsMonetizedRatio = (100 - (effectiveAdblockRate * 0.40)) / 100;

    const longMonetizedViews = longViews * longMonetizedRatio;
    const shortsMonetizedViews = shortsViews * shortsMonetizedRatio;
    const totalMonetizedViews = longMonetizedViews + shortsMonetizedViews;
    const unpaidViews = monthlyViews - totalMonetizedViews;

    // 4. Country Level Calculations
    let longWeightedRpm = 0;
    let shortsWeightedRpm = 0;
    let weightedFillRate = 0;
    let tier1Views = 0;
    let tier2Views = 0;
    let tier3Views = 0;
    let totalSponsorReachValue = 0;

    const countryBreakdown = normalizedTraffic.map(item => {
      const country = this.getCountry(item.code);
      const share = item.normalizedShare;
      const cViews = monthlyViews * share;
      const cLongViews = longViews * share;
      const cShortsViews = shortsViews * share;
      const cLongMonetized = longMonetizedViews * share;
      const cShortsMonetized = shortsMonetizedViews * share;

      // Niche applies strongly to long-form; duration modifier also multiplies long-form inventory
      const effectiveCountryLongRpm = country.baseRpm * niche.multiplier * duration.multiplier;
      
      // Shorts RPM has slight niche variation (+- 15%) and depends heavily on country pool
      const shortsNicheFactor = 0.85 + (niche.multiplier - 1) * 0.15;
      const effectiveCountryShortsRpm = country.shortsRpm * Math.max(0.6, Math.min(1.8, shortsNicheFactor));

      // Revenue is generated exclusively from monetized playbacks
      const countryLongRevenue = (cLongMonetized / 1000) * effectiveCountryLongRpm;
      const countryShortsRevenue = (cShortsMonetized / 1000) * effectiveCountryShortsRpm;
      const countryTotalRevenue = countryLongRevenue + countryShortsRevenue;

      // Track aggregate weights
      longWeightedRpm += effectiveCountryLongRpm * share;
      shortsWeightedRpm += effectiveCountryShortsRpm * share;
      weightedFillRate += country.fillRate * share;

      if (country.tier.includes('Tier 1')) {
        tier1Views += cViews;
      } else if (country.tier.includes('Tier 2')) {
        tier2Views += cViews;
      } else {
        tier3Views += cViews;
      }

      // Sponsor value index
      totalSponsorReachValue += (cLongViews / 1000) * country.sponsorCpm;

      return {
        code: country.code,
        name: country.name,
        flag: country.flag,
        tier: country.tier,
        share: Math.round(share * 1000) / 10,
        views: Math.round(cViews),
        monetizedViews: Math.round(cLongMonetized + cShortsMonetized),
        longRpm: effectiveCountryLongRpm,
        shortsRpm: effectiveCountryShortsRpm,
        longRevenue: countryLongRevenue,
        shortsRevenue: countryShortsRevenue,
        totalRevenue: countryTotalRevenue
      };
    });

    // 5. Total AdSense Realistic Revenue (Computed purely on Monetized Playbacks)
    const monthlyLongAdSense = (longMonetizedViews / 1000) * longWeightedRpm;
    const monthlyShortsAdSense = (shortsMonetizedViews / 1000) * shortsWeightedRpm;
    const potentialTotalAdSense = monthlyLongAdSense + monthlyShortsAdSense;
    const monthlyTotalAdSense = isMonetized ? potentialTotalAdSense : 0;
    
    const potentialChannelRpm = monthlyViews > 0 ? (potentialTotalAdSense / monthlyViews) * 1000 : 0;
    const effectiveChannelRpm = isMonetized ? potentialChannelRpm : 0;

    // Realistic range bounds (+- 20% variance for seasonality & ad inventory swings)
    const monthlyAdSenseMin = isMonetized ? monthlyTotalAdSense * 0.82 : 0;
    const monthlyAdSenseMax = isMonetized ? monthlyTotalAdSense * 1.25 : 0;

    // 6. Multi-Stream Income Projections
    // Brand Deals: heavily depend on Tier 1 long-form reach and niche multiplier
    const brandDealMonthly = longViews > 100000 
      ? (totalSponsorReachValue * 0.35 * Math.min(2.5, niche.multiplier))
      : 0;

    // Channel Memberships & Superchats (fan funding): driven by audience affinity & purchasing power (requires YPP or external platforms)
    const fanFundingMonthly = isMonetized 
      ? potentialTotalAdSense * 0.12 * (tier1Views / monthlyViews * 1.5 + tier2Views / monthlyViews * 0.6 + tier3Views / monthlyViews * 0.15)
      : 0;

    // Affiliate / Merch: can work even if unmonetized!
    const affiliateMonthly = (potentialTotalAdSense > 0 ? potentialTotalAdSense : 500) * (niche.id === 'tech' || niche.id === 'finance' || niche.id === 'automotive' ? 0.25 : 0.06);

    const totalEcosystemMonthly = monthlyTotalAdSense + brandDealMonthly + fanFundingMonthly + (longViews > 50000 ? affiliateMonthly : 0);

    // 7. Benchmark Against Standard Generic Trackers (e.g. Social Blade standard model)
    // Most standard trackers assume a flat $0.25 low to $4.00 high CPM applied to ALL views without knowing country or shorts dilution
    const naiveSocialBladeMin = (monthlyViews / 1000) * 0.25;
    const naiveSocialBladeMax = (monthlyViews / 1000) * 4.00;
    const naiveMidpoint = (naiveSocialBladeMin + naiveSocialBladeMax) / 2;

    // 8. Gap Analysis (Why is TrueRPM different?)
    const realityVariance = monthlyTotalAdSense - naiveMidpoint;
    const isOverEstimatedByGeneric = naiveMidpoint > monthlyTotalAdSense;

    // Calculate percentage breakdown by country revenue contribution
    const countryRevenueContribution = countryBreakdown.map(c => ({
      ...c,
      revenueContributionPercent: monthlyTotalAdSense > 0 ? (c.totalRevenue / monthlyTotalAdSense) * 100 : 0
    })).sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      views: {
        total: monthlyViews,
        long: Math.round(longViews),
        shorts: Math.round(shortsViews),
        shortsPercent,
        monetizedTotal: Math.round(totalMonetizedViews),
        monetizedLong: Math.round(longMonetizedViews),
        monetizedShorts: Math.round(shortsMonetizedViews),
        unpaidViews: Math.round(unpaidViews),
        adblockPercent: effectiveAdblockRate
      },
      niche,
      duration,
      metrics: {
        effectiveChannelRpm,
        potentialChannelRpm,
        longWeightedRpm,
        shortsWeightedRpm,
        weightedFillRate: Math.round(weightedFillRate * 100),
        tier1SharePercent: Math.round((tier1Views / monthlyViews) * 100),
        tier2SharePercent: Math.round((tier2Views / monthlyViews) * 100),
        tier3SharePercent: Math.round((tier3Views / monthlyViews) * 100),
        isMonetized
      },
      earnings: {
        isMonetized,
        monthlyAdSense: monthlyTotalAdSense,
        potentialMonthlyAdSense: potentialTotalAdSense,
        monthlyAdSenseMin,
        monthlyAdSenseMax,
        yearlyAdSense: monthlyTotalAdSense * 12,
        potentialYearlyAdSense: potentialTotalAdSense * 12,
        dailyAdSense: monthlyTotalAdSense / 30.4,
        longRevenue: isMonetized ? monthlyLongAdSense : 0,
        shortsRevenue: isMonetized ? monthlyShortsAdSense : 0,
        potentialLongRevenue: monthlyLongAdSense,
        potentialShortsRevenue: monthlyShortsAdSense,
        brandDealMonthly,
        fanFundingMonthly,
        affiliateMonthly,
        totalEcosystemMonthly,
        totalEcosystemYearly: totalEcosystemMonthly * 12
      },
      comparison: {
        socialBladeMin: naiveSocialBladeMin,
        socialBladeMax: naiveSocialBladeMax,
        socialBladeMid: naiveMidpoint,
        trueRpmMid: monthlyTotalAdSense,
        gapPercent: naiveMidpoint > 0 ? Math.round(((monthlyTotalAdSense - naiveMidpoint) / naiveMidpoint) * 100) : 0,
        isOverEstimatedByGeneric
      },
      countryBreakdown: countryRevenueContribution
    };
  }

  /**
   * Generate 12-Month Views & Earnings Division with Seasonality and "This Month" focus
   */
  generateMonthlyDivision(baseCalc, currentMonthIndex = new Date().getMonth()) {
    const MONTH_NAMES = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    // YouTube AdSense seasonality multipliers based on advertiser budget cycles
    const SEASONALITY = [
      { mult: 0.82, label: 'Q1 Post-holiday ad budget reset' },
      { mult: 0.88, label: 'Q1 Gradual ramp' },
      { mult: 0.96, label: 'Q1 Close & spring campaigns' },
      { mult: 1.00, label: 'Q2 Baseline' },
      { mult: 1.03, label: 'Q2 Brand product launches' },
      { mult: 1.06, label: 'Q2 Mid-year budget flush' },
      { mult: 0.97, label: 'Q3 Summer viewer lull' },
      { mult: 1.04, label: 'Q3 Back-to-school push' },
      { mult: 1.08, label: 'Q3 Fiscal close' },
      { mult: 1.16, label: 'Q4 Holiday inventory pre-roll' },
      { mult: 1.34, label: 'Q4 Black Friday / Cyber Peak' },
      { mult: 1.45, label: 'Q4 Christmas & Holiday frenzy' }
    ];

    const monthlyViews = baseCalc.views.total;
    const longViews = baseCalc.views.long;
    const shortsViews = baseCalc.views.shorts;
    const isMonetized = baseCalc.earnings.isMonetized;
    const baseLongRevenue = baseCalc.earnings.longRevenue;
    const baseShortsRevenue = baseCalc.earnings.shortsRevenue;

    let cumulativeAdSense = 0;
    let cumulativeViews = 0;

    const months = MONTH_NAMES.map((name, index) => {
      const season = SEASONALITY[index];
      // Slight natural viewer variance across months (+- 3%)
      const viewVar = 1.0 + (index % 3 === 2 ? 0.03 : index % 3 === 0 ? -0.02 : 0.01);
      const mViews = Math.round(monthlyViews * viewVar);
      const mLongViews = Math.round(longViews * viewVar);
      const mShortsViews = Math.round(shortsViews * viewVar);

      const mLongRevenue = isMonetized ? baseLongRevenue * season.mult * viewVar : 0;
      const mShortsRevenue = isMonetized ? baseShortsRevenue * (1 + (season.mult - 1) * 0.4) * viewVar : 0;
      const mTotalRevenue = mLongRevenue + mShortsRevenue;

      cumulativeAdSense += mTotalRevenue;
      cumulativeViews += mViews;

      return {
        index,
        name,
        shortName: name.substring(0, 3),
        isCurrentMonth: index === currentMonthIndex,
        seasonMultiplier: season.mult,
        seasonNote: season.label,
        views: mViews,
        longViews: mLongViews,
        shortsViews: mShortsViews,
        longRevenue: mLongRevenue,
        shortsRevenue: mShortsRevenue,
        totalRevenue: mTotalRevenue,
        effectiveRpm: mViews > 0 ? (mTotalRevenue / mViews) * 1000 : 0,
        cumulativeRevenue: cumulativeAdSense
      };
    });

    return {
      currentMonthIndex,
      currentMonthName: MONTH_NAMES[currentMonthIndex],
      thisMonthRevenue: months[currentMonthIndex].totalRevenue,
      thisMonthViews: months[currentMonthIndex].views,
      thisMonthLongRevenue: months[currentMonthIndex].longRevenue,
      thisMonthShortsRevenue: months[currentMonthIndex].shortsRevenue,
      annualDividedRevenue: cumulativeAdSense,
      annualTotalViews: cumulativeViews,
      averageMonthlyRevenue: cumulativeAdSense / 12,
      averageMonthlyViews: cumulativeViews / 12,
      months
    };
  }
}
