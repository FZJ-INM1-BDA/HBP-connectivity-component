import {Component, h, Method, Prop} from "@stencil/core";
import JSZip from 'jszip'

@Component({
  tag: 'export-full-connectivity',
  shadow: true
})
export class ExportFullConnectivity {

  @Prop({mutable: true}) connections: any
  @Prop({mutable: true}) datasetInfo: any
  @Prop({mutable: true}) el: any

  @Method({mutable: true, reflectToAttr: true}) downloadFullConnectivityCsv() {
    this.getFullConnectivityCSVData().then(cs => {
      const parcellationDescription = '\nThe region definition is taken from the Julich-Brain Cytoarchitectonic Atlas (Amunts and Zilles, 2015). The parcellation is derived from the individual probability maps (PMs) of the cytoarchitectonic regions released in the Julich-Brain Atlas, that are further combined into a Maximum Probability Map (MPM). The MPM is calculated by considering for each voxel the probability of all cytoarchitectonic areas released in the atlas, and determining the most probable assignment (Eickhoff 2005). Note that methodological improvements and integration of new brain structures may lead to small deviations in earlier released datasets.\n        \nMohlberg H, Bludau S, Caspers S, Eickhoff SB, Amunts K '
      const sanitizedFileName = this.datasetInfo.name.replace(/[\\\/:\*\?"<>\|]/g, "").trim()

      const zip = new JSZip();
      zip.file(`Connectivity profile by ${sanitizedFileName}.csv`, cs.toString())
      zip.file("README.txt",
        `The connectivity profile has been extracted from the following dataset:
        \n${this.datasetInfo.name} \n${this.datasetInfo.description} \n${parcellationDescription}`)
      zip.generateAsync({
        type: "base64"
      }).then(function(content) {
        const link = document.createElement('a')
        link.href = 'data:application/zip;base64,' + content
        link.download = `Connectivity profile by ${sanitizedFileName}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    })
  }

  @Method({mutable: true, reflectToAttr: true}) getFullConnectivityCSVData() {
    const rows = [['""', ...this.connections.map((c) => `"${c.sourceArea}"`)]]
    this.connections.forEach((ca) => {
      rows.push([`"${ca.sourceArea}"`, ...ca.connectedAreas.map(ca => ca.numberOfConnections)])
    })
    return new Promise(resolve => {
      resolve(rows.map(e => e.join(",")).join("\n"))
    })
  }

  render() {
    return <div onClick={() => this.downloadFullConnectivityCsv()} class="hidden"></div>
  }

}
