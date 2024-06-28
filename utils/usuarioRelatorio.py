import requests
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

# Endpoint do seu backend Node.js
login_url = 'http://localhost:3000/login'
users_url = 'http://localhost:3000/users'

# Dados de login (usuário e senha)
login_data = {
    'usuario': os.getenv('EMAIL_LOGIN_ADM'),
    'senha': os.getenv('SENHA_ADM')
}

# Função para fazer login e obter o token de autenticação
def get_auth_token(login_url, login_data):
    response = requests.post(login_url, json=login_data)
    if response.status_code == 200:
        return response.json().get('token')
    else:
        print(f'Erro no login: {response.status_code}')
        return None

# Função para obter dados dos usuários
def get_users_data(users_url, token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(users_url, headers=headers)
    if response.status_code == 200:
        return response.json().get('users')
    else:
        print(f'Erro ao obter dados dos usuários: {response.status_code}')
        return None

# Função para gerar relatório de usuários
def gerar_relatorio_usuarios(dados_usuarios):
    df = pd.DataFrame(dados_usuarios)
    df.to_excel('relatorio_usuarios.xlsx', index=False)
    print('Relatório de usuários salvo como relatorio_usuarios.xlsx')


# Main
if __name__ == '__main__':
    token = get_auth_token(login_url, login_data)
    if token:
        dados_usuarios = get_users_data(users_url, token)
        if dados_usuarios:
            gerar_relatorio_usuarios(dados_usuarios)
           