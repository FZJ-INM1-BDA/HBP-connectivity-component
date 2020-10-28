import {Component, h, Element, State, Prop, Watch, EventEmitter, Method} from "@stencil/core";

@Component({
  tag: 'hbp-connectivity-matrix-row',
  styleUrls: ['./hbp-connectivity-matrix-row.scss',],
  shadow: true
})
export class HbpConnectivityMatrixRow {

  // ToDo რომელი მენიუს ელემენტი იქნება გახსნილი ეცოდინება მშობელს და მაგ ინფორმაციას დადებს Slot-ში

  @Element() el: HTMLElement
  @State() showLog10 = true
  @State() showAllConnectionNumbers = false
  @State() connectedAreas = []
  @State() overConnectedAreaIndex = -1
  @State() collapsedConnectivityDescription = false
  @State() regionDescriptionText
  @State() dataIsLoading = false
  @State() collapseMenu = -1
  @State() datasetDescription = ''
  @State() datasetName = ''

  // @ts-ignore
  @Event({bubbles: true, composed: true}) connectivityDataReceived: EventEmitter<any>
  // @ts-ignore
  @Event({bubbles: true, composed: true}) collapsedMenuChanged: EventEmitter<any>
  // @ts-ignore
  @Event({bubbles: true, composed: true}) datasetDataReceived: EventEmitter<any>
  // @ts-ignore
  @Event({bubbles: true, composed: true}) customToolEvent: EventEmitter<any>


  @Prop({mutable: true}) theme: string = ''
  @Prop({mutable: true}) loadurl: string = ''
  @Prop({mutable: true}) datasetUrl: string = ''
  @Prop({mutable: true}) showDatasetName: string = ''
  @Prop({mutable: true}) showDescription: string = ''
  @Prop({mutable: true}) showExport: string = ''
  @Prop({mutable: true}) showSource: string = ''
  @Prop({mutable: true}) showTitle: string = ''
  @Prop({mutable: true}) showToolbar: string = ''
  @Prop({mutable: true, reflectToAttr: true}) customHeight: string = ''
  @Prop({mutable: true, reflectToAttr: true}) customWidth: string = ''
  @Prop({mutable: true}) customDatasetSelector: string = ''
  @Prop({mutable: true, reflectToAttr: true}) region: string = ''
  @Prop({mutable: true}) tools_showlog: string = ''
  @Prop({mutable: true}) tools_showallresults: string = ''
  @Prop({mutable: true}) _tools_custom: CustomTool[]
  @Prop({mutable: true}) tools_custom: CustomTool[] | string
  @Prop({mutable: true}) hideExportView: string

  public exportComponentElement!: HTMLExportConnectivityDiagramElement

  @Watch('region')
  regionChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.collapseMenu = -1
      this.getConnectedAreas(newValue)
    }
  }

  @Watch('loadurl')
  loadurlChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.collapseMenu = -1
      this.getConnectedAreas(this.region)
    }
  }

  @Watch('customHeight')
  customHeightChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {

    }
  }
  @Watch('customWidth')
  customWidthChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {

    }
  }
  @Watch('tools_custom')
  arrayDataWatcher(newValue: CustomTool[] | string) {
    if (typeof newValue === 'string') {
      this._tools_custom = JSON.parse(newValue)
    }
    else {
      this._tools_custom = newValue
    }
  }

  @Method()
  downloadCSV() {
    this.exportComponentElement.downloadCSV()
  }

  componentWillLoad() {
    this.dataIsLoading = true
    if (this.loadurl) this.getConnectedAreas(this.region)
    this.getDatasetInfo()
    this.arrayDataWatcher(this.tools_custom)
  }

  getDatasetInfo = async () => {
    this.fetchDatasetInfo()
      .then(resp => {
        this.datasetDescription = resp.description
        this.datasetName = resp.title
        this.datasetDataReceived.emit([resp])
      })
  }

  fetchDatasetInfo = async () => {
    const responce = await fetch(this.datasetUrl,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    return responce.json()
  }

  getConnectedAreas = async (areaName) => {
    this.fetchConnectedAreas(areaName)
      .then(res => Object.keys(res).map(key => {
          return {name: key, numberOfConnections: res[key]}
        })
          .filter(f => f.numberOfConnections > 0)
          .sort((a, b) => +b.numberOfConnections - +a.numberOfConnections)
      )
      .then(addColorToAreas => {
        const logMax = Math.log(addColorToAreas[0].numberOfConnections)
        let colorAreas = []
        addColorToAreas.forEach((a) => {
          colorAreas.push({
            ...a,
            color: {
              r: this.colormap_red(Math.log(a.numberOfConnections) / logMax),
              g: this.colormap_green(Math.log(a.numberOfConnections) / logMax),
              b: this.colormap_blue(Math.log(a.numberOfConnections) / logMax)
            }
          })
        })
        return colorAreas
      })
      .then(a => {
        this.connectedAreas = a
        this.dataIsLoading = false
        this.emitConnectedRegionEvent()
      })
      .catch(() => {
        this.dataIsLoading = false
      })
  }

  fetchConnectedAreas = async (areaName) => {
    const response = await fetch(this.loadurl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'area': `${areaName}`})
      })

    return response.json()
  }

  emitConnectedRegionEvent() {
    this.connectivityDataReceived.emit(this.connectedAreas)
  }

  cleanAreaNameForDiagram(area) {
    if (area.includes('Area '))
      area = area.replace('Area ', '')
    if (area.indexOf(' - right hemisphere') > -1 || area.indexOf(' - left hemisphere') > -1)
      area = area.replace(area.indexOf(' - left hemisphere') > -1 ? ' - left hemisphere' : ' - right hemisphere', '')
    return area
  }

  customToolsElement(tool) {
    if (tool.type) {
      if (tool.type === 'checkbox') {
        return <div class="mr-1 ml-1 cp"
                    onClick={() => this.customToolEvent.emit(tool)}>
          <input checked={tool.checked}
                 id={tool.name}
                 class="mr-1"
                 type="checkbox"/>
          <span>{tool.name}</span>
        </div>
      } else if (tool.type === 'button') {
        return <div class="mr-1 ml-1 cp">
          <button type="button"
                  class="btn btn-secondary btn-sm mr-2"
                  id={tool.name}
                  onClick={() => this.customToolEvent.emit(tool)}>
            <span>{tool.name}</span>
          </button>
        </div>
      } else if (tool.type === 'slot') {
        return <slot name={tool.name}/>
      }
    }
  }

  render() {

    const asyncQuerySelector = async (node, query) => {
      try {
        return await (query ? node.querySelector(query) : node)
      } catch (error) {
        return null;
      }
    }

    asyncQuerySelector(this.el.shadowRoot, "#regionDescriptionText").then(node => {
      this.regionDescriptionText = node
      return node;
    })

    // const regionDescriptionText = this.el.shadowRoot.querySelector('#regionDescriptionText')

    const diagramContent =
      <div id="chartContent"
           class={(this.theme === 'light' ? 'bg-light' : 'bg-dark') + ' d-flex flex-column justify-content-start overflow-auto mt-2 pb-5 chart-background-for-screenshot'}>
        {this.connectedAreas.map((r, i) => (
          <div
            class={(this.overConnectedAreaIndex === i || this.collapseMenu === i ? 'border ' + (this.theme === 'light' ? 'border-dark' : 'border-white') : '') + ' d-flex flex-column mr-1 position-relative'}
            onMouseEnter={() => this.overConnectedAreaIndex = i}
            onMouseLeave={() => this.overConnectedAreaIndex = -1}>
            <div class="d-flex align-items-center cp position-relative"
                 onClick={() => {
                   this.collapseMenu === i ? this.collapseMenu = -1 : this.collapseMenu = i;
                   this.collapsedMenuChanged.emit(this.collapseMenu)
                 }}>

              <small class="w-50 flex-1 no-wrap text-truncate chart-line-height">
                {this.cleanAreaNameForDiagram(r.name)}
              </small>
              <div class="w-100 flex-3 position-relative">

                <div class="d-flex chart-bar" style={{
                  width: +this.numberToForChart(r.numberOfConnections) / this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 100 + '%',
                  backgroundColor: 'rgb(' + r.color.r + ',' + r.color.g + ',' + r.color.b + ')'
                }}>
                  <small class={(this.theme === 'light' ? 'text-white' : 'text-black') + ' mt-n1 ml-1 text-shadow'}>
                    {this.overConnectedAreaIndex === i || this.showAllConnectionNumbers ? r.numberOfConnections : ''}
                  </small>
                </div>

                {(this.collapseMenu - 1 !== i && this.collapseMenu !== i) &&
                <div>
                  <div class="vl border-left border-dark position-absolute w-0 chart-line-1"></div>
                  <div class="vl border-left border-dark position-absolute w-0 chart-line-2"></div>
                  <div class="vl border-left border-dark position-absolute w-0 chart-line-3"></div>

                  {i === this.connectedAreas.length - 1 &&
                  <div>
                    <div class="position-absolute"
                         style={{left: 'calc(33.33% - ' + Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 1 / 3).toString().length * 8 + 'px)'}}>
                      <small><i>{Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 1 / 3)}</i></small>
                    </div>
                    <div class="position-absolute"
                         style={{left: 'calc(66.66% - ' + Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 2 / 3).toString().length * 8 + 'px)'}}>
                      <small><i>{Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 2 / 3)}</i></small>
                    </div>
                    <div class="position-absolute"
                         style={{left: 'calc(99.99% - ' + Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections)).toString().length * 8 + 'px)'}}>
                      <small><i>{Math.round(this.numberToForChart(this.connectedAreas[0].numberOfConnections))}</i></small>
                    </div>
                  </div>
                  }
                </div>}

              </div>
            </div>

            {this.collapseMenu === i && <slot name="connectedRegionMenu"/>}

          </div>
        ))}
      </div>



    return [
      (
        <div
          class={(this.theme === 'light' ? 'bg-light' : 'bg-dark')
                + ' container d-block d-flex flex-column p-2 '}
          style={{height: this.customHeight? this.customHeight : '100%', width: this.customWidth? this.customWidth : '100%'}}>
          <slot name="header"/>
          <div class="d-flex flex-column">
            {this.showTitle === 'true'? <h5>Connectivity Browser</h5> : null}
            {(this.showDatasetName === 'true' && !this.customDatasetSelector) && <div><span style={{opacity: '0.6'}}>Dataset:</span> {this.datasetName}</div>}
            {(this.showDescription === 'true' && !this.customDatasetSelector) &&
            <div class="mb-2">
              <div
                class={(this.collapsedConnectivityDescription ? ' regionDescriptionTextOpened overflow-hidden ' : ' regionDescriptionTextClass overflow-hidden ')
                + ' row m-2 pr-2 position-relative text-justify '
                + ((this.regionDescriptionText && +this.regionDescriptionText.scrollHeight > +this.regionDescriptionText.clientHeight) && !this.collapsedConnectivityDescription ? (this.theme === 'light' ? 'linear-gradient-fade-light' : 'linear-gradient-fade-dark') : '')}
                id="regionDescriptionText"
                onClick={() => !this.collapsedConnectivityDescription ? this.collapsedConnectivityDescription = true : null}>
                <span>
                  <span style={{opacity: '0.6'}}>Description: </span>
                  {this.datasetDescription}
                </span>
              </div>

              {this.regionDescriptionText && +this.regionDescriptionText.scrollHeight > +this.regionDescriptionText.clientHeight && !this.collapsedConnectivityDescription ?
                <div class="w-100 d-flex justify-content-center align-items-center mt-n2 cp"
                     onClick={() => this.collapsedConnectivityDescription = true}>
                  more <small><small>▼</small></small>
                </div>
                : ''}

              {this.collapsedConnectivityDescription ?
                <div onClick={() => this.collapsedConnectivityDescription = false}
                     class="w-100 d-flex justify-content-center align-items-center mt-n2 cp"><i
                  class="fas fa-angle-up m-1"></i> hide <small><small>▲</small></small>
                </div>
                : ''}
            </div>}


            {this.customDatasetSelector && <slot name="dataset"/>}

            {this.showSource === 'true' &&
              <div class="d-flex flex-column">
                <small><span style={{opacity: '0.6'}}>Source region</span></small>
                {this.region}
              </div>
            }

          </div>
          <span class="mi mi-face"></span>

          {this.showToolbar && <small class="d-flex align-items-center flex-wrap">
            {this.tools_showlog && <div class="mt-2 mr-3 mb-2 cp" onClick={() => this.showLog10 = !this.showLog10}>
              <input checked={this.showLog10}
                     id="log-10-check-box"
                     class="mr-2"
                     type="checkbox"/>
              <span>Log10</span>
            </div>}

            {this.tools_showallresults && <div class="mt-2 mb-2 cp" onClick={() => this.showAllConnectionNumbers = !this.showAllConnectionNumbers}>
              <input checked={this.showAllConnectionNumbers}
                     id="log-10-check-box"
                     class="mr-1"
                     type="checkbox"/>
              <span>All results</span>
            </div>}

            {this.tools_custom && this.tools_custom.length ?
              this._tools_custom.map((tool) => (
                this.customToolsElement(tool)
              ))
              : null
            }
          </small>}

          {this.dataIsLoading ? <div class="d-flex justify-content-center">
            <div class={(this.theme === 'light' ? 'loader-color-light' : 'loader-color-black') + ' loader'}>Loading...
            </div>
          </div> : diagramContent}

          {this.showExport === 'true' &&
          <export-connectivity-diagram
            ref={(el) => this.exportComponentElement= el as HTMLExportConnectivityDiagramElement}
            el={this.el}
            theme={this.theme}
            connectedAreas={this.connectedAreas}
            hideView={this.hideExportView}
            regionInfo={{name: this.region, description: this.datasetDescription}}
            datasetInfo={{name: this.datasetName, description: this.datasetDescription}}
          />}

        </div>
      ),
    ]
  }

  numberToForChart(number) {
    return this.showLog10 ? Math.log10(number).toFixed(2) : number
  }

  clamp = val => Math.round(Math.max(0, Math.min(1.0, val)) * 255)

  colormap_red = (x) => {
    if (x < 0.7) {
      return this.clamp(4.0 * x - 1.5);
    } else {
      return this.clamp(-4.0 * x + 4.5);
    }
  }

  colormap_green = (x) => {
    if (x < 0.5) {
      return this.clamp(4.0 * x - 0.5);
    } else {
      return this.clamp(-4.0 * x + 3.5);
    }
  }

  colormap_blue = (x) => {
    if (x < 0.3) {
      return this.clamp(4.0 * x + 0.5);
    } else {
      return this.clamp(-4.0 * x + 2.5);
    }
  }
}

export interface CustomTool {
  name: string
  type: string
  checked: boolean
}
