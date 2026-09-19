/**
 * TrueRPM - YouTube Realistic Earnings & Geo-Traffic Dataset
 * Based on 2024-2026 creator AdSense analytics, CPM auctions, and regional purchasing power.
 */

export const COUNTRY_DATA = [
  // Tier 1A: Ultra-High CPM ($4.50 - $18.00 base RPM for long-form)
  { code: 'US', name: 'United States', flag: '🇺🇸', tier: 'Tier 1A', baseRpm: 7.80, minRpm: 4.50, maxRpm: 18.50, fillRate: 0.92, shortsRpm: 0.085, region: 'North America', sponsorCpm: 25.00 },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', tier: 'Tier 1A', baseRpm: 6.90, minRpm: 4.20, maxRpm: 16.00, fillRate: 0.90, shortsRpm: 0.075, region: 'North America', sponsorCpm: 22.00 },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', tier: 'Tier 1A', baseRpm: 7.20, minRpm: 4.40, maxRpm: 17.50, fillRate: 0.91, shortsRpm: 0.080, region: 'Oceania', sponsorCpm: 24.00 },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', tier: 'Tier 1A', baseRpm: 6.50, minRpm: 4.00, maxRpm: 15.50, fillRate: 0.89, shortsRpm: 0.070, region: 'Europe', sponsorCpm: 21.00 },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', tier: 'Tier 1A', baseRpm: 8.50, minRpm: 5.20, maxRpm: 21.00, fillRate: 0.94, shortsRpm: 0.090, region: 'Europe', sponsorCpm: 26.00 },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', tier: 'Tier 1A', baseRpm: 8.20, minRpm: 5.00, maxRpm: 20.00, fillRate: 0.93, shortsRpm: 0.090, region: 'Europe', sponsorCpm: 26.00 },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', tier: 'Tier 1A', baseRpm: 6.20, minRpm: 3.80, maxRpm: 14.50, fillRate: 0.88, shortsRpm: 0.065, region: 'Europe', sponsorCpm: 20.00 },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', tier: 'Tier 1A', baseRpm: 6.40, minRpm: 3.90, maxRpm: 15.00, fillRate: 0.89, shortsRpm: 0.070, region: 'Oceania', sponsorCpm: 20.00 },

  // Tier 1B: High CPM ($2.80 - $8.50 base RPM)
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', tier: 'Tier 1B', baseRpm: 5.40, minRpm: 3.20, maxRpm: 12.00, fillRate: 0.87, shortsRpm: 0.060, region: 'Europe', sponsorCpm: 17.00 },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', tier: 'Tier 1B', baseRpm: 5.60, minRpm: 3.40, maxRpm: 12.50, fillRate: 0.88, shortsRpm: 0.060, region: 'Europe', sponsorCpm: 18.00 },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', tier: 'Tier 1B', baseRpm: 5.80, minRpm: 3.50, maxRpm: 13.00, fillRate: 0.88, shortsRpm: 0.065, region: 'Europe', sponsorCpm: 18.00 },
  { code: 'FR', name: 'France', flag: '🇫🇷', tier: 'Tier 1B', baseRpm: 4.80, minRpm: 2.90, maxRpm: 10.80, fillRate: 0.85, shortsRpm: 0.055, region: 'Europe', sponsorCpm: 15.00 },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', tier: 'Tier 1B', baseRpm: 5.20, minRpm: 3.10, maxRpm: 11.50, fillRate: 0.87, shortsRpm: 0.060, region: 'Asia', sponsorCpm: 17.00 },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', tier: 'Tier 1B', baseRpm: 4.60, minRpm: 2.70, maxRpm: 10.50, fillRate: 0.84, shortsRpm: 0.050, region: 'Middle East', sponsorCpm: 16.00 },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', tier: 'Tier 1B', baseRpm: 4.20, minRpm: 2.50, maxRpm: 9.80, fillRate: 0.86, shortsRpm: 0.050, region: 'Asia', sponsorCpm: 14.00 },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', tier: 'Tier 1B', baseRpm: 4.00, minRpm: 2.40, maxRpm: 9.20, fillRate: 0.85, shortsRpm: 0.048, region: 'Asia', sponsorCpm: 13.50 },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', tier: 'Tier 1B', baseRpm: 5.30, minRpm: 3.20, maxRpm: 12.00, fillRate: 0.87, shortsRpm: 0.058, region: 'Europe', sponsorCpm: 17.00 },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', tier: 'Tier 1B', baseRpm: 5.10, minRpm: 3.00, maxRpm: 11.80, fillRate: 0.86, shortsRpm: 0.055, region: 'Europe', sponsorCpm: 16.50 },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', tier: 'Tier 1B', baseRpm: 4.90, minRpm: 2.90, maxRpm: 11.00, fillRate: 0.85, shortsRpm: 0.052, region: 'Europe', sponsorCpm: 15.50 },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', tier: 'Tier 1B', baseRpm: 4.50, minRpm: 2.60, maxRpm: 10.20, fillRate: 0.83, shortsRpm: 0.048, region: 'Middle East', sponsorCpm: 15.00 },

  // Tier 2: Medium CPM ($1.00 - $3.40 base RPM)
  { code: 'ES', name: 'Spain', flag: '🇪🇸', tier: 'Tier 2', baseRpm: 2.70, minRpm: 1.60, maxRpm: 6.20, fillRate: 0.80, shortsRpm: 0.038, region: 'Europe', sponsorCpm: 9.00 },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', tier: 'Tier 2', baseRpm: 2.50, minRpm: 1.50, maxRpm: 5.80, fillRate: 0.79, shortsRpm: 0.036, region: 'Europe', sponsorCpm: 8.50 },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', tier: 'Tier 2', baseRpm: 2.10, minRpm: 1.20, maxRpm: 4.80, fillRate: 0.77, shortsRpm: 0.032, region: 'Europe', sponsorCpm: 7.00 },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', tier: 'Tier 2', baseRpm: 2.80, minRpm: 1.60, maxRpm: 6.50, fillRate: 0.81, shortsRpm: 0.040, region: 'Middle East', sponsorCpm: 9.50 },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', tier: 'Tier 2', baseRpm: 1.60, minRpm: 0.90, maxRpm: 3.80, fillRate: 0.75, shortsRpm: 0.026, region: 'Latin America', sponsorCpm: 5.50 },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', tier: 'Tier 2', baseRpm: 1.45, minRpm: 0.85, maxRpm: 3.50, fillRate: 0.74, shortsRpm: 0.024, region: 'Latin America', sponsorCpm: 5.00 },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', tier: 'Tier 2', baseRpm: 1.90, minRpm: 1.10, maxRpm: 4.40, fillRate: 0.76, shortsRpm: 0.030, region: 'Africa', sponsorCpm: 6.50 },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', tier: 'Tier 2', baseRpm: 1.20, minRpm: 0.70, maxRpm: 2.90, fillRate: 0.71, shortsRpm: 0.020, region: 'Europe/Asia', sponsorCpm: 4.00 },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', tier: 'Tier 2', baseRpm: 1.70, minRpm: 1.00, maxRpm: 4.00, fillRate: 0.75, shortsRpm: 0.028, region: 'Asia', sponsorCpm: 6.00 },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', tier: 'Tier 2', baseRpm: 1.30, minRpm: 0.75, maxRpm: 3.10, fillRate: 0.72, shortsRpm: 0.022, region: 'Asia', sponsorCpm: 4.50 },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', tier: 'Tier 2', baseRpm: 2.20, minRpm: 1.30, maxRpm: 5.00, fillRate: 0.78, shortsRpm: 0.034, region: 'Europe', sponsorCpm: 7.50 },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', tier: 'Tier 2', baseRpm: 2.00, minRpm: 1.20, maxRpm: 4.60, fillRate: 0.76, shortsRpm: 0.030, region: 'Europe', sponsorCpm: 6.80 },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', tier: 'Tier 2', baseRpm: 1.50, minRpm: 0.85, maxRpm: 3.60, fillRate: 0.73, shortsRpm: 0.025, region: 'Latin America', sponsorCpm: 5.20 },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', tier: 'Tier 2', baseRpm: 1.10, minRpm: 0.60, maxRpm: 2.60, fillRate: 0.70, shortsRpm: 0.018, region: 'Latin America', sponsorCpm: 3.50 },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', tier: 'Tier 2', baseRpm: 1.15, minRpm: 0.65, maxRpm: 2.70, fillRate: 0.70, shortsRpm: 0.019, region: 'Latin America', sponsorCpm: 3.80 },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', tier: 'Tier 2', baseRpm: 1.80, minRpm: 1.05, maxRpm: 4.20, fillRate: 0.75, shortsRpm: 0.027, region: 'Europe', sponsorCpm: 6.00 },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', tier: 'Tier 2', baseRpm: 1.40, minRpm: 0.80, maxRpm: 3.30, fillRate: 0.72, shortsRpm: 0.022, region: 'Europe', sponsorCpm: 4.80 },

  // Tier 3: Emerging / Low CPM ($0.18 - $0.90 base RPM)
  { code: 'IN', name: 'India', flag: '🇮🇳', tier: 'Tier 3', baseRpm: 0.52, minRpm: 0.25, maxRpm: 1.40, fillRate: 0.62, shortsRpm: 0.012, region: 'South Asia', sponsorCpm: 1.80 },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', tier: 'Tier 3', baseRpm: 0.38, minRpm: 0.18, maxRpm: 0.95, fillRate: 0.55, shortsRpm: 0.009, region: 'South Asia', sponsorCpm: 1.20 },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', tier: 'Tier 3', baseRpm: 0.35, minRpm: 0.16, maxRpm: 0.90, fillRate: 0.54, shortsRpm: 0.008, region: 'South Asia', sponsorCpm: 1.10 },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', tier: 'Tier 3', baseRpm: 0.75, minRpm: 0.40, maxRpm: 1.80, fillRate: 0.68, shortsRpm: 0.015, region: 'Southeast Asia', sponsorCpm: 2.50 },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', tier: 'Tier 3', baseRpm: 0.65, minRpm: 0.35, maxRpm: 1.60, fillRate: 0.65, shortsRpm: 0.014, region: 'Southeast Asia', sponsorCpm: 2.20 },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', tier: 'Tier 3', baseRpm: 0.70, minRpm: 0.38, maxRpm: 1.70, fillRate: 0.66, shortsRpm: 0.015, region: 'Southeast Asia', sponsorCpm: 2.40 },
  { code: 'EG', name: 'Egypt', flag: 'EG', tier: 'Tier 3', baseRpm: 0.45, minRpm: 0.22, maxRpm: 1.15, fillRate: 0.58, shortsRpm: 0.010, region: 'North Africa', sponsorCpm: 1.50 },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', tier: 'Tier 3', baseRpm: 0.48, minRpm: 0.24, maxRpm: 1.25, fillRate: 0.60, shortsRpm: 0.011, region: 'Sub-Saharan Africa', sponsorCpm: 1.60 },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', tier: 'Tier 3', baseRpm: 0.55, minRpm: 0.28, maxRpm: 1.35, fillRate: 0.62, shortsRpm: 0.012, region: 'Sub-Saharan Africa', sponsorCpm: 1.90 },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', tier: 'Tier 3', baseRpm: 0.32, minRpm: 0.15, maxRpm: 0.85, fillRate: 0.52, shortsRpm: 0.007, region: 'South Asia', sponsorCpm: 1.00 },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', tier: 'Tier 3', baseRpm: 0.42, minRpm: 0.20, maxRpm: 1.10, fillRate: 0.56, shortsRpm: 0.009, region: 'South Asia', sponsorCpm: 1.40 },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', tier: 'Tier 3', baseRpm: 0.40, minRpm: 0.19, maxRpm: 1.05, fillRate: 0.56, shortsRpm: 0.009, region: 'North Africa', sponsorCpm: 1.30 },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', tier: 'Tier 3', baseRpm: 0.50, minRpm: 0.25, maxRpm: 1.30, fillRate: 0.60, shortsRpm: 0.011, region: 'North Africa', sponsorCpm: 1.70 },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', tier: 'Tier 3', baseRpm: 0.85, minRpm: 0.45, maxRpm: 2.10, fillRate: 0.68, shortsRpm: 0.016, region: 'Latin America', sponsorCpm: 2.80 },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', tier: 'Tier 3', baseRpm: 0.80, minRpm: 0.42, maxRpm: 2.00, fillRate: 0.67, shortsRpm: 0.015, region: 'Latin America', sponsorCpm: 2.60 },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', tier: 'Tier 3', baseRpm: 0.90, minRpm: 0.48, maxRpm: 2.20, fillRate: 0.69, shortsRpm: 0.018, region: 'Europe', sponsorCpm: 3.00 },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', tier: 'Tier 3', baseRpm: 0.46, minRpm: 0.23, maxRpm: 1.20, fillRate: 0.59, shortsRpm: 0.010, region: 'Sub-Saharan Africa', sponsorCpm: 1.50 }
];

export const NICHES = [
  { id: 'finance', name: 'Personal Finance & Investing', multiplier: 3.20, adblockRate: 24, description: 'High advertiser bids from banks, trading apps, crypto & credit cards' },
  { id: 'tech', name: 'Tech, Software & Gadgets', multiplier: 2.25, adblockRate: 42, description: 'SaaS, VPN, consumer hardware and developer tools (High adblocker adoption)' },
  { id: 'business', name: 'Business, eCommerce & Real Estate', multiplier: 2.60, adblockRate: 22, description: 'High ticket services, dropshipping courses, B2B software' },
  { id: 'education', name: 'Education, How-To & Productivity', multiplier: 1.50, adblockRate: 28, description: 'Online courses, learning platforms and professional skills' },
  { id: 'automotive', name: 'Cars & Automotive', multiplier: 1.65, adblockRate: 26, description: 'Automobile dealerships, insurance, parts & accessories' },
  { id: 'health', name: 'Fitness, Health & Nutrition', multiplier: 1.35, adblockRate: 20, description: 'Supplements, workout gear and wellness subscriptions' },
  { id: 'travel', name: 'Travel & Lifestyle', multiplier: 1.20, adblockRate: 18, description: 'Airlines, hotels, booking agencies and gear' },
  { id: 'entertainment', name: 'Entertainment & Commentary', multiplier: 1.00, adblockRate: 25, description: 'Baseline standard AdSense monetization' },
  { id: 'gaming', name: 'Gaming, Let\'s Play & Esports', multiplier: 0.72, adblockRate: 45, description: 'Highest adblock rate (~45%) among young desktop viewers' },
  { id: 'comedy', name: 'Comedy & Viral Skits', multiplier: 0.80, adblockRate: 22, description: 'Broad general appeal, high mobile viewership' },
  { id: 'food', name: 'Food, Cooking & ASMR', multiplier: 1.05, adblockRate: 16, description: 'Grocery, kitchenware and delivery services' },
  { id: 'kids', name: 'Kids Content (Made for Kids)', multiplier: 0.38, adblockRate: 12, description: 'COPPA regulation prohibits targeted ads, heavily reducing CPM' },
  { id: 'music', name: 'Music, Covers & Lyrics', multiplier: 0.45, adblockRate: 20, description: 'High copyright claims and background audio listening without screen ads' }
];

export const DURATION_MODIFIERS = [
  { id: 'short_video', name: 'Under 8 minutes', multiplier: 1.00, midRolls: 0, description: 'Pre-roll and post-roll only' },
  { id: 'mid_video', name: '8 – 14 minutes', multiplier: 1.70, midRolls: 2, description: '1-2 mid-roll ads inserted (standard YouTube optimization)' },
  { id: 'long_video', name: '15 – 30 minutes', multiplier: 2.35, midRolls: 4, description: '3-4 mid-roll ads with higher viewer watch time' },
  { id: 'extended_video', name: '30+ minutes / Podcasts', multiplier: 2.90, midRolls: 6, description: 'Deep dives, podcasts, documentaries with maximum ad inventory' }
];

export const PRESET_CHANNELS = [
  {
    id: 'south_asia_tech',
    name: 'South Asia Tech & Reviews',
    badge: 'Regional Giant',
    viewsPerMonth: 12000000,
    shortsShare: 20,
    niche: 'tech',
    duration: 'mid_video',
    trafficDistribution: [
      { code: 'IN', share: 78 },
      { code: 'PK', share: 7 },
      { code: 'BD', share: 5 },
      { code: 'AE', share: 4 },
      { code: 'US', share: 4 },
      { code: 'GB', share: 2 }
    ],
    socialBladeRange: { min: 3000, max: 48000 },
    description: '12M views/month channel with high volume from India, Pakistan, and GCC expatriates.'
  },
  {
    id: 'us_finance_guru',
    name: 'US Wealth & Stock Market',
    badge: 'High RPM Niche',
    viewsPerMonth: 1500000,
    shortsShare: 15,
    niche: 'finance',
    duration: 'mid_video',
    trafficDistribution: [
      { code: 'US', share: 72 },
      { code: 'CA', share: 12 },
      { code: 'GB', share: 8 },
      { code: 'AU', share: 5 },
      { code: 'DE', share: 3 }
    ],
    socialBladeRange: { min: 375, max: 6000 },
    description: '1.5M views/month personal finance channel based in the US with top-tier purchasing audience.'
  },
  {
    id: 'global_viral_shorts',
    name: 'Viral Shorts Factory',
    badge: 'Shorts Dilution Case',
    viewsPerMonth: 75000000,
    shortsShare: 92,
    niche: 'entertainment',
    duration: 'short_video',
    trafficDistribution: [
      { code: 'IN', share: 35 },
      { code: 'US', share: 15 },
      { code: 'BR', share: 15 },
      { code: 'ID', share: 12 },
      { code: 'PH', share: 10 },
      { code: 'MX', share: 8 },
      { code: 'GB', share: 5 }
    ],
    socialBladeRange: { min: 18750, max: 300000 },
    description: '75M views/month channel dominated by YouTube Shorts with broad global and emerging market reach.'
  },
  {
    id: 'global_gaming_streamer',
    name: 'Competitive Gaming & Highlights',
    badge: 'Gaming Demographics',
    viewsPerMonth: 8000000,
    shortsShare: 40,
    niche: 'gaming',
    duration: 'mid_video',
    trafficDistribution: [
      { code: 'US', share: 30 },
      { code: 'GB', share: 15 },
      { code: 'DE', share: 10 },
      { code: 'BR', share: 15 },
      { code: 'PH', share: 15 },
      { code: 'PL', share: 15 }
    ],
    socialBladeRange: { min: 2000, max: 32000 },
    description: '8M views/month gaming channel with youthful audience and high adblock usage.'
  },
  {
    id: 'euro_lifestyle_travel',
    name: 'European Travel & Vlogs',
    badge: 'Balanced EU Reach',
    viewsPerMonth: 3000000,
    shortsShare: 25,
    niche: 'travel',
    duration: 'long_video',
    trafficDistribution: [
      { code: 'GB', share: 25 },
      { code: 'DE', share: 25 },
      { code: 'FR', share: 20 },
      { code: 'US', share: 15 },
      { code: 'ES', share: 15 }
    ],
    socialBladeRange: { min: 750, max: 12000 },
    description: '3M views/month cinematic long-form travel channel with affluent European viewers.'
  }
];

export const REGIONAL_PRESETS = [
  {
    id: 'south_asia_dom',
    name: 'South Asia Dominant (85% IN/PK/BD)',
    distribution: [
      { code: 'IN', share: 75 },
      { code: 'PK', share: 6 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 5 },
      { code: 'US', share: 6 },
      { code: 'GB', share: 4 }
    ]
  },
  {
    id: 'north_america_pure',
    name: 'North America Pure (85% US/CA)',
    distribution: [
      { code: 'US', share: 75 },
      { code: 'CA', share: 12 },
      { code: 'GB', share: 7 },
      { code: 'AU', share: 4 },
      { code: 'DE', share: 2 }
    ]
  },
  {
    id: 'latin_america_mix',
    name: 'Latin America Core (BR, MX, CO, AR)',
    distribution: [
      { code: 'MX', share: 38 },
      { code: 'BR', share: 28 },
      { code: 'CO', share: 14 },
      { code: 'AR', share: 10 },
      { code: 'US', share: 10 }
    ]
  },
  {
    id: 'western_europe',
    name: 'Western Europe Cluster (UK, DE, FR, NL)',
    distribution: [
      { code: 'GB', share: 35 },
      { code: 'DE', share: 28 },
      { code: 'FR', share: 17 },
      { code: 'NL', share: 10 },
      { code: 'US', share: 10 }
    ]
  },
  {
    id: 'global_balanced',
    name: 'Global Equal Distribution',
    distribution: [
      { code: 'US', share: 25 },
      { code: 'IN', share: 25 },
      { code: 'BR', share: 15 },
      { code: 'GB', share: 15 },
      { code: 'PH', share: 10 },
      { code: 'DE', share: 10 }
    ]
  }
];

export const GEO_INFERENCE_RULES = {
  IN: [
    { code: 'IN', share: 80 },
    { code: 'PK', share: 7 },
    { code: 'BD', share: 4 },
    { code: 'AE', share: 4 },
    { code: 'US', share: 3 },
    { code: 'GB', share: 2 }
  ],
  US: [
    { code: 'US', share: 72 },
    { code: 'GB', share: 11 },
    { code: 'CA', share: 8 },
    { code: 'AU', share: 5 },
    { code: 'DE', share: 4 }
  ],
  GB: [
    { code: 'GB', share: 42 },
    { code: 'US', share: 32 },
    { code: 'CA', share: 9 },
    { code: 'AU', share: 8 },
    { code: 'DE', share: 5 },
    { code: 'IE', share: 4 }
  ],
  CA: [
    { code: 'US', share: 58 },
    { code: 'CA', share: 22 },
    { code: 'GB', share: 9 },
    { code: 'AU', share: 5 },
    { code: 'DE', share: 6 }
  ],
  AU: [
    { code: 'AU', share: 38 },
    { code: 'US', share: 36 },
    { code: 'GB', share: 12 },
    { code: 'NZ', share: 8 },
    { code: 'CA', share: 6 }
  ],
  BR: [
    { code: 'BR', share: 85 },
    { code: 'PT', share: 6 },
    { code: 'US', share: 4 },
    { code: 'MX', share: 3 },
    { code: 'AR', share: 2 }
  ],
  MX: [
    { code: 'MX', share: 52 },
    { code: 'US', share: 18 },
    { code: 'CO', share: 12 },
    { code: 'AR', share: 10 },
    { code: 'ES', share: 8 }
  ],
  DE: [
    { code: 'DE', share: 68 },
    { code: 'AT', share: 14 },
    { code: 'CH', share: 10 },
    { code: 'US', share: 5 },
    { code: 'GB', share: 3 }
  ],
  DEFAULT: [
    { code: 'US', share: 35 },
    { code: 'IN', share: 25 },
    { code: 'GB', share: 15 },
    { code: 'BR', share: 15 },
    { code: 'DE', share: 10 }
  ]
};

export const VERIFIED_CHANNELS = [
  {
    handle: '@999india',
    name: '999India',
    channelId: 'UCQ5yNhhqbTqXxJ34RcQkAcA',
    avatar: 'https://yt3.googleusercontent.com/JW_vWVY8wUGnQcSywCa0DfAiO6vQ54_OjGd1jnGYysfEtGIwAlDAhyX8vWYGxPXR0tzB-b5mqA=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 2570000,
    totalViews: 3878508407,
    videoCount: 750,
    joinedDate: 'Jan 26, 2022',
    channelAgeMonths: 56,
    monthlyViews: 42000000,
    thisMonthViews: 42000000,
    actualViewsByDate: 42000000,
    averageMonthlyViews: 42000000,
    dailyViews: 1400000,
    shortsShare: 95,
    niche: 'comedy',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    hasJoinButton: false,
    monetizationReason: 'Verified YouTube Partner Program (YPP) active. 3.88 Billion lifetime views driven by viral Telugu comedy sketches & shorts (95% Shorts / 5% Long-form).',
    trafficDistribution: [
      { code: 'IN', share: 82 },
      { code: 'PK', share: 6 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 4 },
      { code: 'US', share: 4 }
    ]
  },
  {
    handle: '@filmymoji',
    name: 'Filmymoji',
    channelId: 'UCjNVDW-rkDYR0aOKp3E-2wg',
    avatar: 'https://yt3.googleusercontent.com/ytc/AIdro_l33grX8QP2RB1eB2yKmmLJigk7rCZ_nEApCQz60zDvtXU=s900-c-k-c0x00ffffff-no-rj',
    subscribers: 6110000,
    totalViews: 1699095461,
    videoCount: 527,
    joinedDate: 'Mar 22, 2018',
    channelAgeMonths: 102,
    monthlyViews: 25141000,
    thisMonthViews: 25141000,
    actualViewsByDate: 25141000,
    averageMonthlyViews: 25141000,
    dailyViews: 838033,
    shortsShare: 55,
    niche: 'comedy',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    hasJoinButton: true,
    monetizationReason: 'Verified YouTube Partner Program (YPP) active. Middle Class Madhu animated comedy episodes (8-15 min mid-rolls) driving 1.70B lifetime views.',
    trafficDistribution: [
      { code: 'IN', share: 82 },
      { code: 'AE', share: 5 },
      { code: 'US', share: 5 },
      { code: 'PK', share: 4 },
      { code: 'BD', share: 4 }
    ]
  },
  {
    handle: '@wildboybalu',
    name: 'WildBoyBalu',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subscribers: 125000,
    totalViews: 26600000,
    monthlyViews: 2216667,
    thisMonthViews: 2216667,
    averageMonthlyViews: 2216667,
    dailyViews: 73888,
    shortsShare: 90,
    niche: 'entertainment',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Enrolled in YouTube Partner Program. 24M Shorts / 2.6M Long Form split with 25% AdBlock deduction',
    trafficDistribution: [
      { code: 'IN', share: 82 },
      { code: 'PK', share: 6 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 4 },
      { code: 'US', share: 4 }
    ]
  },
  {
    handle: '@mrbeast',
    name: 'MrBeast',
    avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
    subscribers: 320000000,
    totalViews: 65000000000,
    monthlyViews: 380000000,
    shortsShare: 28,
    niche: 'entertainment',
    duration: 'mid_video',
    countryCode: 'US',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Enrolled in YouTube Partner Program with active AdSense and multi-million ad inventory',
    trafficDistribution: [
      { code: 'US', share: 65 },
      { code: 'GB', share: 10 },
      { code: 'CA', share: 8 },
      { code: 'IN', share: 7 },
      { code: 'AU', share: 5 },
      { code: 'DE', share: 5 }
    ]
  },
  {
    handle: '@carryminati',
    name: 'CarryMinati',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    subscribers: 44500000,
    totalViews: 3850000000,
    monthlyViews: 28000000,
    shortsShare: 32,
    niche: 'comedy',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    hasJoinButton: true,
    monetizationReason: 'YouTube Partner Program active. Majority revenue from long-form comedy videos and Tier-3 view auction',
    trafficDistribution: [
      { code: 'IN', share: 84 },
      { code: 'PK', share: 6 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 3 },
      { code: 'US', share: 3 }
    ]
  },
  {
    handle: '@tseries',
    name: 'T-Series',
    avatar: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=150&auto=format&fit=crop&q=80',
    subscribers: 275000000,
    totalViews: 265000000000,
    monthlyViews: 2400000000,
    shortsShare: 38,
    niche: 'music',
    duration: 'short_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Massive enterprise MCN partner. Music catalog monetization across global streaming',
    trafficDistribution: [
      { code: 'IN', share: 78 },
      { code: 'PK', share: 7 },
      { code: 'BD', share: 5 },
      { code: 'AE', share: 5 },
      { code: 'US', share: 5 }
    ]
  },
  {
    handle: '@mkbhd',
    name: 'Marques Brownlee',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    subscribers: 19500000,
    totalViews: 4300000000,
    monthlyViews: 26000000,
    shortsShare: 35,
    niche: 'tech',
    duration: 'mid_video',
    countryCode: 'US',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Top-tier tech creator. Premium advertiser fill rates from Google, Apple, and consumer tech OEMs',
    trafficDistribution: [
      { code: 'US', share: 68 },
      { code: 'GB', share: 11 },
      { code: 'CA', share: 8 },
      { code: 'AU', share: 5 },
      { code: 'DE', share: 4 },
      { code: 'IN', share: 4 }
    ]
  },
  {
    handle: '@grahamstephan',
    name: 'Graham Stephan',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    subscribers: 4700000,
    totalViews: 850000000,
    monthlyViews: 3800000,
    shortsShare: 22,
    niche: 'finance',
    duration: 'mid_video',
    countryCode: 'US',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Personal finance niche with elite $25+ RPMs from credit cards, fintechs, and real estate bids',
    trafficDistribution: [
      { code: 'US', share: 76 },
      { code: 'CA', share: 11 },
      { code: 'GB', share: 6 },
      { code: 'AU', share: 4 },
      { code: 'DE', share: 3 }
    ]
  },
  {
    handle: '@dhruvrathee',
    name: 'Dhruv Rathee',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    subscribers: 27200000,
    totalViews: 4600000000,
    monthlyViews: 115000000,
    shortsShare: 45,
    niche: 'education',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Enrolled in YPP. High watch times and strong diaspora viewer share',
    trafficDistribution: [
      { code: 'IN', share: 76 },
      { code: 'PK', share: 6 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 6 },
      { code: 'US', share: 5 },
      { code: 'GB', share: 3 }
    ]
  },
  {
    handle: '@techburner',
    name: 'Tech Burner',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    subscribers: 12200000,
    totalViews: 2400000000,
    monthlyViews: 38000000,
    shortsShare: 52,
    niche: 'tech',
    duration: 'mid_video',
    countryCode: 'IN',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'YPP active with consumer electronics brand integrations and regional smartphone ad campaigns',
    trafficDistribution: [
      { code: 'IN', share: 86 },
      { code: 'PK', share: 5 },
      { code: 'BD', share: 4 },
      { code: 'AE', share: 3 },
      { code: 'US', share: 2 }
    ]
  },
  {
    handle: '@pewdiepie',
    name: 'PewDiePie',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    subscribers: 111000000,
    totalViews: 29300000000,
    monthlyViews: 16500000,
    shortsShare: 18,
    niche: 'gaming',
    duration: 'mid_video',
    countryCode: 'JP',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Legacy creator with global Western audience base and YouTube memberships integration',
    trafficDistribution: [
      { code: 'US', share: 42 },
      { code: 'GB', share: 16 },
      { code: 'CA', share: 10 },
      { code: 'AU', share: 9 },
      { code: 'DE', share: 8 },
      { code: 'SE', share: 6 },
      { code: 'JP', share: 9 }
    ]
  },
  {
    handle: '@ishowspeed',
    name: 'IShowSpeed',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    subscribers: 33000000,
    totalViews: 3400000000,
    monthlyViews: 90000000,
    shortsShare: 64,
    niche: 'gaming',
    duration: 'mid_video',
    countryCode: 'US',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'Massive livestream SuperChat revenue combined with viral shorts monetization',
    trafficDistribution: [
      { code: 'US', share: 52 },
      { code: 'GB', share: 14 },
      { code: 'BR', share: 12 },
      { code: 'PH', share: 12 },
      { code: 'IN', share: 10 }
    ]
  },
  {
    handle: '@veritasium',
    name: 'Veritasium',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    subscribers: 16800000,
    totalViews: 2850000000,
    monthlyViews: 24000000,
    shortsShare: 24,
    niche: 'education',
    duration: 'long_video',
    countryCode: 'US',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'High watch time educational content with premium mid-roll frequency and university/science advertiser bids',
    trafficDistribution: [
      { code: 'US', share: 64 },
      { code: 'GB', share: 12 },
      { code: 'CA', share: 8 },
      { code: 'AU', share: 6 },
      { code: 'DE', share: 5 },
      { code: 'IN', share: 5 }
    ]
  },
  {
    handle: '@aliabdaal',
    name: 'Ali Abdaal',
    avatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150&auto=format&fit=crop&q=80',
    subscribers: 5800000,
    totalViews: 480000000,
    monthlyViews: 6500000,
    shortsShare: 30,
    niche: 'education',
    duration: 'mid_video',
    countryCode: 'GB',
    isMonetized: true,
    monetizationTier: 'YPP_ACTIVE',
    monetizationReason: 'High purchasing power productivity audience with high software and book affiliate conversion',
    trafficDistribution: [
      { code: 'US', share: 46 },
      { code: 'GB', share: 24 },
      { code: 'CA', share: 10 },
      { code: 'AU', share: 9 },
      { code: 'IN', share: 6 },
      { code: 'DE', share: 5 }
    ]
  },
  {
    handle: '@unmonetized_demo',
    name: 'Indie Gamer (New Channel)',
    avatar: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=150&auto=format&fit=crop&q=80',
    subscribers: 420,
    totalViews: 28000,
    monthlyViews: 6500,
    shortsShare: 50,
    niche: 'gaming',
    duration: 'short_video',
    countryCode: 'US',
    isMonetized: false,
    monetizationTier: 'UNMONETIZED',
    monetizationReason: 'Channel does not meet minimum YPP threshold (Under 1,000 subscribers and 4,000 public watch hours)',
    trafficDistribution: [
      { code: 'US', share: 70 },
      { code: 'GB', share: 15 },
      { code: 'CA', share: 15 }
    ]
  }
];

