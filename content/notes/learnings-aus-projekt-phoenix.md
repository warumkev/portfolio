---
title: "Learnings aus Projekt 'Phoenix'"
date: "02. Juni 2024"
---

### Herausforderung: Datenbank-Performance

Die größte Herausforderung bei _'Phoenix'_ war die **Skalierung der Datenbank-Abfragen unter hoher Last**.

**Maßnahmen:**

1. Implementierung eines Caching-Layers mit _Redis_
2. Optimierung von Indizes

> Ergebnis: Die Latenz konnte um **70% reduziert** werden.

**Wichtiges Learning:**

Performance-Tests sollten so früh wie möglich in den Entwicklungszyklus integriert werden.