#!/usr/bin/env node
/**
 * Image Humanizer HTTP API Server
 * 
 * Simple HTTP server for OpenAI Actions and custom integrations.
 */

import { createServer } from 'http';
import { transformPrompt, analyzePrompt, getSuggestions } from '../src/index.js';
import {
  CAMERAS,
  LENSES,
  LIGHTING,
  IMPERFECTIONS,
  HUMAN_DETAILS,
  COMPOSITION,
} from '../src/modifiers.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = process.env.PORT || 3001;

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', chunk => data += chunk);
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function json(res, data, status = 200) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(data));
}

async function handleRequest(req, res) {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  
  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  try {
    // OpenAPI spec
    if (url.pathname === '/api/openapi' && req.method === 'GET') {
      const spec = readFileSync(join(__dirname, 'openapi.yaml'), 'utf-8');
      res.writeHead(200, { 'Content-Type': 'text/yaml' });
      return res.end(spec);
    }

    // Transform endpoint
    if (url.pathname === '/api/transform' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.prompt) {
        return json(res, { error: 'prompt is required' }, 400);
      }
      const result = transformPrompt(body.prompt, {
        style: body.style || 'film',
        mood: body.mood || 'natural',
        imperfectionLevel: body.imperfectionLevel || 'medium',
      });
      return json(res, {
        original: result.original,
        transformed: result.transformed,
        originalScore: result.originalScore,
        newScore: result.newScore,
        improvement: result.improvement,
      });
    }

    // Analyze endpoint
    if (url.pathname === '/api/analyze' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.prompt) {
        return json(res, { error: 'prompt is required' }, 400);
      }
      const result = analyzePrompt(body.prompt);
      return json(res, {
        score: result.score,
        badge: result.score >= 60 ? '🔴' : result.score >= 30 ? '🟡' : '🟢',
        issues: result.issues.map(i => ({ name: i.name, severity: i.severity })),
        realismIndicators: result.realismIndicators,
      });
    }

    // Suggest endpoint
    if (url.pathname === '/api/suggest' && req.method === 'POST') {
      const body = await parseBody(req);
      if (!body.prompt) {
        return json(res, { error: 'prompt is required' }, 400);
      }
      return json(res, getSuggestions(body.prompt));
    }

    // Modifiers endpoint
    if (url.pathname === '/api/modifiers' && req.method === 'GET') {
      return json(res, {
        cameras: CAMERAS,
        lenses: LENSES,
        lighting: LIGHTING,
        imperfections: IMPERFECTIONS,
        humanDetails: HUMAN_DETAILS,
        composition: COMPOSITION,
      });
    }

    // Health check
    if (url.pathname === '/health' && req.method === 'GET') {
      return json(res, { status: 'ok', version: '0.1.0' });
    }

    // 404
    return json(res, { error: 'Not found' }, 404);

  } catch (err) {
    return json(res, { error: err.message }, 500);
  }
}

const server = createServer(handleRequest);
server.listen(PORT, () => {
  console.log(`Image Humanizer API running on http://localhost:${PORT}`);
  console.log('Endpoints:');
  console.log('  POST /api/transform   - Transform a prompt');
  console.log('  POST /api/analyze     - Analyze a prompt');
  console.log('  POST /api/suggest     - Get suggestions');
  console.log('  GET  /api/modifiers   - List modifiers');
  console.log('  GET  /api/openapi     - OpenAPI spec');
});
