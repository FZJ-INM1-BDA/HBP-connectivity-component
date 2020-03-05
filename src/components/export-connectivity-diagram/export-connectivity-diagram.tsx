import {Component, h, Method, Prop, State} from "@stencil/core";
import domtoimage from 'dom-to-image';

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

  render() {
    return <div>
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

        <a class="d-flex flex-column align-items-center mr-2 ml-2 " onClick={this.downloadPng.bind(this)}>
          {!this.takingScreenshot ?
            <button disabled={this.takingScreenshot}
                    class={(this.theme === 'light' ? 'dark-border-btn' : 'light-border-btn') + ' btn border-btn btn-circle cp'}>
              <small>.png</small>
            </button> :
            <div class={(this.theme === 'light' ? 'loader-color-light' : 'loader-color-black') + ' loader'}>Loading...</div>}
          <small>Image</small>
        </a>
      </div>
    </div>
  }

  downloadCSV() {
    this.getCSVData().then(cs => {
      const encodedUri = encodeURI(cs as string)
      const link = document.createElement("a")
      link.setAttribute("href", encodedUri)
      link.setAttribute("download", "my_data.csv")
      document.body.appendChild(link)
      link.click()
    })
  }

  @Method({mutable: true, reflectToAttr: true}) getCSVData() {
    const rows = [['Name', 'Number', 'Log10']]
    this.connectedAreas.forEach(ca => {
      rows.push(['"' + ca.name + '"', ca.numberOfConnections, Math.log10(ca.numberOfConnections)])
    })
    return new Promise(resolve => {
      resolve("data:text/csv;charset=utf-8,"
        + rows.map(e => e.join(",")).join("\n"))
    })
  }


  @Method() async downloadPng() {
    this.takingScreenshot = true
    const node = this.el.shadowRoot.querySelector('#chartContent');
    domtoimage.toPng(node, { width: node.scrollWidth, height: node.scrollHeight })
      .then(function (dataUrl) {
        // this.takingScreenshot = false

        const img = new Image();
        img.src = dataUrl;

        const link = document.createElement("a")
        link.setAttribute("href", dataUrl)
        link.setAttribute("download", "connectivity.png")
        document.body.appendChild(link)
        link.click()
      })
      .then(() => this.takingScreenshot = false)
      .catch(function (error) {
        console.error('oops, something went wrong!', error)
      })
  }

}
