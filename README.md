# Gastos de Viagem — App Expo/React Native

App convertido do protótipo web original para **React Native com Expo**, com persistência
local real usando **SQLite** (via `expo-sqlite`) — o equivalente ao Room do Android nativo,
mas funcionando em Android e iOS a partir do mesmo código JS/TS.

## Como rodar

```bash
npm install
npx expo start
```

Depois, no terminal do Expo:
- pressione `a` para abrir no emulador Android
- pressione `i` para abrir no simulador iOS (precisa de macOS + Xcode)
- ou escaneie o QR code com o app **Expo Go** no seu celular físico

## Onde fica o banco de dados

Todo o código do banco está em `src/db/database.ts`. Ele:

1. Abre (ou cria) um arquivo `travel_expenses.db` dentro do armazenamento privado do app
   (isso é feito automaticamente pelo `expo-sqlite`, sem precisar de permissões extras).
2. Cria a tabela `expenses` na primeira execução (`initDatabase()`).
3. Expõe funções simples para ler, inserir e apagar gastos — chamadas pelo `App.tsx`.

Os dados **persistem entre aberturas do app** e funcionam **100% offline**, exatamente
como aconteceria com Room no Android nativo.

## Estrutura do projeto

```
App.tsx                      → tela raiz: inicializa o banco e alterna entre as telas
src/
  types.ts                   → tipos (Category, Expense)
  constants.ts                → categorias, cores, ícones
  utils.ts                    → formatação de moeda/data, geração de id
  db/database.ts              → camada de persistência local (SQLite)
  components/
    TotalBanner.tsx
    CategoryPill.tsx
    ExpenseCard.tsx
  screens/
    DashboardScreen.tsx        → lista de gastos, filtros por categoria/data
    AddExpenseScreen.tsx       → formulário de novo gasto
```