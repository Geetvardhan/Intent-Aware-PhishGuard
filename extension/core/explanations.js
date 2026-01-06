// extension/core/explanations.js

export const EXPLANATIONS = {
  FORM_ACTION_MISMATCH: {
    title: "Credentials sent to a different site",
    message:
      "This page asks for your password but submits it to a different domain.",
    lesson:
      "Legitimate websites send login data only to their own domain."
  },

  IP_BASED_URL: {
    title: "Suspicious website address",
    message:
      "This website uses a raw IP address instead of a normal domain name.",
    lesson:
      "Trusted services almost always use recognizable domain names."
  },

  NO_HTTPS: {
    title: "Connection is not secure",
    message:
      "This site does not use HTTPS, meaning your data could be intercepted.",
    lesson:
      "Never enter passwords on sites without a lock icon."
  },

  SUSPICIOUS_KEYWORD_IN_URL: {
    title: "Misleading website name",
    message:
      "The website address contains words commonly used in phishing attacks.",
    lesson:
      "Attackers use words like 'secure' or 'verify' to appear trustworthy."
  },

  DEEP_SUBDOMAIN: {
    title: "Unusual website structure",
    message:
      "This site is buried under many subdomains, often used to impersonate brands.",
    lesson:
      "Always focus on the main domain name, not the page text."
  }
};
