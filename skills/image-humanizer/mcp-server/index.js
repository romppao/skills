#!/usr/bin/env node
/**
 * Image Humanizer MCP Server
 * 
 * Model Context Protocol server for Claude Desktop, VS Code, and other MCP clients.
 * Provides tools for transforming AI image prompts into realistic ones.
 */

import { transformPrompt, analyzePrompt, getSuggestions } from '../src/index.js';
import {
  CAMERAS,
  LENSES,
  LIGHTING,
  IMPERFECTIONS,
  HUMAN_DETAILS,
  COMPOSITION,
} from '../src/modifiers.js';

const SERVER_INFO = {
  name: 'image-humanizer',
  version: '0.1.0',
  description: 'Transform generic AI image prompts into realistic, photography-grounded ones',
};

const TOOLS = [
  {
    name: 'transform',
    description: 'Transform a generic AI prompt into a realistic, photography-grounded one. Returns before/after with scores.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The image prompt to transform' },
        style: { type: 'string', enum: ['film', 'digital', 'phone'], default: 'film', description: 'Photography style' },
        mood: { type: 'string', enum: ['natural', 'moody', 'harsh'], default: 'natural', description: 'Lighting mood' },
        imperfectionLevel: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium', description: 'How many imperfections to add' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'analyze',
    description: 'Analyze a prompt for AI-prone patterns without transforming it. Returns score and issues.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The image prompt to analyze' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'suggest',
    description: 'Get suggestions for improving a prompt without auto-transforming.',
    inputSchema: {
      type: 'object',
      properties: {
        prompt: { type: 'string', description: 'The image prompt to get suggestions for' },
      },
      required: ['prompt'],
    },
  },
  {
    name: 'modifiers',
    description: 'List all available realism modifiers by category.',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
];

function handleTool(name, args) {
  switch (name) {
    case 'transform': {
      const result = transformPrompt(args.prompt, {
        style: args.style || 'film',
        mood: args.mood || 'natural',
        imperfectionLevel: args.imperfectionLevel || 'medium',
      });
      return {
        original: result.original,
        transformed: result.transformed,
        originalScore: result.originalScore,
        newScore: result.newScore,
        improvement: result.improvement,
        modifiersAdded: result.modifiersAdded,
      };
    }
    
    case 'analyze': {
      const result = analyzePrompt(args.prompt);
      return {
        score: result.score,
        badge: result.score >= 60 ? '🔴' : result.score >= 30 ? '🟡' : '🟢',
        issues: result.issues.map(i => ({
          name: i.name,
          severity: i.severity,
          found: i.found,
        })),
        realismIndicators: result.realismIndicators,
      };
    }
    
    case 'suggest': {
      return getSuggestions(args.prompt);
    }
    
    case 'modifiers': {
      return {
        cameras: { film: CAMERAS.film, modern: CAMERAS.modern, vintage: CAMERAS.vintage },
        lenses: LENSES,
        lighting: LIGHTING,
        imperfections: IMPERFECTIONS,
        humanDetails: HUMAN_DETAILS,
        composition: COMPOSITION,
      };
    }
    
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

// MCP stdio transport
async function main() {
  const readline = await import('readline');
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });

  function send(msg) {
    process.stdout.write(JSON.stringify(msg) + '\n');
  }

  rl.on('line', (line) => {
    try {
      const msg = JSON.parse(line);
      
      if (msg.method === 'initialize') {
        send({
          jsonrpc: '2.0',
          id: msg.id,
          result: {
            protocolVersion: '2024-11-05',
            serverInfo: SERVER_INFO,
            capabilities: {
              tools: {},
            },
          },
        });
      } else if (msg.method === 'tools/list') {
        send({
          jsonrpc: '2.0',
          id: msg.id,
          result: { tools: TOOLS },
        });
      } else if (msg.method === 'tools/call') {
        const { name, arguments: args } = msg.params;
        try {
          const result = handleTool(name, args || {});
          send({
            jsonrpc: '2.0',
            id: msg.id,
            result: {
              content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
            },
          });
        } catch (err) {
          send({
            jsonrpc: '2.0',
            id: msg.id,
            error: { code: -32000, message: err.message },
          });
        }
      } else if (msg.method === 'notifications/initialized') {
        // Acknowledgement, no response needed
      } else {
        send({
          jsonrpc: '2.0',
          id: msg.id,
          error: { code: -32601, message: `Method not found: ${msg.method}` },
        });
      }
    } catch (err) {
      // Parse error, ignore malformed lines
    }
  });
}

main().catch(console.error);
