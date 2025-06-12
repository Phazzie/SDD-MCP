/**
 * SDD MCP Server - Seam Integration Tests
 * Testing the connections BEFORE implementing the endpoints
 */
import { ContractResult } from "../contracts.js";
export declare class SeamIntegrationTester {
    testMCPProtocolSeam(): Promise<ContractResult<string>>;
    testSDDFunctionSeam(): Promise<ContractResult<string>>;
    testTemplateProcessingSeam(): Promise<ContractResult<string>>;
    testValidationSeam(): Promise<ContractResult<string>>;
    testErrorHandlingSeam(): Promise<ContractResult<string>>;
    testConfigurationSeam(): Promise<ContractResult<string>>;
    runAllSeamTests(): Promise<ContractResult<string[]>>;
}
export declare const seamTester: SeamIntegrationTester;
