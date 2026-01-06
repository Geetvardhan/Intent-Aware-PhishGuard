// extension/core/explainability_engine.js

import { EXPLANATIONS } from "./explanations.js";

/**
 * Converts deterministic rule triggers into
 * human-readable explanations.
 *
 * @param {string[]} triggers
 * @returns {Array<Object>}
 */
export function buildExplanation(triggers) {
  if (!Array.isArray(triggers)) return [];

  return triggers
    .filter(trigger => EXPLANATIONS[trigger])
    .map(trigger => ({
      trigger,
      title: EXPLANATIONS[trigger].title,
      message: EXPLANATIONS[trigger].message,
      lesson: EXPLANATIONS[trigger].lesson
    }));
}
