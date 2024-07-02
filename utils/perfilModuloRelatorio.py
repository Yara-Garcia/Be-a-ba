import requests
import pandas as pd
from dotenv import load_dotenv
import os

load_dotenv()

login_url = 'http://localhost:3000/login'
profileModule_url = 'http://localhost:3000/profileModuleAssociationsList'

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

def get_profileModule_data(profileModule_url, token):
    headers = {'Authorization': f'Bearer {token}'}
    response = requests.get(profileModule_url, headers=headers)
    if (response.status_code == 200) and ('associations' in response.json()):
        return response.json().get('associations')
    else:
        print(f'Erro ao obter dados das associações de perfil e módulos: {response.status_code}')
        return None

def gerar_relatorio_perfilModulos(dados_perfilModulos):
    df = pd.DataFrame(dados_perfilModulos)
    report_path = os.path.join(os.path.dirname(__file__), 'relatorio_perfilModulos.xlsx')
    df.to_excel(report_path, index=False)
    print(f'Relatório de módulos salvo como {report_path}')

if __name__ == '__main__':
    token = get_auth_token(login_url, login_data)
    if token:
        dados_perfilModulos = get_profileModule_data(profileModule_url, token)
        if dados_perfilModulos:
            gerar_relatorio_perfilModulos(dados_perfilModulos)
