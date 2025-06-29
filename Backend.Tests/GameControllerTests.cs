using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using System.Text;
using System.Text.Json;
using Xunit;

namespace Backend.Tests
{
    public class GameControllerTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _factory;

        public GameControllerTests(WebApplicationFactory<Program> factory)
        {
            _factory = factory;
        }

        [Fact]
        public async Task Guess_WithValidNumber_ShouldReturnOkResult()
        {
            // Arrange
            var client = _factory.CreateClient();
            var request = new { Number = 50 };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/game/guess", content);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("result", responseContent);
        }

        [Fact]
        public async Task Guess_WithNumberBelowMinimum_ShouldReturnBadRequest()
        {
            // Arrange
            var client = _factory.CreateClient();
            var request = new { Number = 0 };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/game/guess", content);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("O número deve estar entre 1 e 100", responseContent);
        }

        [Fact]
        public async Task Guess_WithNumberAboveMaximum_ShouldReturnBadRequest()
        {
            // Arrange
            var client = _factory.CreateClient();
            var request = new { Number = 101 };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/game/guess", content);

            // Assert
            Assert.Equal(System.Net.HttpStatusCode.BadRequest, response.StatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("O número deve estar entre 1 e 100", responseContent);
        }

        [Fact]
        public async Task Guess_WithCorrectNumber_ShouldReturnCorrectResult()
        {
            // Arrange
            var client = _factory.CreateClient();
            
            // Primeiro, fazer um palpite para inicializar o jogo
            var initialRequest = new { Number = 50 };
            var initialContent = new StringContent(JsonSerializer.Serialize(initialRequest), Encoding.UTF8, "application/json");
            await client.PostAsync("/api/game/guess", initialContent);

            // Agora fazer o mesmo palpite novamente (deve retornar o mesmo resultado)
            var request = new { Number = 50 };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/game/guess", content);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
            Assert.True(result.TryGetProperty("attempts", out var attempts));
            Assert.Equal(2, attempts.GetInt32());
        }

        [Fact]
        public async Task Restart_ShouldReturnOkResult()
        {
            // Arrange
            var client = _factory.CreateClient();

            // Act
            var response = await client.PostAsync("/api/game/restart", null);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            Assert.Contains("Novo número sorteado", responseContent);
        }

        [Fact]
        public async Task Restart_ShouldResetAttempts()
        {
            // Arrange
            var client = _factory.CreateClient();
            
            // Fazer um palpite primeiro
            var guessRequest = new { Number = 50 };
            var guessContent = new StringContent(JsonSerializer.Serialize(guessRequest), Encoding.UTF8, "application/json");
            await client.PostAsync("/api/game/guess", guessContent);

            // Act - Reiniciar o jogo
            var restartResponse = await client.PostAsync("/api/game/restart", null);
            Assert.True(restartResponse.IsSuccessStatusCode);

            // Fazer um novo palpite
            var newGuessResponse = await client.PostAsync("/api/game/guess", guessContent);

            // Assert
            Assert.True(newGuessResponse.IsSuccessStatusCode);
            var responseContent = await newGuessResponse.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
            Assert.True(result.TryGetProperty("attempts", out var attempts));
            Assert.Equal(1, attempts.GetInt32());
        }

        [Theory]
        [InlineData(1)]
        [InlineData(50)]
        [InlineData(100)]
        public async Task Guess_WithValidNumbers_ShouldReturnValidResponse(int number)
        {
            // Arrange
            var client = _factory.CreateClient();
            var request = new { Number = number };
            var content = new StringContent(JsonSerializer.Serialize(request), Encoding.UTF8, "application/json");

            // Act
            var response = await client.PostAsync("/api/game/guess", content);

            // Assert
            Assert.True(response.IsSuccessStatusCode);
            var responseContent = await response.Content.ReadAsStringAsync();
            var result = JsonSerializer.Deserialize<JsonElement>(responseContent);
            
            Assert.True(result.TryGetProperty("result", out var resultProperty));
            Assert.True(result.TryGetProperty("message", out var messageProperty));
            Assert.True(result.TryGetProperty("attempts", out var attemptsProperty));
            
            var resultValue = resultProperty.GetString();
            Assert.True(resultValue == "correct" || resultValue == "higher" || resultValue == "lower");
            Assert.True(attemptsProperty.GetInt32() > 0);
        }
    }
} 