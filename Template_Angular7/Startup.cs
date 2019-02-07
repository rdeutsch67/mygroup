using System;
using System.Threading.Tasks;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SpaServices.AngularCli;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;
using Template_Angular7.Data;
using Newtonsoft.Json;
using Template_Angular7.Helpers;
using Template_Angular7.Services;
using AutoMapper;
using Microsoft.AspNetCore.Http;

namespace Template_Angular7
{
    public class Startup
    {
        private readonly IConfiguration _configuration;

        public Startup(IConfiguration config, IHostingEnvironment env)
        {
            _configuration = config;
        }
        

        //public IConfiguration Configuration { get; }
        
        public CorsPolicy GenerateCorsPolicy(){
            var corsBuilder = new CorsPolicyBuilder();
            corsBuilder.AllowAnyHeader();
            corsBuilder.AllowAnyMethod();
            //corsBuilder.AllowAnyOrigin(); // For anyone access.
            corsBuilder.WithOrigins("http://www.razorflights.com"); // for a specific url. Don't add a forward slash on the end!
            corsBuilder.AllowCredentials();
            return corsBuilder.Build();
        }


        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            //services.AddCors();
            // ********************
            // Setup CORS
            // ********************
            /*var corsBuilder = new CorsPolicyBuilder();
            corsBuilder.AllowAnyHeader();
            corsBuilder.AllowAnyMethod();
            corsBuilder.AllowAnyOrigin(); 
            corsBuilder.AllowCredentials();

            services.AddCors(options =>
            {
                options.AddPolicy("SiteCorsPolicy", corsBuilder.Build());
            });*/

            /*services.AddCors(options =>
            {
                options.AddPolicy("SiteCorsPolicy",
                    builder =>
                        builder
                            .AllowAnyOrigin()
                            .AllowAnyMethod()
                            .AllowAnyHeader());
            });*/
            
            services.AddCors(options =>
            {
                options.AddPolicy("AllowAllOrigins", GenerateCorsPolicy());
            });
            
            

            //services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);
            services.AddAutoMapper();
            Console.WriteLine("after AddAutoMapper");

            // configure strongly typed settings objects
            var appSettingsSection = _configuration.GetSection("AppSettings");
            Console.WriteLine("after var appSettingsSection = Configuration.GetSection(AppSettings");
            services.Configure<AppSettings>(appSettingsSection);
            Console.WriteLine("after services.Configure<AppSettings>(appSettingsSection);");

            // configure jwt authentication
            var appSettings = appSettingsSection.Get<AppSettings>();
            Console.WriteLine(appSettings); // bis hier ok

            var mySecret = _configuration.GetSection("AppSettings").GetValue<string>("Secret");
            //var mySecret = Configuration["AppSettings:Secret"];
            //var mySecret = "hello";
            Console.WriteLine("mySecret =" + mySecret);
            //var mySecret = appSettings.Secret;

            //var key = Encoding.ASCII.GetBytes(appSettings.Secret);
            var key = Encoding.ASCII.GetBytes(mySecret);
            Console.WriteLine("after Encoding.ASCII.GetBytes(appSettings.Secret)");
            //var key = Encoding.ASCII.GetBytes("THIS IS USED TO SIGN AND VERIFY JWT TOKENS, REPLACE IT WITH YOUR OWN SECRET, IT CAN BE ANY STRING");
            services.AddAuthentication(x =>
                {
                    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(x =>
                {
                    x.Events = new JwtBearerEvents
                    {
                        OnTokenValidated = context =>
                        {
                            var userService = context.HttpContext.RequestServices.GetRequiredService<IUserService>();
                            var userId = int.Parse(context.Principal.Identity.Name);
                            var user = userService.GetById(userId);
                            if (user == null)
                            {
                                // return unauthorized if user does not longer exists
                                context.Fail("Unauthorized");
                            }

                            return Task.CompletedTask;
                        }
                    };
                    x.RequireHttpsMetadata = false;
                    x.SaveToken = true;
                    x.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = false,
                        ValidateAudience = false
                    };
                });

            // configure DI for application services
            services.AddScoped<IUserService, AppUserService>();
            services.AddMvc().SetCompatibilityVersion(CompatibilityVersion.Version_2_2);


            var myConnection = _configuration["ConnectionStrings:MyWebApiConnection"];
            Console.WriteLine(myConnection);
            services.AddEntityFrameworkNpgsql().AddDbContext<ApplicationDbContext>(opt =>
                opt.UseNpgsql(myConnection));
            Console.WriteLine("after UseNpgsql");


            // In production, the Angular files will be served from this directory
            services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });

            services.AddMvc().AddJsonOptions(config =>
            {
                // This prevents the json serializer from parsing dates
                config.SerializerSettings.DateParseHandling = DateParseHandling.None;
                // This changes how the timezone is converted - RoundtripKind keeps the timezone that was provided and doesn't convert it
                config.SerializerSettings.DateTimeZoneHandling = DateTimeZoneHandling.RoundtripKind;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Error");
                app.UseHsts();

                app.UseForwardedHeaders(new ForwardedHeadersOptions
                {
                    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
                });
            }

            //app.UseHsts();
            app.UseHttpsRedirection();
            app.UseStaticFiles();
            app.UseSpaStaticFiles();
            app.UseAuthentication();
            
            //app.UseCors("SiteCorsPolicy");
            app.UseCors("AllowAllOrigins");  

            app.UseMvc(routes =>
            {
                //routes.SetTimeZoneInfo(TimeZoneInfo.Utc);

                routes.MapRoute(
                    name: "default",
                    template: "{controller}/{action=Index}/{id?}");
            });

            app.UseSpa(spa =>
            {
                // To learn more about options for serving an Angular SPA from ASP.NET Core,
                // see https://go.microsoft.com/fwlink/?linkid=864501

                spa.Options.SourcePath = "ClientApp";

                if (env.IsDevelopment())
                {
                    spa.UseAngularCliServer(npmScript: "start");
                }
            });

            // Create a service scope to get an ApplicationDbContext instance using DI
            using (var serviceScope =
                app.ApplicationServices.GetRequiredService<IServiceScopeFactory>().CreateScope())
            {
                var dbContext = serviceScope.ServiceProvider.GetService<ApplicationDbContext>();
                // Create the Db if it doesn't exist and applies any pending migration.
                Console.WriteLine("before dbContext.Database.Migrate();");
                dbContext.Database.Migrate();
                Console.WriteLine("after dbContext.Database.Migrate();");
                // Seed the Db.
                Console.WriteLine("before DBSeeder.Seed(dbContext);");
                DBSeeder.Seed(dbContext);
                Console.WriteLine("after DBSeeder.Seed(dbContext);");
            }
        }
    }
}