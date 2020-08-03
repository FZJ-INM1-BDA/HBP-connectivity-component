import {Component, h, Method, Prop} from "@stencil/core";
import JSZip from 'jszip'

@Component({
  tag: 'export-full-connectivity',
  shadow: true
})
export class ExportFullConnectivity {

  @Prop({mutable: true}) connections: any
  @Prop({mutable: true}) datasetInfo: any

  @Method({mutable: true, reflectToAttr: true}) downloadFUllConnectivityCsv() {
    this.getFullConnectivityCSVData().then(cs => {
      const zip = new JSZip();
      zip.file("data.csv", cs.toString())
      zip.file("dataset.txt", "Dataset name: " + this.datasetInfo.name + "\nDescription: " + this.datasetInfo.description)
      zip.generateAsync({
        type: "base64"
      }).then(function(content) {
        window.location.href = "data:application/zip;base64," + content
      })
    })
  }

  @Method({mutable: true, reflectToAttr: true}) getFullConnectivityCSVData() {
    const rows = [['Name', 'Connection Strength', 'Log10']]
    this.connections.forEach(ca => {
      rows.push(['"' + ca.name + '"', ca.numberOfConnections, Math.log10(ca.numberOfConnections)])
    })
    return new Promise(resolve => {
      resolve(rows.map(e => e.join(",")).join("\n"))
    })
  }

  render() {
    return <div onClick={() => this.downloadFUllConnectivityCsv()}>button</div>
  }

}
