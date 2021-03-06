UIL.Gui = function( o ){

    o = o || {};

    this.zone = { x:0, y:0, w:0, h:0 };

    this.isCanvas = o.isCanvas || false;
    this.is3d = o.is3d || false;

    this.extraUpdate = null;

    this.current = -1;
    this.old = -1;

    

    /*this.end_canvas = document.createElement( 'canvas' );
    this.tmp_canvas = document.createElement( 'canvas' );

    this.tmp_ctx = this.tmp_canvas.getContext("2d");
    this.end_ctx = this.end_canvas.getContext("2d");*/


    this.left = 0;
    this.top = 0;

    this.height = 20;
    this.width = o.width || UIL.WIDTH;

    this.action = '';

    this.acts = [0,0];

    this.mouse = new UIL.Mouse();

    if( o.Tpercent !== undefined ) UIL.P = o.Tpercent;
    if( o.css === undefined ) o.css = '';

    
    this.h = 0;//this.height;
    this.prevY = -1;

    UIL.main = this;

    this.callback = o.callback  === undefined ? null : o.callback;

    this.color = o.color || UIL.COLOR;
    this.bg = o.bg || 'rgba(44,44,44,0.3)';
    
    this.isCenter = o.center || false;
    this.lockwheel = false;
    this.onWheel = false;
    this.isOpen = true;

    
    //this.height = o.height || UIL.HEIGHT;

    // bottom and close height
    this.bh = o.bh || 20;

    // scroll width
    this.sw = o.sw || 10;

    this.uis = [];

    var css = o.css || '';

    this.content = UIL.DOM('UIL', 'div',  'display:block; height:auto; top:0; right:10px; transition:height 0.1s ease-out; ' + css );
    
    //this.content.style.background = UIL.bgcolor( this.color, 1, true );

    

    this.innerContent = UIL.DOM('UIL', 'div', 'width:100%; top:0; left:0; height:auto;');
    this.content.appendChild(this.innerContent);

    this.inner = UIL.DOM('UIL', 'div', 'width:100%; top:0; left:0; height:auto;');
    this.innerContent.appendChild(this.inner);
   // this.content.appendChild( this.inner );
    this.inner.name = 'inner';

    //this.scrollBG = UIL.DOM('UIL scroll-bg');
    //this.scrollBG = UIL.DOM('UIL', 'div', 'right:0; top:0; width:10px; height:10px; cursor:s-resize; pointer-events:auto; display:none;');
    this.scrollBG = UIL.DOM('UIL', 'div', 'right:0; top:0; width:10px; height:10px; display:none;');
    this.content.appendChild(this.scrollBG);
    this.scrollBG.name = 'scroll';

    //this.scroll = UIL.DOM('UIL scroll');
    this.scroll = UIL.DOM('UIL', 'div', 'background:#666; right:0; top:0; width:5px; height:10px;');
    this.scrollBG.appendChild( this.scroll );

    //this.bottom = UIL.DOM('UIL', 'div',  UIL.TXT+'width:100%; top:auto; bottom:0; left:0; border-bottom-right-radius:10px;  border-bottom-left-radius:10px; text-align:center; pointer-events:auto; cursor:pointer; height:'+this.bh+'px; line-height:'+(this.bh-5)+'px;');

    //this.bottom = UIL.DOM('UIL', 'div', UIL.TXT+'width:100%; left:0; right:10px; border-bottom-right-radius:10px; border-bottom-left-radius:10px; text-align:center; pointer-events:auto; cursor:pointer; height:'+this.bh+'px; line-height:'+(this.bh-5)+'px;'+ o.css);
    this.bottom = UIL.DOM('UIL', 'div', UIL.TXT+'width:100%; left:0; border-bottom-right-radius:10px; border-bottom-left-radius:10px; text-align:center; height:'+this.bh+'px; line-height:'+(this.bh-5)+'px;');
    
    this.content.appendChild(this.bottom);
    //document.body.appendChild( this.bottom );
    this.bottom.textContent = 'close';
    this.bottom.name = 'bottom';
    this.bottom.style.background = this.bg;
    
    this.isDown = false;
    this.isScroll = false;

    //this.callbackClose = function(){};

    
    

    

    if(this.isCanvas){

        

        this.content.style.left = 0;
        this.content.style.top = 0;

        this.canvas = document.createElement( 'canvas' );
        this.ctx = this.canvas.getContext("2d");
        //this.ctx.imageSmoothingEnabled = false;
        this.canvas.style.cssText = 'position:absolute; top:0; right:10px; pointer-events:auto;' + css;
        if( !this.is3d ) document.body.appendChild( this.canvas );

        //this.svg = UMC.dom( null, 'foreignObject', 'position:abolute; left:0; top:0; width:'+w+'; height:'+h+';', { width:w, height:h } );
        this.svg = UMC.dom( null, 'foreignObject', 'position:abolute; left:0; top:0;' );
        this.svg.childNodes[0].appendChild( this.content );

        this.svg.setAttribute("version", "1.1");
        this.svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg' );
        this.svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");

        this.xml = new XMLSerializer();

        this.img = new Image();

        this.events = new UIL.Events( this, this.canvas );

    } else {

        var box = this.content.getBoundingClientRect();
        this.left = box.left;
        this.top = box.top;

        document.body.appendChild( this.content );
        this.content.style.pointerEvents = 'auto';
        this.events = new UIL.Events( this, this.content );

    }

   

    //this.bottom.addEventListener( 'mousedown', this, false );

    //this.content.addEventListener( 'mousedown', this, false );
    //this.content.addEventListener( 'mousemove', this, false );
    //this.content.addEventListener( 'mouseout',  this, false );
    //this.content.addEventListener( 'mouseup',   this, false );
    //this.content.addEventListener( 'mouseover', this, false );
    //this.content.addEventListener( 'mousewheel', this, false );

    //document.addEventListener( 'mousewheel', this, false );
    
    //window.addEventListener("resize", function(e){this.resize(e)}.bind(this), false );

    this.setWidth();

}

UIL.Gui.prototype = {
    constructor: UIL.Gui,

    draw: function () {

        if(!this.isCanvas) return;

        //UMC.toCanvas( this.canvas, this.content, this.width, this.height );

        //var dcopy = this.content.cloneNode( true );//document.createElement('div');
        //dcopy.style.left = 0;
        
        

        //var tmp_svg = UIL.DOM( null, 'foreignObject', 'position:abolute; left:0; top:0; width:'+this.width+'; height:'+this.height+';', { width:this.width, height:this.height } );
        //tmp_svg.childNodes[0].appendChild( dcopy );

       // this.svg = UMC.dom( null, 'foreignObject', 'position:abolute; left:0; top:0; width:300; height:300;', { width:300, height:300 } );
       // this.svg.childNodes[0].appendChild( this.content.cloneNode( true ) );

        this.svg.setAttribute('width', this.width );
        this.svg.setAttribute('height', this.height );
        this.svg.childNodes[0].setAttribute('width', this.width );
        this.svg.childNodes[0].setAttribute('height', this.height );
       //dcopy = null;

       // var 
       //
        this.img.crossOrigin ='anonymous';
        this.img.src = 'data:image/svg+xml;base64,'+ window.btoa( this.xml.serializeToString( this.svg ) );

       // var parser = new DOMParser();

       // this.img.src = parser.parseFromString(this.svg, "image/svg+xml");//'data:image/svg+xml;'+ this.svg;

        this.canvas.width = this.width;
        this.canvas.height = this.height;


        //var ctx = this.canvas.getContext("2d");
        //ctx.imageSmoothingEnabled = false;
        this.ctx.drawImage( this.img, 0, 0 );


        if(this.extraUpdate) this.extraUpdate();



    },

    setExtraUpdate: function( up ){

        this.extraUpdate = up;

    },

    getCanvas: function(){
        return this.canvas;
    },

    hide : function (b) {

        if(b) this.content.style.display = 'none';
        else this.content.style.display = 'block';
    },

    setBG : function(c){

        this.bg = c;

        var i = this.uis.length;
        while(i--){
            this.uis[i].setBG(c);
        }

        this.bottom.style.background = c;

    },

    getHTML : function(){

        return this.content;

    },

    onChange : function( f ){

        this.callback = f;
        return this;

    },

    // -----------------------------------

    // Mouse event

    mouseAction: function () {

        if( this.mouse.down ){

            if(this.action === 'scroll'){
                this.update( (this.mouse.y)-(this.sh*0.5) );
                this.draw();
                return;
            }

            if(this.action === 'bottom'){
                this.isOpen = this.isOpen ? false : true;
                this.show();
            }
             
        }

        this.action = '';

        if( this.mouse.over( this ) ){ 

            //if( this.mouse.x > this.width || this.mouse.y > this.height ) return;

            if( this.mouse.y > this.height - this.bh ) this.action = 'bottom';
            else {
                if( this.isScroll && this.mouse.x > this.width - this.sw ) this.action = 'scroll';
                else {

                    /*if( this.current !== -1 ){
                        this.uis[ this.current ].mouseAction();
                        this.draw();
                    }*/
                    
                    if( !this.mouse.down ){

                        if( this.old !== -1 ){
                             this.uis[ this.old ].mouseAction();
                             this.draw();
                        }

                        this.current = this.findID( this.mouse.y );

                    }

                    if( this.current > -1 ){

                        this.old = this.current; 
                        this.uis[ this.current ].mouseAction( this.mouse );
                        if( this.uis[ this.current ].getActif() ) this.draw();

                    }

                    //debug.innerHTML = this.current + '   ' + this.mouse.x;
                    
                }
            }
        }


        this.applyAction();
        //this.draw();
    },

    applyAction: function () {

        if( this.action === 'bottom' ){
            if(!this.acts[0]){
                this.acts[0] = 1;
                this.bottom.style.color = '#FFF';
                this.bottom.style.background = '#000';
                this.mouse.setCursor('pointer');
                this.draw();
            }
        } else if( this.acts[0] ){
            this.acts[0] = 0;
            this.bottom.style.color = '#CCC';
            this.bottom.style.background = this.bg;
            this.mouse.defCursor();
            this.draw();
        }

        if( this.action === 'scroll' ){
            if(!this.acts[1]){
                this.acts[1] = 1;
                this.scroll.style.background = '#AAA';
                this.mouse.setCursor('s-resize');
                this.draw();
            }
        } else if( this.acts[1] ){
            this.acts[1] = 0;
            this.scroll.style.background = '#666';
            this.mouse.defCursor();
            this.draw();
        }





    },

    findID: function ( y ){

        var i = this.uis.length, py, h;
        while( i-- ){

            py = this.uis[i].py;
            h = this.uis[i].h;
            if( y>= py && y<= py + h ) return i;

        }

        return -1;

    },

    



    // -----------------------------------

    // Add node to gui

    add:function(){

        var a = arguments;

        if( typeof a[1] === 'object' ){ 
            a[1].isUI = true;
            a[1].main = this;
        } else if( typeof a[1] === 'string' ){
            if( a[2] === undefined ) [].push.call(a, { isUI:true, main:this });
            else {
                a[2].isUI = true;
                a[2].main = this;
            }
        } 


        var n = UIL.add.apply( this, a );
        //var n = UIL.add( ...args );

        this.uis.push( n );
        n.py = this.h;

        if( !n.autoWidth ){
            var y = n.c[0].getBoundingClientRect().top;
            if( this.prevY !== y ){
                this.calc( n.h + 1 );
                this.prevY = y;
            }
        }else{
            this.prevY = -1;
            this.calc( n.h + 1 );
        }




        //console.log(n.zone.y)

        

        return n;

    },


    // -----------------------------------


    // remove one node

    remove: function ( n ) { 

        var i = this.uis.indexOf( n ); 
        if ( i !== -1 ) this.uis[i].clear();

    },

    // call after uis clear

    clearOne: function ( n ) { 

        var i = this.uis.indexOf( n ); 
        if ( i !== -1 ) {
            this.inner.removeChild( this.uis[i].c[0] );
            this.uis.splice( i, 1 ); 
        }

    },

    // clear all gui

    clear:function(){

        //this.update( 0 );

        var i = this.uis.length;
        while(i--) this.uis[i].clear();

        this.uis = [];
        UIL.listens = [];

        this.calc( - this.h );

    },

    // -----------------------------------

    // Scroll

    update: function ( y ){

        y = y < 0 ? 0 :y;
        y = y > this.range ? this.range : y;

        this.inner.style.top = -( ~~ ( y / this.ratio ) ) + 'px';
        this.scroll.style.top = ( ~~ y ) + 'px';

        this.py = y;

        //this.onWheel = false;

    },

    showScroll:function(h){

        this.isScroll = true;

        this.total = this.h;
        this.maxView = this.maxHeight;// - this.bh;

        this.ratio = this.maxView / this.total;
        this.sh = this.maxView * this.ratio;

        if( this.sh < 20 ) this.sh = 20;

        this.range = this.maxView - this.sh;

        this.scrollBG.style.display = 'block';
        this.scrollBG.style.height = this.maxView + 'px';
        this.scroll.style.height = this.sh + 'px';

        this.update( 0 );
    },

    hideScroll:function(){

        this.isScroll = false;
        this.update( 0 );

        this.scrollBG.style.display = 'none';

    },

    // -----------------------------------

    getPosition: function(){
        var box;

        if( this.isCanvas ) {

            box = this.canvas.getBoundingClientRect();
            this.left = box.left;
            this.top = box.top;

            //console.log(box)

        } else {

            box = this.content.getBoundingClientRect();
            this.left = box.left;
            this.top = box.top;

        }

        this.mouse.setDecal( this.left, this.top );

        this.zone.x = this.left;
        this.zone.y = this.top;
        this.zone.w = this.width;
        this.zone.h = this.height;

    },

    resize:function(e){

        this.testHeight();
        this.getPosition();

        //this.draw();

    },

    calc:function( y ) {

        this.h += y;
        //this.testHeight();
        clearTimeout( this.tmp );
        this.tmp = setTimeout( this.testHeight.bind(this), 10);

    },

    setMaxHeight: function ( h ){

        this.maxHeight = h - this.bh;

    },

    testHeight:function(){

        if( this.tmp ) clearTimeout( this.tmp );

        this.height = this.top + this.bh;

        if( this.isOpen ) {

            if( !this.is3d ) this.maxHeight = window.innerHeight - this.top - this.bh;

            if( this.h > this.maxHeight ){

                this.height = this.maxHeight + this.bh;
                this.showScroll();

            }else{

                this.height = this.h + this.bh;
                this.hideScroll();

            }
        } else {

            this.hideScroll();

        }

        

        this.innerContent.style.height = this.height - this.bh + 'px';

       // this.inner.style.height = ih + 'px';
        this.content.style.height = this.height + 'px';
        this.bottom.style.top = this.height - this.bh + 'px';

        this.zone.h = this.height;

        //console.log( this.height )

        this.draw();



        //this.tmp_canvas.height = this.end_canvas.height = this.height;

    },

    setWidth:function( w ) {

       // if( w ) UIL.WIDTH = ~~ size;



        if( w ) this.width = w;//UIL.WIDTH;
        this.content.style.width = this.width + 'px';
        //this.bottom.style.width = this.width + 'px';

        //this.end_canvas.width = this.tmp_canvas.width = this.width;
    

        if( this.isCenter ) this.content.style.marginLeft = -(~~ (UIL.WIDTH*0.5)) + 'px';

        this.getPosition();

        var l = this.uis.length;
        var i = l;
        while(i--){
            this.uis[i].setSize( this.width );
        }

        i = l;
        while(i--){
            this.uis[i].rSize();
        }

        this.resize();


        

        //this.calc();

    },

    

    // -----------------------------------

    show:function(){

        if( this.isOpen ){
            //this.inner.style.display = 'block';
            this.bottom.textContent = 'close';
            
        }else{
            this.bottom.textContent = 'open';
            //this.content.style.height = this.bh + 'px';
            //this.tmp = setTimeout( this.endHide.bind(this), 100 );
        }

        this.testHeight();

        
        
    },

};