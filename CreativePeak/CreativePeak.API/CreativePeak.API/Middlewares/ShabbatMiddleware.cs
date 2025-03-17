namespace CreativePeak.API.Middlewares
{
    public class ShabbatMiddleware
    {
        private readonly RequestDelegate _requestDelegate;

        public ShabbatMiddleware(RequestDelegate requestDelegate)
        {
            _requestDelegate = requestDelegate;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            var shabbat = DateTime.Now.DayOfWeek == DayOfWeek.Saturday;
            if (shabbat)
            {
                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                Console.WriteLine("The service is currently inactive.");
            }
            else await _requestDelegate(httpContext);
        }
    }
}
