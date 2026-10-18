# Best Price — landing page dos grupos de ofertas

Site estático (HTML + CSS + JS, sem build). Os grupos ficam em **`grupos.json`**.

## Adicionar, editar ou remover um grupo

Edite `grupos.json`. Cada grupo é um bloco assim:

```json
{
  "id": "casa",
  "nome": "Best Price Casa",
  "emoji": "🏠",
  "cor": "#9333ea",
  "descricao": "Utilidades, decoração e organização.",
  "exemplos": ["Panelas", "Organizadores", "Iluminação"],
  "link": "https://chat.whatsapp.com/SEU-CONVITE",
  "ativo": true
}
```

- **Adicionar:** copie um bloco, cole depois do último (lembre da vírgula entre blocos) e ajuste os campos.
- **Remover:** apague o bloco, ou só troque `"ativo": true` por `"ativo": false` para esconder sem perder os dados.
- **Grupo lotou (1024 membros)?** Troque o `link` pelo convite do grupo novo. Os anúncios continuam iguais.
- `id`: só letras minúsculas, sem espaço nem acento. É ele que vai na URL do anúncio.

Dica: valide o arquivo em https://jsonlint.com antes de publicar, porque uma vírgula a mais ou a menos quebra a lista.

## URLs para os anúncios da Meta

Use uma URL por conjunto de anúncios, assim o grupo certo aparece primeiro e destacado:

| Nicho | URL |
|---|---|
| Fitness | `https://SEU-SITE.pages.dev/?nicho=fitness` |
| Estética Automotiva | `https://SEU-SITE.pages.dev/?nicho=automotiva` |
| Pet | `https://SEU-SITE.pages.dev/?nicho=pet` |

Os parâmetros UTM da Meta podem ser adicionados normalmente depois do `&`.

## Eventos do Pixel (ID 4491130207838080)

| Evento | Quando dispara | Parâmetros |
|---|---|---|
| `PageView` | Ao abrir qualquer página com o pixel | — |
| `ViewContent` | Quando o card de um grupo aparece na tela (1x por grupo) | `content_name`, `content_category` = id do grupo |
| `Lead` | Clique em "Entrar no grupo" | `content_name`, `content_category` = id do grupo |

Otimize a campanha para **Lead**. Para relatórios por nicho, crie conversões personalizadas no Gerenciador de Eventos filtrando `content_category`.

## Publicar no Cloudflare Pages (grátis)

1. Crie uma conta no GitHub e um repositório (ex.: `best-price`) e envie estes arquivos.
2. Crie uma conta em https://dash.cloudflare.com → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Escolha o repositório. Em *Build settings*: framework **None**, build command vazio, output directory `/`.
4. Deploy. O site fica em `https://NOME-DO-PROJETO.pages.dev`.
5. Daqui em diante, toda alteração em `grupos.json` no GitHub publica sozinha em ~1 minuto.

## Antes de ligar os anúncios

- [ ] Trocar `[SEU-EMAIL-DE-CONTATO]` em `privacidade.html`.
- [ ] Abrir o site publicado com o **Meta Pixel Helper** (extensão do Chrome) ou em *Gerenciador de Eventos → Testar eventos* e conferir `PageView`, `ViewContent` e `Lead`.
- [ ] Testar os 3 botões no celular.
