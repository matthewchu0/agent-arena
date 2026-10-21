import { describe, expect, it, vi } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { resolveCommand } from './resolve-command';

describe('resolveCommand', () => {
  it.skipIf(process.platform !== 'win32')('prefers an executable after an npm shim on Windows PATH', () => {
    const root = mkdtempSync(path.join(os.tmpdir(), 'arena-resolve-'));
    const shimDir = path.join(root, 'shim');
    const nativeDir = path.join(root, 'native');
    mkdirSync(shimDir);
    mkdirSync(nativeDir);
    writeFileSync(path.join(shimDir, 'arena-codex-launch-test'), '#!/bin/sh');
    writeFileSync(path.join(shimDir, 'arena-codex-launch-test.cmd'), '@echo off');
    const executable = path.join(nativeDir, 'arena-codex-launch-test.exe');
    writeFileSync(executable, 'fixture');
    vi.stubEnv('PATH', `${shimDir};${nativeDir};${process.env.PATH}`);
    try {
      expect(resolveCommand('arena-codex-launch-test')).toBe(executable);
    } finally {
      vi.unstubAllEnvs();
    }
  });

  it('resolves a known command to an absolute path', () => {
    const resolved = resolveCommand('node');
    expect(path.isAbsolute(resolved)).toBe(true);
    expect(resolved).toContain('node');
  }, 15_000);

  it('returns absolute paths as-is', () => {
    const abs = '/usr/local/bin/my-tool';
    expect(resolveCommand(abs)).toBe(abs);
  });

  it('returns paths with separators as-is', () => {
    const relative = './bin/my-tool';
    expect(resolveCommand(relative)).toBe(relative);
  });

  it('returns paths with platform separators as-is', () => {
    const withSep = `bin${path.sep}my-tool`;
    expect(resolveCommand(withSep)).toBe(withSep);
  });

  it('throws with a helpful message for unknown commands', () => {
    expect(() => resolveCommand('nonexistent-command-abc123xyz')).toThrow(
      '"nonexistent-command-abc123xyz" not found in PATH'
    );
  });

  it('includes the command name in the error message', () => {
    try {
      resolveCommand('missing-tool-xyz');
      expect.fail('Expected an error to be thrown');
    } catch (error) {
      expect((error as Error).message).toContain('missing-tool-xyz');
      expect((error as Error).message).toContain('not found in PATH');
    }
  });
});
