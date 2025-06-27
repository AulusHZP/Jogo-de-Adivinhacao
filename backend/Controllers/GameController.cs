using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http;
using System;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GameController : ControllerBase
    {
        private const string SessionKey = "RandomNumber";
        private const string AttemptsKey = "Attempts";
        private const int MinNumber = 1;
        private const int MaxNumber = 100;

        [HttpPost("guess")]
        public IActionResult Guess([FromBody] GuessRequest request)
        {
            if (request.Number < MinNumber || request.Number > MaxNumber)
                return BadRequest(new { message = $"O número deve estar entre {MinNumber} e {MaxNumber}." });

            int? randomNumber = HttpContext.Session.GetInt32(SessionKey);
            if (randomNumber == null)
            {
                randomNumber = GenerateRandomNumber();
                HttpContext.Session.SetInt32(SessionKey, randomNumber.Value);
                HttpContext.Session.SetInt32(AttemptsKey, 0);
            }

            int attempts = HttpContext.Session.GetInt32(AttemptsKey) ?? 0;
            attempts++;
            HttpContext.Session.SetInt32(AttemptsKey, attempts);

            if (request.Number == randomNumber)
            {
                return Ok(new { result = "correct", message = $"Parabéns! Você acertou o número em {attempts} tentativa(s)!", number = randomNumber, attempts });
            }
            else if (request.Number < randomNumber)
            {
                return Ok(new { result = "higher", message = "O número sorteado é maior.", attempts });
            }
            else
            {
                return Ok(new { result = "lower", message = "O número sorteado é menor.", attempts });
            }
        }

        [HttpPost("restart")]
        public IActionResult Restart()
        {
            int newNumber = GenerateRandomNumber();
            HttpContext.Session.SetInt32(SessionKey, newNumber);
            HttpContext.Session.SetInt32(AttemptsKey, 0);
            return Ok(new { message = "Novo número sorteado! Jogo reiniciado." });
        }

        private int GenerateRandomNumber()
        {
            return new Random().Next(MinNumber, MaxNumber + 1);
        }
    }

    public class GuessRequest
    {
        public int Number { get; set; }
    }
} 