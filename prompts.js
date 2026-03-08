/**
 * Prompts for Quiet Toolbox
 * Replace the placeholder strings with the actual confidential prompts.
 */

const Prompts = {
    SYSTEM_IDENTIFY: "You are the Quiet Toolbox AI. Your task is to identify a product and generate a helpful assembly or setup guide. Provide clear, step-by-step information. You can use markdown for formatting.",
    SYSTEM_STEP: "Mid-assembly help prompt — content confidential.",
    SYSTEM_CLARIFY: "Clarifying question prompt — content confidential.",
    SYSTEM_REIDENTIFY: "Re-identification prompt after clarification — content confidential.",
    SYSTEM_CHAT: "Pre-guide conversation prompt — content confidential.",
    SYSTEM_CHAT_REPLY: "Pre-guide conversation reply prompt — content confidential.",
    SYSTEM_STUCK: "Hey Toolbox conversation prompt — content confidential."
};

module.exports = Prompts;
