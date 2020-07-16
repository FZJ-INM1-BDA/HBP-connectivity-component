import {Component, h, EventEmitter, State, Prop} from "@stencil/core";

@Component({
  tag: 'full-connectivity-grid',
  styleUrls: ['./full-connectivity-grid.scss',],
  shadow: true
})
export class FullConnectivityGrid {


  @State() allConnectedAreas: any
  @State() overConnectedAreaIndex = -1

  @State() dataIsLoading = false
  // @State() collapseMenu = -1
  @State() datasetDescription = ''
  @State() datasetName = ''

  hoveringColumn = -1
  hoveringRow = -1

  @Prop({mutable: true}) theme: string = ''
  @Prop({mutable: true}) gridwidth: string = '100%'
  @Prop({mutable: true}) gridheight: string = '100%'
  @Prop({mutable: true}) pixelsize: string = '8px'
  @Prop({mutable: true}) textwidth: string = '70px'


  public verticalHoverDiv!: HTMLElement
  public horizontalHoverDiv!: HTMLElement

  // @ts-ignore
  @Event({bubbles: true, composed: true}) connectivityDataReceived: EventEmitter<any>

  componentWillLoad() {
    this.dataIsLoading = true
    this.getConnectedAreas()
  }


  getConnectedAreas = async () => {
    this.fetchConnectedAreas()
      .then(res =>
        Object.keys(res).map(key => {
          return {
            sourceArea: key,
            connectedAreas:
              Object.keys(res[key]).map(k => {
                return {
                  name: k,
                  numberOfConnections: res[key][k]
                }
              })
                .filter(f => f.numberOfConnections > 0)
                .sort((a, b) => +b.numberOfConnections - +a.numberOfConnections)
          }
        })
      )
      .then(addColorToAreasToAllConnections => {
        let maxConnection = 0
        addColorToAreasToAllConnections.forEach(addColorAreas => {
          addColorAreas.connectedAreas.forEach(areas => {
            if (areas.numberOfConnections > maxConnection) maxConnection = areas.numberOfConnections
          })
        })
        const logMax = Math.log(maxConnection)

        const colorAreas = addColorToAreasToAllConnections.map(addColorToAreas => {
          return {
            ...addColorToAreas,
            connectedAreas: addColorToAreas.connectedAreas.map((a) => {
              return {
                ...a,
                color: {
                  r: this.colormap_red(Math.log(a.numberOfConnections) / logMax),
                  g: this.colormap_green(Math.log(a.numberOfConnections) / logMax),
                  b: this.colormap_blue(Math.log(a.numberOfConnections) / logMax)
                }
              }
            })
          }
        })
        return colorAreas
      })
      .then(a => {
        this.allConnectedAreas = a
        this.dataIsLoading = false
        this.emitAllConnectedAreaEvent()
      })
      .catch(() => {
        this.dataIsLoading = false
      })
  }


  fetchConnectedAreas = async () => {
    const response = await fetch('https://connectivityquery-connectivity.apps-dev.hbp.eu/connectivitywholebrain/21212',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

    return response.json()
  }

  emitAllConnectedAreaEvent() {
    this.connectivityDataReceived.emit(this.allConnectedAreas)
  }

  cleanAreaNameForDiagram(area) {
    if (area.includes('Area '))
      area = area.replace('Area ', '')
    if (area.indexOf(' - right hemisphere') > -1 || area.indexOf(' - left hemisphere') > -1)
      area = area.replace(area.indexOf(' - left hemisphere') > -1 ? ' - left hemisphere' : ' - right hemisphere', '')
    return area
  }

  getConnectionColor(rowAreas, columnAreas) {
    const baseArea = this.allConnectedAreas
      .find(aca => aca.sourceArea === rowAreas.sourceArea)
    const connArea = baseArea.connectedAreas
      .find(ca => ca.name === columnAreas.sourceArea)
    if (connArea) {

      return `rgba(${connArea.color.r},${connArea.color.g},${connArea.color.b}, 1)`
    } else {
      return 'rgba(0, 0, 0, 0)'
    }
  }

  rangeChange(event) {
    this.pixelsize = event.target.value + 'px'
    console.log(event)
  }

  mouseEnterOnItem(j, i) {
    this.hoveringColumn = j
    this.hoveringRow = i
    const pixelSizeNumber = Number.parseInt(this.pixelsize)
    this.verticalHoverDiv.style["left"] = (this.hoveringColumn * pixelSizeNumber + pixelSizeNumber/2) + 'px'
    this.horizontalHoverDiv.style["top"] = (this.hoveringRow * pixelSizeNumber + pixelSizeNumber/2) + 'px'
  }

  mouseLeavesGrid() {
    this.hoveringColumn = -1
    this.hoveringRow = -1
    this.verticalHoverDiv.style["left"] = '-1px'
    this.horizontalHoverDiv.style["top"] = '-1px'
  }


  render() {

    const diagramContent = this.allConnectedAreas &&  <div style={{width: this.gridwidth, display: 'inline-grid', height: this.gridheight, position:'relative', overflow: 'auto'}}>
      {/*<div style={{display: 'flex', flexDirection: 'column'}}>*/}

      <div class={'verticalSticky columnHeader ' + (this.theme === 'light'? 'bg-light' : 'bg-dark')}
           style={{marginLeft: this.textwidth, zIndex: '2'}}>

        {this.allConnectedAreas.map((rowAreas) => (
          <div class={'rotated'} style={{
            height: this.textwidth,
            minWidth: this.pixelsize,
            maxWidth: this.pixelsize,
          }}>
            <small style={{overflow: 'hidden', whiteSpace: 'nowrap', fontSize: this.pixelsize}}>
              {this.cleanAreaNameForDiagram(rowAreas.sourceArea)}
            </small>
          </div>

        ))}
      </div>

      <div style={{display: 'flex'}} >
        <div class={'horizontalSticky ' + (this.theme === 'light'? 'bg-light' : 'bg-dark')} style={{zIndex: '2'}}>
        {this.allConnectedAreas.map((rowAreas) => (
          <div style={{
            textAlign: 'right',
            minWidth: this.textwidth,
            display: 'flex',
            justifyContent: 'flex-end',
            maxWidth: this.textwidth,
            minHeight: this.pixelsize,
            maxHeight: this.pixelsize,
          }}>
            <small style={{fontSize: this.pixelsize, overflow: 'hidden', whiteSpace: 'nowrap',}}>
              {this.cleanAreaNameForDiagram(rowAreas.sourceArea)}
            </small>
          </div>))}
        </div>

        <div style={{zIndex: '1', position: 'relative'}} onMouseLeave={()=> this.mouseLeavesGrid()}>

            <div ref={(el) => this.verticalHoverDiv = el as HTMLElement}
                 style={{position: 'absolute', height: '100%', borderLeft: '1px solid', borderColor: this.theme === 'light'? 'black' : 'white'}}></div>
            <div ref={(el) => this.horizontalHoverDiv = el as HTMLElement}
                 style={{position: 'absolute', width: '100%', borderTop: '1px solid', borderColor: this.theme === 'light'? 'black' : 'white'}}></div>

            {this.allConnectedAreas.map((rowAreas, i) => (
              <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'start', alignItems: 'flex-end'}}>
                {this.allConnectedAreas.map((columnAreas, j) => (
                  // !(j === 0 && i===0) &&
                  <div
                    class={'disable-select hoverBorder'}
                    style={{
                      minWidth: this.pixelsize, maxWidth: this.pixelsize,
                      minHeight: this.pixelsize, maxHeight: this.pixelsize,
                      backgroundColor: this.getConnectionColor(rowAreas, columnAreas),
                      borderColor: this.theme === 'light'? 'black' : 'white'
                    }}
                    // onMouseEnter={() => [this.hoveringColumn = i===0? j-1 : j, this.hoveringRow = i, console.log({column: this.hoveringColumn, row: this.hoveringRow})]}
                    onMouseEnter={() => this.mouseEnterOnItem(j, i)}>
                    <span style={{hidden: 'true'}}>&nbsp;</span>
                  </div>
                ))}
              </div>
            ))}

        </div>
      </div>
    </div>


    return [
      <div class={this.theme === 'light'? 'bg-light' : 'bg-dark'}>
      <div>
        <input
          type="range"
          min="5"
          max="20"
          value={Number.parseInt(this.pixelsize)}
          onInput={(event) => this.rangeChange(event)}>
        </input>
      </div>
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', width: this.textwidth, height: this.textwidth, backgroundColor: 'red', zIndex: '100'}}
             class={(this.theme === 'light'? 'bg-light' : 'bg-dark')}>&nbsp;</div>
        {this.dataIsLoading ? <div class="d-flex justify-content-center">
          <div class={(this.theme === 'light' ? 'loader-color-light' : 'loader-color-black') + ' loader'}>Loading...
          </div>
        </div> : diagramContent}

      </div>
      </div>
    ]
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
