#!/usr/bin/env node

/**
 * Karibase CSS Build Script
 * 
 * This script builds the CSS framework with modern optimizations:
 * - PostCSS processing with purging
 * - Minification with cssnano
 * - Cascade Layers support
 * - Source maps for development
 * 
 * Usage:
 *   node build-css.js          # Build for production
 *   node build-css.js --dev     # Build for development
 */

import { readFile, writeFile } from 'fs/promises'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

const isDev = process.argv.includes('--dev')

console.log('🎨 Building Karibase CSS Framework...')
console.log(`Mode: ${isDev ? 'Development' : 'Production'}`)

async function buildCSS() {
  try {
    // Build command with PostCSS CLI
    const input = 'public/styles/karibase.css'
    const output = 'public/css/karibase.css'

    let command = `npx postcss ${input} -o ${output}`

    if (isDev) {
      command += ' --map'
    }
    
    console.log(`\n📦 Processing: ${input}`)
    await execAsync(command)
    
    // Get file size
    const stats = await readFile(output)
    const sizeKB = (stats.length / 1024).toFixed(2)
    
    console.log(`\n✅ Build complete!`)
    console.log(`📊 Output: ${output}`)
    console.log(`📏 Size: ${sizeKB} KB`)
    
    if (!isDev) {
      console.log(`\n💡 Tip: Use --dev flag for development builds with source maps`)
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error.message)
    process.exit(1)
  }
}

buildCSS()
