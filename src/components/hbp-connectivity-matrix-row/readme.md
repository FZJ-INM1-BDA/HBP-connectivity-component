# hbp-connectivity-matrix-row



<!-- Auto Generated Below -->


## Properties

| Property          | Attribute          | Description | Type     | Default     |
| ----------------- | ------------------ | ----------- | -------- | ----------- |
| `loadurl`         | `loadurl`          |             | `string` | `undefined` |
| `region`          | `region`           |             | `string` | `undefined` |
| `showDescription` | `show-description` |             | `string` | `false`     |
| `showExport`      | `show-export`      |             | `string` | `false`     |
| `showSource`      | `show-source`      |             | `string` | `false`     |
| `showTitle`       | `show-title`       |             | `string` | `false`     |
| `showToolbar`     | `show-toolbar`     |             | `string` | `false`     |
| `theme`           | `theme`            |             | `string` | `dark`      |


## Events

| Event                      | Description                  |Type                |
| -------------------------- | ---------------------------- | ------------------ |
| `collapsedMenuChanged`     | Gives expanded menu item id  | `CustomEvent<any>` |
| `connectivityDataReceived` | Returns connected regions    | `CustomEvent<any>` |


## Dependencies

### Depends on

- [export-connectivity-diagram](../export-connectivity-diagram)

### Graph
```mermaid
graph TD;
  hbp-connectivity-matrix-row --> export-connectivity-diagram
  style hbp-connectivity-matrix-row fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
