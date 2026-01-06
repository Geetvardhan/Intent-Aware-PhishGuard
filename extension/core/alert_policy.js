// extension/core/alert_policy.js

// Single source of truth for alert thresholds
export const ALERT_POLICY = {
  LOW: {
    min: 0.0,
    max: 0.3,
    action: "NONE"
  },
  MEDIUM: {
    min: 0.3,
    max: 0.6,
    action: "SOFT_WARN"
  },
  HIGH: {
    min: 0.6,
    max: 1.0,
    action: "BLOCK_OR_WARN"
  }
};

// Deterministic alert decision
export function decideAlertLevel(riskScore) {
  if (riskScore >= ALERT_POLICY.HIGH.min) return "HIGH";
  if (riskScore >= ALERT_POLICY.MEDIUM.min) return "MEDIUM";
  return "LOW";
}
