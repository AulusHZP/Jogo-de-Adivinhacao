import { useState } from 'react'
import './App.css'

// URL base da API do backend
const API_URL = 'http://localhost:5095/api/game'

function App() {
  // Estados principais do jogo
  const [guess, setGuess] = useState('') // Valor do palpite digitado
  const [feedback, setFeedback] = useState('') // Mensagem de feedback do backend
  const [isCorrect, setIsCorrect] = useState(false) // Se o usuário acertou o número
  const [loading, setLoading] = useState(false) // Se está aguardando resposta
  const [attempts, setAttempts] = useState(0) // Número de tentativas
  const [number, setNumber] = useState(null) // Número sorteado (mostrado ao acertar)

  // Função chamada ao enviar o palpite
  const handleGuess = async (e) => {
    e.preventDefault()
    setLoading(true)
    setFeedback('')
    setIsCorrect(false)
    setAttempts(0)
    setNumber(null)
    try {
      // Envia o palpite para o backend
      const response = await fetch(`${API_URL}/guess`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Number: Number(guess) }),
        credentials: 'include' // Garante que o cookie de sessão é enviado
      })
      const data = await response.json()
      if (!response.ok) {
        // Erro de validação ou backend
        setFeedback(data.message || 'Erro ao enviar palpite.')
      } else {
        // Se acertou, mostra mensagem especial
        if (data.result === 'correct') {
          setNumber(data.number)
          setAttempts(data.attempts)
          setFeedback(`Parabéns! Você acertou o número ${data.number} em ${data.attempts} tentativa(s)!`)
        } else {
          // Se não acertou, mostra dica (maior/menor)
          setFeedback(data.message)
          setIsCorrect(false)
          setAttempts(data.attempts)
          setNumber(null)
        }
        setIsCorrect(data.result === 'correct')
      }
    } catch (err) {
      setFeedback('Erro de conexão com o backend.')
    }
    setLoading(false)
  }

  // Função chamada ao clicar em "Nova rodada"
  const handleRestart = async () => {
    setLoading(true)
    setFeedback('')
    setIsCorrect(false)
    setGuess('')
    setAttempts(0)
    setNumber(null)
    try {
      // Solicita ao backend um novo número sorteado
      const response = await fetch(`${API_URL}/restart`, { method: 'POST', credentials: 'include' })
      const data = await response.json()
      setFeedback(data.message)
    } catch (err) {
      setFeedback('Erro ao reiniciar o jogo.')
    }
    setLoading(false)
  }

  // Função para garantir que só inteiros positivos sejam digitados
  const handleInputChange = (e) => {
    // Remove qualquer caractere que não seja dígito
    const value = e.target.value.replace(/[^\d]/g, '')
    setGuess(value)
  }

  // Renderização do componente
  return (
    <div className="container">
      <div className="game-card">
        {/* Título do jogo */}
        <h1>Jogo de Adivinhação</h1>
        {/* Formulário de palpite */}
        <form onSubmit={handleGuess} className="guess-form">
          <input
            type="number"
            min="1"
            max="100"
            step="1"
            value={guess}
            onChange={handleInputChange}
            placeholder="Digite um número de 1 a 100"
            disabled={isCorrect || loading}
            required
          />
          <button type="submit" disabled={isCorrect || loading || !guess}>
            Enviar
          </button>
        </form>
        {/* Botão para reiniciar o jogo */}
        <button onClick={handleRestart} className="restart-btn" disabled={loading}>
          Nova rodada
        </button>
        {/* Mensagem de feedback (acerto, dica, erro) */}
        {feedback && (
          <div className={`feedback${isCorrect ? ' success' : ''}`}>{feedback}</div>
        )}
        {/* Exibe o número de tentativas */}
        <div className="attempts">Tentativas: {attempts}</div>
      </div>
    </div>
  )
}

export default App
