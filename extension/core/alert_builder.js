// extension/core/alert_builder.js

import { decideAlertLevel } from "./alert_policy.js";
import { buildExplanation } from "./explainability_engine.js";

/**
 * Builds the final alert payload sent to the UI.
 * Returns null if no alert should be shown.
 */
export function buildAlertPayload({ riskScore, triggers, intent, url }) {
  const level = decideAlertLevel(riskScore);

  // Silent when safe
  if (level === "LOW") return null;

  return {
    level,
    intent,
    riskScore,
    url,
    explanations: buildExplanation(triggers),
    recommendedAction:
      level === "HIGH" ? "GO_BACK" : "PROCEED_WITH_CAUTION"
  };
}
