import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import sys

load_dotenv()

# Credenciais de login
def enviar_email(destinatario, assunto, corpo_email):
    smtp_server = 'smtp.gmail.com'
    smtp_port = 587

    email_envio = os.getenv('EMAIL_ENVIO')
    senha = os.getenv('SENHA')

    # Construção do e-mail
    msg = MIMEMultipart()
    msg['From'] = email_envio
    msg['To'] = destinatario
    msg['Subject'] = assunto

    msg.attach(MIMEText(corpo_email, 'html'))

    # Início da conexão SMTP e envio do e-mail
    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(email_envio, senha)
        server.sendmail(email_envio, destinatario, msg.as_string())
        print('E-mail enviado com sucesso!')
    except Exception as e:
        print(f'Erro ao enviar e-mail: {str(e)}')

# Captura do e-mail passado como argumento do Node.js
if __name__ == '__main__':
    args = sys.argv[1:]
    if len(args) > 0:
        destinatario = args[0]
        token = args[1]  # Token JWT passado como segundo argumento
        assunto = 'Redefinição de Senha'

        # Corpo do e-mail com o link contendo o token
        corpo_email = f"""
        <html>
        <body>
            <p>Olá,</p>
            <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
            <p><a href="http://localhost:8080/views/html/redefinirSenha.html?token={token}">Redefinir Senha</a></p>
            <p>Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
        </body>
        </html>
        """

        enviar_email(destinatario, assunto, corpo_email)
