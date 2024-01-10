namespace genuine_captcha_api.Configuration
{
    public static class ConfigurationHelper
    {


        public static WebApplicationBuilder CreateExtendedBuilder()
        {
            var builder = WebApplication.CreateBuilder();

            builder.Configuration.AddJsonFile($"appsettings.{Environment.MachineName}.json", optional: true);

            return builder;

        }

    }
}
