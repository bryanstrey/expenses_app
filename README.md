# Gastos de Viagem

App de controle de gastos de viagem para Android e iOS, feito em React Native com Expo.

## Sobre o app

O app organiza suas viagens em três níveis:

- **Viagens** — cada viagem tem nome, ícone, cor e datas de início/fim
- **Cidades** — cada viagem pode ter várias cidades, cada uma com suas próprias datas de chegada e saída
- **Gastos e Pontos Turísticos** — dentro de cada cidade, você registra os gastos (com categoria, valor e data) e os pontos turísticos que quer visitar (marcando como visitado depois)

Também é possível ver todos os gastos da viagem inteira juntos, filtrando por cidade, categoria ou período.

Os dados ficam salvos na nuvem (Supabase), então dá pra acessar as mesmas viagens de mais de um celular, bastando entrar com o mesmo login. O login é feito só com **nome e senha** — não precisa de email de verdade.

## Dependências necessárias

- **Node.js** (versão 18 ou mais recente)
- **npm** (vem junto com o Node.js)
- **App Expo Go** instalado no celular (Android ou iOS) — ou um emulador Android / simulador iOS no computador

Não precisa instalar Android Studio ou Xcode pra rodar em modo desenvolvimento — só pra gerar o instalável (APK) mais pra frente.

## Como rodar

1. Instale as dependências do projeto:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npx expo start
```

3. No terminal que abrir, você pode:
   - Escanear o **QR code** com o app **Expo Go** no celular (forma mais simples)
   - Pressionar `a` para abrir num emulador Android
   - Pressionar `i` para abrir num simulador iOS (precisa de macOS + Xcode)

Se fizer alguma alteração no código e ela não aparecer no app, reinicie com o cache limpo:
```bash
npx expo start -c
```

## Gerando um APK (instalável no Android)

```bash
eas build -p android --profile preview
```
Isso gera um link pra baixar o `.apk` direto no celular, sem precisar do Expo Go. Requer o `eas-cli` instalado (`npm install -g eas-cli`) e login na Expo (`eas login`).
