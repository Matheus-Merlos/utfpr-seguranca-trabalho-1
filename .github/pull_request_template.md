## Correção de Segurança

### Achado Relacionado

**ID:** ACH-XX

**Título:** [Título do achado]

**Severidade:** [Crítica / Alta / Média / Baixa]

---

### O que foi corrigido

[Descreva brevemente a vulnerabilidade e como foi corrigida]

---

### Como validar

1. Suba o ambiente local:
   ```bash
   docker compose up -d
   ```

2. Antes da correção, o seguinte payload/ação causava o problema:
   ```
   [payload ou passos que exploravam a vulnerabilidade]
   ```

3. Após a correção, o resultado esperado é:
   ```
   [comportamento seguro esperado]
   ```

---

### Checklist de Revisão

- [ ] Ficha de achado preenchida em `docs/achados/ACH-XX-*/achado.md`
- [ ] Evidências de **antes** da correção anexadas
- [ ] Evidências de **depois** da correção anexadas
- [ ] Reteste local realizado e documentado na ficha
- [ ] Código segue boas práticas (sem introduzir novos problemas)
- [ ] Testes passando (se aplicável)

---

### Notas adicionais

[Qualquer informação adicional relevante para o revisor]
