---
date: '2025-07-09T20:35:36-03:00'
draft: true
title: 'Markdown Hextra ShowCase'
math: true
summary: 'Show case of all possible'
---
## Teste

teste em portugues

```yaml {filename="hugo.yaml"}
params:
  highlight:
    copy:
      enable: true
      # hover | always
      display: hover

```

$$F(\omega) = \int_{-\infty}^{\infty} f(t) e^{-j\omega t} \, dt$$

This $\sigma(z) = \frac{1}{1 + e^{-z}}$ is inline.

{{% details title="Detalhes" closed="true" %}}

LOREM LOREM

```yaml {filename="hugo.yaml"}
params:
  highlight:
    copy:
      enable: true
      # hover | always
      display: hover
```

Markdown is **supported**.

{{% /details %}}

{{< callout type="info" >}}
  Please visit GitHub to see the latest releases.
{{< /callout >}}

{{< tabs items="JSON,YAML,TOML" >}}

  {{< tab >}}
  ```yaml {filename="hugo.yaml"}
  params:
    highlight:
      copy:
        enable: true
        # hover | always
        display: hover
  ```
  {{< /tab >}}
  {{< tab >}}**YAML**: YAML is a human-readable data serialization language.{{< /tab >}}
  {{< tab >}}**TOML**: TOML aims to be a minimal configuration file format that's easy to read due to obvious semantics.{{< /tab >}}

{{< /tabs >}}

https://imfing.github.io/hextra/docs/guide/shortcodes/cards/

{{< cards >}}
  {{< card link="../callout" title="Card with default tag color" tag="tag text" >}}
  {{< card link="../callout" title="Card with default red tag" tag="tag text" tagType="error" >}}
  {{< card link="../callout" title="Card with blue tag" tag="tag text" tagType="info" >}}
  {{< card link="../callout" title="Card with yellow tag" tag="tag text" tagType="warning" >}}
{{< /cards >}}

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

```mermaid
gitGraph
    commit
    commit
    branch develop
    commit
    commit
    commit
    checkout main
    commit
    commit
```

```mermaid
quadrantChart
    title Reach and engagement of campaigns
    x-axis Low Reach --> High Reach
    y-axis Low Engagement --> High Engagement
    quadrant-1 We should expand
    quadrant-2 Need to promote
    quadrant-3 Re-evaluate
    quadrant-4 May be improved
    Campaign A: [0.3, 0.6]
    Campaign B: [0.45, 0.23]
    Campaign C: [0.57, 0.69]
    Campaign D: [0.78, 0.34]
    Campaign E: [0.40, 0.34]
    Campaign F: [0.35, 0.78]
```
```mermaid
mindmap
Root
    A
      B
      C
```
```mermaid
timeline
    title Timeline of Industrial Revolution
    section 17th-20th century
        Industry 1.0 : Machinery, Water power, Steam <br>power
        Industry 2.0 : Electricity, Internal combustion engine, Mass production
        Industry 3.0 : Electronics, Computers, Automation
    section 21st century
        Industry 4.0 : Internet, Robotics, Internet of Things
        Industry 5.0 : Artificial intelligence, Big data, 3D printing
```
```mermaid
---
config:
  theme: 'base'
  themeVariables:
    primaryColor: '#BB2528'
    primaryTextColor: '#fff'
    primaryBorderColor: '#7C0000'
    lineColor: '#F8B229'
    secondaryColor: '#006100'
    tertiaryColor: '#fff'
---
pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15
```

{{< filetree/container >}}
  {{< filetree/folder name="content" >}}
    {{< filetree/file name="_index.md" >}}
    {{< filetree/folder name="docs" state="closed" >}}
      {{< filetree/file name="_index.md" >}}
      {{< filetree/file name="introduction.md" >}}
      {{< filetree/file name="introduction.fr.md" >}}
    {{< /filetree/folder >}}
  {{< /filetree/folder >}}
  {{< filetree/file name="hugo.toml" >}}
{{< /filetree/container >}}