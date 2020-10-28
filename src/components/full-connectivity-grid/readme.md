# full-connectivity-grid



<!-- Auto Generated Below -->


## Properties

| Property      | Attribute     | Description | Type     | Default  |
| ------------- | ------------- | ----------- | -------- | -------- |
| `datasetUrl`  | `dataset-url` |             | `string` | `''`     |
| `description` | `description` |             | `string` | `''`     |
| `gridheight`  | `gridheight`  |             | `string` | `'100%'` |
| `gridwidth`   | `gridwidth`   |             | `string` | `'100%'` |
| `loadurl`     | `loadurl`     |             | `string` | `''`     |
| `name`        | `name`        |             | `string` | `''`     |
| `onlyExport`  | `only-export` |             | `string` | `''`     |
| `pixelsize`   | `pixelsize`   |             | `string` | `'8px'`  |
| `textwidth`   | `textwidth`   |             | `string` | `'70px'` |
| `theme`       | `theme`       |             | `string` | `''`     |


## Events

| Event                      | Description | Type               |
| -------------------------- | ----------- | ------------------ |
| `connectivityDataReceived` |             | `CustomEvent<any>` |


## Methods

### `downloadCSV() => Promise<void>`



#### Returns

Type: `Promise<void>`




## Dependencies

### Depends on

- [export-full-connectivity](../export-full-connectivity)

### Graph
```mermaid
graph TD;
  full-connectivity-grid --> export-full-connectivity
  style full-connectivity-grid fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
