using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using System.Security.Cryptography;
using System.Text;
using System.Numerics;



namespace genuine_captcha_api.Controllers
{
    [ApiController]
    [Route("api/health")]
    public class HealthController : ControllerBase
    {

        private IConfiguration _configuration;


        private readonly ILogger<CaptchaController> _logger;

        public HealthController(ILogger<CaptchaController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;

        }


        [HttpGet]
        public ActionResult GetResult()
        {
            const string result = "{\"QUESTION\":\"What is the meaning of Life, the Universe, and Everything?\",\"ANSWER\":42}";
            return StatusCode(200, result);
        }


    }
}
