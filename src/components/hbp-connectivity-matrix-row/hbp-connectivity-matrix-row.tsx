import {Component, h, Element, State, Prop, Watch, EventEmitter} from "@stencil/core";

// import domtoimage from 'dom-to-image';


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

  // @ts-ignore
  @Event({bubbles: true, composed: true}) connectivityDataReceived: EventEmitter<any>
  // @ts-ignore
  @Event({bubbles: true, composed: true}) collapsedMenuChanged: EventEmitter<any>


  @Prop({mutable: true}) theme: string
  @Prop({mutable: true}) loadurl: string
  @Prop({mutable: true}) showDescription: string
  @Prop({mutable: true}) showExport: string
  @Prop({mutable: true}) showSource: string
  @Prop({mutable: true}) showTitle: string
  @Prop({mutable: true}) showToolbar: string

  @Prop({mutable: true, reflectToAttr: true}) region: string

  @Watch('region')
  regionChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.collapseMenu = -1
      this.getConnectedAreas(newValue)
    }
  }

  componentWillLoad() {
    this.dataIsLoading = true
    this.getConnectedAreas(this.region)
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

    if (areaName.indexOf(' - right hemisphere') > -1 || areaName.indexOf(' - left hemisphere') > -1)
      areaName = areaName.replace(areaName.indexOf(' - left hemisphere') > -1 ? ' - left hemisphere' : ' - right hemisphere', '')

    const responce = await fetch(this.loadurl,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({'area': `${areaName}`})
      })

    return responce.json()
  }

  emitConnectedRegionEvent() {
    this.connectivityDataReceived.emit(this.connectedAreas)
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
                {r.name.includes('Area ') ? r.name.replace('Area ', '') : r.name}
              </small>
              <div class="w-100 flex-3 position-relative">

                <div class="d-flex chart-bar" style={{
                  width: +this.numberToForChart(r.numberOfConnections) / this.numberToForChart(this.connectedAreas[0].numberOfConnections) * 100 + '%',
                  backgroundColor: 'rgb(' + r.color.r + ',' + r.color.g + ',' + r.color.b + ')'
                }}>
                  <small class={(this.theme === 'light' ? 'text-white' : 'text-black') + ' mt-n1 ml-1 text-shadow'}>
                    {this.overConnectedAreaIndex === i || this.showAllConnectionNumbers ? this.numberToForChart(r.numberOfConnections) : ''}
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
          class={(this.theme === 'light' ? 'bg-light' : 'bg-dark') + ' container w-100 h-100 overflow-hidden d-block d-flex flex-column p-2 '}>
          <slot name="header"/>
          <br class="position-relative mb-2"> </br>
          <div class="d-flex flex-column">
            {this.showTitle === 'true' && <h5>Connectivity Browser</h5>}

            {this.showDescription === 'true' &&
            <div class="mb-2">
              <div
                class={(this.collapsedConnectivityDescription ? 'regionDescriptionTextOpened overflow-auto ' : 'regionDescriptionTextClass overflow-hidden ')
                + ' row m-2 pr-2 position-relative text-justify '
                + ((this.regionDescriptionText && +this.regionDescriptionText.scrollHeight > +this.regionDescriptionText.clientHeight) && !this.collapsedConnectivityDescription ? (this.theme === 'light' ? 'linear-gradient-fade-light' : 'linear-gradient-fade-dark') : '')}
                id="regionDescriptionText"
                onClick={() => !this.collapsedConnectivityDescription ? this.collapsedConnectivityDescription = true : null}>
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
                Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been
                the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of
                type and scrambled it to make a type specimen book.
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

            {this.showSource === 'true' && <span>Source region - {this.region}</span>}

          </div>
          <span class="mi mi-face"></span>

          {this.showToolbar && <div class="d-flex">
            <div class="mt-2 mr-3 mb-2 cp" onClick={() => this.showLog10 = !this.showLog10}>
              <input checked={this.showLog10}
                     id="log-10-check-box"
                     class="mr-2"
                     type="checkbox"/>
              <span>Show Log10</span>
            </div>

            <div class="mt-2 mb-2 cp" onClick={() => this.showAllConnectionNumbers = !this.showAllConnectionNumbers}>
              <input checked={this.showAllConnectionNumbers}
                     id="log-10-check-box"
                     class="mr-2"
                     type="checkbox"/>
              <span>Show All results</span>
            </div>
          </div>}

          {this.dataIsLoading ? <div class="d-flex justify-content-center">
            <div class={(this.theme === 'light' ? 'loader-color-light' : 'loader-color-black') + ' loader'}>Loading...
            </div>
          </div> : diagramContent}

          {this.showExport === 'true' &&
          <export-connectivity-diagram
            el={this.el}
            theme={this.theme}
            connectedAreas={this.connectedAreas}
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
