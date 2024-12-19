---
theme: dashboard
title: Experiments
toc: false
---

# Experiments 🧪

<!-- Load and transform the data -->

```js
import * as yaml from 'js-yaml';
const text = FileAttachment("data/experiments.yaml").text();
```

```js
const experiments = yaml.loadAll(text);
```

```js
Inputs.table(experiments)
```