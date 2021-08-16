# hbp-connectivity-matrix-row API



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute                 | Description | Type                     | Default     |
| ----------------------- | ------------------------- | ----------- | ------------------------ | ----------- |
| `_tools_custom`         | --                        |             | `CustomTool[]`           | `undefined` |
| `customDatasetSelector` | `custom-dataset-selector` |             | `string`                 | `''`        |
| `customHeight`          | `custom-height`           |             | `string`                 | `''`        |
| `customWidth`           | `custom-width`            |             | `string`                 | `''`        |
| `datasetUrl`            | `dataset-url`             |             | `string`                 | `''`        |
| `hideExportView`        | `hide-export-view`        |             | `string`                 | `undefined` |
| `loadurl`               | `loadurl`                 |             | `string`                 | `''`        |
| `region`                | `region`                  |             | `string`                 | `''`        |
| `showDatasetName`       | `show-dataset-name`       |             | `string`                 | `''`        |
| `showDescription`       | `show-description`        |             | `string`                 | `''`        |
| `showExport`            | `show-export`             |             | `string`                 | `''`        |
| `showSource`            | `show-source`             |             | `string`                 | `''`        |
| `showTitle`             | `show-title`              |             | `string`                 | `''`        |
| `showToolbar`           | `show-toolbar`            |             | `string`                 | `''`        |
| `theme`                 | `theme`                   |             | `string`                 | `''`        |
| `tools_custom`          | `tools_custom`            |             | `CustomTool[] \| string` | `undefined` |
| `tools_showallresults`  | `tools_showallresults`    |             | `string`                 | `''`        |
| `tools_showlog`         | `tools_showlog`           |             | `string`                 | `''`        |


## Events

| Event                      | Description | Type               |
| -------------------------- | ----------- | ------------------ |
| `collapsedMenuChanged`     |             | `CustomEvent<any>` |
| `connectedRegionClicked`   |             | `CustomEvent<any>` |
| `connectivityDataReceived` |             | `CustomEvent<any>` |
| `customToolEvent`          |             | `CustomEvent<any>` |
| `datasetDataReceived`      |             | `CustomEvent<any>` |
| `loadingStateChanged`      |             | `CustomEvent<any>` |


## Methods

### `downloadCSV() => Promise<void>`



#### Returns

Type: `Promise<void>`




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
