import requests
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

login_url = 'http://localhost:3000/login'
profiles_url = 'http://localhost:3000/profiles'

login_data = {
    'usuario': os.getenv('EMAIL_LOGIN_ADM'),
    'senha': os.getenv('SENHA_ADM')
}

def get_auth_token(login_url, login_data):
    response = requests.post(login_url, json=login_data)
    if response.status_code == 200:
        return response.json().get('token')
    else:
        print(f'Erro no login: {response.status_code}')
        return None

def get_profiles_data(profiles_url, token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(profiles_url, headers=headers)
    if (response.status_code == 200) and ('profiles' in response.json()):
        return response.json().get('profiles')
    else:
        print(f'Erro ao obter dados dos perfis: {response.status_code}')
        return None

def gerar_relatorio_perfis(dados_perfis):
    df = pd.DataFrame(dados_perfis)
    report_path = os.path.join(os.path.dirname(__file__), 'relatorio_perfis.xlsx')
    df.to_excel(report_path, index=False)
    print(f'Relatório de perfis salvo como {report_path}')

if __name__ == '__main__':
    token = get_auth_token(login_url, login_data)
    if token:
        dados_perfis = get_profiles_data(profiles_url, token)
        if dados_perfis:
            gerar_relatorio_perfis(dados_perfis)
