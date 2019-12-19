![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# HBP Connectivity browser component

### Example of using component

    <hbp-connectivity-matrix-row -> Create component
            region="region name" -> Set source region name 
            theme="light" -> Set theme (There are 2 light and dark themes. default theme is dark.)
            loadurl="https://example.com" -> Set source url of connectivity data (It will hardcoded in component soon)
            show-description="true" -> Show description area
            show-export="true" -> Show export area
            show-source="true" -> Show source component
            show-title="true" -> Show title
            show-toolbar="true"> -> Show toolbar ("log10", "show all results"...)
        <div slot="header"></div> -> Send HTML to set custom header
        <div slot="connectedRegionMenu"></div> -> Sent HTML to set any content under connected area after user clicks
    </hbp-connectivity-matrix-row>
    
    
## Import component
### Angular 2+ application
1. Install npm package - 

       npm install hbp-connectivity-component --save
       
2. Import "CUSTOM_ELEMENTS_SCHEMA" from angular core to main module of application
      
       import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";

3. Add "CUSTOM_ELEMENTS_SCHEMA" in schemas in main module

       schemas: [CUSTOM_ELEMENTS_SCHEMA]
       
3. Import "defineCustomElements" from "hbp-connectivity-component/dist/loader" into main.ts file
      main.ts
      
       import {defineCustomElements} from 'hbp-connectivity-component/dist/loader'
       
       
4. Use "defineCustomElements" in main.ts file              
      main.ts
      
       defineCustomElements(window) 

5. Done! component is available in application you can use it with tag:
       
       <hbp-connectivity-matrix-row></hbp-connectivity-matrix-row>

