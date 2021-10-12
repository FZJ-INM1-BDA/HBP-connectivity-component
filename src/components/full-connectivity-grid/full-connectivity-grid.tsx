import {Component, h, EventEmitter, State, Prop, Method, Element, Listen, Watch} from "@stencil/core";

@Component({
  tag: 'full-connectivity-grid',
  styleUrls: ['./full-connectivity-grid.scss',],
  shadow: true
})
export class FullConnectivityGrid {
  @Element() el: HTMLElement
  @State() allConnectedAreas: any
  // @State() unfilteredConnections: any
  @State() dataIsLoading = false

  // @State() collapseMenu = -1
  @State() datasetDescription = ''
  @State() datasetName = ''

  @State() overConnectedAreaIndex = -1
  @State() hoveringX = -1
  @State() hoveringY = -1
  public exportFullConnectivityElement!: HTMLExportFullConnectivityElement

  @Prop({mutable: true}) theme: string = ''
  @Prop({mutable: true}) datasetUrl: string = ''
  @Prop({mutable: true}) onlyExport: string = ''
  @Prop({mutable: true}) gridwidth: string = 'auto'
  @Prop({mutable: true}) gridheight: string = 'auto'
  @Prop({mutable: true}) pixelsize: number = 10
  @Prop({mutable: true}) textwidth: number = 70

  @Prop({mutable: true}) tooltipWidth: number = 250
  @Prop({mutable: true}) tooltipHeight: number = 90

  @Prop({mutable: true}) loadurl: string = ''
  // @Prop({mutable: true}) name: string = ''
  // @Prop({mutable: true}) description: string = ''


  @Method()
  downloadCSV() {
    this.exportFullConnectivityElement.downloadFullConnectivityCsv()
  }

  @Watch('loadurl')
  loadurlChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue) {
      this.getConnectedAreas()
    }
  }

  @Watch('pixelsize')
  pixelSizeChanged(newValue: string, oldValue: string) {
    if (newValue !== oldValue && this.allConnectedAreas.length) {
      this.generateCanvas()
    }
  }

  public diagramCanvas!: HTMLCanvasElement
  public verticalAreaNames!: HTMLCanvasElement
  public horizontalAreaNames!: HTMLCanvasElement
  public verticalHoverDiv!: HTMLElement
  public horizontalHoverDiv!: HTMLElement
  public hoveringAreaTooltip!: HTMLElement

  public diagramParent!: HTMLElement

  // @ts-ignore
  @Event({bubbles: true, composed: true}) connectivityDataReceived: EventEmitter<any>

  componentWillLoad() {
    if (this.loadurl) this.getConnectedAreas()
  }

  getConnectedAreas = async () => {
    this.dataIsLoading = true
    this.fetchConnectedAreas()
      .then(connMatrix => {
        connMatrix = connMatrix.result
        this.datasetDescription = connMatrix['src_info']
        this.datasetName = connMatrix['src_name']

        const matrix = []

        for (let i =0; i<connMatrix.matrix.length; i++) {
          matrix[i] = {
            sourceArea: connMatrix.matrix[i][0],
            connectedAreas: connMatrix.matrix[i].map((m, idx) => idx > 0 && ({
                name: connMatrix.matrix[idx-1][0],
                numberOfConnections: m
              }
            ))
          }
          matrix[i].connectedAreas.shift()
        }

        return matrix

      })
      .then(res => {
        let maxConnection = 0
        res.forEach(profile => {
          profile.connectedAreas.forEach(areas => {
            if (areas.numberOfConnections > maxConnection) maxConnection = areas.numberOfConnections
          })
        })
        const logMax = Math.log(maxConnection)

        const colorAreas = res.map(profile => {
          return {
            ...profile,
            connectedAreas: profile.connectedAreas.map((a) => {
              let r = this.colormap_red(Math.log(a.numberOfConnections) / logMax)
              let g = this.colormap_green(Math.log(a.numberOfConnections) / logMax)
              let b = this.colormap_blue(Math.log(a.numberOfConnections) / logMax)

              if (r === 0 && g ===0 && b === 0) {
                if (this.theme === 'light') {
                  r = 255
                  g = 255
                  b = 255
                } else {
                  r = 66
                  g = 66
                  b = 66
                }
              }

              return {
                ...a,
                color: {r, g, b}
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
        this.generateCanvas()
      })
      .catch(() => {
        this.dataIsLoading = false
      })
  }


  fetchConnectedAreas = async () => {
    const response = await fetch(this.loadurl,
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

  // rangeChange(event) {
  //   this.pixelsize = event.target.value
  // }

  getMousePos(canvas, evt) {
    const rect = canvas && canvas.getBoundingClientRect();
    return rect && {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  @Listen('mousemove', { target: 'window' })
  handleMouseMove(ev) {
    const mousePos = this.getMousePos(this.diagramCanvas, ev)

    const scale = window.devicePixelRatio;
    const textAreaSize = this.textwidth * scale

    if (mousePos && mousePos.x && mousePos.y &&
      mousePos.x < +this.diagramCanvas.offsetWidth
      && mousePos.y < +this.diagramCanvas.offsetHeight
      && mousePos.x > textAreaSize && mousePos.y > textAreaSize) {

      const position = {
        x: mousePos.x - textAreaSize,
        y: mousePos.y - textAreaSize
      }

      const hoverX = (position.x - position.x % this.pixelsize)/this.pixelsize
      const hoverY = (position.y - position.y % this.pixelsize)/this.pixelsize

      this.hoveringX = hoverX%2 === 0 || scale === 1? hoverX/scale : (hoverX-1)/scale
      this.hoveringY = hoverY%2 === 0 || scale === 1? hoverY/scale : (hoverY-1)/scale

      this.verticalHoverDiv.style.left = (this.textwidth + this.hoveringX * this.pixelsize + this.pixelsize/2)*scale + 'px'
      this.horizontalHoverDiv.style.top = (this.textwidth + this.hoveringY * this.pixelsize + this.pixelsize/2)*scale + 'px'


      // if ((ev.target.clientWidth - ev.clientX) < this.tooltipWidth) {
        // this.hoveringAreaTooltip.style.left = ev.offsetX - (this.tooltipWidth - (ev.target.clientWidth - ev.clientX))-ev.target.scrollX - 40 + 'px'
      // } else {
        this.hoveringAreaTooltip.style.left = (this.textwidth + this.hoveringX * this.pixelsize + this.pixelsize)*scale + this.tooltipWidth - this.tooltipWidth + 'px'
      // }

      // if ((ev.clientY - this.textwidth) < this.tooltipHeight) {
      //   this.hoveringAreaTooltip.style.top = ev.clientY + 40 + 'px'
      // } else {
        this.hoveringAreaTooltip.style.top = (this.textwidth + this.hoveringY * this.pixelsize + this.pixelsize)*scale - this.tooltipHeight - 30 + 'px'
      // }


    } else {
      if(this.verticalHoverDiv) {
        this.hoveringAreaTooltip.style.left = -this.tooltipWidth + 'px'
        this.hoveringAreaTooltip.style.top = -this.tooltipHeight + 'px'
        this.verticalHoverDiv.style.left = '-1px'
        this.horizontalHoverDiv.style.top = '-1px'
      }
      this.clearHoveringArea()
    }
  }

  clearHoveringArea() {
    this.hoveringX = -1
    this.hoveringY = -1
  }

  generateCanvas() {
    const context = this.diagramCanvas.getContext('2d')
    const verticalText = this.verticalAreaNames.getContext('2d')
    const horizontalText = this.horizontalAreaNames.getContext('2d')

    const scale = window.devicePixelRatio;
    const textPanelWidth = this.textwidth

    const fullSize = this.pixelsize * this.allConnectedAreas.length + textPanelWidth

    const diagramWidth = Math.floor(fullSize * scale);
    const diagramHeight = Math.floor(fullSize * scale);
    this.diagramCanvas.width = diagramWidth
    this.diagramCanvas.height = diagramHeight;

    this.verticalAreaNames.width = textPanelWidth * scale
    this.verticalAreaNames.height = diagramHeight
    this.horizontalAreaNames.height = textPanelWidth * scale
    this.horizontalAreaNames.width = diagramWidth

    context.scale(scale, scale);
    verticalText.scale(scale, scale);
    horizontalText.scale(scale, scale);

    this.allConnectedAreas.forEach((source, i) => {
      let name = this.cleanAreaNameForDiagram(source.sourceArea)
      let text = context.measureText(name);

      const normalizeText = (t) => {
        if (t.width > textPanelWidth) {
          name = name.slice(0, -1)
          const mt = context.measureText(name);
          normalizeText(mt)
        }
      }
      normalizeText(text)
      verticalText.textBaseline = "top";
      verticalText.fillStyle=this.theme === 'light'? '#000' : '#FFF';
      verticalText.font = `${this.pixelsize - 1}px arial`;
      verticalText.fillText(name, 0, this.pixelsize*i + textPanelWidth + 1)

      horizontalText.textBaseline = "top";
      horizontalText.fillStyle=this.theme === 'light'? '#000' : '#FFF';
      horizontalText.font = `${this.pixelsize - 1}px arial`;

      const font = `${this.pixelsize - 1}px arial`
      const degree = -Math.PI/2
      horizontalText.save();
      this.rotateText(horizontalText, name, font, degree,  this.pixelsize*i + textPanelWidth + 1, textPanelWidth)
      horizontalText.restore();

      source.connectedAreas.forEach((area, j) => {
        context.save();
        context.fillStyle=`rgb(${area.color.r}, ${area.color.g}, ${area.color.b})`;
        context.fillRect(this.pixelsize*i + textPanelWidth,this.pixelsize*j + textPanelWidth,this.pixelsize,this.pixelsize);
        context.restore();
      })
    })

  }

  rotateText(ctx, txt, font, angleStep, cx, cy) {
    ctx.font = font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    ctx.translate(cx, cy);
    ctx.rotate(angleStep);
    ctx.translate(-cx, -cy);
    ctx.fillText(txt, cx, cy);
  }

  scrolled()  {
    this.horizontalAreaNames.style.left = - this.diagramParent.scrollLeft + 'px'

    this.verticalAreaNames.style.top = - this.diagramParent.scrollTop + 'px'
  }


  render() {

    const diagramContent =
      <div style={{position: 'relative'}}>

        <div style={{position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', maxHeight:'90vh', overflow: 'hidden'}}>
          <canvas ref={(el) => this.verticalAreaNames = el as HTMLCanvasElement}
                  style={{backgroundColor: this.theme === 'light' ? 'white' : 'rgba(66,66,66, 0.9)', zIndex: '1',
                    position: 'absolute', top: '0', left: '0',
                    borderRight: '1px solid', borderColor: this.theme === 'light' ? 'black' : 'white'}}></canvas>
          <canvas ref={(el) => this.horizontalAreaNames = el as HTMLCanvasElement}
                  style={{backgroundColor: this.theme === 'light' ? 'white' : 'rgba(66,66,66, 0.9)', zIndex: '1',
                    position: 'absolute', top: '0', left: '0',
                    borderBottom: '1px solid', borderColor: this.theme === 'light' ? 'black' : 'white'}}></canvas>
        </div>

        <div ref={(el) => this.diagramParent = el as HTMLElement}
           style={{position: 'relative', width: '100%', height: '100%', maxHeight:'90vh', overflow: 'auto'}}
             onScroll={this.scrolled.bind(this)}
        >

        <div style={{width: 'auto', height: 'auto'}} class="position-relative">

          <div ref={(el) => this.verticalHoverDiv = el as HTMLElement}
               class="d-inline-block"
               style={{position: 'absolute', height: this.diagramCanvas && this.diagramCanvas.height + 'px',
                 borderLeft: '1px solid', borderColor: this.theme === 'light' ? 'black' : 'white'
               }}></div>
          <div ref={(el) => this.horizontalHoverDiv = el as HTMLElement}
               class="d-inline-block"
               style={{position: 'absolute', width: this.diagramCanvas && this.diagramCanvas.width + 'px', borderTop: '1px solid', borderColor: this.theme === 'light' ? 'black' : 'white'}}></div>
          <div ref={(el) => this.hoveringAreaTooltip = el as HTMLElement}
               class="d-inline-block"
               hidden={!(this.hoveringX >= 0 && this.hoveringY >= 0 && this.allConnectedAreas[this.hoveringX].connectedAreas[this.hoveringY].numberOfConnections)}
               style={{position: 'absolute', width: this.tooltipWidth + 'px', height: this.tooltipHeight + 'px',
                 border: '1px solid', borderRadius: '10px', padding: '10px',
                 background: this.theme === 'light' ? 'white' : 'rgba(66,66,66, 0.7)', color: this.theme === 'light' ? 'black' : 'white'}}>
            {this.hoveringX >= 0 && this.hoveringY >= 0 && this.allConnectedAreas[this.hoveringX].connectedAreas[this.hoveringY].numberOfConnections &&
            <div class="d-flex flex-column">
              <div class="tooltipTextLine">{this.allConnectedAreas[this.hoveringX].sourceArea}</div>
              <hr/>
              <div class="tooltipTextLine">Strength: {this.allConnectedAreas[this.hoveringX].connectedAreas[this.hoveringY].numberOfConnections}</div>
              <hr/>
              <div class="tooltipTextLine">{this.allConnectedAreas[this.hoveringX].connectedAreas[this.hoveringY].name}</div>
            </div>
            }
          </div>
          <canvas ref={(el) => this.diagramCanvas = el as HTMLCanvasElement}></canvas>
        </div>
      </div>


    </div>

    return [
      !this.onlyExport? diagramContent
      //   <div class={this.theme === 'light'? 'bg-light' : 'bg-dark'}>
      //
      // <div style={{position: 'relative'}}>
      //   <div style={{position: 'absolute', width: this.textwidth, height: this.textwidth, backgroundColor: 'red', zIndex: '100'}}
      //        class={(this.theme === 'light'? 'bg-light' : 'bg-dark')}>&nbsp;</div>
      //   {/*{this.dataIsLoading ? <div class="d-flex justify-content-center">*/}
      //   {/*  <div class={(this.theme === 'light' ? 'loader-color-light' : 'loader-color-black') + ' loader'}>Loading...*/}
      //   {/*  </div>*/}
      //   {/*</div> : diagramContent}*/}
      //
      // </div>
      //
      // </div>

        :
        <div>
          <export-full-connectivity
            ref={(el) => this.exportFullConnectivityElement = el as HTMLExportFullConnectivityElement}
            el={this.el}
            connections={this.allConnectedAreas}
            datasetInfo={{name: this.datasetName, description: this.datasetDescription}}>
          </export-full-connectivity>
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
