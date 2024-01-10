
using genuine_captcha_api.services;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace genuine_captcha_api.Controllers
{
    [ApiController]
    [Route("api/captcha")]
    public class CaptchaController : ControllerBase
    {
        private string _test_secretKey;
        private IConfiguration _configuration;
        private readonly ILogger<CaptchaController> _logger;
        private string _secret;

        public CaptchaController(ILogger<CaptchaController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
            _secret = configuration["Captcha_Generation_Secret"];
        }


        [HttpGet("create/custom")]
        public ActionResult GetCaptchaCustom(string customSecret)
        {
            var captcha = CaptchaProvider.GenerateCaptchaImageAsByteArray(HttpContext, customSecret);
            var resJson = new
            {
                ImageAsBase64 = Convert.ToBase64String(captcha.img),
                SecretAsBase64 = Convert.ToBase64String(captcha.enc)
            };
            return new ContentResult()
            {

                Content = JsonSerializer.Serialize(resJson),
                ContentType = "application/json"
            };
        }

        [HttpGet("create")]
        public ActionResult GetCaptcha()
        {
            var captcha = CaptchaProvider.GenerateCaptchaImageAsByteArray(HttpContext, _secret);
            var resJson = new
            {
                ImageAsBase64 = Convert.ToBase64String(captcha.img),
                SecretAsBase64 = Convert.ToBase64String(captcha.enc)
            };
            return new ContentResult()
            {

                Content = JsonSerializer.Serialize(resJson),
                ContentType = "application/json"
            };
        }


        [HttpGet("verify")]
        public ActionResult VerifyCaptcha(string captchaSolution, string captchaSecret)
        {
            if (!Int32.TryParse(captchaSolution, out int n))
            {
                return StatusCode(400, "The captcha provided was not a number");
            }
            if (!CaptchaProvider.CheckCaptchaResult(HttpContext, captchaSolution, captchaSecret))
            {
                return new ContentResult() { Content = "The Captcha was incorrect!", ContentType = "text", StatusCode = 401 };
            }

            return new OkResult();
        }


        [HttpGet("verify/custom")]
        public ActionResult VerifyCaptchaCustom(string captchaSolution, string captchaSecret, string customSecret)
        {
            if (!Int32.TryParse(captchaSolution, out int n))
            {
                return StatusCode(400, "The captcha provided was not a number");
            }
            if (!CaptchaProvider.CheckCaptchaResult(HttpContext, captchaSolution, captchaSecret))
            {
                return new ContentResult() { Content = "The Captcha was incorrect!", ContentType = "text", StatusCode = 401 };
            }

            return new OkResult();
        }


    }
}
