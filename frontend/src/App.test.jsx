import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'

// Mock do fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('App Component', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('should render the game title', () => {
    render(<App />)
    expect(screen.getByText('Jogo de Adivinhação')).toBeInTheDocument()
  })

  it('should render input field and submit button', () => {
    render(<App />)
    expect(screen.getByPlaceholderText('Digite um número de 1 a 100')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Enviar' })).toBeInTheDocument()
  })

  it('should render restart button', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: 'Nova rodada' })).toBeInTheDocument()
  })

  it('should show attempts counter', () => {
    render(<App />)
    expect(screen.getByText('Tentativas: 0')).toBeInTheDocument()
  })

  it('should handle input change correctly', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    await user.type(input, '50')
    
    expect(input.value).toBe('50')
  })

  it('should only allow numeric input', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    await user.type(input, '123')
    
    expect(input.value).toBe('123')
  })

  it('should disable submit button when input is empty', () => {
    render(<App />)
    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    expect(submitButton).toBeDisabled()
  })

  it('should enable submit button when input has value', async () => {
    const user = userEvent.setup()
    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    
    await user.type(input, '50')
    expect(submitButton).not.toBeDisabled()
  })

  it('should handle successful guess submission', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: 'higher',
        message: 'O número sorteado é maior.',
        attempts: 1
      })
    })

    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    
    await user.type(input, '50')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('O número sorteado é maior.')).toBeInTheDocument()
      expect(screen.getByText('Tentativas: 1')).toBeInTheDocument()
    })

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:5095/api/game/guess',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Number: 50 }),
        credentials: 'include'
      })
    )
  })

  it('should handle correct guess', async () => {
    const user = userEvent.setup()
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: 'correct',
        message: 'Parabéns! Você acertou o número 42 em 3 tentativa(s)!',
        number: 42,
        attempts: 3
      })
    })

    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    
    await user.type(input, '42')
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Parabéns! Você acertou o número 42 em 3 tentativa(s)!')).toBeInTheDocument()
      expect(screen.getByText('Tentativas: 3')).toBeInTheDocument()
    })
  })

  it('should show loading state during API calls', async () => {
    const user = userEvent.setup()
    
    let resolvePromise
    const promise = new Promise(resolve => { resolvePromise = resolve })
    mockFetch.mockReturnValueOnce(promise)

    render(<App />)
    
    const input = screen.getByPlaceholderText('Digite um número de 1 a 100')
    const submitButton = screen.getByRole('button', { name: 'Enviar' })
    const restartButton = screen.getByRole('button', { name: 'Nova rodada' })
    
    await user.type(input, '50')
    await user.click(submitButton)

    await waitFor(() => {
      expect(submitButton).toBeDisabled()
      expect(restartButton).toBeDisabled()
    })

    resolvePromise()
  })
}) 