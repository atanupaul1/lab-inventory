import random
import string
import resend
import os
from pydantic import EmailStr

# Resend API Key - User MUST get this from resend.com
# For testing, you can use your on-boarding email
RESEND_API_KEY = "re_MSaVV7xQ_j4wXK4jToksNZ9eEGLydVK8d"

resend.api_key = RESEND_API_KEY

def generate_otp():
    return "".join(random.choices(string.digits, k=6))

async def send_otp_email(email: EmailStr, otp: str):
    # FALLBACK: Print to console for easy development
    print(f"\n{'='*30}")
    print(f"DEBUG OTP for {email}: {otp}")
    print(f"{'='*30}\n")

    # If API key is still placeholder, don't try to send
    if RESEND_API_KEY == "re_your_api_key_here":
        print("Resend API Key not set. Email not sent to real inbox.")
        return

    try:
        params = {
            "from": "Inventory App <onboarding@resend.dev>",
            "to": [email],
            "subject": "Verify Your Email - Inventory Management",
            "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <h2 style="color: #4f46e5; text-align: center;">Email Verification</h2>
                    <p>Hello,</p>
                    <p>Thank you for registering. Please use the following One-Time Password (OTP) to verify your account:</p>
                    <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #111827; border-radius: 8px; margin: 20px 0;">
                        {otp}
                    </div>
                    <p style="color: #6b7280; font-size: 14px;">This code will expire in 10 minutes. If you did not request this, please ignore this email.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                    <p style="text-align: center; color: #9ca3af; font-size: 12px;">Inventory Management System &copy; 2024</p>
                </div>
            """
        }
        resend.Emails.send(params)
        print(f"Email sent via Resend to {email}")
    except Exception as e:
        print(f"Resend error: {e}")
