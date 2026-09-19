/**
 * TrueRPM — Application Controller & Dynamic UI Engine
 */

import { COUNTRY_DATA, NICHES, DURATION_MODIFIERS, PRESET_CHANNELS, REGIONAL_PRESETS } from './data.js';
import { RevenueEngine } from './engine.js';
import { ChannelResolver } from './resolver.js';

// Currency exchange rates (relative to USD)
const CURRENCIES = {
  USD: { symbol: '$', rate: 1.00, prefix: true },
  INR: { symbol: '₹', rate: 83.50, prefix: true },
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

    // Default application state (starts with CarryMinati as initial verified channel)
    this.state = {
      channelName: 'CarryMinati',
      channelHandle: '@carryminati',
      channelAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      subscribers: 44500000,
      totalViews: 3850000000,
      monthlyViews: 28000000,
      shortsPercent: 32,
      nicheId: 'comedy',
      durationId: 'mid_video',
      countryCode: 'IN',
      isMonetized: true,
      monetizationTier: 'YPP_ACTIVE',
      monetizationReason: 'YouTube Partner Program active. Majority revenue from long-form comedy videos and Tier-3 view auction',
      traffic: [
        { code: 'IN', share: 84 },
        { code: 'PK', share: 6 },
        { code: 'BD', share: 4 },
        { code: 'AE', share: 3 },
        { code: 'US', share: 3 }
      ],
      currency: 'USD',
      activePresetId: null,
      adblockEnabled: true,
      adblockPercent: 25,
      thisMonthViews: 26614610,
      averageMonthlyViews: 6203871,
      totalViews: 409455545,
      channelAgeMonths: 66,
      joinedDate: 'Apr 16, 2021',
      viewScopeMode: 'this-month',
      dividePeriodMonths: '12'
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
    this.cardTierMix = document.getElementById('card-tier-mix');
    this.cardTierDetails = document.getElementById('card-tier-details');
    this.cardEcosystemTotal = document.getElementById('card-ecosystem-total');

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
    this.streamBrandVal = document.getElementById('stream-brand-val');
    this.streamFanVal = document.getElementById('stream-fan-val');
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
    if (this.btnScopeAnnual12) {
      this.btnScopeAnnual12.addEventListener('click', () => this.setViewScope('annual-12'));
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
    if (this.btnDivSplit12) {
      this.btnDivSplit12.addEventListener('click', () => this.setViewScope('annual-12'));
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
  }

  // Format currency helpers
  formatMoney(amountInUsd, decimals = 0) {
    const cur = CURRENCIES[this.state.currency] || CURRENCIES.USD;
    const converted = amountInUsd * cur.rate;
    const formatted = Math.round(converted).toLocaleString();
    return cur.prefix ? `${cur.symbol}${formatted}` : `${formatted} ${cur.symbol}`;
  }

  formatRpm(rpmInUsd) {
    const cur = CURRENCIES[this.state.currency] || CURRENCIES.USD;
    const converted = rpmInUsd * cur.rate;
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
    this.state.thisMonthViews = channel.thisMonthViews || channel.monthlyViews;
    this.state.averageMonthlyViews = channel.averageMonthlyViews || Math.round(channel.totalViews / (channel.channelAgeMonths || 66));
    this.state.viewScopeMode = 'this-month';
    this.state.monthlyViews = this.state.thisMonthViews;
    this.state.shortsPercent = channel.shortsShare;
    this.state.nicheId = channel.niche;
    this.state.durationId = channel.duration;
    this.state.countryCode = channel.countryCode;
    this.state.isMonetized = channel.isMonetized;
    this.state.monetizationTier = channel.monetizationTier;
    this.state.monetizationReason = channel.monetizationReason;
    this.state.traffic = JSON.parse(JSON.stringify(channel.trafficDistribution));
    this.state.activePresetId = null;

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

    // Monetization badge & reason
    if (this.state.isMonetized) {
      this.profileMonetizationBadge.className = 'badge-monetized';
      this.profileMonetizationBadge.innerHTML = `<span class="badge-icon">✅</span><span class="badge-text">Monetized (YPP Active)</span>`;
    } else {
      this.profileMonetizationBadge.className = 'badge-monetized unmonetized';
      this.profileMonetizationBadge.innerHTML = `<span class="badge-icon">⚠️</span><span class="badge-text">Unmonetized / Ineligible</span>`;
    }
    this.profileMonetizationReason.textContent = this.state.monetizationReason;

    this.profileSubscribers.textContent = this.formatCompactNumber(this.state.subscribers);
    this.profileTotalViews.textContent = this.formatCompactNumber(this.state.totalViews);
    if (this.profileMonthlyViews) {
      this.profileMonthlyViews.textContent = `${this.formatCompactNumber(this.state.thisMonthViews || this.state.monthlyViews)}/mo`;
    }
    if (this.profileLifetimeAvg) {
      this.profileLifetimeAvg.textContent = `${this.formatCompactNumber(this.state.averageMonthlyViews || Math.round(this.state.totalViews / 66))}/mo`;
    }
    if (this.profileChannelAge) {
      this.profileChannelAge.textContent = this.state.joinedDate 
        ? `${this.state.joinedDate} (${this.state.channelAgeMonths} mos)` 
        : `${this.state.channelAgeMonths || 66} Mos Active`;
    }
    if (this.btnDivLifetimeVal) {
      this.btnDivLifetimeVal.textContent = `${this.formatCompactNumber(this.state.averageMonthlyViews || Math.round(this.state.totalViews / 66))}/mo`;
    }

    const countryObj = this.engine.getCountry(this.state.countryCode);
    this.profileOriginCountry.innerHTML = `${countryObj.flag} ${countryObj.name} (${countryObj.tier})`;

    // Format Split Pill
    if (this.profileFormatSplit) {
      const longPct = 100 - this.state.shortsPercent;
      this.profileFormatSplit.textContent = `${longPct}% Long · ${this.state.shortsPercent}% Shorts`;
    }

    // Top Country Traffic Pill
    if (this.profileTopTraffic) {
      const topItems = (this.state.traffic || []).slice(0, 3).map(c => {
        const cObj = this.engine.getCountry(c.code);
        return `${cObj?.flag || c.code} ${c.share}%`;
      }).join(' · ');
      this.profileTopTraffic.textContent = topItems || 'Global';
    }

    // AdBlock Rate Pill
    if (this.profileAdblockRate) {
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
      adblockPercent: this.state.adblockEnabled ? this.state.adblockPercent : 0
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

    // 4. Update The Reality Check Battlefield Card
    const fbMin = this.formatMoney(results.comparison.socialBladeMin);
    const fbMax = this.formatMoney(results.comparison.socialBladeMax);
    this.statFantasyRange.textContent = `${fbMin} – ${fbMax} /mo`;

    if (this.state.isMonetized) {
      this.statRealityPrice.innerHTML = `${this.formatMoney(results.earnings.monthlyAdSense)} <span class="unit">/mo</span>`;
      this.statRealityRange.textContent = `${this.formatMoney(results.earnings.monthlyAdSenseMin)} – ${this.formatMoney(results.earnings.monthlyAdSenseMax)}`;
      this.statEffectiveRpm.textContent = this.formatRpm(results.metrics.effectiveChannelRpm);
    } else {
      this.statRealityPrice.innerHTML = `<span style="color:#f87171;">${this.formatMoney(0)}</span> <span class="unit" style="color:#f87171;">/mo (Unmonetized)</span>`;
      this.statRealityRange.innerHTML = `Actual: <strong>${this.formatMoney(0)}</strong> · Potential if YPP approved: <strong style="color:#34d399;">${this.formatMoney(results.earnings.potentialMonthlyAdSense)}</strong>`;
      this.statEffectiveRpm.innerHTML = `<span style="color:#f87171;">${this.formatRpm(0)}</span> (Potential: <strong style="color:#34d399;">${this.formatRpm(results.metrics.potentialChannelRpm)}</strong>)`;
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
    this.renderCalculationProof(results);

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
    this.cardTierMix.textContent = `${results.metrics.tier1SharePercent}% Tier 1 · ${results.metrics.tier3SharePercent}% Tier 3`;
    this.cardTierDetails.textContent = `Weighted Fill Rate: ${results.metrics.weightedFillRate}%`;
    this.cardEcosystemTotal.innerHTML = `${this.formatMoney(results.earnings.totalEcosystemMonthly)} <span class="unit">/mo</span>`;

    // 7. Update Tabs Content
    this.renderCountryTable(results.countryBreakdown);
    this.renderFormatTab(results);
    this.renderMultiStreamTab(results);

    // 8. Update 12-Month Views Division & This Month Focus
    const currentMonthIndex = new Date().getMonth();
    const monthlyDivision = this.engine.generateMonthlyDivision(results, currentMonthIndex);
    this.renderMonthlyDivisionTab(monthlyDivision);
    this.updateViewsScopeUI();
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

  renderCalculationProof(results) {
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
    this.streamBrandVal.textContent = `${this.formatMoney(results.earnings.brandDealMonthly)} /mo`;
    this.streamFanVal.textContent = `${this.formatMoney(results.earnings.fanFundingMonthly)} /mo`;
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
    if (mode === 'this-month') {
      this.state.monthlyViews = this.state.thisMonthViews || 26614610;
    } else if (mode === 'lifetime-avg') {
      const age = Math.max(1, this.state.channelAgeMonths || 66);
      this.state.monthlyViews = this.state.averageMonthlyViews || Math.round((this.state.totalViews || 409455545) / age);
    } else if (mode === 'annual-12') {
      this.state.monthlyViews = Math.round((this.state.totalViews || 100000000) / 12);
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
    if (this.btnScopeAnnual12) {
      this.btnScopeAnnual12.classList.toggle('active', this.state.viewScopeMode === 'annual-12');
    }

    // Update Profile Card Mode Toggles active state
    if (this.btnProfileThisMonth) {
      this.btnProfileThisMonth.classList.toggle('active', this.state.viewScopeMode === 'this-month');
    }
    if (this.btnProfileLifetimeAvg) {
      this.btnProfileLifetimeAvg.classList.toggle('active', this.state.viewScopeMode === 'lifetime-avg');
    }

    // Update Tab 4 buttons active state
    if (this.btnDivThisMonth) {
      this.btnDivThisMonth.classList.toggle('active', this.state.viewScopeMode === 'this-month');
    }
    if (this.btnDivLifetimeAvg) {
      this.btnDivLifetimeAvg.classList.toggle('active', this.state.viewScopeMode === 'lifetime-avg');
    }
    if (this.btnDivSplit12) {
      this.btnDivSplit12.classList.toggle('active', this.state.viewScopeMode === 'annual-12');
    }

    // Update Caption text
    if (this.viewsScopeCaption) {
      if (this.state.viewScopeMode === 'this-month') {
        this.viewsScopeCaption.innerHTML = `Active Mode: ⚡ <strong>This Month</strong> (${this.formatCompactNumber(this.state.monthlyViews)} recent 30-day velocity)`;
      } else if (this.state.viewScopeMode === 'lifetime-avg') {
        const age = this.state.channelAgeMonths || 66;
        this.viewsScopeCaption.innerHTML = `Active Mode: 📅 <strong>Lifetime Divided by Months</strong> (${this.formatCompactNumber(this.state.totalViews)} ÷ ${age} mos = ${this.formatCompactNumber(this.state.monthlyViews)}/mo)`;
      } else if (this.state.viewScopeMode === 'annual-12') {
        this.viewsScopeCaption.innerHTML = `Active Mode: ➗ <strong>Annual Divided by 12</strong> (${this.formatCompactNumber(this.state.monthlyViews * 12)} ÷ 12 = ${this.formatCompactNumber(this.state.monthlyViews)}/mo)`;
      } else {
        this.viewsScopeCaption.innerHTML = `Active Mode: 🎛️ <strong>Custom Monthly Target</strong> (${this.formatCompactNumber(this.state.monthlyViews)} views/mo)`;
      }
    }
  }

  openDivideModal() {
    if (!this.divideModal) return;
    if (this.inputTotalViewsToDivide) {
      this.inputTotalViewsToDivide.value = this.state.totalViews || (this.state.monthlyViews * 12);
    }
    this.recalculateDivideModal();
    this.divideModal.classList.add('open');
  }

  closeDivideModal() {
    if (this.divideModal) this.divideModal.classList.remove('open');
  }

  recalculateDivideModal() {
    const rawVal = Number(this.inputTotalViewsToDivide?.value) || 0;
    let months = 12;
    if (this.state.dividePeriodMonths === '6') months = 6;
    else if (this.state.dividePeriodMonths === '3') months = 3;
    else if (this.state.dividePeriodMonths === 'channel') months = Math.max(1, this.state.channelAgeMonths || 66);
    else months = 12;

    const divided = Math.round(rawVal / months);
    if (this.dispCalcDividedViews) {
      this.dispCalcDividedViews.textContent = `${this.formatNumber(divided)} views / month`;
    }
  }

  applyDividedModalResult() {
    const rawVal = Number(this.inputTotalViewsToDivide?.value) || 0;
    let months = 12;
    if (this.state.dividePeriodMonths === '6') months = 6;
    else if (this.state.dividePeriodMonths === '3') months = 3;
    else if (this.state.dividePeriodMonths === 'channel') months = Math.max(1, this.state.channelAgeMonths || 66);
    else months = 12;

    const divided = Math.max(1000, Math.round(rawVal / months));
    this.state.monthlyViews = divided;
    this.state.viewScopeMode = 'annual-12';
    if (this.sliderViews) {
      this.sliderViews.value = divided;
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
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.trueRpmApp = new TrueRpmApp();
});
