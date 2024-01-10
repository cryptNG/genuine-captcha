

using Microsoft.AspNetCore.DataProtection;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using SkiaSharp;
using System.Drawing;

namespace genuine_captcha_api.services
{
    public static class CaptchaProvider
    {
        public static bool CheckCaptchaResult(HttpContext context, string userInput, string captchaSecret)
        {
            Aes myAes = Aes.Create();
            using (SHA256 mySHA256 = SHA256.Create())
            {
                myAes.Key = mySHA256.ComputeHash(Encoding.Default.GetBytes("my - secret"));
            }
            byte[] enciv = Convert.FromBase64String(captchaSecret);

            byte[] enc = enciv.Take(enciv.Length - 16).ToArray();

            myAes.IV = enciv.TakeLast(16).ToArray();

            int solution = Convert.ToInt32(DecryptStringFromBytes_Aes(enc, myAes.Key, myAes.IV));

            return solution == Convert.ToInt32(userInput);


        }
        public static (byte[] img, byte[] enc) GenerateCaptchaImageAsByteArray(HttpContext context, string secret)
        {

            Random ran = new Random(Convert.ToInt32(DateTime.Now.Ticks % int.MaxValue) - 1894);
            int[] calculation = new int[] { ran.Next(10, 20), ran.Next(0, 100) % 2, ran.Next(0, 10) };
            int solution = calculation[0] + calculation[2] * (calculation[1] == 0 ? -1 : 1);
            context.Session.SetInt32("CaptchaSolution", solution);
            Aes myAes = Aes.Create();
            using (SHA256 mySHA256 = SHA256.Create())
            {
                myAes.Key = mySHA256.ComputeHash(Encoding.Default.GetBytes(secret));
            }
            byte[] encrypted = EncryptStringToBytes_Aes(solution.ToString(), myAes.Key, myAes.IV);
            IEnumerable<byte> enciv = encrypted.Concat(myAes.IV);
            string calcText = calculation[0] + (calculation[1] == 0 ? " - " : " + ") + calculation[2];

            var info = new SKImageInfo(200, 150);
            using (var surface = SKSurface.Create(info))
            {
                SKCanvas canvas = surface.Canvas;

                canvas.Clear(SKColors.White);

                using (var paint = new SKPaint())
                {
                    paint.TextSize = 34.0f;
                    paint.IsAntialias = true;
                    paint.Color = new SKColor(0x8C, 0x9F, 0x97);
                    paint.IsStroke = false;
                    paint.StrokeWidth = 3;
                    paint.TextAlign = SKTextAlign.Center;
                    paint.Typeface = SKTypeface.FromFile("fonts/pixhobo.ttf");

                    canvas.Skew((float)GetRandomNumber(ran, -0.3, 0.3), (float)GetRandomNumber(ran, -0.3, 0.3));

                    canvas.DrawText(calcText, info.Width / 2f, info.Height / 1.5f, paint);
                    //random circles all arounds
                    for (int i = 0; i < 100; i++)
                    {
                        uint ui = (uint)ran.Next(-int.MaxValue, int.MaxValue);
                        byte red = Convert.ToByte(ran.Next(0, 255));
                        byte green = Convert.ToByte(ran.Next(0, 255));
                        byte blue = Convert.ToByte(ran.Next(0, 255));
                        byte alpha = Convert.ToByte(ran.Next(0, 50));
                        float x = ran.Next(info.Width);
                        float y = ran.Next(info.Height);
                        float r = ran.Next(5, 50);

                        SKColor randomColor = new SKColor(red, green, blue, alpha);

                        paint.StrokeWidth = r / 3;
                        paint.IsStroke = ran.Next(0, 100) % 2 == 1;
                        paint.Color = randomColor;
                        canvas.DrawCircle(new SKPoint(x, y), r, paint);
                    }
                }
                MemoryStream output = new MemoryStream();
                var image = surface.Snapshot();

                var data = image.Encode(SKEncodedImageFormat.Png, 80);
                data.SaveTo(output);
                return (output.ToArray(), enciv.ToArray());
            }


        }

        public static double GetRandomNumber(Random ran, double minimum, double maximum)
        {
            return ran.NextDouble() * (maximum - minimum) + minimum;
        }

        static byte[] EncryptStringToBytes_Aes(string plainText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (plainText == null || plainText.Length <= 0)
                throw new ArgumentNullException("plainText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");
            byte[] encrypted;

            // Create an Aes object
            // with the specified key and IV.
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;

                // Create an encryptor to perform the stream transform.
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for encryption.
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                        {
                            //Write all data to the stream.
                            swEncrypt.Write(plainText);
                        }
                        encrypted = msEncrypt.ToArray();
                    }
                }
            }

            // Return the encrypted bytes from the memory stream.
            return encrypted;
        }

        static string DecryptStringFromBytes_Aes(byte[] cipherText, byte[] Key, byte[] IV)
        {
            // Check arguments.
            if (cipherText == null || cipherText.Length <= 0)
                throw new ArgumentNullException("cipherText");
            if (Key == null || Key.Length <= 0)
                throw new ArgumentNullException("Key");
            if (IV == null || IV.Length <= 0)
                throw new ArgumentNullException("IV");

            // Declare the string used to hold
            // the decrypted text.
            string plaintext = null;

            // Create an Aes object
            // with the specified key and IV.
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Key;
                aesAlg.IV = IV;

                // Create a decryptor to perform the stream transform.
                ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);

                // Create the streams used for decryption.
                using (MemoryStream msDecrypt = new MemoryStream(cipherText))
                {
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                        {

                            // Read the decrypted bytes from the decrypting stream
                            // and place them in a string.
                            plaintext = srDecrypt.ReadToEnd();
                        }
                    }
                }
            }

            return plaintext;
        }
    }
}

