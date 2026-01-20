#!/usr/bin/env node
/**
 * Video Compression Script
 * - Compresses MP4 videos to WebM format (for desktop)
 * - Creates mobile-optimized H.264 versions (for mobile devices)
 * Run automatically before build or manually with: node scripts/compress-videos.js
 */

import { execSync, spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const VIDEOS_DIR = path.join(__dirname, '..', 'public', 'videos');
const FFMPEG_PATH = path.join(__dirname, '..', 'ffmpeg-8.0.1-essentials_build', 'bin', 'ffmpeg.exe');

// WebM compression settings (desktop)
const WEBM_SETTINGS = {
  codec: 'libvpx-vp9',
  bitrate: '1M',
  crf: 30,
  scale: 720,
  cpuUsed: 2,
};

// Mobile H.264 settings
const MOBILE_SETTINGS = {
  codec: 'libx264',
  profile: 'high',
  preset: 'slow',
  crf: 26,
  scale: 480,  // Lower res for mobile
};

function findFFmpeg() {
  // Check local ffmpeg first
  if (fs.existsSync(FFMPEG_PATH)) {
    return FFMPEG_PATH;
  }

  // Try system ffmpeg
  try {
    execSync('ffmpeg -version', { stdio: 'ignore' });
    return 'ffmpeg';
  } catch {
    return null;
  }
}

function getVideoFiles() {
  if (!fs.existsSync(VIDEOS_DIR)) {
    console.log('No videos directory found');
    return [];
  }

  return fs.readdirSync(VIDEOS_DIR)
    .filter(file => file.endsWith('.mp4') && !file.endsWith('-mobile.mp4'))
    .map(file => ({
      name: path.basename(file, '.mp4'),
      mp4Path: path.join(VIDEOS_DIR, file),
      webmPath: path.join(VIDEOS_DIR, file.replace('.mp4', '.webm')),
      mobilePath: path.join(VIDEOS_DIR, file.replace('.mp4', '-mobile.mp4')),
    }));
}

function formatSize(bytes) {
  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(1)} MB`;
}

async function compressToWebM(ffmpeg, video) {
  const { name, mp4Path, webmPath } = video;

  // Check if WebM already exists
  if (fs.existsSync(webmPath)) {
    const mp4Size = fs.statSync(mp4Path).size;
    const webmSize = fs.statSync(webmPath).size;
    console.log(`  ✓ ${name}.webm exists (${formatSize(webmSize)})`);
    return false;
  }

  const mp4Size = fs.statSync(mp4Path).size;
  console.log(`  → Creating ${name}.webm...`);

  const args = [
    '-i', mp4Path,
    '-c:v', WEBM_SETTINGS.codec,
    '-b:v', WEBM_SETTINGS.bitrate,
    '-crf', WEBM_SETTINGS.crf.toString(),
    '-an',
    '-vf', `scale=-1:${WEBM_SETTINGS.scale}`,
    '-deadline', 'good',
    '-cpu-used', WEBM_SETTINGS.cpuUsed.toString(),
    '-y',
    webmPath,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, args, { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code === 0) {
        const webmSize = fs.statSync(webmPath).size;
        const savings = ((1 - webmSize / mp4Size) * 100).toFixed(0);
        console.log(`  ✓ Created ${name}.webm (${formatSize(webmSize)}, ${savings}% smaller)`);
        resolve(true);
      } else {
        console.error(`  ✗ Failed to create ${name}.webm`);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function compressToMobile(ffmpeg, video) {
  const { name, mp4Path, mobilePath } = video;

  // Check if mobile version already exists
  if (fs.existsSync(mobilePath)) {
    const mobileSize = fs.statSync(mobilePath).size;
    console.log(`  ✓ ${name}-mobile.mp4 exists (${formatSize(mobileSize)})`);
    return false;
  }

  const mp4Size = fs.statSync(mp4Path).size;
  console.log(`  → Creating ${name}-mobile.mp4...`);

  const args = [
    '-i', mp4Path,
    '-c:v', MOBILE_SETTINGS.codec,
    '-profile:v', MOBILE_SETTINGS.profile,
    '-preset', MOBILE_SETTINGS.preset,
    '-crf', MOBILE_SETTINGS.crf.toString(),
    '-vf', `scale=${MOBILE_SETTINGS.scale}:-2`,
    '-an',
    '-movflags', '+faststart',
    '-y',
    mobilePath,
  ];

  return new Promise((resolve, reject) => {
    const proc = spawn(ffmpeg, args, { stdio: 'inherit' });

    proc.on('close', (code) => {
      if (code === 0) {
        const mobileSize = fs.statSync(mobilePath).size;
        const savings = ((1 - mobileSize / mp4Size) * 100).toFixed(0);
        console.log(`  ✓ Created ${name}-mobile.mp4 (${formatSize(mobileSize)}, ${savings}% smaller)`);
        resolve(true);
      } else {
        console.error(`  ✗ Failed to create ${name}-mobile.mp4`);
        reject(new Error(`FFmpeg exited with code ${code}`));
      }
    });

    proc.on('error', reject);
  });
}

async function main() {
  console.log('🎬 Video Compression Script\n');

  const ffmpeg = findFFmpeg();
  if (!ffmpeg) {
    console.log('⚠ FFmpeg not found. Skipping video compression.');
    console.log('  Install FFmpeg or place it in ffmpeg-*/bin/ffmpeg.exe');
    process.exit(0);  // Don't fail the build
  }

  console.log(`Using FFmpeg: ${ffmpeg}\n`);

  const videos = getVideoFiles();
  if (videos.length === 0) {
    console.log('No MP4 videos found to compress');
    return;
  }

  console.log(`Found ${videos.length} source video(s)\n`);

  let webmCreated = 0;
  let mobileCreated = 0;

  for (const video of videos) {
    console.log(`\n📹 ${video.name}.mp4 (${formatSize(fs.statSync(video.mp4Path).size)})`);

    // Create WebM version (desktop)
    try {
      const created = await compressToWebM(ffmpeg, video);
      if (created) webmCreated++;
    } catch (error) {
      console.error(`  Error creating WebM: ${error.message}`);
    }

    // Create mobile version (H.264 480p)
    try {
      const created = await compressToMobile(ffmpeg, video);
      if (created) mobileCreated++;
    } catch (error) {
      console.error(`  Error creating mobile: ${error.message}`);
    }
  }

  console.log(`\n✓ Done! Created ${webmCreated} WebM + ${mobileCreated} mobile video(s)`);
}

main().catch(console.error);
