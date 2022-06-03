import {Component, h, Method, Prop, State} from "@stencil/core";
import JSZip from 'jszip'

@Component({
  tag: 'export-connectivity-diagram',
  styleUrls: ['./export-connectivity-diagram.scss',],
  shadow: true
})
export class ExportConnectivityDiagram {

  @State() takingScreenshot = false

  @Prop({mutable: true}) theme: string
  @Prop({mutable: true}) el: any
  @Prop({mutable: true}) connectedAreas: any
  @Prop({mutable: true}) hideView: string
  @Prop({mutable: true}) regionInfo: any
  @Prop({mutable: true}) datasetInfo: any

  render() {
    return !this.hideView && <div>
      <div class="text-center m-2">
        Export
      </div>
      <div class="d-flex justify-content-center">

        <a class="d-flex flex-column align-items-center mr-2 ml-2 cp" onClick={this.downloadCSV.bind(this)}>
          <button type="button"
                  class={(this.theme === 'light' ? 'dark-border-btn' : 'light-border-btn') + " btn border-btn btn-circle cp"}>
            <small>.csv</small>
          </button>
          <small>CSV</small>
        </a>

      </div>
    </div>
  }

  @Method({mutable: true, reflectToAttr: true}) downloadCSV(floatConnectionNumbers) {
    //ToDo change to dynamic description
    const parcellationDescription = '\nThe region definition is taken from the Julich-Brain Cytoarchitectonic Atlas (Amunts and Zilles, 2015). The parcellation is derived from the individual probability maps (PMs) of the cytoarchitectonic regions released in the Julich-Brain Atlas, that are further combined into a Maximum Probability Map (MPM). The MPM is calculated by considering for each voxel the probability of all cytoarchitectonic areas released in the atlas, and determining the most probable assignment (Eickhoff 2005). Note that methodological improvements and integration of new brain structures may lead to small deviations in earlier released datasets.\n        \nMohlberg H, Bludau S, Caspers S, Eickhoff SB, Amunts K '
    const sanitizedRegionName = this.regionInfo.name.replace(/[\\\/:\*\?"<>\|]/g, "").trim()
    this.getCSVData(floatConnectionNumbers).then(cs => {
      const zip = new JSZip();
      zip.file(`Connectivity profile for ${sanitizedRegionName}.csv`, cs.toString())
      zip.file("README.txt",
        `The connectivity profile has been extracted from the following dataset:
        \n${this.datasetInfo.name} \n${this.datasetInfo.description} \n${parcellationDescription}`)
      zip.generateAsync({
        type: "base64"
      }).then(content => {
        // const fileName = this.regionInfo.name.replace(/[\\\/:\*\?"<>\|]/g, "").trim()
        const link = document.createElement('a')
        link.href = 'data:application/zip;base64,' + content
        link.download = `Connectivity profile for ${sanitizedRegionName}.zip`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })

      // const encodedUri = encodeURI(cs as string)
      // const link = document.createElement("a")
      // link.setAttribute("href", encodedUri)
      // link.setAttribute("download", "connectivity_data.csv")
      // document.body.appendChild(link)
      // link.click()
    })
  }

  @Method({mutable: true, reflectToAttr: true}) getCSVData(floatConnectionNumbers) {
    const rows = [['Name', 'Connection Strength', !floatConnectionNumbers? 'Log10': null]]
    this.connectedAreas.forEach(ca => {
      rows.push(['"' + ca.name + '"', ca.numberOfConnections, !floatConnectionNumbers? Math.log10(ca.numberOfConnections) : null])
    })
    return new Promise(resolve => {
      resolve(rows.map(e => e.join(",")).join("\n"))
    })
  }



}
