const subLayerConfig = [{
    //Non ReactJS
    type: 'stack',
    componentName: 'main-layout',
    componentState: { label: 'value' },

    //General
    content: [{
        //Non ReactJS
        type: 'component',
        componentName: 'main-layout',
        componentState: { label: 'value' },
    
        //General
        content: [],
        id: '10',
        width: 10,
        height: 30,
        isClosable: false,
        title: 'Project',
        activeItemIndex: 0
    }],
    id: '0',
    width: 10,
    height: 30,
    isClosable: false,
    title: '',
    activeItemIndex: 0
},
{
    //Non ReactJS
    type: 'column',
    componentName: 'main-layout',
    componentState: { label: 'value' },

    //General
    content: [{
        //Non ReactJS
        type: 'stack',
        componentName: 'main-layout',
        componentState: { label: 'value' },
    
        //General
        content: [ {                
            type: 'component',
            componentName: 'stock-chart',
            componentState: { label: 'value' },
            id: '101',
            width: 10,
            height: 10,
            isClosable: false,
            title: '101',
        },{                
            type: 'component',
            componentName: 'main-layout',
            componentState: { label: 'value' },
            id: '102',
            width: 10,
            height: 10,
            isClosable: false,
            title: '102',
        }],
        id: '100',
        width: 10,
        height: 30,
        isClosable: false,
        title: '100',
        activeItemIndex: 0
    },{
        //Non ReactJS
        type: 'stack',
        componentName: 'main-layout',
        componentState: { label: 'value' },
    
        //General
        content: [{                
            type: 'component',
            componentName: 'main-layout',
            componentState: { label: 'value' },
            id: '103',
            width: 10,
            height: 10,
            isClosable: false,
            title: '103',
        }],
        id: '11',
        width: 10,
        height: 10,
        isClosable: false,
        title: '11',
        activeItemIndex: 0
    }],
    id: '1',
    width: 30,
    height: 30,
    isClosable: false,
    title: 'title2',
    activeItemIndex: 0
}];

const layout = new GoldenLayout({
    settings:{
        hasHeaders: true,
        constrainDragToContainer: true,
        reorderEnabled: true,
        selectionEnabled: false,
        popoutWholeStack: false,
        blockedPopoutsThrowError: true,
        closePopoutsOnUnload: true,
        showPopoutIcon: false,
        showMaximiseIcon: false,
        showCloseIcon: false
    },
    dimensions: {
        borderWidth: 1,
        minItemHeight: 10,
        minItemWidth: 10,
        headerHeight: 20,
        dragProxyWidth: 300,
        dragProxyHeight: 200
    },
    labels: {
        close: 'close',
        maximise: 'maximise',
        minimise: 'minimise',
        popout: 'open in new window'
    },
    content: [ {
        //Non ReactJS
        type: 'row',
        componentName: 'main-layout',
        componentState: { label: 'value' },

        //General
        content: subLayerConfig,
        id: 'some id',
        width: 30,
        height: 30,
        isClosable: false,
        title: 'some title',
        activeItemIndex: 0
    } ]
});
    
$().ready( () => {
    console.log("load document successfully!");
    layout.registerComponent( 'main-layout', function( container, componentState ){
        container.getElement().html( '<h2>' + componentState.label + '</h2>' );
    });
    /// Callback for every created stack
    layout.on( 'stackCreated', function( stack ){

        //HTML for the colorDropdown is stored in a template tag
        var colorDropdown = $( $( 'template' ).html() ),
            colorDropdownBtn = colorDropdown.find( '.selectedColor' ),
            setColor = function( color ){
                var container = stack.getActiveContentItem().container;

                // Set the color on both the dropDown and the background
                colorDropdownBtn.css( 'background-color', color );
                container.getElement().css( 'background-color', color );

                // Update the state
                container.extendState({ color: color });
            };

        // Add the colorDropdown to the header
        stack.header.controlsContainer.prepend( colorDropdown );

        // Update the color initially and whenever the tab changes
        stack.on( 'activeContentItemChanged', function( contentItem ){
            setColor( contentItem.container.getState().color );
        });

        // Update when the user selects a different color
        // from the dropdown
        colorDropdown.find( 'li' ).click(function(){
            setColor( $(this).css( 'background-color' ) );
        });
    });

    layout.on( 'initialised', function(){
        var noDropStack = layout.root.getItemsById( '0' )[ 0 ];
        var originalGetArea = noDropStack._$getArea;
        noDropStack._$getArea = function() {
          var area = originalGetArea.call( noDropStack );
          delete noDropStack._contentAreaDimensions.header;
          return area;
        };
      });

    var seriesChart = null;
    StockChartComponent = function( container, state ) {
        this._highChartsConfig = {
            title: { text: 'My First chart' },
            series: [{                              // 数据列
                name: '小明',                        // 数据列名
                data: [1, 0, 4]                     // 数据
            }, {
                name: '小红',
                data: [5, 7, 3]
            }],
            plotOptions: { line: { marker: { enabled: false } } },
            xAxis:{categories: ['苹果', '香蕉', '橙子']  },
            yAxis:{ 
                text: '吃水果个数'                // y 轴标题
            },
            chart:{
                type: 'bar',
                renderTo: container.getElement()[ 0 ] 
            }
        };
    
        this._container = container;
        this._state = state;
        this._chart = null;
        seriesChart = this._chart;
        this._container.setTitle( 'First Chart' );
        this._container.on( 'open', this._createChart.bind( this ) );
    };

    
    StockChartComponent.prototype._createChart = function() {
        this._chart = new Highcharts.Chart( this._highChartsConfig );
        seriesChart = this._chart;
        this._bindContainerEvents();
    };
    
    StockChartComponent.prototype._onDataReady = function( highchartsData ) {
        this._chart.addSeries({
            color: this._state.color,
            name: this._state.companyName,
            data: highchartsData
        });
    };
    
    StockChartComponent.prototype._bindContainerEvents = function() {
        this._container.on( 'resize', this._setSize.bind( this ) );
        this._container.on( 'destroy', this._chart.destroy.bind( this._chart ) );
    };
    
    StockChartComponent.prototype._setSize = function() {
        this._chart.setSize( this._container.width, this._container.height );
    };

    StockChartComponent.prototype._getChart = function() {
        return this._chart;
    };

    layout.registerComponent( 'stock-chart', StockChartComponent);   

    layout.init();

    function changeSeries() {
        var chart = seriesChart;
        if (!chart)
        {
            console.log("Unexpected Error");
            setTimeout(changeSeries, 1000);
        }
        var chartOption = {series:[
            {                              // 数据列
                name: '小明',                        // 数据列名
                data: [1, 0, 4]                     // 数据
            }, {
                name: '小红',
                data: [Math.random()*10, 7, 3]
            }
        ]};
        chart.update(chartOption, true);
        setTimeout(changeSeries, 1000);
    }
    
    setTimeout(changeSeries, 1000);
});