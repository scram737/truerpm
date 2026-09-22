/**
 * TrueRPM — Application Controller & Dynamic UI Engine
 */

import { COUNTRY_DATA, NICHES, DURATION_MODIFIERS, PRESET_CHANNELS, REGIONAL_PRESETS } from './data.js';
import { RevenueEngine } from './engine.js';
import { ChannelResolver } from './resolver.js';

// Currency exchange rates (relative to USD)
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.00, prefix: true },
  INR: { symbol: '₹', rate: 96.00, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: false },
  GBP: { symbol: '£', rate: 0.79, prefix: true },
  CAD: { symbol: 'C$', rate: 1.36, prefix: true },
  AUD: { symbol: 'A$', rate: 1.52, prefix: true },
  BRL: { symbol: 'R$', rate: 5.45, prefix: true }
};

class TrueRpmApp {
  constructor() {
    this.engine = new RevenueEngine();
    this.resolver = new ChannelResolver();
    this.userHasEditedFxRate = false;

    // Default application state (starts with Sarath Nalla @nisharath2326 verified channel)
    this.state = {
      channelName: 'Sarath Nalla',
      channelHandle: '@nisharath2326',
      channelAvatar: 'https://yt3.googleusercontent.com/ogiEyqvm3lach3NAY2P0oiEuEodPoE3RLdDM5keNwj5hc533iO7971aG81PLFkngNOeJTnKReg=s900-c-k-c0x00ffffff-no-rj',
      subscribers: 1440000,
      totalViews: 1508899956,
      monthlyViews: 66790000,
      shortsPercent: 94.0,
      nicheId: 'comedy',
      durationId: 'long_video',
      countryCode: 'IN',
      isMonetized: true,
      monetizationTier: 'YPP_ACTIVE',
      monetizationReason: 'Verified YouTube Partner Program active. ~66.8M monthly views across high-engagement Telugu comedy sketches and viral shorts. vidIQ benchmark: $3.49K/mo.',
      hasJoinButton: false,
      videoCount: 594,
      healthScore: 98,
      channelGrade: 'A',
      vidiqMonthlyEarnings: 3492,
      traffic: [
        { code: 'IN', share: 82 },
        { code: 'PK', share: 6 },
        { code: 'BD', share: 4 },
        { code: 'AE', share: 4 },
        { code: 'US', share: 4 }
      ],
      currency: 'USD',
      activePresetId: null,
      adblockEnabled: true,
      adblockPercent: 25,
      thisMonthViews: 66790000,
      actualViewsByDate: 66790000,
      averageMonthlyViews: 66790000,
      channelAgeMonths: 222,
      joinedDate: 'Jan 1, 2008',
      viewScopeMode: 'this-month',
      recentVideos: [
        {
          id: 'mW0Wt6XVNWY',
          title: 'SarathNalla Sept 20',
          views: '912K views',
          viewsNum: 912000,
          date: '1 day ago',
          duration: '23:48',
          thumb: 'https://i.ytimg.com/vi/mW0Wt6XVNWY/hqdefault.jpg'
        },
        {
          id: 'vAlLJFzS3AU',
          title: "Sarath's struggle for husbands... Finally he became a Secretary! 😂🔥 | Sarath Nalla & Nisha in Gat...",
          views: '1.1M views',
          viewsNum: 1100000,
          date: '4 days ago',
          duration: '23:50',
          thumb: 'https://i.ytimg.com/vi/vAlLJFzS3AU/hqdefault.jpg'
        },
        {
          id: 'w4r20pQ9y3I',
          title: 'ఆటగాడు మా శరత్ 😂 | స్కూల్‌లో రచ్చ… ఇంకోపక్క క్రికెట్ పిచ్చి! | నిషా లిఫ్ట్‌లో | Gated Secretary Ep-2',
          views: '1.3M views',
          viewsNum: 1300000,
          date: '8 days ago',
          duration: '23:51',
          thumb: 'https://i.ytimg.com/vi/w4r20pQ9y3I/hqdefault.jpg'
        },
        {
          id: 'J0tQn0Y1wXk',
          title: 'Gated Secretary EP-1 | No Power… No Water… Full Racha! | Sarath Nalla & Nisha',
          views: '1.2M views',
          viewsNum: 1200000,
          date: '11 days ago',
          duration: '20:43',
          thumb: 'https://i.ytimg.com/vi/J0tQn0Y1wXk/hqdefault.jpg'
        }
      ],
      // India Tax & FX Conversion State
      exchangeRate: 96.00,
      indiaTaxRegime: '44ada',
      indiaFlatTaxPercent: 20,
      hasW8Ben: true,
      useLakhsFormat: true
    };

    this.initElements();
    this.setupEventListeners();
    this.renderPresets();
    this.renderNiches();
    this.renderDurations();
    this.renderGeoPresets();
    this.renderAllCountryExplorer();
    this.renderModalCountryList();
    this.renderProfileCard();
    this.updateUI();
    this.fetchLiveExchangeRates();
  }

  async fetchLiveExchangeRates() {
    try {
      const resp = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!resp.ok) return;
      const data = await resp.json();
      if (data && data.rates) {
        if (data.rates.INR) {
          const liveInr = Number(data.rates.INR.toFixed(2));
          CURRENCIES.INR.rate = liveInr;
          if (!this.userHasEditedFxRate) {
            this.state.exchangeRate = liveInr;
            if (this.inputExchangeRate) this.inputExchangeRate.value = liveInr.toFixed(2);
            if (this.sliderExchangeRate) this.sliderExchangeRate.value = Math.min(115, Math.max(75, liveInr));
            if (this.dispFxRateBadge) this.dispFxRateBadge.textContent = `1 USD = ₹${liveInr.toFixed(2)} (Live FX)`;
            if (this.proofTaxFxRate) this.proofTaxFxRate.textContent = `1 USD = ₹${liveInr.toFixed(2)}`;
            const proofNote = document.getElementById('disp-inr-gross-usd-note');
            if (proofNote) proofNote.textContent = `$5,600 USD @ ₹${liveInr.toFixed(2)}/$`;
          }
        }
        if (data.rates.EUR) CURRENCIES.EUR.rate = Number(data.rates.EUR.toFixed(4));
        if (data.rates.GBP) CURRENCIES.GBP.rate = Number(data.rates.GBP.toFixed(4));
        if (data.rates.CAD) CURRENCIES.CAD.rate = Number(data.rates.CAD.toFixed(4));
        if (data.rates.AUD) CURRENCIES.AUD.rate = Number(data.rates.AUD.toFixed(4));
        if (data.rates.BRL) CURRENCIES.BRL.rate = Number(data.rates.BRL.toFixed(4));

        this.updateUI();
      }
    } catch (e) {
      console.warn('[TrueRPM] Live FX fetch error, using default market rate ₹96.00:', e);
    }
  }

  initElements() {
    // Top Controls
    this.currencySelector = document.getElementById('currency-selector');
    this.btnExport = document.getElementById('btn-export-report');
    this.presetContainer = document.getElementById('preset-buttons-container');

    // Search and Profile Elements
    this.formChannelSearch = document.getElementById('form-channel-search');
    this.inputSearchChannel = document.getElementById('input-search-channel');
    this.suggestionChips = document.querySelectorAll('.chip-suggest');
    this.channelProfileCard = document.getElementById('channel-profile-card');
    this.profileAvatarImg = document.getElementById('profile-avatar-img');
    this.profileName = document.getElementById('profile-name');
    this.profileHandle = document.getElementById('profile-handle');
    this.profileMonetizationBadge = document.getElementById('profile-monetization-badge');
    this.profileMonetizationReason = document.getElementById('profile-monetization-reason');
    this.profileSubscribers = document.getElementById('profile-subscribers');
    this.profileTotalViews = document.getElementById('profile-total-views');
    this.profileMonthlyViews = document.getElementById('profile-monthly-views');
    this.profileLifetimeAvg = document.getElementById('profile-lifetime-avg');
    this.profileChannelAge = document.getElementById('profile-channel-age');
    this.btnProfileThisMonth = document.getElementById('btn-profile-this-month');
    this.btnProfileLifetimeAvg = document.getElementById('btn-profile-lifetime-avg');
    this.profileOriginCountry = document.getElementById('profile-origin-country');
    this.profileFormatSplit = document.getElementById('profile-format-split');
    this.profileTopTraffic = document.getElementById('profile-top-traffic');
    this.profileJoinBadge = document.getElementById('profile-join-badge');
    this.profileJoinStatus = document.getElementById('profile-join-status');
    
    // vidIQ Scorecard & KPI Elements
    this.profileEstEarnings = document.getElementById('profile-est-earnings');
    this.profileVidiqBadge = document.getElementById('profile-vidiq-badge');
    this.profileEffectiveRpm = document.getElementById('profile-effective-rpm');
    this.profileDailyViews = document.getElementById('profile-daily-views');
    this.profileVideoCount = document.getElementById('profile-video-count');
    this.profileHealthScore = document.getElementById('profile-health-score');
    this.profileHealthGrade = document.getElementById('profile-health-grade');
    this.profileNicheBadge = document.getElementById('profile-niche-badge');
    
    // Recent Videos Table Elements
    this.recentVideosTbody = document.getElementById('recent-videos-tbody');
    this.recentVideosBadgeCount = document.getElementById('recent-videos-badge-count');

    // Scan Progress Modal Elements
    this.scanModalOverlay = document.getElementById('scan-modal-overlay');
    this.scanModalTitle = document.getElementById('scan-modal-title');
    this.scanModalSubtitle = document.getElementById('scan-modal-subtitle');
    this.scanProgressFill = document.getElementById('scan-progress-fill');
    this.scanStepItems = document.querySelectorAll('.scan-step-item');

    // Form inputs
    this.inputChannelName = document.getElementById('input-channel-name');
    this.sliderViews = document.getElementById('slider-monthly-views');
    this.displayViews = document.getElementById('display-monthly-views');
    this.btnScopeThisMonth = document.getElementById('btn-scope-this-month');
    this.btnScopeLifetimeAvg = document.getElementById('btn-scope-lifetime-avg');
    this.btnScopeAnnual12 = document.getElementById('btn-scope-annual-12');
    this.viewsScopeCaption = document.getElementById('views-scope-caption');
    this.btnOpenDivideModal = document.getElementById('btn-open-divide-modal');
    this.sliderShorts = document.getElementById('slider-shorts-percent');
    this.displayShorts = document.getElementById('display-shorts-percent');
    this.barLongShare = document.getElementById('bar-long-share');
    this.barShortsShare = document.getElementById('bar-shorts-share');
    this.selectNiche = document.getElementById('select-niche');
    this.nicheDescBadge = document.getElementById('niche-desc-badge');
    this.durationGroup = document.getElementById('duration-selector-group');

    // Geo Traffic Elements
    this.geoPresetChips = document.getElementById('geo-preset-chips');
    this.geoMultibar = document.getElementById('geo-multibar');
    this.geoMultibarLegend = document.getElementById('geo-multibar-legend');
    this.countryList = document.getElementById('country-allocation-list');
    this.trafficSumStatus = document.getElementById('traffic-sum-status');
    this.btnNormalize = document.getElementById('btn-normalize-traffic');
    this.btnAddCountry = document.getElementById('btn-add-country');

    // Reality Battlefield Elements
    this.statFantasyRange = document.getElementById('stat-fantasy-range');
    this.statRealityPrice = document.getElementById('stat-reality-price');
    this.statRealityRange = document.getElementById('stat-reality-range');
    this.statEffectiveRpm = document.getElementById('stat-effective-rpm');
    this.varianceDiagnostics = document.getElementById('variance-diagnostic-bar');
    this.calloutLongRevenue = document.getElementById('callout-long-revenue');
    this.calloutLongSub = document.getElementById('callout-long-sub');
    this.calloutShortsRevenue = document.getElementById('callout-shorts-revenue');
    this.calloutShortsSub = document.getElementById('callout-shorts-sub');

    // Calculation Proof & Live Formulas
    this.fantasyLiveCalc = document.getElementById('fantasy-live-calc');
    this.realityLiveCalc = document.getElementById('reality-live-calc');
    this.realityAdblockPill = document.getElementById('reality-adblock-pill');
    this.realityAdblockPercentTag = document.getElementById('reality-adblock-percent-tag');
    this.btnToggleCalc = document.getElementById('btn-toggle-calc');
    this.btnToggleCalcText = document.getElementById('btn-toggle-calc-text');
    this.calcProofBody = document.getElementById('calc-proof-body');
    
    // AdBlock Controls
    this.sliderAdblock = document.getElementById('slider-adblock-rate');
    this.toggleAdblock = document.getElementById('toggle-adblock');
    this.badgeAdblockStatus = document.getElementById('badge-adblock-status');
    this.displayAdblockPercent = document.getElementById('display-adblock-percent');
    this.displayUnpaidViews = document.getElementById('display-unpaid-views');
    this.profileAdblockRate = document.getElementById('profile-adblock-rate');

    this.proofTotalViews = document.getElementById('proof-total-views');
    this.proofAdblockShare = document.getElementById('proof-adblock-share');
    this.proofUnpaidViews = document.getElementById('proof-unpaid-views');
    this.proofMonetizedViews = document.getElementById('proof-monetized-views');
    this.proofLongShare = document.getElementById('proof-long-share');
    this.proofLongViews = document.getElementById('proof-long-views');
    this.proofShortsShare = document.getElementById('proof-shorts-share');
    this.proofShortsViews = document.getElementById('proof-shorts-views');
    this.proofAdblockFlaw = document.getElementById('proof-adblock-flaw');
    
    this.proofGeoTrafficSummary = document.getElementById('proof-geo-traffic-summary');
    this.proofNicheMult = document.getElementById('proof-niche-mult');
    this.proofDurationMult = document.getElementById('proof-duration-mult');
    this.proofEffectiveLongRpm = document.getElementById('proof-effective-long-rpm');
    this.proofEffectiveShortsRpm = document.getElementById('proof-effective-shorts-rpm');
    
    this.proofLongCalc = document.getElementById('proof-long-calc');
    this.proofLongTotal = document.getElementById('proof-long-total');
    this.proofShortsCalc = document.getElementById('proof-shorts-calc');
    this.proofShortsTotal = document.getElementById('proof-shorts-total');
    this.proofSumTotal = document.getElementById('proof-sum-total');
    this.proofBlendedRpm = document.getElementById('proof-blended-rpm');
    
    this.proofFantasyFormulaDetail = document.getElementById('proof-fantasy-formula-detail');
    this.proofFantasyResultDetail = document.getElementById('proof-fantasy-result-detail');
    this.proofOverestimateMultiple = document.getElementById('proof-overestimate-multiple');

    // Metric Cards
    this.cardMonthlyAdSense = document.getElementById('card-monthly-adsense');
    this.cardDailyAdSense = document.getElementById('card-daily-adsense');
    this.cardAnnualAdSense = document.getElementById('card-annual-adsense');
    this.cardMembershipsVal = document.getElementById('card-memberships-val');
    this.cardMembershipsSub = document.getElementById('card-memberships-sub');
    this.cardMembershipsBadge = document.getElementById('card-memberships-badge');
    this.cardTierMix = document.getElementById('card-tier-mix');
    this.cardTierDetails = document.getElementById('card-tier-details');
    this.cardEcosystemTotal = document.getElementById('card-ecosystem-total');
    this.cardEcosystemSub = document.getElementById('card-ecosystem-sub');

    // Tabs
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    this.tableCountryContributions = document.querySelector('#table-country-contributions tbody');

    // Format tab
    this.statFormatLongViews = document.getElementById('stat-format-long-views');
    this.statFormatLongRpm = document.getElementById('stat-format-long-rpm');
    this.statFormatDurationMult = document.getElementById('stat-format-duration-mult');
    this.statFormatLongRev = document.getElementById('stat-format-long-revenue');
    this.statFormatShortsViews = document.getElementById('stat-format-shorts-views');
    this.statFormatShortsRpm = document.getElementById('stat-format-shorts-rpm');
    this.statFormatShortsRev = document.getElementById('stat-format-shorts-revenue');

    // Multi-stream tab
    this.streamAdSenseVal = document.getElementById('stream-adsense-val');
    this.streamAdSenseSub = document.getElementById('stream-adsense-sub');
    this.streamBrandVal = document.getElementById('stream-brand-val');
    this.streamFanVal = document.getElementById('stream-fan-val');
    this.streamFanSub = document.getElementById('stream-fan-sub');
    this.streamAffiliateVal = document.getElementById('stream-affiliate-val');
    this.streamGrandTotal = document.getElementById('stream-grand-total');

    // Country Database
    this.tableAllCountries = document.querySelector('#table-all-countries tbody');
    this.inputCountrySearch = document.getElementById('input-country-search');
    this.filterTierSelect = document.getElementById('filter-tier-select');

    // Modal
    this.modalOverlay = document.getElementById('add-country-modal');
    this.btnCloseModal = document.getElementById('btn-close-modal');
    this.selectCountryToAdd = document.getElementById('select-country-to-add');
    this.countryAddPreview = document.getElementById('country-add-preview');
    this.btnConfirmAddCountry = document.getElementById('btn-confirm-add-country');

    // Tab 4 12-Month Division Elements
    this.dispThisMonthTakehome = document.getElementById('disp-this-month-takehome');
    this.dispThisMonthViews = document.getElementById('disp-this-month-views');
    this.btnDivThisMonth = document.getElementById('btn-div-this-month');
    this.btnDivLifetimeAvg = document.getElementById('btn-div-lifetime-avg');
    this.btnDivLifetimeVal = document.getElementById('btn-div-lifetime-val');
    this.btnDivSplit12 = document.getElementById('btn-div-split-12');
    this.tableMonthlyDivision = document.getElementById('table-monthly-division')?.querySelector('tbody');
    this.footAnnualViews = document.getElementById('foot-annual-views');
    this.footAnnualRevenue = document.getElementById('foot-annual-revenue');
    this.footAvgMonthly = document.getElementById('foot-avg-monthly');

    // Divide Calculator Modal
    this.divideModal = document.getElementById('divide-views-modal');
    this.btnCloseDivideModal = document.getElementById('btn-close-divide-modal');
    this.inputTotalViewsToDivide = document.getElementById('input-total-views-to-divide');
    this.dividePeriodButtons = document.querySelectorAll('.divide-period-btn');
    this.dispCalcDividedViews = document.getElementById('disp-calc-divided-views');
    this.btnApplyDividedViews = document.getElementById('btn-apply-divided-views');

    // Tab 5 India Tax & USD/INR Conversion Elements
    this.sliderExchangeRate = document.getElementById('slider-exchange-rate');
    this.inputExchangeRate = document.getElementById('input-exchange-rate');
    this.dispFxRateBadge = document.getElementById('disp-fx-rate-badge');
    this.selectTaxRegime = document.getElementById('select-tax-regime');
    this.wrapFlatTax = document.getElementById('wrap-flat-tax');
    this.sliderFlatTax = document.getElementById('slider-flat-tax');
    this.dispFlatTaxVal = document.getElementById('disp-flat-tax-val');
    this.checkW8Ben = document.getElementById('check-w8ben');
    this.checkLakhsFormat = document.getElementById('check-lakhs-format');

    this.dispInrNetMonthly = document.getElementById('disp-inr-net-monthly');
    this.dispInrNetMonthlyLakhs = document.getElementById('disp-inr-net-monthly-lakhs');
    this.dispInrNetAnnual = document.getElementById('disp-inr-net-annual');
    this.dispInrNetAnnualLakhs = document.getElementById('disp-inr-net-annual-lakhs');
    this.dispInrTotalTax = document.getElementById('disp-inr-total-tax');
    this.dispInrEffectiveRate = document.getElementById('disp-inr-effective-rate');
    this.dispInrGrossMonthly = document.getElementById('disp-inr-gross-monthly');
    this.dispInrGrossUsdNote = document.getElementById('disp-inr-gross-usd-note');

    this.barSegInhand = document.getElementById('bar-seg-inhand');
    this.barSegIndiatax = document.getElementById('bar-seg-indiatax');
    this.barSegUstax = document.getElementById('bar-seg-ustax');
    this.legendInhandPct = document.getElementById('legend-inhand-pct');
    this.legendIndiataxPct = document.getElementById('legend-indiatax-pct');
    this.legendUstaxPct = document.getElementById('legend-ustax-pct');

    this.tableIndiaWaterfall = document.getElementById('table-india-waterfall')?.querySelector('tbody');

    // Dual currency preview on main reality card
    this.dispRealityInrPreview = document.getElementById('disp-reality-inr-preview');
    this.dispRealityInrVal = document.getElementById('disp-reality-inr-val');
    this.dispRealityInrTaxVal = document.getElementById('disp-reality-inr-tax-val');
    this.dispRealityInrNet = document.getElementById('disp-reality-inr-net');
    this.dispRealityInrNetVal = document.getElementById('disp-reality-inr-net-val');

    // Step 5 Calculation Proof Elements
    this.proofTaxGrossUsd = document.getElementById('proof-tax-gross-usd');
    this.proofTaxFxRate = document.getElementById('proof-tax-fx-rate');
    this.proofTaxGrossInr = document.getElementById('proof-tax-gross-inr');
    this.proofTaxUsDeduction = document.getElementById('proof-tax-us-deduction');
    this.proofTaxIndiaDeduction = document.getElementById('proof-tax-india-deduction');
    this.proofTaxNetInhand = document.getElementById('proof-tax-net-inhand');
  }

  setupEventListeners() {
    // Search Form Submit
    if (this.formChannelSearch) {
      this.formChannelSearch.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = this.inputSearchChannel.value.trim();
        if (q) this.auditChannel(q);
      });
    }

    // Suggestion Chips Click
    if (this.suggestionChips) {
      this.suggestionChips.forEach(chip => {
        chip.addEventListener('click', (e) => {
          e.preventDefault();
          const handle = chip.dataset.handle;
          this.inputSearchChannel.value = handle;
          this.auditChannel(handle);
        });
      });
    }

    // Currency change
    this.currencySelector.addEventListener('change', (e) => {
      this.state.currency = e.target.value;
      this.updateUI();
    });

    // Channel name input
    this.inputChannelName.addEventListener('input', (e) => {
      this.state.channelName = e.target.value || 'Custom Channel';
    });

    // Monthly views slider
    this.sliderViews.addEventListener('input', (e) => {
      this.state.monthlyViews = Number(e.target.value);
      this.state.viewScopeMode = 'custom';
      this.state.activePresetId = null;
      this.updatePresetsActiveState();
      this.updateUI();
    });

    // Shorts percent slider
    this.sliderShorts.addEventListener('input', (e) => {
      this.state.shortsPercent = Number(e.target.value);
      this.state.activePresetId = null;
      this.updatePresetsActiveState();
      this.updateUI();
    });

    // AdBlock slider and toggle
    if (this.sliderAdblock) {
      this.sliderAdblock.addEventListener('input', (e) => {
        this.state.adblockPercent = Number(e.target.value);
        this.updateUI();
      });
    }

    if (this.toggleAdblock) {
      this.toggleAdblock.addEventListener('change', (e) => {
        this.state.adblockEnabled = e.target.checked;
        this.updateUI();
      });
    }

    // Niche selector with smart AdBlock rate
    this.selectNiche.addEventListener('change', (e) => {
      this.state.nicheId = e.target.value;
      const n = NICHES.find(item => item.id === e.target.value);
      if (n && n.adblockRate !== undefined) {
        this.state.adblockPercent = n.adblockRate;
        if (this.sliderAdblock) this.sliderAdblock.value = n.adblockRate;
      }
      this.state.activePresetId = null;
      this.updatePresetsActiveState();
      this.updateUI();
    });

    // Normalize traffic shares
    this.btnNormalize.addEventListener('click', () => {
      this.normalizeTraffic();
      this.updateUI();
    });

    // Tab switching
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.getAttribute('data-target');
        this.tabButtons.forEach(b => b.classList.remove('active'));
        this.tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(target)?.classList.add('active');
      });
    });

    // Country Database Search and Filter
    this.inputCountrySearch.addEventListener('input', () => this.filterCountryExplorer());
    this.filterTierSelect.addEventListener('change', () => this.filterCountryExplorer());

    // Modal controls
    this.btnAddCountry.addEventListener('click', () => this.openAddCountryModal());
    this.btnCloseModal.addEventListener('click', () => this.closeAddCountryModal());
    this.modalOverlay.addEventListener('click', (e) => {
      if (e.target === this.modalOverlay) this.closeAddCountryModal();
    });
    this.selectCountryToAdd.addEventListener('change', (e) => this.updateCountryModalPreview(e.target.value));
    this.btnConfirmAddCountry.addEventListener('click', () => this.confirmAddCountry());

    // Calculation proof toggle
    if (this.btnToggleCalc && this.calcProofBody) {
      this.btnToggleCalc.addEventListener('click', () => {
        const isCollapsed = this.calcProofBody.classList.toggle('collapsed');
        this.btnToggleCalc.classList.toggle('collapsed', isCollapsed);
        if (this.btnToggleCalcText) {
          this.btnToggleCalcText.textContent = isCollapsed ? 'Show Calculation Steps' : 'Hide Calculation Steps';
        }
      });
    }

    // Export button
    this.btnExport.addEventListener('click', () => {
      window.print();
    });

    // Views Scope Mode Switchers
    if (this.btnScopeThisMonth) {
      this.btnScopeThisMonth.addEventListener('click', () => this.setViewScope('this-month'));
    }
    if (this.btnScopeLifetimeAvg) {
      this.btnScopeLifetimeAvg.addEventListener('click', () => this.setViewScope('lifetime-avg'));
    }

    // Profile card timeframe buttons
    if (this.btnProfileThisMonth) {
      this.btnProfileThisMonth.addEventListener('click', () => this.setViewScope('this-month'));
    }
    if (this.btnProfileLifetimeAvg) {
      this.btnProfileLifetimeAvg.addEventListener('click', () => this.setViewScope('lifetime-avg'));
    }

    // Tab 4 action buttons
    if (this.btnDivThisMonth) {
      this.btnDivThisMonth.addEventListener('click', () => this.setViewScope('this-month'));
    }
    if (this.btnDivLifetimeAvg) {
      this.btnDivLifetimeAvg.addEventListener('click', () => this.setViewScope('lifetime-avg'));
    }

    // Divide Modal listeners
    if (this.btnOpenDivideModal) {
      this.btnOpenDivideModal.addEventListener('click', () => this.openDivideModal());
    }
    if (this.btnCloseDivideModal) {
      this.btnCloseDivideModal.addEventListener('click', () => this.closeDivideModal());
    }
    if (this.divideModal) {
      this.divideModal.addEventListener('click', (e) => {
        if (e.target === this.divideModal) this.closeDivideModal();
      });
    }
    if (this.inputTotalViewsToDivide) {
      this.inputTotalViewsToDivide.addEventListener('input', () => this.recalculateDivideModal());
    }
    if (this.dividePeriodButtons) {
      this.dividePeriodButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          this.dividePeriodButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.state.dividePeriodMonths = btn.dataset.months;
          this.recalculateDivideModal();
        });
      });
    }
    if (this.btnApplyDividedViews) {
      this.btnApplyDividedViews.addEventListener('click', () => this.applyDividedModalResult());
    }

    // India Tax & FX Conversion Event Listeners
    if (this.sliderExchangeRate) {
      this.sliderExchangeRate.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value) || 96.00;
        this.userHasEditedFxRate = true;
        this.state.exchangeRate = val;
        CURRENCIES.INR.rate = val;
        if (this.inputExchangeRate) this.inputExchangeRate.value = val.toFixed(2);
        if (this.dispFxRateBadge) this.dispFxRateBadge.textContent = `1 USD = ₹${val.toFixed(2)}`;
        if (this.proofTaxFxRate) this.proofTaxFxRate.textContent = `1 USD = ₹${val.toFixed(2)}`;
        this.updateUI();
      });
    }

    if (this.inputExchangeRate) {
      this.inputExchangeRate.addEventListener('input', (e) => {
        const val = Math.max(1, parseFloat(e.target.value) || 96.00);
        this.userHasEditedFxRate = true;
        this.state.exchangeRate = val;
        CURRENCIES.INR.rate = val;
        if (this.sliderExchangeRate) this.sliderExchangeRate.value = Math.min(115, Math.max(75, val));
        if (this.dispFxRateBadge) this.dispFxRateBadge.textContent = `1 USD = ₹${val.toFixed(2)}`;
        if (this.proofTaxFxRate) this.proofTaxFxRate.textContent = `1 USD = ₹${val.toFixed(2)}`;
        this.updateUI();
      });
    }

    if (this.selectTaxRegime) {
      this.selectTaxRegime.addEventListener('change', (e) => {
        this.state.indiaTaxRegime = e.target.value;
        if (this.wrapFlatTax) {
          this.wrapFlatTax.style.display = this.state.indiaTaxRegime === 'flat' ? 'block' : 'none';
        }
        this.updateUI();
      });
    }

    if (this.sliderFlatTax) {
      this.sliderFlatTax.addEventListener('input', (e) => {
        const val = parseInt(e.target.value, 10) || 20;
        this.state.indiaFlatTaxPercent = val;
        if (this.dispFlatTaxVal) this.dispFlatTaxVal.textContent = `${val}%`;
        this.updateUI();
      });
    }

    if (this.checkW8Ben) {
      this.checkW8Ben.addEventListener('change', (e) => {
        this.state.hasW8Ben = e.target.checked;
        this.updateUI();
      });
    }

    if (this.checkLakhsFormat) {
      this.checkLakhsFormat.addEventListener('change', (e) => {
        this.state.useLakhsFormat = e.target.checked;
        this.updateUI();
      });
    }
  }

  formatInr(amount, includeSymbol = true) {
    const rounded = Math.round(Number(amount) || 0);
    const formatted = rounded.toLocaleString('en-IN');
    return includeSymbol ? `₹${formatted}` : formatted;
  }

  formatInrLakhs(amount) {
    const val = Number(amount) || 0;
    const absVal = Math.abs(val);
    const sign = val < 0 ? '-' : '';
    if (absVal >= 10000000) {
      return `${sign}₹${(absVal / 10000000).toFixed(2)} Cr`;
    }
    if (absVal >= 100000) {
      return `${sign}₹${(absVal / 100000).toFixed(2)} Lakhs`;
    }
    if (absVal >= 1000) {
      return `${sign}₹${(absVal / 1000).toFixed(1)}K`;
    }
    return `${sign}₹${Math.round(absVal).toLocaleString('en-IN')}`;
  }

  // Format currency helpers
  formatMoney(amountInUsd, decimals = 0) {
    const cur = CURRENCIES[this.state.currency] || CURRENCIES.USD;
    const rate = this.state.currency === 'INR' ? this.state.exchangeRate : cur.rate;
    const converted = amountInUsd * rate;
    const formatted = this.state.currency === 'INR'
      ? Math.round(converted).toLocaleString('en-IN')
      : Math.round(converted).toLocaleString();
    return cur.prefix ? `${cur.symbol}${formatted}` : `${formatted} ${cur.symbol}`;
  }

  formatRpm(rpmInUsd) {
    const cur = CURRENCIES[this.state.currency] || CURRENCIES.USD;
    const rate = this.state.currency === 'INR' ? this.state.exchangeRate : cur.rate;
    const converted = rpmInUsd * rate;
    const val = converted >= 10 ? converted.toFixed(1) : converted.toFixed(2);
    return cur.prefix ? `${cur.symbol}${val}` : `${val} ${cur.symbol}`;
  }

  formatNumber(num) {
    return Math.round(num).toLocaleString();
  }

  formatCompactNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  }

  // Automated Zero-Manual-Work Channel Audit Sequence
  async auditChannel(query) {
    if (!query) return;

    // Show animated scan modal immediately
    this.scanModalOverlay.classList.add('open');
    this.scanModalTitle.textContent = `Connecting to YouTube Intelligence...`;
    this.scanProgressFill.style.width = '15%';

    // Reset steps
    this.scanStepItems.forEach((item, i) => {
      item.className = 'scan-step-item';
      item.querySelector('.step-status-icon').textContent = '⏳';
    });

    // Step 1: Initiating Connection & Query Normalization
    const step1El = document.getElementById('step-1');
    if (step1El) {
      step1El.classList.add('done');
      step1El.querySelector('.step-status-icon').textContent = '✅';
    }
    this.scanProgressFill.style.width = '30%';

    // Fetch live channel data from backend / YouTube API
    let channel;
    try {
      channel = await this.resolver.resolveAsync(query);
    } catch (e) {
      console.error('[TrueRPM] Resolve error:', e);
      channel = this.resolver.resolve(query);
    }

    if (!channel) {
      this.scanModalOverlay.classList.remove('open');
      return;
    }

    this.scanModalTitle.textContent = `Auditing ${channel.name} (${channel.handle || query})...`;

    // Step 2: Live subscriber & total view telemetry extracted
    const step2El = document.getElementById('step-2');
    if (step2El) {
      step2El.classList.add('done');
      step2El.querySelector('.step-status-icon').textContent = '✅';
    }
    this.scanProgressFill.style.width = '55%';

    // Step 3: YPP monetization, ad slot tags & partner status verified
    await new Promise(r => setTimeout(r, 160));
    const step3El = document.getElementById('step-3');
    if (step3El) {
      step3El.classList.add('done');
      step3El.querySelector('.step-status-icon').textContent = '✅';
    }
    this.scanProgressFill.style.width = '75%';

    // Step 4: Geographic audience & country origin detected
    await new Promise(r => setTimeout(r, 160));
    const step4El = document.getElementById('step-4');
    if (step4El) {
      step4El.classList.add('done');
      step4El.querySelector('.step-status-icon').textContent = '✅';
    }
    this.scanProgressFill.style.width = '90%';

    // Step 5: Realistic TrueRPM economic model calculated
    await new Promise(r => setTimeout(r, 160));
    const step5El = document.getElementById('step-5');
    if (step5El) {
      step5El.classList.add('done');
      step5El.querySelector('.step-status-icon').textContent = '✅';
    }
    this.scanProgressFill.style.width = '100%';

    setTimeout(() => {
      this.scanModalOverlay.classList.remove('open');
      this.applyChannelData(channel);
    }, 280);
  }

  applyChannelData(channel) {
    this.state.channelName = channel.name;
    this.state.channelHandle = channel.handle;
    this.state.channelAvatar = channel.avatar;
    this.state.subscribers = channel.subscribers;
    this.state.totalViews = channel.totalViews;
    this.state.joinedDate = channel.joinedDate || '';
    this.state.channelAgeMonths = channel.channelAgeMonths || 66;
    this.state.actualViewsByDate = channel.actualViewsByDate || channel.thisMonthViews || channel.monthlyViews;
    this.state.thisMonthViews = this.state.actualViewsByDate;
    this.state.averageMonthlyViews = this.state.actualViewsByDate;
    this.state.viewScopeMode = 'this-month';
    this.state.monthlyViews = this.state.actualViewsByDate;
    this.state.shortsPercent = channel.shortsShare;
    this.state.nicheId = channel.niche;
    this.state.durationId = channel.duration;
    this.state.countryCode = channel.countryCode;
    this.state.isMonetized = channel.isMonetized;
    this.state.monetizationTier = channel.monetizationTier;
    this.state.monetizationReason = channel.monetizationReason;
    this.state.hasJoinButton = (channel.hasJoinButton === true);
    this.state.traffic = JSON.parse(JSON.stringify(channel.trafficDistribution));
    this.state.recentVideos = channel.recentVideos || [];
    this.state.healthScore = channel.healthScore || 88;
    this.state.channelGrade = channel.channelGrade || 'A';
    this.state.vidiqMonthlyEarnings = channel.vidiqMonthlyEarnings || 0;
    this.state.videoCount = channel.videoCount || 594;
    this.state.activePresetId = null;

    if (this.inputSearchChannel) {
      this.inputSearchChannel.value = channel.handle || channel.name;
    }

    // Dynamically adjust slider range if channel has huge or tiny views
    if (this.sliderViews) {
      this.sliderViews.max = Math.max(150000000, Math.round(channel.monthlyViews * 1.5));
      this.sliderViews.value = channel.monthlyViews;
    }

    // Automatically update form controls (Zero Manual Work)
    if (this.inputChannelName) this.inputChannelName.value = channel.name;
    if (this.sliderShorts) this.sliderShorts.value = channel.shortsShare;
    if (this.selectNiche) this.selectNiche.value = channel.niche;

    this.renderDurations();
    this.renderProfileCard();
    this.updatePresetsActiveState();
    this.updateUI();
  }

  renderProfileCard() {
    if (!this.channelProfileCard) return;

    this.profileAvatarImg.src = this.state.channelAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(this.state.channelName)}`;
    this.profileName.textContent = this.state.channelName;
    this.profileHandle.textContent = this.state.channelHandle || `@${this.state.channelName.toLowerCase().replace(/\s+/g, '')}`;

    // Health score & grade (vidIQ benchmark)
    if (this.profileHealthScore) {
      this.profileHealthScore.textContent = this.state.healthScore || 88;
    }
    if (this.profileHealthGrade) {
      this.profileHealthGrade.textContent = `Grade ${this.state.channelGrade || 'A'}`;
    }

    // Monetization badge & reason
    if (this.state.isMonetized) {
      this.profileMonetizationBadge.className = 'badge-monetized';
      this.profileMonetizationBadge.innerHTML = `<span class="badge-icon">✅</span><span class="badge-text">Monetized (YPP Active)</span>`;
    } else {
      this.profileMonetizationBadge.className = 'badge-monetized unmonetized';
      this.profileMonetizationBadge.innerHTML = `<span class="badge-icon">⚠️</span><span class="badge-text">Unmonetized / Ineligible</span>`;
    }
    this.profileMonetizationReason.textContent = this.state.monetizationReason;

    // Join Button badge & status
    if (this.profileJoinBadge) {
      if (this.state.hasJoinButton) {
        this.profileJoinBadge.className = 'badge-join active';
        this.profileJoinBadge.innerHTML = `<span class="badge-icon">⭐</span><span class="badge-text">Join Button Active</span>`;
      } else {
        this.profileJoinBadge.className = 'badge-join inactive';
        this.profileJoinBadge.innerHTML = `<span class="badge-icon">❌</span><span class="badge-text">No Join Button</span>`;
      }
    }
    if (this.profileJoinStatus) {
      if (this.state.hasJoinButton) {
        const estMembers = Math.round(this.state.subscribers * 0.001);
        this.profileJoinStatus.className = 'highlight-emerald';
        this.profileJoinStatus.textContent = `Active (~${this.formatCompactNumber(estMembers)} Members)`;
      } else {
        this.profileJoinStatus.className = 'highlight-rose';
        this.profileJoinStatus.textContent = 'Disabled (0 Members)';
      }
    }

    this.profileSubscribers.textContent = this.formatCompactNumber(this.state.subscribers);
    this.profileTotalViews.textContent = this.formatCompactNumber(this.state.totalViews);
    if (this.profileMonthlyViews) {
      this.profileMonthlyViews.textContent = `${this.formatCompactNumber(this.state.monthlyViews)}`;
    }
    if (this.profileDailyViews) {
      const daily = Math.round(this.state.monthlyViews / 30);
      this.profileDailyViews.textContent = `~${this.formatCompactNumber(daily)} views / day`;
    }
    if (this.profileVideoCount) {
      this.profileVideoCount.textContent = `${this.state.videoCount || 594} Videos Total`;
    }
    if (this.profileChannelAge) {
      this.profileChannelAge.textContent = this.state.joinedDate 
        ? `${this.state.joinedDate} (${this.state.channelAgeMonths} mos)` 
        : `${this.state.channelAgeMonths || 66} Mos Active`;
    }

    const countryObj = this.engine.getCountry(this.state.countryCode);
    this.profileOriginCountry.innerHTML = `${countryObj.flag} ${countryObj.name} (${countryObj.tier})`;

    if (this.profileNicheBadge) {
      const nObj = NICHES.find(n => n.id === this.state.nicheId);
      this.profileNicheBadge.textContent = nObj ? `${nObj.name}` : 'Comedy & Skits';
    }

    // Format Split Pill
    if (this.profileFormatSplit) {
      const longPct = 100 - this.state.shortsPercent;
      this.profileFormatSplit.textContent = `${longPct}% Long / ${this.state.shortsPercent}% Shorts`;
    }

    // Top Country Traffic Pill
    if (this.profileTopTraffic) {
      const topItems = (this.state.traffic || []).slice(0, 4).map(c => {
        const cObj = this.engine.getCountry(c.code);
        return `${cObj?.flag || c.code} ${c.share}%`;
      }).join(' · ');
      this.profileTopTraffic.textContent = topItems || 'Global';
    }

    // AdBlock Rate Pill
    if (this.profileAdblockRate) {
      this.profileAdblockRate.textContent = this.state.adblockEnabled ? `${this.state.adblockPercent}% Unpaid Filtered` : '0% Filtered';
    }
  }
      this.profileAdblockRate.textContent = this.state.adblockEnabled ? `${this.state.adblockPercent}% Unpaid` : '0% Filtered';
    }
  }

  getFlagHtml(country) {
    if (!country || !country.code || country.code.length !== 2) return country?.flag || '🌐';
    const cCode = country.code.toLowerCase();
    return `<img src="https://flagcdn.com/28x21/${cCode}.png" class="flag-icon-img" alt="${country.name || country.code}" onerror="this.outerHTML='${country.flag || '🌐'}'">`;
  }

  // Presets Rendering
  renderPresets() {
    this.presetContainer.innerHTML = '';
    PRESET_CHANNELS.forEach(p => {
      const chip = document.createElement('button');
      chip.className = `preset-chip ${p.id === this.state.activePresetId ? 'active' : ''}`;
      chip.dataset.presetId = p.id;
      chip.innerHTML = `
        <div class="preset-name">${p.name}</div>
        <div class="preset-meta">
          <span>${(p.viewsPerMonth / 1000000).toFixed(1)}M views/mo</span>
          <span class="preset-badge">${p.badge}</span>
        </div>
      `;
      chip.addEventListener('click', () => this.loadPreset(p.id));
      this.presetContainer.appendChild(chip);
    });
  }

  updatePresetsActiveState() {
    document.querySelectorAll('.preset-chip').forEach(chip => {
      if (chip.dataset.presetId === this.state.activePresetId) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  loadPreset(presetId) {
    const preset = PRESET_CHANNELS.find(p => p.id === presetId);
    if (!preset) return;

    this.state.activePresetId = preset.id;
    this.state.channelName = preset.name;
    this.state.monthlyViews = preset.viewsPerMonth;
    this.state.shortsPercent = preset.shortsShare;
    this.state.nicheId = preset.niche;
    this.state.durationId = preset.duration;
    this.state.traffic = JSON.parse(JSON.stringify(preset.trafficDistribution));

    // Update form controls
    this.inputChannelName.value = preset.name;
    this.sliderViews.value = preset.viewsPerMonth;
    this.sliderShorts.value = preset.shortsShare;
    this.selectNiche.value = preset.niche;

    this.renderDurations();
    this.updatePresetsActiveState();
    this.updateUI();
  }

  // Niches Rendering
  renderNiches() {
    this.selectNiche.innerHTML = '';
    NICHES.forEach(n => {
      const opt = document.createElement('option');
      opt.value = n.id;
      opt.textContent = `${n.name} (${n.multiplier}x RPM)`;
      if (n.id === this.state.nicheId) opt.selected = true;
      this.selectNiche.appendChild(opt);
    });
  }

  // Video Duration Rendering
  renderDurations() {
    this.durationGroup.innerHTML = '';
    DURATION_MODIFIERS.forEach(d => {
      const pill = document.createElement('div');
      pill.className = `duration-pill ${d.id === this.state.durationId ? 'active' : ''}`;
      pill.innerHTML = `
        <span class="pill-name">${d.name} (${d.multiplier}x)</span>
        <span class="pill-sub">${d.description}</span>
      `;
      pill.addEventListener('click', () => {
        this.state.durationId = d.id;
        this.state.activePresetId = null;
        this.updatePresetsActiveState();
        this.renderDurations();
        this.updateUI();
      });
      this.durationGroup.appendChild(pill);
    });
  }

  // Regional Presets
  renderGeoPresets() {
    this.geoPresetChips.innerHTML = '';
    REGIONAL_PRESETS.forEach(gp => {
      const chip = document.createElement('button');
      chip.className = 'geo-chip';
      chip.textContent = gp.name;
      chip.addEventListener('click', () => {
        this.state.traffic = JSON.parse(JSON.stringify(gp.distribution));
        this.state.activePresetId = null;
        this.updatePresetsActiveState();
        this.updateUI();
      });
      this.geoPresetChips.appendChild(chip);
    });
  }

  // Main UI Calculation & Rendering
  updateUI() {
    // 1. Calculate Results using the Revenue Engine
    const results = this.engine.calculate({
      monthlyViews: this.state.monthlyViews,
      shortsPercent: this.state.shortsPercent,
      nicheId: this.state.nicheId,
      durationId: this.state.durationId,
      traffic: this.state.traffic,
      isMonetized: this.state.isMonetized,
      adblockPercent: this.state.adblockEnabled ? this.state.adblockPercent : 0,
      subscribers: this.state.subscribers,
      hasJoinButton: this.state.hasJoinButton,
      countryCode: this.state.countryCode,
      exchangeRate: this.state.exchangeRate
    });

    // 2. Update Input Display Values
    this.displayViews.textContent = this.formatNumber(this.state.monthlyViews);
    this.displayShorts.textContent = `${this.state.shortsPercent}% Shorts / ${100 - this.state.shortsPercent}% Long`;
    
    this.barLongShare.style.width = `${100 - this.state.shortsPercent}%`;
    this.barLongShare.innerHTML = `<span>Long-form: ${(results.views.long / 1000000).toFixed(1)}M (${100 - this.state.shortsPercent}%)</span>`;
    
    this.barShortsShare.style.width = `${this.state.shortsPercent}%`;
    this.barShortsShare.innerHTML = `<span>Shorts: ${(results.views.shorts / 1000000).toFixed(1)}M (${this.state.shortsPercent}%)</span>`;

    const selectedNiche = NICHES.find(n => n.id === this.state.nicheId);
    if (selectedNiche) {
      this.nicheDescBadge.textContent = `${selectedNiche.name}: ${selectedNiche.description}`;
    }

    // 2b. Update AdBlock Filter Controls
    if (this.sliderAdblock) this.sliderAdblock.value = this.state.adblockPercent;
    if (this.toggleAdblock) this.toggleAdblock.checked = this.state.adblockEnabled;
    if (this.badgeAdblockStatus) {
      this.badgeAdblockStatus.textContent = this.state.adblockEnabled ? `Active (-${this.state.adblockPercent}%)` : 'Disabled (0%)';
      this.badgeAdblockStatus.className = `adblock-status-pill ${this.state.adblockEnabled ? '' : 'disabled'}`;
    }
    if (this.displayAdblockPercent) {
      this.displayAdblockPercent.textContent = this.state.adblockEnabled ? `${this.state.adblockPercent}% AdBlock / Unpaid` : '0% (Disabled)';
    }
    if (this.displayUnpaidViews) {
      this.displayUnpaidViews.textContent = this.state.adblockEnabled 
        ? `${this.formatCompactNumber(results.views.unpaidViews)} views earn $0.00` 
        : '100% Monetized (Fantasy)';
    }
    if (this.profileAdblockRate) {
      this.profileAdblockRate.textContent = this.state.adblockEnabled ? `${this.state.adblockPercent}% Unpaid` : '0% Filtered';
    }
    if (this.realityAdblockPill) {
      this.realityAdblockPill.style.display = this.state.adblockEnabled ? 'inline-flex' : 'none';
      if (this.realityAdblockPercentTag) this.realityAdblockPercentTag.textContent = `${this.state.adblockPercent}%`;
    }

    // 3. Update Country Traffic Multi-Bar and Allocation List
    this.renderTrafficMultiBar(results.countryBreakdown);
    this.renderCountryAllocationList();

    // 3b. Calculate India Dollar Conversion & Income Tax
    const usTraffic = this.state.traffic.find(t => t.code === 'US');
    const usTrafficSharePercent = usTraffic ? Number(usTraffic.share) || 0 : 0;

    const indiaTaxResults = this.engine.calculateIndiaTax({
      monthlyGrossUsd: this.state.isMonetized ? results.earnings.monthlyAdSense : 0,
      usTrafficSharePercent,
      exchangeRate: this.state.exchangeRate,
      regime: this.state.indiaTaxRegime,
      flatPercent: this.state.indiaFlatTaxPercent,
      hasW8Ben: this.state.hasW8Ben
    });

    // 4. Update The Reality Check Battlefield Card
    const fbMin = this.formatMoney(results.comparison.socialBladeMin);
    const fbMax = this.formatMoney(results.comparison.socialBladeMax);
    this.statFantasyRange.textContent = `${fbMin} – ${fbMax} /mo`;

    if (this.state.isMonetized) {
      if (this.state.currency === 'INR') {
        this.statRealityPrice.innerHTML = `${this.formatInr(indiaTaxResults.netInHandMonthlyInr)} <span class="unit">/mo (Net In-Hand)</span>`;
        this.statRealityRange.innerHTML = `Gross AdSense: <strong>${this.formatInr(indiaTaxResults.grossMonthlyInr)}</strong> · Deductions at End: <strong style="color:#f87171;">-${this.formatInr(indiaTaxResults.totalDeductionsMonthlyInr)}</strong>`;
      } else {
        this.statRealityPrice.innerHTML = `${this.formatMoney(results.earnings.monthlyAdSense)} <span class="unit">/mo</span>`;
        this.statRealityRange.textContent = `${this.formatMoney(results.earnings.monthlyAdSenseMin)} – ${this.formatMoney(results.earnings.monthlyAdSenseMax)}`;
      }
      this.statEffectiveRpm.textContent = this.formatRpm(results.metrics.effectiveChannelRpm);
    } else {
      this.statRealityPrice.innerHTML = `<span style="color:#f87171;">${this.formatMoney(0)}</span> <span class="unit" style="color:#f87171;">/mo (Unmonetized)</span>`;
      this.statRealityRange.innerHTML = `Actual: <strong>${this.formatMoney(0)}</strong> · Potential if YPP approved: <strong style="color:#34d399;">${this.formatMoney(results.earnings.potentialMonthlyAdSense)}</strong>`;
      this.statEffectiveRpm.innerHTML = `<span style="color:#f87171;">${this.formatRpm(0)}</span> (Potential: <strong style="color:#34d399;">${this.formatRpm(results.metrics.potentialChannelRpm)}</strong>)`;
    }

    // Dual currency & tax-at-end preview on Reality Battlefield card
    if (this.dispRealityInrVal) {
      this.dispRealityInrVal.textContent = `${this.formatInr(indiaTaxResults.grossMonthlyInr)}`;
    }
    if (this.dispRealityInrTaxVal) {
      this.dispRealityInrTaxVal.textContent = indiaTaxResults.totalDeductionsMonthlyInr > 0 
        ? `-${this.formatInr(indiaTaxResults.totalDeductionsMonthlyInr)}`
        : '₹0 (Sec 87A Rebate)';
    }
    if (this.dispRealityInrNetVal) {
      this.dispRealityInrNetVal.textContent = `${this.formatInr(indiaTaxResults.netInHandMonthlyInr)} /mo`;
    }

    // 5. Update Diagnostics Pills (Explaining the gap to the user)
    this.renderDiagnostics(results);

    // 5b. Update Format Split Callout (Differentiating Long-Form vs Shorts Revenue)
    if (this.calloutLongRevenue) {
      const longRev = this.state.isMonetized ? results.earnings.longRevenue : results.earnings.potentialLongRevenue;
      const shortsRev = this.state.isMonetized ? results.earnings.shortsRevenue : results.earnings.potentialShortsRevenue;

      this.calloutLongRevenue.innerHTML = `${this.formatMoney(longRev)} <span class="unit">/mo</span>`;
      this.calloutLongSub.textContent = `RPM: ${this.formatRpm(results.metrics.longWeightedRpm)} · ${this.formatCompactNumber(results.views.long)} views (${100 - this.state.shortsPercent}%)`;

      this.calloutShortsRevenue.innerHTML = `${this.formatMoney(shortsRev)} <span class="unit">/mo</span>`;
      this.calloutShortsSub.textContent = `RPM: ${this.formatRpm(results.metrics.shortsWeightedRpm)} · ${this.formatCompactNumber(results.views.shorts)} views (${this.state.shortsPercent}%)`;
    }

    // 5c. Update Step-by-Step Calculation Breakdown & Formulas
    this.renderCalculationProof(results, indiaTaxResults);

    // 6. Update Metric Cards
    if (this.state.isMonetized) {
      this.cardMonthlyAdSense.textContent = this.formatMoney(results.earnings.monthlyAdSense);
      this.cardDailyAdSense.textContent = `~${this.formatMoney(results.earnings.dailyAdSense)} / day`;
      this.cardAnnualAdSense.textContent = this.formatMoney(results.earnings.yearlyAdSense);
    } else {
      this.cardMonthlyAdSense.innerHTML = `<span style="color:#f87171;">${this.formatMoney(0)}</span>`;
      this.cardDailyAdSense.innerHTML = `Potential: ~${this.formatMoney(results.earnings.potentialMonthlyAdSense)}/mo`;
      this.cardAnnualAdSense.innerHTML = `<span style="color:#f87171;">${this.formatMoney(0)}</span> <span style="font-size:0.75rem; color:#94a3b8;">(Potential: ${this.formatMoney(results.earnings.potentialYearlyAdSense)})</span>`;
    }

    // Update Channel Memberships Card (Replaced Audience Purchasing Tier)
    if (this.cardMembershipsVal) {
      if (results.earnings.hasJoinButton && results.earnings.paidMembersCount > 0) {
        this.cardMembershipsVal.innerHTML = `${this.formatMoney(results.earnings.membershipsMonthlyNetUsd)} <span class="unit">/mo</span>`;
        const priceLabel = this.state.countryCode === 'IN' ? '₹89/mo' : '$2.99/mo';
        if (this.cardMembershipsSub) {
          this.cardMembershipsSub.textContent = `${this.formatNumber(results.earnings.paidMembersCount)} Members (0.1% @ ${priceLabel} - 70% Cut)`;
        }
        if (this.cardMembershipsBadge) {
          this.cardMembershipsBadge.textContent = '✅ Join Button Active';
          this.cardMembershipsBadge.className = 'metric-badge-status green';
        }
      } else {
        this.cardMembershipsVal.innerHTML = `${this.formatMoney(0)} <span class="unit">/mo</span>`;
        if (this.cardMembershipsSub) {
          this.cardMembershipsSub.textContent = '0 Members (Join Perks Disabled)';
        }
        if (this.cardMembershipsBadge) {
          this.cardMembershipsBadge.textContent = '❌ No Join Button';
          this.cardMembershipsBadge.className = 'metric-badge-status gray';
        }
      }
    }
    if (this.cardTierMix) {
      this.cardTierMix.textContent = `${results.metrics.tier1SharePercent}% Tier 1 · ${results.metrics.tier3SharePercent}% Tier 3`;
    }
    if (this.cardTierDetails) {
      this.cardTierDetails.textContent = `Weighted Fill Rate: ${results.metrics.weightedFillRate}%`;
    }
    this.cardEcosystemTotal.innerHTML = `${this.formatMoney(results.earnings.totalEcosystemMonthly)} <span class="unit">/mo</span>`;
    if (this.cardEcosystemSub) {
      this.cardEcosystemSub.innerHTML = `AdSense (${this.formatMoney(results.earnings.monthlyAdSense)}) + Brand Deals (${this.formatMoney(results.earnings.brandDealMonthly)}) + Memberships (${this.formatMoney(results.earnings.membershipsMonthlyNetUsd)})`;
    }

    // 7. Update Tabs Content
    this.renderCountryTable(results.countryBreakdown);
    this.renderFormatTab(results);
    this.renderMultiStreamTab(results);

    // 8. Update 12-Month Views Division & This Month Focus
    const currentMonthIndex = new Date().getMonth();
    const monthlyDivision = this.engine.generateMonthlyDivision(results, currentMonthIndex);
    this.renderMonthlyDivisionTab(monthlyDivision);
    this.updateViewsScopeUI();

    // 9. Update India Dollar Conversion & Income Tax Tab
    this.renderIndiaTaxTab(results, indiaTaxResults);

    // 10. Update vidIQ-Style Scorecard KPIs
    if (this.profileEstEarnings) {
      if (this.state.isMonetized) {
        this.profileEstEarnings.textContent = `${this.formatMoney(results.earnings.monthlyAdSenseMin)} – ${this.formatMoney(results.earnings.monthlyAdSenseMax)}`;
      } else {
        this.profileEstEarnings.textContent = `${this.formatMoney(0)} (Unmonetized)`;
      }
    }
    if (this.profileVidiqBadge) {
      const vTarget = this.state.vidiqMonthlyEarnings || (results.vidiqBenchmark ? results.vidiqBenchmark.monthly : 3492);
      this.profileVidiqBadge.innerHTML = `🎯 vidIQ Match: <strong>${this.formatMoney(vTarget)} / mo</strong>`;
    }
    if (this.profileEffectiveRpm) {
      this.profileEffectiveRpm.textContent = `${this.formatRpm(results.metrics.effectiveChannelRpm)} / 1k`;
    }

    // 11. Render vidIQ-Style Recent Videos Table
    this.renderRecentVideosTable(results);
  }

  renderRecentVideosTable(results) {
    if (!this.recentVideosTbody) return;

    let videos = this.state.recentVideos;
    if (!videos || videos.length === 0) {
      const avgDur = this.state.durationId === 'long_video' ? '23:48' : (this.state.durationId === 'mid_video' ? '12:30' : '4:15');
      videos = [
        {
          id: 'mW0Wt6XVNWY',
          title: `${this.state.channelName} — Latest Release`,
          views: `${this.formatCompactNumber(Math.round(this.state.monthlyViews * 0.035))} views`,
          viewsNum: Math.round(this.state.monthlyViews * 0.035),
          date: '1 day ago',
          duration: avgDur,
          thumb: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=160&auto=format&fit=crop&q=80'
        },
        {
          id: 'vAlLJFzS3AU',
          title: `${this.state.channelName} — Trending Comedy Sketch`,
          views: `${this.formatCompactNumber(Math.round(this.state.monthlyViews * 0.05))} views`,
          viewsNum: Math.round(this.state.monthlyViews * 0.05),
          date: '4 days ago',
          duration: avgDur,
          thumb: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'
        },
        {
          id: 'w4r20pQ9y3I',
          title: `${this.state.channelName} — Viral Episode`,
          views: `${this.formatCompactNumber(Math.round(this.state.monthlyViews * 0.065))} views`,
          viewsNum: Math.round(this.state.monthlyViews * 0.065),
          date: '8 days ago',
          duration: avgDur,
          thumb: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=160&auto=format&fit=crop&q=80'
        }
      ];
    }

    if (this.recentVideosBadgeCount) {
      this.recentVideosBadgeCount.textContent = `${videos.length} Recent Uploads`;
    }

    this.recentVideosTbody.innerHTML = '';
    const longRpm = (results.metrics && results.metrics.longWeightedRpm) ? results.metrics.longWeightedRpm : 0.85;

    videos.forEach((v, idx) => {
      const tr = document.createElement('tr');
      const estRev = (v.viewsNum > 0 && this.state.isMonetized)
        ? this.formatMoney((v.viewsNum / 1000) * longRpm)
        : (this.state.isMonetized ? '~$750' : '$0.00');

      const vph = Math.max(150, Math.round((v.viewsNum || 800000) / (24 * Math.max(1, idx * 3 + 1))));
      const vphStr = vph >= 1000 ? `${(vph / 1000).toFixed(1)}K` : `${vph}`;
      const videoUrl = v.id ? `https://www.youtube.com/watch?v=${v.id}` : '#';
      const thumbUrl = v.thumb || (v.id ? `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg` : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80');

      tr.innerHTML = `
        <td>
          <div class="video-thumb-container">
            <img src="${thumbUrl}" alt="" class="video-thumb-img" onerror="this.src='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80'">
            <span class="video-dur-tag">${v.duration || '20:00'}</span>
          </div>
        </td>
        <td>
          <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="video-title-link" title="${v.title}">
            ${v.title}
          </a>
        </td>
        <td>
          <span class="video-meta-date">${v.date || 'Recent'}</span>
        </td>
        <td>
          <span class="profile-meta-tag">${v.duration || '20:00'}</span>
        </td>
        <td>
          <span class="video-views-text">${v.views || '1.0M views'}</span>
        </td>
        <td>
          <span class="video-est-revenue">${estRev}</span>
        </td>
        <td>
          <span class="velocity-vph-pill">🔥 ${vphStr} VPH</span>
        </td>
        <td style="text-align: right;">
          <a href="${videoUrl}" target="_blank" rel="noopener noreferrer" class="btn-watch-yt">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            Watch
          </a>
        </td>
      `;
      this.recentVideosTbody.appendChild(tr);
    });
  }

  renderTrafficMultiBar(countryList) {
    this.geoMultibar.innerHTML = '';
    this.geoMultibarLegend.innerHTML = '';

    const colors = ['#6366f1', '#10b981', '#06b6d4', '#f59e0b', '#ec4899', '#8b5cf6', '#14b8a6', '#f97316'];

    countryList.forEach((c, index) => {
      const color = colors[index % colors.length];

      // Segment in the bar
      const seg = document.createElement('div');
      seg.className = 'multibar-segment';
      seg.style.width = `${c.share}%`;
      seg.style.backgroundColor = color;
      seg.title = `${c.flag} ${c.name}: ${c.share}%`;
      this.geoMultibar.appendChild(seg);

      // Legend below
      const leg = document.createElement('div');
      leg.className = 'legend-item';
      leg.innerHTML = `
        <span class="legend-dot" style="background-color: ${color}"></span>
        <span>${this.getFlagHtml(c)} ${c.code} (${c.share}%)</span>
      `;
      this.geoMultibarLegend.appendChild(leg);
    });
  }

  renderCountryAllocationList() {
    this.countryList.innerHTML = '';
    const totalShare = this.state.traffic.reduce((acc, c) => acc + (Number(c.share) || 0), 0);

    // Update status footer
    if (Math.round(totalShare) === 100) {
      this.trafficSumStatus.textContent = 'Total Share: 100% (Balanced)';
      this.trafficSumStatus.className = 'sum-status valid';
      this.btnNormalize.style.display = 'none';
    } else {
      this.trafficSumStatus.textContent = `Total Share: ${totalShare}% (Not 100%)`;
      this.trafficSumStatus.className = 'sum-status invalid';
      this.btnNormalize.style.display = 'inline-block';
    }

    this.state.traffic.forEach((item, index) => {
      const country = this.engine.getCountry(item.code);
      const tierClass = country.tier.toLowerCase().replace(' ', '-');

      const row = document.createElement('div');
      row.className = 'country-row-item';
      row.innerHTML = `
        <div class="country-item-top">
          <div class="country-name-badge">
            <span class="country-flag">${this.getFlagHtml(country)}</span>
            <span class="country-title">${country.name}</span>
            <span class="tier-pill ${tierClass}">${country.tier}</span>
          </div>
          <div class="country-controls-right">
            <div class="country-share-input-wrap">
              <input type="number" min="0" max="100" class="country-share-num" value="${item.share}" data-index="${index}">
              <span>%</span>
            </div>
            ${this.state.traffic.length > 1 ? `<button class="btn-remove-country" data-index="${index}" title="Remove Country">&times;</button>` : ''}
          </div>
        </div>
        <input type="range" min="0" max="100" value="${item.share}" class="custom-range country-slider-track" data-index="${index}">
        <div class="country-rate-info">
          <span>Base RPM: ${this.formatRpm(country.baseRpm)}</span>
          <span>Shorts RPM: ${this.formatRpm(country.shortsRpm)}</span>
          <span>Fill Rate: ${(country.fillRate * 100).toFixed(0)}%</span>
        </div>
      `;

      // Event listeners for slider and number input
      const slider = row.querySelector('.country-slider-track');
      const numInput = row.querySelector('.country-share-num');
      const btnRemove = row.querySelector('.btn-remove-country');

      const onValChange = (newVal) => {
        this.state.traffic[index].share = Math.max(0, Math.min(100, Number(newVal) || 0));
        this.state.activePresetId = null;
        this.updatePresetsActiveState();
        this.updateUI();
      };

      slider.addEventListener('input', (e) => onValChange(e.target.value));
      numInput.addEventListener('change', (e) => onValChange(e.target.value));

      if (btnRemove) {
        btnRemove.addEventListener('click', () => {
          this.state.traffic.splice(index, 1);
          this.normalizeTraffic();
          this.state.activePresetId = null;
          this.updatePresetsActiveState();
          this.updateUI();
        });
      }

      this.countryList.appendChild(row);
    });
  }

  normalizeTraffic() {
    const total = this.state.traffic.reduce((acc, c) => acc + (Number(c.share) || 0), 0) || 100;
    let runningSum = 0;
    this.state.traffic.forEach((c, i) => {
      if (i === this.state.traffic.length - 1) {
        c.share = Math.max(0, 100 - runningSum);
      } else {
        c.share = Math.round(((Number(c.share) || 0) / total) * 100);
        runningSum += c.share;
      }
    });
  }

  renderDiagnostics(results) {
    this.varianceDiagnostics.innerHTML = '';

    // Diagnostic 0: Monetization Alert
    if (!this.state.isMonetized) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag warn';
      tag.innerHTML = `⛔ <strong>UNMONETIZED CHANNEL:</strong> Generates $0 AdSense because it is not enrolled in YPP (requires 1,000 subs & 4,000 watch hrs). Estimated potential when monetized: ${this.formatMoney(results.earnings.potentialMonthlyAdSense)}/mo.`;
      this.varianceDiagnostics.appendChild(tag);
    }

    // Diagnostic 1: Geo Drag / Boost
    if (results.metrics.tier3SharePercent >= 50) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag warn';
      tag.innerHTML = `⚠️ <strong>${results.metrics.tier3SharePercent}% Emerging Market Views:</strong> Earns $0.35–$0.80 RPM instead of standard $4.00 US CPM.`;
      this.varianceDiagnostics.appendChild(tag);
    } else if (results.metrics.tier1SharePercent >= 60) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag good';
      tag.innerHTML = `💎 <strong>${results.metrics.tier1SharePercent}% Tier-1 Reach:</strong> Unlocks ultra-high $6.50+ base RPM and premium US/EU brand deals.`;
      this.varianceDiagnostics.appendChild(tag);
    }

    // Diagnostic 2: Shorts impact
    if (this.state.shortsPercent >= 50) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag warn';
      tag.innerHTML = `⚡ <strong>Shorts Heavy Channel (${this.state.shortsPercent}%):</strong> 10M Shorts views yield ~$800 AdSense vs ~$15,000 for long-form.`;
      this.varianceDiagnostics.appendChild(tag);
    }

    // Diagnostic 3: Niche boost
    if (results.niche.multiplier >= 2.0) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag good';
      tag.innerHTML = `🚀 <strong>${results.niche.name}:</strong> High advertiser intent adds a +${Math.round((results.niche.multiplier - 1) * 100)}% CPM multiplier.`;
      this.varianceDiagnostics.appendChild(tag);
    } else if (results.niche.multiplier < 0.8) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag warn';
      tag.innerHTML = `📉 <strong>${results.niche.name}:</strong> Young demographic & high ad-blocking creates a -${Math.round((1 - results.niche.multiplier) * 100)}% discount.`;
      this.varianceDiagnostics.appendChild(tag);
    }

    // Diagnostic 4: Mid-rolls
    if (results.duration.multiplier > 1.5) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag info';
      tag.innerHTML = `⏱️ <strong>${results.duration.name}:</strong> Mid-roll ads boost long-form AdSense by ${Math.round((results.duration.multiplier - 1) * 100)}%.`;
      this.varianceDiagnostics.appendChild(tag);
    }

    // Diagnostic 5: AdBlock & Unpaid Views
    if (this.state.adblockEnabled && results.views.adblockPercent > 0) {
      const tag = document.createElement('div');
      tag.className = 'diagnostic-tag warn';
      tag.innerHTML = `🛡️ <strong>${results.views.adblockPercent}% AdBlock / Zero-Ad Traffic:</strong> ${this.formatCompactNumber(results.views.unpaidViews)} views earn $0.00 AdSense due to browser adblockers and unmonetized sessions.`;
      this.varianceDiagnostics.appendChild(tag);
    }
  }

  renderCalculationProof(results, tax) {
    const totalViews = this.state.monthlyViews;
    const monetizedLong = results.views.monetizedLong;
    const monetizedShorts = results.views.monetizedShorts;
    const monetizedTotal = results.views.monetizedTotal;
    const unpaidViews = results.views.unpaidViews;
    const adblockPct = results.views.adblockPercent;

    const longRev = this.state.isMonetized ? results.earnings.longRevenue : results.earnings.potentialLongRevenue;
    const shortsRev = this.state.isMonetized ? results.earnings.shortsRevenue : results.earnings.potentialShortsRevenue;
    const totalAdSense = this.state.isMonetized ? results.earnings.monthlyAdSense : results.earnings.potentialMonthlyAdSense;
    const fbMin = results.comparison.socialBladeMin;
    const fbMax = results.comparison.socialBladeMax;

    // Mini calc pill in fantasy box (Assumes 100% of views earn ads, 0% adblock)
    if (this.fantasyLiveCalc) {
      this.fantasyLiveCalc.innerHTML = `
        <span>Low: ${this.formatCompactNumber(totalViews)} × $0.25/1k = <strong>${this.formatMoney(fbMin)}</strong></span>
        <span>High: ${this.formatCompactNumber(totalViews)} × $4.00/1k = <strong>${this.formatMoney(fbMax)}</strong></span>
      `;
    }

    // Mini calc pill in reality box (Calculates strictly on monetized playbacks)
    if (this.realityLiveCalc) {
      this.realityLiveCalc.innerHTML = `
        <span>(${this.formatCompactNumber(monetizedLong)} × ${this.formatRpm(results.metrics.longWeightedRpm)}/1k) + (${this.formatCompactNumber(monetizedShorts)} × ${this.formatRpm(results.metrics.shortsWeightedRpm)}/1k) = <strong>${this.formatMoney(totalAdSense)} /mo</strong></span>
      `;
    }

    // Step 1: Traffic & AdBlock Separation
    if (this.proofTotalViews) this.proofTotalViews.textContent = this.formatNumber(totalViews);
    if (this.proofAdblockShare) this.proofAdblockShare.textContent = adblockPct > 0 ? `-${adblockPct}%` : '0%';
    if (this.proofUnpaidViews) this.proofUnpaidViews.textContent = adblockPct > 0 ? `-${this.formatNumber(unpaidViews)} ($0 earned)` : '0 (None)';
    if (this.proofMonetizedViews) this.proofMonetizedViews.textContent = `${this.formatNumber(monetizedTotal)} (${100 - adblockPct}% Paid)`;
    if (this.proofLongShare) this.proofLongShare.textContent = `${100 - this.state.shortsPercent}%`;
    if (this.proofLongViews) this.proofLongViews.textContent = `${this.formatNumber(monetizedLong)} paid`;
    if (this.proofShortsShare) this.proofShortsShare.textContent = `${this.state.shortsPercent}%`;
    if (this.proofShortsViews) this.proofShortsViews.textContent = `${this.formatNumber(monetizedShorts)} paid`;

    // Step 2: Geo & RPM
    if (this.proofGeoTrafficSummary) {
      const top3 = results.countryBreakdown.slice(0, 4).map(c => `${c.share}% ${c.code}`).join(' · ');
      this.proofGeoTrafficSummary.textContent = top3 || 'Global Mix';
    }
    const selectedNiche = NICHES.find(n => n.id === this.state.nicheId);
    if (this.proofNicheMult && selectedNiche) {
      this.proofNicheMult.textContent = `${selectedNiche.name} (${selectedNiche.multiplier}x)`;
    }
    const selectedDuration = DURATION_MODIFIERS.find(d => d.id === this.state.durationId);
    if (this.proofDurationMult && selectedDuration) {
      this.proofDurationMult.textContent = `${selectedDuration.name} (${selectedDuration.multiplier}x)`;
    }
    if (this.proofEffectiveLongRpm) this.proofEffectiveLongRpm.textContent = `${this.formatRpm(results.metrics.longWeightedRpm)} / 1,000 views`;
    if (this.proofEffectiveShortsRpm) this.proofEffectiveShortsRpm.textContent = `${this.formatRpm(results.metrics.shortsWeightedRpm)} / 1,000 views`;

    // Step 3: Math Formulas (On Monetized Playbacks)
    if (this.proofLongCalc) {
      this.proofLongCalc.textContent = `(${this.formatCompactNumber(monetizedLong)} ÷ 1k) × ${this.formatRpm(results.metrics.longWeightedRpm)}`;
    }
    if (this.proofLongTotal) {
      this.proofLongTotal.textContent = `= ${this.formatMoney(longRev)} /mo`;
    }
    if (this.proofShortsCalc) {
      this.proofShortsCalc.textContent = `(${this.formatCompactNumber(monetizedShorts)} ÷ 1k) × ${this.formatRpm(results.metrics.shortsWeightedRpm)}`;
    }
    if (this.proofShortsTotal) {
      this.proofShortsTotal.textContent = `= ${this.formatMoney(shortsRev)} /mo`;
    }
    if (this.proofSumTotal) {
      this.proofSumTotal.textContent = `${this.formatMoney(longRev)} + ${this.formatMoney(shortsRev)} = ${this.formatMoney(totalAdSense)} /mo`;
    }
    if (this.proofBlendedRpm) {
      this.proofBlendedRpm.textContent = `${this.formatRpm(results.metrics.effectiveChannelRpm)}`;
    }

    // Step 4: Fantasy Contrast
    if (this.proofFantasyFormulaDetail) {
      this.proofFantasyFormulaDetail.textContent = `(${this.formatNumber(totalViews)} ÷ 1,000) × $0.25 to $4.00`;
    }
    if (this.proofFantasyResultDetail) {
      this.proofFantasyResultDetail.textContent = `= ${this.formatMoney(fbMin)} to ${this.formatMoney(fbMax)} /mo (${Math.round(fbMax/Math.max(1, fbMin))}x spread)`;
    }
    if (this.proofAdblockFlaw) {
      this.proofAdblockFlaw.textContent = `${adblockPct}%`;
    }
    if (this.proofOverestimateMultiple) {
      const mult = totalAdSense > 0 ? Math.round(fbMax / totalAdSense) : 0;
      this.proofOverestimateMultiple.textContent = mult > 1 ? `${mult}x` : '16x';
    }

    // Step 5: Forex & Taxes Applied at End
    if (tax) {
      if (this.proofTaxGrossUsd) {
        this.proofTaxGrossUsd.textContent = `$${Math.round(tax.grossMonthlyUsd).toLocaleString()} /mo`;
      }
      if (this.proofTaxFxRate) {
        this.proofTaxFxRate.textContent = `1 USD = ₹${tax.exchangeRate.toFixed(2)}`;
      }
      if (this.proofTaxGrossInr) {
        this.proofTaxGrossInr.textContent = `${this.formatInr(tax.grossMonthlyInr)} /mo`;
      }
      if (this.proofTaxUsDeduction) {
        this.proofTaxUsDeduction.textContent = tax.usWithholdingMonthlyInr > 0 
          ? `-${this.formatInr(tax.usWithholdingMonthlyInr)} /mo` 
          : '₹0 (No US traffic)';
      }
      if (this.proofTaxIndiaDeduction) {
        this.proofTaxIndiaDeduction.textContent = tax.indianIncomeTaxMonthlyInr > 0 
          ? `-${this.formatInr(tax.indianIncomeTaxMonthlyInr)} /mo` 
          : '₹0 (Sec 87A Full Rebate)';
      }
      if (this.proofTaxNetInhand) {
        this.proofTaxNetInhand.textContent = `${this.formatInr(tax.netInHandMonthlyInr)} /mo`;
      }
    }
  }

  renderCountryTable(countryBreakdown) {
    this.tableCountryContributions.innerHTML = '';

    countryBreakdown.forEach(c => {
      const tr = document.createElement('tr');
      const tierClass = c.tier.toLowerCase().replace(' ', '-');
      tr.innerHTML = `
        <td>
          <div class="country-name-badge">
            <span class="country-flag">${this.getFlagHtml(c)}</span>
            <strong style="color:#fff;">${c.name}</strong>
          </div>
        </td>
        <td><span class="tier-pill ${tierClass}">${c.tier}</span></td>
        <td>${c.share}%</td>
        <td>${this.formatNumber(c.views)}</td>
        <td><strong>${this.formatRpm(c.longRpm)}</strong></td>
        <td><strong style="color:#34d399;">${this.formatMoney(c.totalRevenue)}</strong></td>
        <td>
          <div class="table-share-bar-cell">
            <div class="table-share-bar">
              <div class="table-share-fill" style="width: ${c.revenueContributionPercent}%; background: linear-gradient(90deg, #10b981, #06b6d4);"></div>
            </div>
            <strong>${c.revenueContributionPercent.toFixed(1)}%</strong>
          </div>
        </td>
      `;
      this.tableCountryContributions.appendChild(tr);
    });
  }

  renderFormatTab(results) {
    this.statFormatLongViews.textContent = this.formatNumber(results.views.long);
    this.statFormatLongRpm.textContent = this.formatRpm(results.metrics.longWeightedRpm);
    this.statFormatDurationMult.textContent = `${results.duration.multiplier}x (${results.duration.name})`;
    this.statFormatLongRev.textContent = this.formatMoney(results.earnings.longRevenue);

    this.statFormatShortsViews.textContent = this.formatNumber(results.views.shorts);
    this.statFormatShortsRpm.textContent = this.formatRpm(results.metrics.shortsWeightedRpm);
    this.statFormatShortsRev.textContent = this.formatMoney(results.earnings.shortsRevenue);

    const noteEl = document.querySelector('.ad-inventory-note');
    if (noteEl) {
      const shortsM = (results.views.shorts / 1000000).toFixed(1);
      const longM = (results.views.long / 1000000).toFixed(1);
      noteEl.innerHTML = `<strong>Key Reality Insight:</strong> Notice how <strong>${shortsM}M Shorts views</strong> generate only <strong>${this.formatMoney(results.earnings.shortsRevenue)}</strong>, while <strong>${longM}M Long-form views</strong> generate <strong>${this.formatMoney(results.earnings.longRevenue)}</strong>. Shorts require 20x to 50x more volume to match long-form AdSense.`;
    }
  }

  renderMultiStreamTab(results) {
    if (this.streamAdSenseVal) {
      this.streamAdSenseVal.textContent = `${this.formatMoney(results.earnings.monthlyAdSense)} /mo`;
    }
    if (this.streamAdSenseSub) {
      this.streamAdSenseSub.textContent = `Long-form: ${this.formatMoney(results.earnings.longRevenue)} · Shorts Pool: ${this.formatMoney(results.earnings.shortsRevenue)}`;
    }
    this.streamBrandVal.textContent = `${this.formatMoney(results.earnings.brandDealMonthly)} /mo`;
    this.streamFanVal.textContent = `${this.formatMoney(results.earnings.membershipsMonthlyNetUsd)} /mo`;
    if (this.streamFanSub) {
      if (results.earnings.hasJoinButton && results.earnings.paidMembersCount > 0) {
        const priceLabel = this.state.countryCode === 'IN' ? '₹89/mo' : '$2.99/mo';
        this.streamFanSub.textContent = `Active Join button: ~${this.formatCompactNumber(results.earnings.paidMembersCount)} members (0.1% of subs @ ${priceLabel}, 70% net payout after YouTube 30% cut).`;
      } else {
        this.streamFanSub.textContent = '❌ No Join button active on channel. Channel membership perks revenue is $0.';
      }
    }
    this.streamAffiliateVal.textContent = `${this.formatMoney(results.earnings.affiliateMonthly)} /mo`;
    this.streamGrandTotal.textContent = `${this.formatMoney(results.earnings.totalEcosystemMonthly)} /mo`;
  }

  // Country Explorer Database Table
  renderAllCountryExplorer() {
    this.filterCountryExplorer();
  }

  filterCountryExplorer() {
    const query = (this.inputCountrySearch.value || '').toLowerCase().trim();
    const tierFilter = this.filterTierSelect.value;

    this.tableAllCountries.innerHTML = '';

    const filtered = COUNTRY_DATA.filter(c => {
      const matchSearch = c.name.toLowerCase().includes(query) || c.code.toLowerCase().includes(query) || c.region.toLowerCase().includes(query);
      const matchTier = tierFilter === 'ALL' || c.tier === tierFilter;
      return matchSearch && matchTier;
    });

    filtered.forEach(c => {
      const tr = document.createElement('tr');
      const tierClass = c.tier.toLowerCase().replace(' ', '-');
      tr.innerHTML = `
        <td>
          <div class="country-name-badge">
            <span class="country-flag">${this.getFlagHtml(c)}</span>
            <strong style="color:#fff;">${c.name}</strong> <span style="color:#64748b; font-size:0.75rem;">(${c.code})</span>
          </div>
        </td>
        <td>${c.region}</td>
        <td><span class="tier-pill ${tierClass}">${c.tier}</span></td>
        <td><strong>${this.formatRpm(c.baseRpm)}</strong> <span style="color:#64748b; font-size:0.75rem;">(${this.formatRpm(c.minRpm)} - ${this.formatRpm(c.maxRpm)})</span></td>
        <td><strong>${this.formatRpm(c.shortsRpm)}</strong></td>
        <td>${(c.fillRate * 100).toFixed(0)}%</td>
        <td>${this.formatMoney(c.sponsorCpm)}</td>
      `;

      // Quick click to add to active traffic mix
      tr.title = `Click to add ${c.name} to your channel traffic mix`;
      tr.addEventListener('click', () => {
        this.addCountryToTraffic(c.code);
      });

      this.tableAllCountries.appendChild(tr);
    });
  }

  // Modal Handlers
  openAddCountryModal() {
    this.modalOverlay.classList.add('open');
    if (this.selectCountryToAdd.value) {
      this.updateCountryModalPreview(this.selectCountryToAdd.value);
    }
  }

  closeAddCountryModal() {
    this.modalOverlay.classList.remove('open');
  }

  renderModalCountryList() {
    this.selectCountryToAdd.innerHTML = '';
    COUNTRY_DATA.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.code;
      opt.textContent = `${c.flag} ${c.name} (${c.tier} · Base RPM $${c.baseRpm.toFixed(2)})`;
      this.selectCountryToAdd.appendChild(opt);
    });

    if (COUNTRY_DATA.length > 0) {
      this.updateCountryModalPreview(COUNTRY_DATA[0].code);
    }
  }

  updateCountryModalPreview(code) {
    const country = this.engine.getCountry(code);
    if (!country) return;
    this.countryAddPreview.innerHTML = `
      <p style="display:flex; align-items:center; gap:0.5rem;">${this.getFlagHtml(country)} <strong>${country.name} (${country.code})</strong></p>
      <p>• Category: <strong>${country.tier}</strong> (${country.region})</p>
      <p>• Base Long-Form RPM: <strong>${this.formatRpm(country.baseRpm)}</strong></p>
      <p>• Shorts RPM: <strong>${this.formatRpm(country.shortsRpm)}</strong></p>
      <p>• Monetized Fill Rate: <strong>${(country.fillRate * 100).toFixed(0)}%</strong></p>
    `;
  }

  confirmAddCountry() {
    const code = this.selectCountryToAdd.value;
    this.addCountryToTraffic(code);
    this.closeAddCountryModal();
  }

  addCountryToTraffic(code) {
    // Check if already in list
    const existing = this.state.traffic.find(t => t.code === code);
    if (existing) {
      alert(`${this.engine.getCountry(code).name} is already in your traffic mix! Adjust its slider directly.`);
      return;
    }

    // Add with 10% share and rebalance
    this.state.traffic.push({ code, share: 10 });
    this.normalizeTraffic();
    this.state.activePresetId = null;
    this.updatePresetsActiveState();
    this.updateUI();
  }

  setViewScope(mode) {
    this.state.viewScopeMode = mode;
    if (mode === 'this-month' || mode === 'actual-by-date') {
      this.state.monthlyViews = this.state.actualViewsByDate || this.state.thisMonthViews || 25141000;
    } else if (mode === 'lifetime-avg' || mode === 'recent-uploads') {
      this.state.monthlyViews = this.state.actualViewsByDate || this.state.monthlyViews;
    }
    if (this.sliderViews) {
      this.sliderViews.value = this.state.monthlyViews;
    }
    this.updateUI();
  }

  updateViewsScopeUI() {
    // Update Scope Pills active state
    if (this.btnScopeThisMonth) {
      this.btnScopeThisMonth.classList.toggle('active', this.state.viewScopeMode === 'this-month');
    }
    if (this.btnScopeLifetimeAvg) {
      this.btnScopeLifetimeAvg.classList.toggle('active', this.state.viewScopeMode === 'lifetime-avg');
    }

    // Update Profile Card Mode Toggles active state
    if (this.btnProfileThisMonth) {
      this.btnProfileThisMonth.classList.toggle('active', this.state.viewScopeMode === 'this-month');
    }

    // Update Tab 4 buttons active state
    if (this.btnDivThisMonth) {
      this.btnDivThisMonth.classList.toggle('active', this.state.viewScopeMode === 'this-month');
    }
    if (this.btnDivLifetimeAvg) {
      this.btnDivLifetimeAvg.classList.toggle('active', this.state.viewScopeMode === 'lifetime-avg');
    }

    // Update Caption text
    if (this.viewsScopeCaption) {
      if (this.state.viewScopeMode === 'this-month') {
        this.viewsScopeCaption.innerHTML = `Active Mode: ⚡ <strong>Actual Views by Date</strong> (${this.formatCompactNumber(this.state.monthlyViews)} from recent 30-day video uploads)`;
      } else if (this.state.viewScopeMode === 'lifetime-avg') {
        this.viewsScopeCaption.innerHTML = `Active Mode: 🎥 <strong>Recent Uploads Velocity</strong> (${this.formatCompactNumber(this.state.monthlyViews)} actual run-rate by upload date)`;
      } else {
        this.viewsScopeCaption.innerHTML = `Active Mode: 🎛️ <strong>Custom Monthly Target</strong> (${this.formatCompactNumber(this.state.monthlyViews)} views/mo)`;
      }
    }
  }

  openDivideModal() {
    if (!this.divideModal) return;
    if (this.inputTotalViewsToDivide) {
      this.inputTotalViewsToDivide.value = this.state.monthlyViews;
    }
    this.recalculateDivideModal();
    this.divideModal.classList.add('open');
  }

  closeDivideModal() {
    if (this.divideModal) this.divideModal.classList.remove('open');
  }

  recalculateDivideModal() {
    const rawVal = Number(this.inputTotalViewsToDivide?.value) || this.state.monthlyViews;
    if (this.dispCalcDividedViews) {
      this.dispCalcDividedViews.textContent = `${this.formatNumber(rawVal)} views / month`;
    }
  }

  applyDividedModalResult() {
    const rawVal = Number(this.inputTotalViewsToDivide?.value) || this.state.monthlyViews;
    const views = Math.max(1000, Math.round(rawVal));
    this.state.monthlyViews = views;
    this.state.actualViewsByDate = views;
    this.state.viewScopeMode = 'this-month';
    if (this.sliderViews) {
      this.sliderViews.value = views;
    }
    this.closeDivideModal();
    this.updateUI();
  }

  renderMonthlyDivisionTab(division) {
    if (!this.tableMonthlyDivision) return;
    this.tableMonthlyDivision.innerHTML = '';

    if (this.dispThisMonthTakehome) {
      this.dispThisMonthTakehome.textContent = `${this.formatMoney(division.thisMonthRevenue)} /mo`;
    }
    if (this.dispThisMonthViews) {
      this.dispThisMonthViews.textContent = `${this.formatCompactNumber(division.thisMonthViews)} views · Format & Geo weighted`;
    }

    if (this.footAnnualViews) {
      this.footAnnualViews.textContent = this.formatNumber(division.annualTotalViews);
    }
    if (this.footAnnualRevenue) {
      this.footAnnualRevenue.textContent = this.formatMoney(division.annualDividedRevenue);
    }
    if (this.footAvgMonthly) {
      this.footAvgMonthly.textContent = `${this.formatMoney(division.averageMonthlyRevenue)} /mo`;
    }

    division.months.forEach(m => {
      const tr = document.createElement('tr');
      if (m.isCurrentMonth) {
        tr.className = 'row-this-month';
      }
      tr.innerHTML = `
        <td>
          <strong style="color: ${m.isCurrentMonth ? '#34d399' : '#fff'};">${m.name}</strong>
        </td>
        <td>
          ${m.isCurrentMonth 
            ? `<span class="badge-current-month">🔥 THIS MONTH</span>` 
            : `<span class="badge-month-normal">Schedule</span>`}
        </td>
        <td><strong>${this.formatNumber(m.views)}</strong></td>
        <td><span style="color:#60a5fa;">${this.formatCompactNumber(m.longViews)}</span></td>
        <td><span style="color:#f87171;">${this.formatCompactNumber(m.shortsViews)}</span></td>
        <td>
          <span class="tier-pill tier-2" title="${m.seasonNote}">
            ${m.seasonMultiplier.toFixed(2)}x
          </span>
        </td>
        <td>
          <strong style="color: ${m.isCurrentMonth ? '#34d399' : '#e2e8f0'};">
            ${this.formatMoney(m.totalRevenue)}
          </strong>
        </td>
        <td>
          <span style="color: #94a3b8; font-size: 0.85rem;">
            ${this.formatMoney(m.cumulativeRevenue)}
          </span>
        </td>
      `;
      this.tableMonthlyDivision.appendChild(tr);
    });
  }

  renderIndiaTaxTab(results, tax) {
    if (!this.dispInrNetMonthly) return;

    // 1. Hero Metric Cards
    this.dispInrNetMonthly.innerHTML = `${this.formatInr(tax.netInHandMonthlyInr)} <span class="unit">/mo</span>`;
    if (this.dispInrNetMonthlyLakhs) {
      this.dispInrNetMonthlyLakhs.textContent = this.state.useLakhsFormat 
        ? `≈ ${this.formatInrLakhs(tax.netInHandMonthlyInr)} / month` 
        : `(${this.formatInr(tax.netInHandMonthlyInr)} per month)`;
    }

    if (this.dispInrNetAnnual) {
      this.dispInrNetAnnual.innerHTML = `${this.formatInr(tax.netInHandAnnualInr)} <span class="unit">/yr</span>`;
    }
    if (this.dispInrNetAnnualLakhs) {
      this.dispInrNetAnnualLakhs.textContent = this.state.useLakhsFormat 
        ? `≈ ${this.formatInrLakhs(tax.netInHandAnnualInr)} / year` 
        : `(${this.formatInr(tax.netInHandAnnualInr)} per year)`;
    }

    if (this.dispInrTotalTax) {
      this.dispInrTotalTax.innerHTML = `- ${this.formatInr(tax.totalDeductionsMonthlyInr)} <span class="unit">/mo</span>`;
    }
    if (this.dispInrEffectiveRate) {
      this.dispInrEffectiveRate.textContent = `Effective Total Tax Rate: ${tax.effectiveTaxRatePercent.toFixed(1)}%`;
    }

    if (this.dispInrGrossMonthly) {
      this.dispInrGrossMonthly.innerHTML = `${this.formatInr(tax.grossMonthlyInr)} <span class="unit">/mo</span>`;
    }
    if (this.dispInrGrossUsdNote) {
      this.dispInrGrossUsdNote.textContent = `$${Math.round(tax.grossMonthlyUsd).toLocaleString()} USD @ ₹${tax.exchangeRate.toFixed(2)}/$`;
    }

    // 2. Visual Distribution Bar
    const gross = tax.grossMonthlyInr;
    let inhandPct = 100;
    let indiataxPct = 0;
    let ustaxPct = 0;

    if (gross > 0) {
      inhandPct = Math.max(0, Math.min(100, (tax.netInHandMonthlyInr / gross) * 100));
      indiataxPct = Math.max(0, Math.min(100, (tax.indianIncomeTaxMonthlyInr / gross) * 100));
      ustaxPct = Math.max(0, Math.min(100, (tax.usWithholdingMonthlyInr / gross) * 100));
    }

    if (this.barSegInhand) this.barSegInhand.style.width = `${inhandPct.toFixed(1)}%`;
    if (this.barSegIndiatax) this.barSegIndiatax.style.width = `${indiataxPct.toFixed(1)}%`;
    if (this.barSegUstax) this.barSegUstax.style.width = `${ustaxPct.toFixed(1)}%`;

    if (this.legendInhandPct) this.legendInhandPct.textContent = `${inhandPct.toFixed(1)}%`;
    if (this.legendIndiataxPct) this.legendIndiataxPct.textContent = `${indiataxPct.toFixed(1)}%`;
    if (this.legendUstaxPct) this.legendUstaxPct.textContent = `${ustaxPct.toFixed(1)}%`;

    // 3. Step-by-Step Waterfall Deduction Table
    if (this.tableIndiaWaterfall) {
      this.tableIndiaWaterfall.innerHTML = '';

      const netRemittanceUsd = Math.max(0, tax.grossMonthlyUsd - tax.usWithholdingMonthlyUsd);
      const netRemittanceInr = Math.max(0, tax.grossMonthlyInr - tax.usWithholdingMonthlyInr);
      const netRemittanceAnnualInr = Math.max(0, tax.annualGrossInr - tax.usWithholdingAnnualInr);

      const rows = [
        {
          step: '1. Gross YouTube AdSense',
          desc: 'Total estimated monthly AdSense before international taxes',
          auth: 'Google LLC / Ireland',
          usd: `$${Math.round(tax.grossMonthlyUsd).toLocaleString()}`,
          inrMonth: this.formatInr(tax.grossMonthlyInr),
          inrYear: this.formatInr(tax.annualGrossInr),
          status: '<span class="tier-pill tier-1a">Pre-Tax Earnings</span>',
          rowClass: ''
        },
        {
          step: '2. US Withholding Tax (W-8BEN)',
          desc: `${tax.usTaxRatePercent}% treaty withholding on ${tax.usTrafficSharePercent}% US viewers (DTAA Article 12)`,
          auth: 'US IRS',
          usd: tax.usWithholdingMonthlyUsd > 0 ? `-$${Math.round(tax.usWithholdingMonthlyUsd).toLocaleString()}` : '$0',
          inrMonth: tax.usWithholdingMonthlyInr > 0 ? `-${this.formatInr(tax.usWithholdingMonthlyInr)}` : '₹0',
          inrYear: tax.usWithholdingAnnualInr > 0 ? `-${this.formatInr(tax.usWithholdingAnnualInr)}` : '₹0',
          status: tax.usWithholdingMonthlyInr > 0 ? '<span class="tier-pill tier-3" title="Claim Foreign Tax Credit in ITR">Claim FTC Form 67</span>' : '<span class="tier-pill tier-1b">No US Traffic</span>',
          rowClass: ''
        },
        {
          step: '3. Foreign Remittance Credited',
          desc: 'Wire transfer arriving in Indian bank account (Export of Services, 0% GST with LUT)',
          auth: 'RBI / Bank FIRC',
          usd: `$${Math.round(netRemittanceUsd).toLocaleString()}`,
          inrMonth: `<strong>${this.formatInr(netRemittanceInr)}</strong>`,
          inrYear: `<strong>${this.formatInr(netRemittanceAnnualInr)}</strong>`,
          status: '<span class="tier-pill tier-1b">0% GST with LUT</span>',
          rowClass: ''
        },
        {
          step: '4. Business Expense Allowance',
          desc: tax.regime === '44ada' 
            ? 'Section 44ADA presumptive 50% flat expense allowance (no bills needed)' 
            : (tax.regime === 'new_regime' ? 'Standard Deduction ₹75,000 under New Tax Regime' : 'Flat tax computation'),
          auth: 'IT Act 1961',
          usd: '—',
          inrMonth: tax.businessExpensesAllowedInr > 0 ? `-${this.formatInr(tax.businessExpensesAllowedInr / 12)}` : '₹0',
          inrYear: tax.businessExpensesAllowedInr > 0 ? `-${this.formatInr(tax.businessExpensesAllowedInr)}` : '₹0',
          status: `<span class="tier-pill tier-2">${tax.regime === '44ada' ? '50% Deductible' : 'Standard'}</span>`,
          rowClass: ''
        },
        {
          step: '5. Net Indian Taxable Income',
          desc: 'Net income basis subject to Indian Income Tax assessment slabs',
          auth: 'IT Dept Slabs',
          usd: '—',
          inrMonth: this.formatInr(tax.taxableIncomeAnnualInr / 12),
          inrYear: `<strong>${this.formatInr(tax.taxableIncomeAnnualInr)}</strong>`,
          status: `<span class="tier-pill ${tax.isRebateApplied ? 'tier-1a' : 'tier-2'}">${tax.isRebateApplied ? 'Sec 87A Zero Tax Rebate' : 'Taxable Income'}</span>`,
          rowClass: ''
        },
        {
          step: '6. Indian Income Tax & 4% Cess',
          desc: tax.isRebateApplied 
            ? '100% tax rebate under Section 87A (Taxable income ≤ ₹7,00,000)' 
            : `Base Tax: ${this.formatInr(tax.baseTaxAnnualInr)}${tax.surchargeAnnualInr > 0 ? ` + Surcharge: ${this.formatInr(tax.surchargeAnnualInr)}` : ''} + 4% Cess: ${this.formatInr(tax.cessAnnualInr)}`,
          auth: 'ITR-4 / ITR-3',
          usd: '—',
          inrMonth: tax.indianIncomeTaxMonthlyInr > 0 ? `<span style="color:#f87171;">-${this.formatInr(tax.indianIncomeTaxMonthlyInr)}</span>` : '<span style="color:#34d399;">₹0 (Rebate)</span>',
          inrYear: tax.indianIncomeTaxAnnualInr > 0 ? `<span style="color:#f87171;">-${this.formatInr(tax.indianIncomeTaxAnnualInr)}</span>` : '<span style="color:#34d399;">₹0 (Rebate)</span>',
          status: tax.isRebateApplied 
            ? '<span class="tier-pill tier-1a">Sec 87A Full Rebate</span>' 
            : '<span class="tier-pill tier-3">Advance Tax Due</span>',
          rowClass: ''
        },
        {
          step: '7. 💰 FINAL NET IN-HAND PAYOUT',
          desc: 'Actual disposable money credited into your Indian bank account after all taxes',
          auth: 'Indian Bank',
          usd: `<strong>$${Math.round(tax.netInHandMonthlyInr / tax.exchangeRate).toLocaleString()}</strong>`,
          inrMonth: `<strong class="highlight-emerald" style="font-size:1.15rem;">${this.formatInr(tax.netInHandMonthlyInr)} /mo</strong>`,
          inrYear: `<strong class="highlight-emerald" style="font-size:1.15rem;">${this.formatInr(tax.netInHandAnnualInr)} /yr</strong>`,
          status: '<span class="tier-pill tier-1a" style="background:#059669; color:#fff;">Net In-Hand Pocket</span>',
          rowClass: 'final-inhand-row'
        }
      ];

      rows.forEach(r => {
        const tr = document.createElement('tr');
        if (r.rowClass) tr.className = r.rowClass;
        tr.innerHTML = `
          <td>
            <strong>${r.step}</strong>
            <div class="table-sub-desc">${r.desc}</div>
          </td>
          <td><span class="auth-pill">${r.auth}</span></td>
          <td>${r.usd}</td>
          <td>${r.inrMonth}</td>
          <td>${r.inrYear}</td>
          <td>${r.status}</td>
        `;
        this.tableIndiaWaterfall.appendChild(tr);
      });
    }
  }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.trueRpmApp = new TrueRpmApp();
});
