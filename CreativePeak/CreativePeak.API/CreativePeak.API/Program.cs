using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CreativePeak.Core.IRepositories;
using CreativePeak.Core;
using CreativePeak.Core.IServices;
using CreativePeak.Service;
using CreativePeak.Data.Repositories;
using CreativePeak.Core.Models;
using CreativePeak.Data;
using CreativePeak.API.Middlewares;
using System.Text;
using DotNetEnv;
using Microsoft.EntityFrameworkCore;
using Amazon.S3;
using Microsoft.Extensions.Configuration;

Env.Load();

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDefaultAWSOptions(builder.Configuration.GetAWSOptions());
builder.Services.AddAWSService<IAmazonS3>();

// לטעינת קובץ .env
builder.Configuration["JWT:Issuer"] = Environment.GetEnvironmentVariable("JWT_ISSUER");
builder.Configuration["JWT:Audience"] = Environment.GetEnvironmentVariable("JWT_AUDIENCE");
builder.Configuration["JWT:Key"] = Environment.GetEnvironmentVariable("JWT_KEY");
builder.Configuration["AWS:AccessKey"] = Environment.GetEnvironmentVariable("AWS_ACCESS_KEY_ID");
builder.Configuration["AWS:SecretKey"] = Environment.GetEnvironmentVariable("AWS_SECRET_ACCESS_KEY");
builder.Configuration["AWS:Region"] = Environment.GetEnvironmentVariable("AWS_REGION");
builder.Configuration["AWS:BucketName"] = Environment.GetEnvironmentVariable("AWS_BUCKET_NAME");
builder.Configuration["ConnectionStrings:MyDatabase"] = Environment.GetEnvironmentVariable("ConnectionStrings_CreativePeak");

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
// חיבור ל DB
builder.Services.AddDbContext<DataContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("MyDatabase"),
        new MySqlServerVersion(new Version(8, 0, 0))
    ));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles; // �� ReferenceHandler.Preserve
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("MyPolicy", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

//builder.Services.AddSwaggerGen();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Bearer Authentication with JWT Token",
        Type = SecuritySchemeType.Http
    });
    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Id = "Bearer",
                    Type = ReferenceType.SecurityScheme
                }
            },
            new List<string>()
        }
    });
});

builder.Services.AddScoped<IRepositoryManager, RepositoryManager>();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IRepository<User>, Repository<User>>();


builder.Services.AddScoped<IImageService, ImageService>();
builder.Services.AddScoped<IRepository<Image>, Repository<Image>>();
//builder.Services.AddScoped<IImageRepository, ImageRepository>();


builder.Services.AddScoped<IDesignerDetailsService, DesignerDetailsService>();
builder.Services.AddScoped<IRepository<DesignerDetails>, Repository<DesignerDetails>>();
builder.Services.AddScoped<IDesignerDetailsRepository, DesignerDetailsRepository>();


builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IRepository<Category>, Repository<Category>>();
//builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

//builder.Services.AddDbContext<DataContext>();
//builder.Services.AddSingleton<DataContext>();

builder.Services.AddScoped<IAuthRepository, AuthRepository>();

//builder.Services.AddSingleton<Mapping>();
builder.Services.AddAutoMapper(typeof(MappingProfile));
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddSingleton<PasswordService>();



//app.UseCors("MyPolicy");
//builder.Services.AddCors(opt => opt.AddPolicy("MyPolicy", policy =>
//{
//    policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
//}));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["JWT:Issuer"],
            ValidAudience = builder.Configuration["JWT:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
        };
    });


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwaggerUI();
    app.UseSwagger();
}

app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
    c.RoutePrefix = string.Empty;
});
app.UseCors("MyPolicy");

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseAuthentication();

app.UseHttpsRedirection();

app.UseAuthorization();

app.UseMiddleware<ShabbatMiddleware>();

app.MapControllers();

app.Run();
