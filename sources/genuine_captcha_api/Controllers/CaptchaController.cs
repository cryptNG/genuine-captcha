﻿
using genuine_captcha_api.services;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
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


            AddCorsHeaders();

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

            AddCorsHeaders();


            return new ContentResult()
            {

                Content = JsonSerializer.Serialize(resJson),
                ContentType = "application/json"
            };
        }


        [HttpGet("verify")]
        public ActionResult VerifyCaptcha(string captchaSolution, string captchaSecret)
        {

            AddCorsHeaders();

            if (!Int32.TryParse(captchaSolution, out int n))
            {
                return StatusCode(400, "The captcha provided was not a number");
            }
           
            if (!CaptchaProvider.CheckCaptchaResult(HttpContext, captchaSolution, captchaSecret, _secret))
            {
                return new ContentResult() { Content = "The Captcha was incorrect!", ContentType = "text", StatusCode = 401 };
            }


            return new OkResult();
        }


        [HttpGet("verify/custom")]
        public ActionResult VerifyCaptchaCustom(string captchaSolution, string captchaSecret, string customSecret)
        {
            AddCorsHeaders();

            if (!Int32.TryParse(captchaSolution, out int n))
            {
                return StatusCode(400, "The captcha provided was not a number");
            }
            if (!CaptchaProvider.CheckCaptchaResult(HttpContext, captchaSolution, captchaSecret, _secret))
            {
                return new ContentResult() { Content = "The Captcha was incorrect!", ContentType = "text", StatusCode = 401 };
            }

            return new OkResult();
        }



        private void AddCorsHeaders()
        {
            HttpContext.Response.Cookies.Delete(".AspNetCore.Session");
            HttpContext.Response.Headers.Remove("Access-Control-Allow-Origin");
            if (HttpContext.Request.Headers.ContainsKey("Origin"))
            {
                var origin = HttpContext.Request.Headers["Origin"];
                HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", origin);

            }
            else HttpContext.Response.Headers.Add("Access-Control-Allow-Origin", "*");

            HttpContext.Response.Headers.Add("Access-Control-Allow-Credentials", "true");
            HttpContext.Response.Headers.Add("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE, PATCH");
            HttpContext.Response.Headers.Add("Access-Control-Allow-Headers", "Content-Type, Authorization"); // Adjust based on your actual headers
        }


    }
}
