import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os
import sys

load_dotenv()
   # Credenciais de login

# def é definição de funções
def enviar_email(destinatario, assunto, mensagem): 
   
    smtp_server = 'smtp.gmail.com'  # Exemplo: smtp.gmail.com para Gmail
    smtp_port = 587  # Porta SMTP 587 é mais segura e recomendada

    email_envio = os.getenv('EMAIL_ENVIO')
    senha = os.getenv('SENHA')
    print('Script Python sendo executado...')


    # Construção do e-mail
    msg = MIMEMultipart()
    msg['From'] = email_envio
    msg['To'] = destinatario
    msg['Subject'] = assunto

    # Corpo do e-mail (HTML para enviar o link de redefinição de senha)
    # f antes de uma string indica que se trata de uma string formatada
    corpo_email = f"""   
    <html>
    <body>
        <p>Olá,</p>
        <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para redefinir sua senha:</p>
        <p><a href="http://localhost:8080/views/html/redefinirSenha.html">Redefinir Senha</a></p>
        <p>Se você não solicitou a redefinição de senha, ignore este e-mail.</p>
    </body>
    </html>
    """

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
    #é uma maneira de verificar se o script está sendo executado diretamente ou se foi importado como um módulo em outro script Python

    args = sys.argv[1:]  # Captura os argumentos passados para o script Python
    if len(args) > 0:
        destinatario = args[0] 
        print(destinatario) # O primeiro argumento é o destinatário (e-mail)
assunto = 'Redefinição de Senha'
mensagem = 'Link para redefinição de senha enviado.'

enviar_email(destinatario, assunto, mensagem)
