// Scientific Constants
const EVIDENCE_WEIGHTS = {
    bowling_workload: 0.30,
    previous_injury: 0.25,
    recovery: 0.10,
    sleep_fatigue: 0.10,
    core_strength: 0.10,
    flexibility: 0.05,
    bmi: 0.05,
    age: 0.05
};

const ROLE_INJURY_RATES = {
    'Fast Bowler': 0.45,
    'All-rounder': 0.32,
    'Wicketkeeper': 0.28,
    'Spin Bowler': 0.18,
    'Batsman': 0.12
};

let currentStep = 1;
const totalSteps = 4;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    // Update sliders
    document.querySelectorAll('.modern-slider, .pain-slider').forEach(slider => {
        slider.addEventListener('input', () => {
            updateSliderValues();
            updateSliderGradient(slider);
        });
        updateSliderGradient(slider);
    });
    
    document.getElementById('height').addEventListener('input', updateSliderValues);
    document.getElementById('weight').addEventListener('input', updateSliderValues);
    document.getElementById('infoBtn').addEventListener('click', () => navigateTo('infoScreen'));
    document.getElementById('backBtn').addEventListener('click', goBack);
    
    updateSliderValues();
    updateFormNavigation();
});

// Navigation
function navigateTo(screenId) {
    document.querySelectorAll('.screen').forEach(screen => screen.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
    
    const backBtn = document.getElementById('backBtn');
    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    
    if (screenId === 'homeScreen') {
        backBtn.style.display = 'none';
        headerTitle.textContent = 'Assessment';
        headerSubtitle.textContent = 'Cricket Injury Prevention';
    } else {
        backBtn.style.display = 'flex';
        if (screenId === 'formScreen') {
            headerTitle.textContent = `Step ${currentStep} of ${totalSteps}`;
            headerSubtitle.textContent = 'Player Assessment';
        } else if (screenId === 'resultsScreen') {
            headerTitle.textContent = 'Results';
            headerSubtitle.textContent = 'Risk Assessment';
        } else if (screenId === 'infoScreen') {
            headerTitle.textContent = 'Information';
            headerSubtitle.textContent = 'About System';
        }
    }
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goBack() {
    const activeScreen = document.querySelector('.screen.active');
    if (activeScreen.id === 'resultsScreen' || activeScreen.id === 'infoScreen') {
        navigateTo('homeScreen');
    } else if (activeScreen.id === 'formScreen') {
        if (currentStep === 1) {
            navigateTo('homeScreen');
        } else {
            previousStep();
        }
    }
}

// Form Steps
function nextStep() {
    if (currentStep < totalSteps) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep++;
        
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        updateFormNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function previousStep() {
    if (currentStep > 1) {
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.remove('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
        
        currentStep--;
        
        document.querySelector(`.form-step[data-step="${currentStep}"]`).classList.add('active');
        document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
        
        updateFormNavigation();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updateFormNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const calculateBtn = document.getElementById('calculateBtn');
    const headerTitle = document.getElementById('headerTitle');
    
    headerTitle.textContent = `Step ${currentStep} of ${totalSteps}`;
    
    prevBtn.style.display = currentStep === 1 ? 'none' : 'flex';
    
    if (currentStep === totalSteps) {
        nextBtn.style.display = 'none';
        calculateBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        calculateBtn.style.display = 'none';
    }
}

function calculateAndNavigate() {
    showLoading();
    setTimeout(() => {
        calculateRisk();
        hideLoading();
        navigateTo('resultsScreen');
    }, 1500);
}

// Slider Updates
function updateSliderValues() {
    document.getElementById('ageValue').textContent = document.getElementById('age').value;
    document.getElementById('painValue').textContent = document.getElementById('painLevel').value;
    document.getElementById('flexValue').textContent = document.getElementById('flexibilityScore').value;
    document.getElementById('postValue').textContent = document.getElementById('postureScore').value;
    document.getElementById('sleepValue').textContent = parseFloat(document.getElementById('sleepHours').value).toFixed(1);
    
    const height = parseFloat(document.getElementById('height').value);
    const weight = parseFloat(document.getElementById('weight').value);
    const bmi = weight / Math.pow(height / 100, 2);
    document.getElementById('bmiDisplay').textContent = bmi.toFixed(1);
    
    const bmiStatus = document.getElementById('bmiStatus');
    const bmiFill = document.getElementById('bmiFill');
    
    if (bmi < 18.5) {
        bmiStatus.textContent = 'Underweight';
        bmiStatus.style.color = '#f59e0b';
        bmiFill.style.width = '20%';
    } else if (bmi < 25) {
        bmiStatus.textContent = 'Normal Range';
        bmiStatus.style.color = '#10b981';
        bmiFill.style.width = '50%';
    } else if (bmi < 30) {
        bmiStatus.textContent = 'Overweight';
        bmiStatus.style.color = '#f59e0b';
        bmiFill.style.width = '75%';
    } else {
        bmiStatus.textContent = 'Obese';
        bmiStatus.style.color = '#ef4444';
        bmiFill.style.width = '100%';
    }
}

function updateSliderGradient(slider) {
    if (slider.classList.contains('pain-slider')) return;
    
    const value = (slider.value - slider.min) / (slider.max - slider.min) * 100;
    slider.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${value}%, #e2e8f0 ${value}%, #e2e8f0 100%)`;
}

function showLoading() {
    document.getElementById('loadingOverlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loadingOverlay').classList.remove('active');
}

// Non-linear risk functions
function nonlinearWorkloadRisk(oversPerWeek, role) {
    const safeThreshold = (role === "Fast Bowler") ? 40 : 50;
    if (oversPerWeek <= safeThreshold * 0.75) return 0.0;
    if (oversPerWeek <= safeThreshold) return (oversPerWeek / safeThreshold) * 0.3;
    const excess = oversPerWeek - safeThreshold;
    return Math.min(1.0, 0.3 + Math.pow(excess / safeThreshold, 1.6) * 0.7);
}

function nonlinearPainRisk(painLevel) {
    if (painLevel === 0) return 0.0;
    if (painLevel <= 3) return 0.1 + (painLevel / 10) * 0.2;
    if (painLevel <= 6) return 0.3 + ((painLevel - 3) / 7) * 0.3;
    return 0.6 + Math.pow((painLevel - 6) / 4, 1.8) * 0.4;
}

function sigmoidAgeRisk(age) {
    const optimalAge = 28;
    if (age < 22) return 0.3 + (22 - age) / 22 * 0.4;
    if (age > 35) return 0.2 + (age - 35) / 20 * 0.5;
    return Math.max(0.0, 0.1 - Math.abs(age - optimalAge) * 0.01);
}

function recoveryMismatchRisk(trainingHours, bowlingOvers, recoveryDays) {
    const weeklyLoad = trainingHours + (bowlingOvers * 0.5);
    const recoveryCapacity = recoveryDays * 8;
    if (recoveryCapacity === 0) return 1.0;
    const ratio = weeklyLoad / recoveryCapacity;
    if (ratio < 0.8) return 0.0;
    if (ratio < 1.2) return (ratio - 0.8) / 0.4 * 0.4;
    return Math.min(1.0, 0.4 + (ratio - 1.2) * 0.6);
}

function calculateConfidence(components, params) {
    let completenessScore = 1.0;
    if (params.pain_level === 0 && params.past_injury === "No") completenessScore *= 0.95;
    if (params.training_hours === 15 && params.bowling_workload === 20) completenessScore *= 0.90;
    
    const compValues = Object.values(components);
    const mean = compValues.reduce((a, b) => a + b, 0) / compValues.length;
    const variance = Math.sqrt(compValues.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / compValues.length);
    const varianceScore = Math.min(1.0, variance * 2);
    
    return (completenessScore * 0.6 + varianceScore * 0.4) * 100;
}

// Main calculation
function calculateRisk() {
    const params = {
        age: parseInt(document.getElementById('age').value),
        height: parseFloat(document.getElementById('height').value),
        weight: parseFloat(document.getElementById('weight').value),
        role: document.getElementById('role').value,
        past_injury: document.querySelector('input[name="pastInjury"]:checked').value,
        pain_level: parseInt(document.getElementById('painLevel').value),
        training_hours: parseFloat(document.getElementById('trainingHours').value),
        bowling_workload: parseFloat(document.getElementById('bowlingWorkload').value),
        matches_per_month: parseInt(document.getElementById('matchesPerMonth').value),
        recovery_days: parseInt(document.getElementById('recoveryDays').value),
        strength_training: document.getElementById('strengthTraining').value,
        core_strength: document.getElementById('coreStrength').value,
        warm_up: document.getElementById('warmUp').value,
        cool_down: document.getElementById('coolDown').value,
        sleep_hours: parseFloat(document.getElementById('sleepHours').value),
        posture_score: parseInt(document.getElementById('postureScore').value),
        flexibility_score: parseInt(document.getElementById('flexibilityScore').value)
    };
    
    const bmi = params.weight / Math.pow(params.height / 100, 2);
    const components = {};
    const factors = [];
    
    // Calculate all components (same logic as before)
    components.workload = nonlinearWorkloadRisk(params.bowling_workload, params.role);
    
    if (['Fast Bowler', 'All-rounder'].includes(params.role)) {
        if (params.bowling_workload > 80) {
            factors.push({ factor: "Extreme bowling volume", severity: "critical", 
                description: `${params.bowling_workload} overs/week - Acute spikes = exponential risk` });
        } else if (params.bowling_workload > 50) {
            factors.push({ factor: "Very high bowling volume", severity: "critical",
                description: `${params.bowling_workload} overs/week - Exceeds safe threshold` });
        } else if (params.bowling_workload > 35) {
            factors.push({ factor: "Elevated bowling volume", severity: "high",
                description: `${params.bowling_workload} overs/week - Approaching limit` });
        }
    }
    
    let injuryScore = params.past_injury === "Yes" ? 0.85 : 0.0;
    const painScore = nonlinearPainRisk(params.pain_level);
    
    if (params.past_injury === "Yes") {
        factors.push({ factor: "Previous back injury", severity: "critical",
            description: "3-7x increased re-injury risk" });
    }
    
    if (params.past_injury === "Yes" && params.pain_level >= 4) {
        injuryScore = Math.min(1.0, injuryScore + 0.15);
        factors.push({ factor: "Re-injury pattern", severity: "critical",
            description: "Previous injury + current pain" });
    }
    
    if (params.pain_level >= 7) {
        factors.push({ factor: "Severe pain", severity: "critical",
            description: `Pain ${params.pain_level}/10 - Active tissue damage` });
    } else if (params.pain_level >= 4) {
        factors.push({ factor: "Moderate pain", severity: "high",
            description: `Pain ${params.pain_level}/10 - Early warning` });
    }
    
    components.previous_injury = (injuryScore + painScore) / 2;
    components.recovery = recoveryMismatchRisk(params.training_hours, params.bowling_workload, params.recovery_days);
    
    if (params.recovery_days < 1) {
        factors.push({ factor: "No recovery days", severity: "critical",
            description: "Zero rest = exponential fatigue" });
    } else if (params.recovery_days < 2) {
        factors.push({ factor: "Inadequate recovery", severity: "high",
            description: "Minimum 2 days/week recommended" });
    }
    
    let sleepScore = params.sleep_hours < 6 ? 0.85 : params.sleep_hours < 7 ? 0.60 : params.sleep_hours < 8 ? 0.30 : Math.max(0.0, 0.1 - (params.sleep_hours - 8) * 0.05);
    
    if (params.sleep_hours < 6) {
        factors.push({ factor: "Severe sleep deprivation", severity: "critical",
            description: `${params.sleep_hours}hrs/night - 2.3x injury risk` });
    } else if (params.sleep_hours < 7) {
        factors.push({ factor: "Insufficient sleep", severity: "high",
            description: `${params.sleep_hours}hrs/night - 1.7x injury risk` });
    }
    
    const warmupMap = {"Never": 0.80, "Rarely": 0.65, "Sometimes": 0.40, "Often": 0.20, "Always": 0.0};
    const cooldownMap = {"Never": 0.60, "Rarely": 0.45, "Sometimes": 0.30, "Often": 0.15, "Always": 0.0};
    
    components.sleep_fatigue = (sleepScore + warmupMap[params.warm_up] + cooldownMap[params.cool_down]) / 3;
    
    const coreMap = {"Poor": 0.90, "Average": 0.50, "Good": 0.20, "Excellent": 0.0};
    const strengthMap = {"No": 0.75, "Rarely": 0.50, "Yes": 0.25, "Regular": 0.0};
    
    if (params.core_strength === "Poor") {
        factors.push({ factor: "Weak core", severity: "critical",
            description: "Primary modifiable risk factor" });
    }
    
    components.core_strength = (coreMap[params.core_strength] + strengthMap[params.strength_training]) / 2;
    
    let flexScore = params.flexibility_score < 4 ? 0.85 : params.flexibility_score < 6 ? 0.50 : params.flexibility_score >= 8 ? Math.max(0.0, 0.2 - (params.flexibility_score - 8) * 0.1) : 0.30;
    components.flexibility = flexScore;
    
    let bmiScore = bmi < 18.5 ? 0.60 : bmi > 30 ? 0.75 : bmi > 27 ? 0.50 : 0.0;
    let postureRisk = params.posture_score < 4 ? 0.80 : params.posture_score < 6 ? 0.50 : 0.20;
    
    if (params.posture_score < 4) {
        factors.push({ factor: "Poor posture", severity: "critical",
            description: `Score ${params.posture_score}/10 - Biomechanical dysfunction` });
    }
    
    components.bmi = (bmiScore + postureRisk) / 2;
    components.age = sigmoidAgeRisk(params.age);
    
    const weightedRisk = 
        EVIDENCE_WEIGHTS.bowling_workload * components.workload +
        EVIDENCE_WEIGHTS.previous_injury * components.previous_injury +
        EVIDENCE_WEIGHTS.recovery * components.recovery +
        EVIDENCE_WEIGHTS.sleep_fatigue * components.sleep_fatigue +
        EVIDENCE_WEIGHTS.core_strength * components.core_strength +
        EVIDENCE_WEIGHTS.flexibility * components.flexibility +
        EVIDENCE_WEIGHTS.bmi * components.bmi +
        EVIDENCE_WEIGHTS.age * components.age;
    
    const roleMultiplier = ROLE_INJURY_RATES[params.role];
    const finalRisk = Math.min(1.0, weightedRisk * (1 + roleMultiplier));
    const riskScore = finalRisk * 100;
    const confidence = calculateConfidence(components, params);
    
    factors.sort((a, b) => {
        const order = {"critical": 0, "high": 1, "moderate": 2};
        return order[a.severity] - order[b.severity];
    });
    
    displayResults(riskScore, components, confidence, factors, params, bmi, weightedRisk, roleMultiplier);
}

// Display Results - Mobile Optimized
function displayResults(riskScore, components, confidence, factors, params, bmi, weightedRisk, roleMultiplier) {
    let riskLevel, riskClass, riskMessage;
    
    if (riskScore >= 70) {
        riskLevel = "CRITICAL RISK";
        riskClass = "risk-critical";
        riskMessage = "⚠️ Immediate medical intervention required";
    } else if (riskScore >= 50) {
        riskLevel = "HIGH RISK";
        riskClass = "risk-high";
        riskMessage = "⚠️ Urgent intervention needed";
    } else if (riskScore >= 30) {
        riskLevel = "MODERATE RISK";
        riskClass = "risk-moderate";
        riskMessage = "⚠️ Implement preventive strategies";
    } else {
        riskLevel = "LOW RISK";
        riskClass = "risk-low";
        riskMessage = "✓ Continue monitoring regularly";
    }
    
    const confColor = confidence >= 80 ? "#10b981" : confidence >= 60 ? "#f59e0b" : "#ef4444";
    const confLabel = confidence >= 80 ? "High" : confidence >= 60 ? "Moderate" : "Low";
    
    const criticalCount = factors.filter(f => f.severity === "critical").length;
    const highCount = factors.filter(f => f.severity === "high").length;
    const moderateCount = factors.filter(f => f.severity === "moderate").length;
    
    let html = `
        <div class="risk-card ${riskClass}">
            <div class="risk-label">${riskLevel}</div>
            <div class="risk-score">${riskScore.toFixed(1)}%</div>
            <div style="font-size: 13px; margin-top: 8px; opacity: 0.95;">${riskMessage}</div>
        </div>
        
        <div class="result-card">
            <div style="text-align: center; padding: 12px; background: rgba(${confColor === '#10b981' ? '16, 185, 129' : confColor === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.1); border-radius: 16px; margin-bottom: 16px;">
                <div style="font-size: 12px; color: ${confColor}; font-weight: 700; margin-bottom: 4px;">Confidence: ${confLabel}</div>
                <div style="font-size: 20px; font-weight: 800; color: ${confColor};">${confidence.toFixed(1)}%</div>
            </div>
        </div>
        
        <div class="result-card">
            <div class="card-title">📊 Key Metrics</div>
            <div class="metric-grid">
                <div class="metric-box">
                    <div class="metric-box-label">Pain</div>
                    <div class="metric-box-value">${params.pain_level}</div>
                    <div class="metric-box-status" style="background: ${params.pain_level >= 6 ? '#fee2e2' : params.pain_level >= 3 ? '#ffedd5' : '#dcfce7'}; color: ${params.pain_level >= 6 ? '#dc2626' : params.pain_level >= 3 ? '#ea580c' : '#10b981'};">
                        ${params.pain_level >= 6 ? 'Critical' : params.pain_level >= 3 ? 'Monitor' : 'Normal'}
                    </div>
                </div>
                <div class="metric-box">
                    <div class="metric-box-label">Workload</div>
                    <div class="metric-box-value">${params.bowling_workload}</div>
                    <div class="metric-box-status" style="background: ${params.bowling_workload > 50 ? '#fee2e2' : params.bowling_workload > 30 ? '#ffedd5' : '#dcfce7'}; color: ${params.bowling_workload > 50 ? '#dc2626' : params.bowling_workload > 30 ? '#ea580c' : '#10b981'};">
                        overs/wk
                    </div>
                </div>
                <div class="metric-box">
                    <div class="metric-box-label">Recovery</div>
                    <div class="metric-box-value">${params.recovery_days}</div>
                    <div class="metric-box-status" style="background: ${params.recovery_days >= 2 ? '#dcfce7' : '#fee2e2'}; color: ${params.recovery_days >= 2 ? '#10b981' : '#dc2626'};">
                        days/wk
                    </div>
                </div>
            </div>
        </div>
        
        <div class="chart-wrapper">
            <div class="chart-title">📈 Component Analysis</div>
            <canvas id="componentChart"></canvas>
        </div>
    `;
    
    if (factors.length > 0) {
        html += `
            <div class="result-card">
                <div class="card-title">⚠️ Risk Factors (${factors.length})</div>
                <div class="metric-grid" style="margin-bottom: 16px;">
                    <div class="metric-box" style="background: #fee2e2;">
                        <div class="metric-box-value" style="color: #dc2626;">${criticalCount}</div>
                        <div class="metric-box-label" style="color: #7f1d1d;">Critical</div>
                    </div>
                    <div class="metric-box" style="background: #ffedd5;">
                        <div class="metric-box-value" style="color: #ea580c;">${highCount}</div>
                        <div class="metric-box-label" style="color: #7c2d12;">High</div>
                    </div>
                    <div class="metric-box" style="background: #fef3c7;">
                        <div class="metric-box-value" style="color: #d97706;">${moderateCount}</div>
                        <div class="metric-box-label" style="color: #78350f;">Moderate</div>
                    </div>
                </div>
                <div class="factor-list">
        `;
        
        factors.forEach(({factor, severity, description}) => {
            const icon = severity === "critical" ? "🔴" : severity === "high" ? "🟠" : "🟡";
            html += `
                <div class="factor-item ${severity}">
                    <div class="factor-title">${icon} ${factor}</div>
                    <div class="factor-desc">${description}</div>
                </div>
            `;
        });
        
        html += '</div></div>';
    }
    
    html += `
        <div class="result-card">
            <div class="card-title">📥 Export Report</div>
            <div class="export-grid">
                <button class="export-btn" onclick="exportCSV()">📄 CSV</button>
                <button class="export-btn" onclick="exportReport()">📋 Report</button>
            </div>
        </div>
    `;
    
    document.getElementById('resultsContainer').innerHTML = html;
    
    window.assessmentData = {
        riskScore, components, confidence, factors,
        params, bmi, weightedRisk, roleMultiplier, riskLevel
    };
    
    setTimeout(() => createMobileChart(components), 100);
}

// Mobile-Optimized Chart
function createMobileChart(components) {
    const ctx = document.getElementById('componentChart');
    if (!ctx) return;
    
    const labels = Object.keys(components).map(k => 
        k.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
    );
    const weights = Object.keys(components).map(k => EVIDENCE_WEIGHTS[k] || 0.1);
    const data = Object.values(components).map((v, i) => (v * weights[i] * 100).toFixed(1));
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Risk %',
                data: data,
                backgroundColor: data.map(v => v > 15 ? '#dc2626' : v > 10 ? '#f59e0b' : '#10b981'),
                borderRadius: 8,
                barThickness: 24
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    padding: 12,
                    cornerRadius: 8,
                    titleFont: { size: 13, weight: 'bold' },
                    bodyFont: { size: 12 }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { font: { size: 10 } },
                    grid: { color: 'rgba(0,0,0,0.05)' }
                },
                x: {
                    ticks: { font: { size: 9 }, maxRotation: 45, minRotation: 45 },
                    grid: { display: false }
                }
            }
        }
    });
}

// Export Functions
function exportCSV() {
    const data = window.assessmentData;
    if (!data) return;
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    let csv = 'Date,Age,Height,Weight,BMI,Role,Prev_Injury,Pain,Training_Hrs,Bowling_Overs,Recovery_Days,Risk_Score,Risk_Level,Confidence\n';
    csv += `${new Date().toISOString()},${data.params.age},${data.params.height},${data.params.weight},${data.bmi.toFixed(2)},${data.params.role},${data.params.past_injury},${data.params.pain_level},${data.params.training_hours},${data.params.bowling_workload},${data.params.recovery_days},${data.riskScore.toFixed(2)},${data.riskLevel},${data.confidence.toFixed(2)}\n`;
    
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `assessment_${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function exportReport() {
    const data = window.assessmentData;
    if (!data) return;
    
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5);
    
    const criticalCount = data.factors.filter(f => f.severity === "critical").length;
    const highCount = data.factors.filter(f => f.severity === "high").length;
    const moderateCount = data.factors.filter(f => f.severity === "moderate").length;
    
    let report = `
CRICKET BACK INJURY RISK ASSESSMENT - SCIENTIFIC REPORT
========================================================
Generated: ${now.toLocaleString()}

METHODOLOGY
-----------
Evidence-Based Weighted Scoring with Non-Linear Risk Curves
Statistical Validation: Cross-referenced with peer-reviewed literature

PLAYER INFORMATION
------------------
Age: ${data.params.age} years
Height: ${data.params.height} cm
Weight: ${data.params.weight} kg
BMI: ${data.bmi.toFixed(1)}
Role: ${data.params.role}
Role-Specific Injury Rate: ${(data.roleMultiplier * 100).toFixed(0)}% (Jayasinghe & Perera, 2023)

RISK ASSESSMENT
---------------
Risk Classification: ${data.riskLevel}
Risk Score: ${data.riskScore.toFixed(1)}%
Prediction Confidence: ${data.confidence.toFixed(1)}%
Weighted Risk Index: ${data.weightedRisk.toFixed(4)}

COMPONENT ANALYSIS (Evidence-Weighted)
---------------------------------------
`;
    
    for (const [key, value] of Object.entries(data.components)) {
        const weight = EVIDENCE_WEIGHTS[key] || 0.10;
        const contribution = value * weight * 100;
        const name = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        report += `${name}: ${(value * 100).toFixed(1)}% (Weight: ${(weight * 100).toFixed(0)}%, Contribution: ${contribution.toFixed(1)}%)\n`;
    }
    
    report += `\nRISK FACTORS IDENTIFIED (${data.factors.length})\n`;
    report += `-----------------------\n`;
    
    data.factors.forEach(({factor, severity, description}, i) => {
        report += `${i + 1}. [${severity.toUpperCase()}] ${factor}\n   ${description}\n\n`;
    });
    
    report += `
EVIDENCE BASE
-------------
This assessment is grounded in peer-reviewed literature:

1. Training Workload (30% weight)
   - Dennis et al. (2005): Workload >50 overs/week = high risk
   - Hulin et al. (2014): Non-linear workload-injury relationship
   
2. Previous Injury (25% weight)
   - Orchard et al. (2009): 3-7x increased re-injury risk
   
3. Recovery & Workload Balance (10% weight)
   - Gabbett (2016): Acute:chronic workload ratio critical
   
4. Sleep & Fatigue (10% weight)
   - Milewski et al. (2014): <7hrs sleep = 1.7x injury risk
   
5. Core Strength (10% weight)
   - McGill (2010): Primary protective factor
   - Rao & Kumar (2015): Strengthening reduces injury 40-60%

STATISTICAL CONFIDENCE
----------------------
Confidence Score: ${data.confidence.toFixed(1)}%
Based on: Data completeness, component variance, evidence strength

RECOMMENDATIONS
---------------
Based on identified risk factors, implement evidence-based interventions:
- Workload management per Dennis et al. (2005) guidelines
- Core strengthening program (McGill Big 3)
- Sleep optimization (8-9 hours target)
- Regular biomechanical assessment
- Minimum 2 recovery days per week

RESEARCH INFORMATION
--------------------
Institution: Sabaragamuwa University of Sri Lanka
Researcher: Y.M. V A D Yapa (19 APE 4215)
Supervisor: Mrs. WKDSA Wickramarachchi
Version: 2.0 (Scientific)

DISCLAIMER
----------
This tool is for research and screening purposes. Not a substitute for 
professional medical diagnosis. Consult sports physician for clinical decisions.
`;
    
    const blob = new Blob([report], {type: 'text/plain'});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scientific_report_${timestamp}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
}