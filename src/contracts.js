// =============================================================================
// SDD MCP Server - Core Contracts (SDD-Compliant)
// =============================================================================
// Built following SDD_FOUNDATIONAL_REPAIR_PLAN.md
// Each seam represents a communication pathway between components
// =============================================================================
// TYPE GUARDS
// =============================================================================
/**
 * Type guard to check if a result is successful
 */
export function isSuccessResult(result) {
    return result.success === true && result.data !== undefined;
}
/**
 * Type guard to check if a result is an error
 */
export function isErrorResult(result) {
    return result.success === false && result.error !== undefined;
}
/**
 * NotImplementedError class for marking unfinished implementations
 */
export class NotImplementedError extends Error {
    constructor(method, blueprint) {
        super(`${method} not implemented${blueprint ? `: ${blueprint}` : ""}`);
        this.name = "NotImplementedError";
    }
}
// Schema placeholders for legacy compatibility
export const CreateStubInputSchema = {};
export const CreateStubOutputSchema = {};
// =============================================================================
// END OF CONTRACTS
// =============================================================================
