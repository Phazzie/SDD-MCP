/**
 * SDD Contract Template
 * Generated template for creating type-safe contracts following SDD methodology
 */

import { z } from 'zod';

// Blueprint: Core SDD result pattern with type safety
export type ContractResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  agentId: string;
  timestamp: string;
};

// Blueprint: Agent identification for seam tracking
export type AgentId = string;

// ================================
// {{CONTRACT_NAME}} Contract
// ================================

{{#if description}}
/**
 * Blueprint: {{description}}
 */
{{/if}}
export interface {{CONTRACT_NAME}}Contract {
  {{#each methods}}
  // Blueprint: {{this.description}}
  {{this.name}}({{#each this.parameters}}{{this.name}}: {{this.type}}{{#unless @last}}, {{/unless}}{{/each}}): {{#if this.async}}Promise<{{/if}}ContractResult<{{this.returnType}}>{{#if this.async}}>{{/if}};
  
  {{/each}}
}

{{#if schemas}}
// ================================
// Validation Schemas
// ================================

{{#each schemas}}
export const {{this.name}}Schema = z.object({
  {{#each this.fields}}
  {{this.name}}: z.{{this.type}}(){{#if this.optional}}.optional(){{/if}},
  {{/each}}
});

export type {{this.name}} = z.infer<typeof {{this.name}}Schema>;

{{/each}}
{{/if}}

{{#if types}}
// ================================
// Type Definitions
// ================================

{{#each types}}
export type {{this.name}} = {{#if this.isUnion}}{{{this.definition}}}{{else}}{
  {{#each this.fields}}
  {{this.name}}: {{this.type}};
  {{/each}}
}{{/if}};

{{/each}}
{{/if}}

{{#if enums}}
// ================================
// Enumerations
// ================================

{{#each enums}}
export enum {{this.name}} {
  {{#each this.values}}
  {{this.name}} = '{{this.value}}',
  {{/each}}
}

{{/each}}
{{/if}}

{{#if constants}}
// ================================
// Constants
// ================================

{{#each constants}}
export const {{this.name}} = {{this.value}};
{{/each}}
{{/if}}

// Blueprint: Export contract for implementation
export default {{CONTRACT_NAME}}Contract;
