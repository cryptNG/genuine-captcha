
using genuine_captcha_api.Configuration;
using genuine_captcha_api.services;

var policyName = "_myAllowSpecificOrigins";

var builder = ConfigurationHelper.CreateExtendedBuilder();
// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDistributedMemoryCache();

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(3600);

    options.Cookie.IsEssential = true;
});
//builder.Services.AddHostedService<EvidencingService>();

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: policyName,
                      builder =>
                      {
                          builder
                            .WithOrigins("http://localhost:4200") // specifying the allowed origin
                            .WithMethods("GET", "OPTION") // defining the allowed HTTP method
                            .WithHeaders("authorization", "accept", "content-type", "origin")
                            .AllowCredentials();
                      });
});



var app = builder.Build();




// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSession();

app.UseAuthorization();

app.MapControllers();

app.UseCors(policyName);

app.Run();