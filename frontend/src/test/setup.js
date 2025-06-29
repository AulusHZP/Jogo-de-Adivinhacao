import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock do fetch global para os testes
global.fetch = vi.fn()

// Mock do console para evitar logs durante os testes
global.console = {
  ...console,
  log: vi.fn(),
  debug: vi.fn(),
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
} 