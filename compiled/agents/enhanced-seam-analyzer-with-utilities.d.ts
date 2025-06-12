/**
 * 🔗 ENHANCED SEAM ANALYZER WITH UTILITY INTEGRATION
 * PURPOSE: Integrates development utilities and performance tracking with Enhanced Seam Analyzer
 * STATUS: STUBS - Following SDD pattern with fail-fast stubs first
 * SEAM: EnhancedSeamAnalyzer ↔ DevUtilities ↔ PerformanceTracker
 * CONTRACT VERSION: 1.0.0 - Initial integration
 */
import { ContractResult, DebugReport, EnhancedSeamAnalysis, EnhancedSeamAnalyzerIntegrationContract, InteractionMatrix, InteractionMatrixInput, PerformanceMetrics, SeamAnalysisInput, SeamValidationInput, SeamValidationResult } from "../contracts.js";
/**
 * 🎯 CRITICAL: Enhanced Seam Analyzer with integrated development utilities
 * Follows SDD pattern: Contract → Stubs → Implementation
 */
export declare class EnhancedSeamAnalyzerWithUtilities implements EnhancedSeamAnalyzerIntegrationContract {
    private readonly agentId;
    private readonly seamAnalyzer;
    private readonly devUtilities;
    private readonly performanceTracker;
    private performanceTrackingEnabled;
    private debugLoggingEnabled;
    constructor();
    /**
     * 🎯 CRITICAL: Analyze seams with performance tracking
     * SEAM: SeamAnalyzer ↔ PerformanceTracker ↔ DevUtilities
     */
    analyzeSeamsWithTracking(input: SeamAnalysisInput): Promise<ContractResult<EnhancedSeamAnalysis>>;
    /**
     * 🎯 CRITICAL: Validate seam readiness with performance tracking
     * SEAM: ValidationEngine ↔ PerformanceTracker ↔ DevUtilities
     */
    validateSeamReadinessWithTracking(input: SeamValidationInput): Promise<ContractResult<SeamValidationResult>>;
    /**
     * 🎯 CRITICAL: Generate interaction matrix with performance tracking
     * SEAM: InteractionEngine ↔ PerformanceTracker ↔ DevUtilities
     */
    generateInteractionMatrixWithTracking(input: InteractionMatrixInput): Promise<ContractResult<InteractionMatrix>>;
    /**
     * ⚡ QUICK_WIN: Enable/disable performance tracking
     * SEAM: ConfigManager ↔ PerformanceTracker
     */
    enablePerformanceTracking(enabled: boolean): Promise<ContractResult<boolean>>;
    /**
     * ⚡ QUICK_WIN: Enable/disable debug logging
     * SEAM: ConfigManager ↔ DevUtilities
     */
    enableDebugLogging(enabled: boolean): Promise<ContractResult<boolean>>;
    /**
     * 📊 ANALYTICS: Get operation performance metrics
     * SEAM: PerformanceTracker ↔ MetricsCollector
     */
    getOperationMetrics(): Promise<ContractResult<PerformanceMetrics>>;
    /**
     * 🧪 EXPERIMENTAL: Get comprehensive debug report
     * SEAM: DevUtilities ↔ PerformanceTracker ↔ ErrorHandler
     */
    getDebugReport(): Promise<ContractResult<DebugReport>>;
}
