IMPORTANT:
The documentation is still TBD.


THE CAPTCHA-API DOES NOT LOG ANY PERSONAL INFORMATION AND IS COMPLETELY GDPR-FREE, IT DOES NOT CACHE DATA
AND DOES NOT LOG IP-ADDRESSES.



You can access the api like so:


This will generate a json that contains the captcha image under "ImageAsBase64".
It also contains a field SecretAsBase64 which contains an encoded secret that is created by the API.
This secret will later be provided alongside the solution of the captcha, so the server can verify if the solution is correct.

[GET] https://yitc.ddns.net:5100/api/captcha/create


To this call, you provide the captcha solution (let's say the captcha was 17+4 which makes -> 21)
and you provide the captcha secret that is given to you on the CREATE call, e.g "apiSecret"

[GET] https://yitc.ddns.net:5100/api/captcha/verify


The call will look like this:

https://yitc.ddns.net:5100/api/captcha/verify?captchaSolution=21&captchaSecret=apiSecret

Here you can see, the 21 is the plaintext captcha solution, the apiSecret is just provided as it was given to you.
This will return 200 when the captcha was verified, else you get a bad request (400).


#############################
There are 2 alternative calls.
#############################

The server encodes the captcha-solution in a "apiSecret" string, for that, it uses its own key to encode the correct solution on the CREATE call.
You can also provide your own secret, and instead of using the /captcha/verify call, you can then verify the captcha in your own API instead of ours.
lets say your secret is "yourOwnSecret".

https://yitc.ddns.net:5100/api/captcha/create/custom?customSecret=yourOwnSecret

this will provide the image as base64, and a server secret that is generated based on your provided "yourOwnSecret"

now, using this secret to decode the solution, you can call your own API.
or you call our custom verify endpoint, which uses your secret to verify the captcha.
Let's say again, the solution is "21", the provided "apiSecret" and your own personal secret "yourOwnSecret"

https://yitc.ddns.net:5100/api/captcha/verify/custom?captchaSolution=21&captchaSecret=apiSecret&customSecret=yourOwnSecret

the api will decode the apiSecret based on your provided customSecret and verify the solution.
It will return 200 when the captcha was solved correctly, or 400 if it wasn't.


