# Nelas Cup 2027

Site do torneio feito em Astro. Conteúdo editável no Pages CMS (app.pagescms.org).

## Correr no Mac (Terminal)

```bash
cd ~/Downloads/nelas-cup-2027
npm install
npm run dev        # http://localhost:4321 (Ctrl+C para parar)
npm run build      # gera a pasta dist
```

## Páginas

Início · O torneio · Programa · Equipas · Regulamento e FAQ · Jogos e resultados · Classificações · Notícias · Galeria · Edições anteriores · Informações (como chegar) · Visitar Nelas · Contactos · Patrocinadores (pacotes + pedido de proposta) · Inscrição de equipas.

## Onde está o conteúdo (Pages CMS)

Cada separador do painel corresponde a um ficheiro em `src/data/`. Fotos, logótipos e escudos ficam em `public/images/`.

## Formulários (inscrição e patrocínio)

1. Em https://web3forms.com escreva o email que recebe os pedidos e copie a Access Key.
2. No Pages CMS, em "Dados do torneio", cole-a em "Chave Web3Forms".
3. Sem chave, os formulários abrem o email já preenchido.

## Publicar (Cloudflare)

Build command: `npm run build` · Deploy command: `npx wrangler deploy`
