import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv
import os

load_dotenv()
   # Credenciais de login

# def é definição de funções
def enviar_email(destinatario, assunto, mensagem): 
   
    smtp_server = 'smtp.gmail.com'  # Exemplo: smtp.gmail.com para Gmail
    smtp_port = 587  # Porta SMTP 587 é mais segura e recomendada

    email_envio = 'qqtechbeaba@gmail.com'
    senha = 'lajc oxbk sdnn ubxk'

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
        <p><a href="http://localhost:8080/views/html/recuperacaoSenha.html">Redefinir Senha</a></p>
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
    finally:
        server.quit()

# Exemplo de uso
destinatario = 'email_do_destinatario@example.com'
assunto = 'Redefinição de Senha'
mensagem = 'Link para redefinição de senha enviado.'

enviar_email(destinatario, assunto, mensagem)
