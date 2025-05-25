# Fontes Söhne

Para usar as fontes Söhne no projeto, coloque os arquivos de fonte nos seguintes nomes:

- `sohne-kraftig.woff2` / `sohne-kraftig.woff` (Font Weight 700)
- `sohne-halbfett.woff2` / `sohne-halbfett.woff` (Font Weight 600)  
- `sohne-buch.woff2` / `sohne-buch.woff` (Font Weight 400)
- `sohne-leicht.woff2` / `sohne-leicht.woff` (Font Weight 300)
- `sohne-mono.woff2` / `sohne-mono.woff` (Monospace)

As fontes estão configuradas no `globals.css` com font-display: swap para performance otimizada.

## Fallbacks
O sistema usa a seguinte ordem de fallback:
1. Söhne (primeira escolha)
2. Inter (fallback web)
3. Sistema nativo (fallback final)