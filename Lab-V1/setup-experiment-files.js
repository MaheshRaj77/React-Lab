#!/usr/bin/env node

import { createExperimentFilesTable } from './database/scripts/setup-experiment-files.js';

console.log('🚀 Setting up experiment files table...');

try {
  await createExperimentFilesTable();
  console.log('✅ Setup completed successfully!');
} catch (error) {
  console.error('❌ Setup failed:', error);
  process.exit(1);
}
