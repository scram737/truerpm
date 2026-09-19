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
    adblockPercent = 25,
    subscribers = 100000,
    hasJoinButton = false,
    countryCode = 'US',
    exchangeRate = 96.00
  }) {
    const COUNTRY_DATABASE = COUNTRY_DATA;
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

    const countryBreakdown = normalizedTraffic.map(t => {
      const country = COUNTRY_DATABASE.find(c => c.code === t.code) || {
        code: t.code,
        name: t.code,
        flag: '🌐',
        tier: 'Tier 3',
        baseRpm: 0.80,
        minRpm: 0.30,
        maxRpm: 1.80,
        fillRate: 0.65,
        shortsRpm: 0.020,
        sponsorCpm: 2.00
      };

      const share = t.normalizedShare;
      const cViews = monthlyViews * share;
      const cLongViews = longViews * share;
      const cShortsViews = shortsViews * share;

      const cLongMonetized = longMonetizedViews * share;
      const cShortsMonetized = shortsMonetizedViews * share;

      // Realistic CPM application: Long-form gets full niche and duration uplift
      const effectiveCountryLongRpm = country.baseRpm * niche.multiplier * duration.multiplier;
      
      // Shorts RPM has a much smaller niche uplift (ad pool distribution model)
      const effectiveCountryShortsRpm = country.shortsRpm * Math.min(1.4, Math.max(0.7, 1 + (niche.multiplier - 1) * 0.35));

      const countryLongRevenue = isMonetized ? (cLongMonetized / 1000) * effectiveCountryLongRpm : 0;
      const countryShortsRevenue = isMonetized ? (cShortsMonetized / 1000) * effectiveCountryShortsRpm : 0;
      const countryTotalRevenue = countryLongRevenue + countryShortsRevenue;

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

    // Channel Memberships (Join Button Perks):
    // 0.1% of subscribers join for perks ONLY IF Join button is enabled on YouTube
    const isIndiaChannel = (countryCode === 'IN') || (traffic && traffic[0]?.code === 'IN');
    const currentFxRate = Math.max(1, Number(exchangeRate) || 96.00);
    const membershipTierPriceInr = 89;
    const membershipTierPriceUsd = isIndiaChannel ? (membershipTierPriceInr / currentFxRate) : 2.99; // ₹89/mo in India (~$0.93 at ₹96/USD), $2.99/mo standard global
    const paidMembersCount = (isMonetized && hasJoinButton) ? Math.round(subscribers * 0.001) : 0;
    const membershipsMonthlyGrossUsd = paidMembersCount * membershipTierPriceUsd;
    // YouTube takes 30% cut on Channel Memberships (Creator receives 70% net payout)
    const membershipsMonthlyNetUsd = membershipsMonthlyGrossUsd * 0.70;

    // Fan Funding (SuperChats / SuperThanks during live streams & uploads)
    const superChatsMonthly = isMonetized 
      ? (monthlyTotalAdSense * 0.04 * (tier1Views / monthlyViews * 1.5 + tier2Views / monthlyViews * 0.6 + tier3Views / monthlyViews * 0.2))
      : 0;

    const fanFundingMonthly = membershipsMonthlyNetUsd + superChatsMonthly;

    // Affiliate / Merch: can work even if unmonetized!
    const affiliateMonthly = (potentialTotalAdSense > 0 ? potentialTotalAdSense : 500) * (niche.id === 'tech' || niche.id === 'finance' || niche.id === 'automotive' ? 0.25 : 0.06);

    // Total Creator Ecosystem strictly reflects the 3 core revenue pillars:
    // AdSense + Brand Deals + Memberships (100% mathematically transparent)
    const totalEcosystemMonthly = monthlyTotalAdSense + brandDealMonthly + membershipsMonthlyNetUsd;
    const totalEcosystemWithAffiliateMonthly = totalEcosystemMonthly + superChatsMonthly + (longViews > 50000 ? affiliateMonthly : 0);

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
        isMonetized,
        hasJoinButton,
        paidMembersCount
      },
      earnings: {
        isMonetized,
        hasJoinButton,
        subscribers,
        paidMembersCount,
        membershipTierPriceUsd,
        membershipTierPriceInr,
        membershipsMonthlyGrossUsd,
        membershipsMonthlyNetUsd,
        superChatsMonthly,
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

  /**
   * Calculate Dollar Conversion & Indian Income Tax (ITR Slabs + 44ADA + US W-8BEN Withholding)
   */
  calculateIndiaTax({
    monthlyGrossUsd = 0,
    usTrafficSharePercent = 0,
    exchangeRate = 96.00,
    regime = '44ada',
    flatPercent = 20,
    hasW8Ben = true
  }) {
    const rate = Math.max(1, Number(exchangeRate) || 96.00);
    const monthlyGrossInr = monthlyGrossUsd * rate;
    const annualGrossInr = monthlyGrossInr * 12;
    const annualGrossUsd = monthlyGrossUsd * 12;

    // 1. US Withholding Tax (W-8BEN Treaty under Article 12)
    // Applied ONLY to earnings from viewers located in the United States
    const usEarningsMonthlyUsd = monthlyGrossUsd * ((Number(usTrafficSharePercent) || 0) / 100);
    const usTaxRate = hasW8Ben ? 0.15 : 0.30;
    const usWithholdingMonthlyUsd = usEarningsMonthlyUsd * usTaxRate;
    const usWithholdingMonthlyInr = usWithholdingMonthlyUsd * rate;
    const usWithholdingAnnualInr = usWithholdingMonthlyInr * 12;

    // 2. Indian Income Tax Computation (Annual Basis)
    let taxableIncomeAnnualInr = 0;
    let businessExpensesAllowedInr = 0;
    let baseTaxAnnualInr = 0;
    let isRebateApplied = false;

    if (regime === '44ada') {
      // Section 44ADA Presumptive Taxation Scheme: 50% of gross receipts considered business expenses
      businessExpensesAllowedInr = annualGrossInr * 0.50;
      taxableIncomeAnnualInr = annualGrossInr * 0.50;
    } else if (regime === 'flat') {
      businessExpensesAllowedInr = 0;
      taxableIncomeAnnualInr = annualGrossInr;
      baseTaxAnnualInr = annualGrossInr * ((Number(flatPercent) || 20) / 100);
    } else {
      // Standard Slabs (New Tax Regime with standard deduction of ₹75,000 for FY 2024-25 / FY 2025-26)
      businessExpensesAllowedInr = Math.min(annualGrossInr, 75000);
      taxableIncomeAnnualInr = Math.max(0, annualGrossInr - 75000);
    }

    // Compute slabs if not flat
    const slabBreakdown = [];
    if (regime !== 'flat') {
      if (taxableIncomeAnnualInr <= 700000) {
        // Section 87A rebate: 100% tax rebate if taxable income <= ₹7,00,000 under New Tax Regime
        baseTaxAnnualInr = 0;
        isRebateApplied = taxableIncomeAnnualInr > 0;
        slabBreakdown.push({ slab: 'Up to ₹7,00,000', taxable: taxableIncomeAnnualInr, rate: '0% (Sec 87A Full Rebate)', tax: 0 });
      } else {
        // Slabs:
        // 0 to 3L: 0%
        // 3L to 7L: 5% (max 20,000)
        // 7L to 10L: 10% (max 30,000)
        // 10L to 12L: 15% (max 30,000)
        // 12L to 15L: 20% (max 60,000)
        // > 15L: 30%
        let rem = taxableIncomeAnnualInr;

        // 0 - 3L
        const s1 = Math.min(rem, 300000);
        slabBreakdown.push({ slab: 'Up to ₹3,00,000', taxable: s1, rate: '0%', tax: 0 });
        rem = Math.max(0, rem - 300000);

        // 3L - 7L (4L window)
        const s2 = Math.min(rem, 400000);
        const t2 = s2 * 0.05;
        baseTaxAnnualInr += t2;
        if (s2 > 0) slabBreakdown.push({ slab: '₹3,00,001 – ₹7,00,000', taxable: s2, rate: '5%', tax: t2 });
        rem = Math.max(0, rem - 400000);

        // 7L - 10L (3L window)
        const s3 = Math.min(rem, 300000);
        const t3 = s3 * 0.10;
        baseTaxAnnualInr += t3;
        if (s3 > 0) slabBreakdown.push({ slab: '₹7,00,001 – ₹10,00,000', taxable: s3, rate: '10%', tax: t3 });
        rem = Math.max(0, rem - 300000);

        // 10L - 12L (2L window)
        const s4 = Math.min(rem, 200000);
        const t4 = s4 * 0.15;
        baseTaxAnnualInr += t4;
        if (s4 > 0) slabBreakdown.push({ slab: '₹10,00,001 – ₹12,00,000', taxable: s4, rate: '15%', tax: t4 });
        rem = Math.max(0, rem - 200000);

        // 12L - 15L (3L window)
        const s5 = Math.min(rem, 300000);
        const t5 = s5 * 0.20;
        baseTaxAnnualInr += t5;
        if (s5 > 0) slabBreakdown.push({ slab: '₹12,00,001 – ₹15,00,000', taxable: s5, rate: '20%', tax: t5 });
        rem = Math.max(0, rem - 300000);

        // Above 15L
        if (rem > 0) {
          const t6 = rem * 0.30;
          baseTaxAnnualInr += t6;
          slabBreakdown.push({ slab: 'Above ₹15,00,000', taxable: rem, rate: '30%', tax: t6 });
        }
      }
    }

    // 3. Surcharge on Ultra-High Income (> ₹50 Lakhs)
    let surchargeAnnualInr = 0;
    if (taxableIncomeAnnualInr > 20000000) {
      surchargeAnnualInr = baseTaxAnnualInr * 0.25;
    } else if (taxableIncomeAnnualInr > 10000000) {
      surchargeAnnualInr = baseTaxAnnualInr * 0.15;
    } else if (taxableIncomeAnnualInr > 5000000) {
      surchargeAnnualInr = baseTaxAnnualInr * 0.10;
    }

    // 4. Health & Education Cess (4% on Tax + Surcharge)
    const cessAnnualInr = (baseTaxAnnualInr + surchargeAnnualInr) * 0.04;
    const indianIncomeTaxAnnualInr = baseTaxAnnualInr + surchargeAnnualInr + cessAnnualInr;
    const indianIncomeTaxMonthlyInr = indianIncomeTaxAnnualInr / 12;

    // 5. Total Combined Deductions & Final In-Hand
    const totalDeductionsMonthlyInr = usWithholdingMonthlyInr + indianIncomeTaxMonthlyInr;
    const totalDeductionsAnnualInr = usWithholdingAnnualInr + indianIncomeTaxAnnualInr;

    const netInHandMonthlyInr = Math.max(0, monthlyGrossInr - totalDeductionsMonthlyInr);
    const netInHandAnnualInr = Math.max(0, annualGrossInr - totalDeductionsAnnualInr);

    const effectiveTaxRatePercent = annualGrossInr > 0 
      ? (totalDeductionsAnnualInr / annualGrossInr) * 100 
      : 0;

    return {
      exchangeRate: rate,
      monthlyGrossUsd,
      annualGrossUsd,
      grossMonthlyUsd: monthlyGrossUsd,
      grossAnnualUsd: annualGrossUsd,
      monthlyGrossInr,
      annualGrossInr,
      grossMonthlyInr: monthlyGrossInr,
      usTrafficSharePercent,
      usEarningsMonthlyUsd,
      usWithholdingMonthlyUsd,
      usWithholdingMonthlyInr,
      usWithholdingAnnualInr,
      usTaxRatePercent: Math.round(usTaxRate * 100),
      businessExpensesAllowedInr,
      taxableIncomeAnnualInr,
      isRebateApplied,
      baseTaxAnnualInr,
      surchargeAnnualInr,
      cessAnnualInr,
      indianIncomeTaxAnnualInr,
      indianIncomeTaxMonthlyInr,
      totalDeductionsMonthlyInr,
      totalDeductionsAnnualInr,
      netInHandMonthlyInr,
      netInHandAnnualInr,
      effectiveTaxRatePercent,
      slabBreakdown,
      regime
    };
  }
}
