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
            //var shabbat = DateTime.Now.DayOfWeek == DayOfWeek.Saturday;
            if (IsShabbat())
            {
                httpContext.Response.StatusCode = StatusCodes.Status400BadRequest;
                await httpContext.Response.WriteAsync("The service is currently inactive.");
            }
            else await _requestDelegate(httpContext);
        }

        public static bool IsShabbat()
        {
            DateTime nowUtc = DateTime.UtcNow; // שעון עולמי (UTC)
            int dayOfWeek = (int)nowUtc.DayOfWeek; // 0=Sunday, 5=Friday, 6=Saturday

            DateTime shabbatStartUtc;
            DateTime shabbatEndUtc;

            if (dayOfWeek == 5) // יום שישי - כניסת שבת
            {
                shabbatStartUtc = new DateTime(nowUtc.Year, nowUtc.Month, nowUtc.Day, 15, 00, 0); // 18:00 שעון ישראל = 15:00 UTC
                shabbatEndUtc = shabbatStartUtc.AddHours(25); // שבת יוצאת אחרי 25 שעות
            }
            else if (dayOfWeek == 6) // יום שבת - שבת כבר בפנים
            {
                shabbatStartUtc = new DateTime(nowUtc.Year, nowUtc.Month, nowUtc.Day - 1, 15, 00, 0); // כניסת שבת אתמול
                shabbatEndUtc = new DateTime(nowUtc.Year, nowUtc.Month, nowUtc.Day, 16, 00, 0); // צאת שבת 19:00 בישראל = 16:00 UTC
            }
            else
            {
                return false; // אם זה לא שישי או שבת – לא שבת
            }

            return nowUtc >= shabbatStartUtc && nowUtc <= shabbatEndUtc;
        }
    }
}
